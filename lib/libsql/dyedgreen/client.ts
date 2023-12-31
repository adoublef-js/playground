import {
    Config,
    ExpandedConfig,
    InStatement,
    InValue,
    IntMode,
    LibSqlClient,
    LibsqlError,
    ResultSet,
    Row,
    Transaction,
    TransactionMode,
    Value,
    expandConfig,
} from "$deps/libsql.ts";
import {
    ResultSetImpl,
    supportedUrlLink,
    transactionModeToBegin,
} from "$lib/libsql/utils.ts";
// import {
//     DB,
//     SqliteError,
// } from "https://esm.sh/gh/adoublef/deno-sqlite@e96baa5112/mod.ts";
// import {SqliteOptions} from "https://esm.sh/gh/adoublef/deno-sqlite@e96baa5112/src/db.ts";

import { DB, SqliteOptions } from "../../../vendor/sqlite/mod.ts";
import { SqliteError } from "../../../vendor/sqlite/src/error.ts";
import {
    QueryParameter,
    QueryParameterSet,
} from "../../../vendor/sqlite/src/query.ts";

export function createClient(config: Config): LibSqlClient {
    return _createClient(expandConfig(config, true));
}

/** @private */
export function _createClient(config: ExpandedConfig): LibSqlClient {
    if (config.scheme !== "file") {
        throw new LibsqlError(
            `URL scheme ${JSON.stringify(
                config.scheme + ":"
            )} is not supported by the local sqlite3 client. ` +
                `For more information, please read ${supportedUrlLink}`,
            "URL_SCHEME_NOT_SUPPORTED"
        );
    }

    const authority = config.authority;
    if (authority !== undefined) {
        const host = authority.host.toLowerCase();
        if (host !== "" && host !== "localhost") {
            throw new LibsqlError(
                `Invalid host in file URL: ${JSON.stringify(
                    authority.host
                )}. ` +
                    'A "file:" URL with an absolute path should start with one slash ("file:/absolute/path.db") ' +
                    'or with three slashes ("file:///absolute/path.db"). ' +
                    `For more information, please read ${supportedUrlLink}`,
                "URL_INVALID"
            );
        }

        if (authority.port !== undefined) {
            throw new LibsqlError("File URL cannot have a port", "URL_INVALID");
        }
        if (authority.userinfo !== undefined) {
            throw new LibsqlError(
                "File URL cannot have username and password",
                "URL_INVALID"
            );
        }
    }

    const path = config.path;
    const options = { memory: false } satisfies SqliteOptions;

    const db = new DB(path, options);
    try {
        executeStmt(
            db,
            "SELECT 1 AS checkThatTheDatabaseCanBeOpened",
            config.intMode
        );
    } finally {
        db.close();
    }

    return new Sqlite3Client(path, options, config.intMode);
}

export class Sqlite3Client implements LibSqlClient {
    #path: string;
    #options: SqliteOptions;
    #intMode: IntMode;
    closed: boolean;
    protocol: "file";

    constructor(path: string, options: SqliteOptions, intMode: IntMode) {
        this.#path = path;
        this.#options = options;
        this.#intMode = intMode;
        this.closed = false;
        this.protocol = "file";
    }

    async execute(stmt: InStatement): Promise<ResultSet> {
        this.#checkNotClosed();
        const db = new DB(this.#path, this.#options);
        try {
            return await executeStmt(db, stmt, this.#intMode);
        } finally {
            db.close();
        }
    }

    async batch(
        stmts: Array<InStatement>,
        mode: TransactionMode = "deferred"
    ): Promise<Array<ResultSet>> {
        this.#checkNotClosed();
        const db = new DB(this.#path, this.#options);
        try {
            executeStmt(db, transactionModeToBegin(mode), this.#intMode);
            const resultSets = await Promise.all(
                stmts.map((stmt) => {
                    return executeStmt(db, stmt, this.#intMode);
                })
            );
            executeStmt(db, "COMMIT", this.#intMode);
            return resultSets;
        } finally {
            db.close();
        }
    }

    // deno-lint-ignore require-await
    async transaction(mode: TransactionMode = "write"): Promise<Transaction> {
        this.#checkNotClosed();
        const db = new DB(this.#path, this.#options);
        try {
            executeStmt(db, transactionModeToBegin(mode), this.#intMode);
            return new Sqlite3Transaction(db, this.#intMode);
        } catch (e) {
            db.close();
            throw e;
        }
    }

    // deno-lint-ignore require-await
    async executeMultiple(sql: string): Promise<void> {
        this.#checkNotClosed();
        const db = new DB(this.#path, this.#options);
        try {
            return executeMultiple(db, sql);
        } finally {
            db.close();
        }
    }

    close(): void {
        this.closed = true;
    }

    #checkNotClosed(): void {
        if (this.closed) {
            throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
    }
}

export class Sqlite3Transaction implements Transaction {
    #database: DB;
    #intMode: IntMode;

    /** @private */
    constructor(database: DB, intMode: IntMode) {
        this.#database = database;
        this.#intMode = intMode;
    }

    // deno-lint-ignore require-await
    async execute(stmt: InStatement): Promise<ResultSet> {
        this.#checkNotClosed();
        return executeStmt(this.#database, stmt, this.#intMode);
    }

    // deno-lint-ignore require-await
    async batch(stmts: Array<InStatement>): Promise<Array<ResultSet>> {
        this.#checkNotClosed();
        return Promise.all(
            stmts.map((stmt) =>
                executeStmt(this.#database, stmt, this.#intMode)
            )
        );
    }

    // deno-lint-ignore require-await
    async executeMultiple(sql: string): Promise<void> {
        this.#checkNotClosed();
        return executeMultiple(this.#database, sql);
    }

    // deno-lint-ignore require-await
    async rollback(): Promise<void> {
        if (this.#database.isClosed) {
            return;
        }
        executeStmt(this.#database, "ROLLBACK", this.#intMode);
        this.#database.close();
    }

    // deno-lint-ignore require-await
    async commit(): Promise<void> {
        this.#checkNotClosed();
        executeStmt(this.#database, "COMMIT", this.#intMode);
        this.#database.close();
    }

    close(): void {
        this.#database.close();
    }

    get closed(): boolean {
        return this.#database.isClosed;
    }

    #checkNotClosed(): void {
        if (this.#database.isClosed) {
            throw new LibsqlError(
                "The transaction is closed",
                "TRANSACTION_CLOSED"
            );
        }
    }
}

// deno-lint-ignore require-await
async function executeStmt(
    db: DB,
    stmt: InStatement,
    intMode: IntMode
): Promise<ResultSet> {
    let sql: string;
    let args: QueryParameterSet; // Array<unknown> | Record<string, unknown>;

    if (typeof stmt === "string") {
        sql = stmt;
        args = [];
    } else {
        sql = stmt.sql;
        if (Array.isArray(stmt.args)) {
            args = stmt.args.map(valueToSql);
        } else {
            args = {};
            for (const name in stmt.args) {
                args[name] = valueToSql(stmt.args[name]);
            }
        }
    }

    const sqlStmt = db.prepareQuery(sql);
    // db.int64 = true;
    try {
        // make safe for integers
        // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/integer.md#getting-bigints-from-the-database
        // https://github.com/s ignalapp/better-sqlite3/blob/better-sqlcipher/docs/integer.md
        // https://deno.land/x/sqlite3@0.3.0/src/database.ts?source=#L418

        // https://github.com/libsql/libsql-client-ts/blob/main/src/sqlite3.ts#L214-L219
        let returnsData = true;
        if (returnsData) {
            // TODO there are three options here, find out which makes the most sense
            const columns = sqlStmt.columns().map((column) => column.name);
            const rows = sqlStmt.all(args).map((sqlRow) => {
                return rowFromSql(sqlRow, columns, intMode);
            });

            // https://github.com/libsql/libsql-client-ts/blob/main/src/sqlite3.ts#L226
            const rowsAffected = db.totalChanges;
            const lastInsertRowid = BigInt(db.lastInsertRowId);

            return new ResultSetImpl(
                columns,
                rows,
                rowsAffected,
                lastInsertRowid
            );
        } else {
            // NOTE need a `run` equivalent that does without retrieving any output there may be.
            const info = sqlStmt.execute(args);

            const rowsAffected = db.totalChanges; //info;
            const lastInsertRowid = BigInt(db.lastInsertRowId); //BigInt(info.lastInsertRowid);

            return new ResultSetImpl([], [], rowsAffected, lastInsertRowid);
        }
    } catch (e) {
        throw mapSqliteError(e);
    } finally {
        sqlStmt.finalize();
    }
}

function rowFromSql(
    sqlRow: Array<unknown>,
    columns: Array<string>,
    intMode: IntMode
): Row {
    const row = {};
    // make sure that the "length" property is not enumerable
    Object.defineProperty(row, "length", { value: sqlRow.length });
    for (let i = 0; i < sqlRow.length; ++i) {
        const value = valueFromSql(sqlRow[i], intMode);
        Object.defineProperty(row, i, { value });

        const column = columns[i];
        if (!Object.hasOwn(row, column)) {
            Object.defineProperty(row, column, { value, enumerable: true });
        }
    }
    return row as Row;
}

function valueFromSql(sqlValue: unknown, intMode: IntMode): Value {
    if (typeof sqlValue === "bigint") {
        console.log("typeof valueFromSql.sqlValue === bigint", sqlValue);
        if (intMode === "number") {
            if (sqlValue < minSafeBigint || sqlValue > maxSafeBigint) {
                throw new RangeError(
                    "Received integer which cannot be safely represented as a JavaScript number"
                );
            }
            return Number(sqlValue);
        } else if (intMode === "bigint") {
            return sqlValue;
        } else if (intMode === "string") {
            return "" + sqlValue;
        } else {
            throw new Error("Invalid value for IntMode");
        }
    } else if (sqlValue instanceof Object && sqlValue instanceof Buffer) {
        return sqlValue.buffer;
    }
    return sqlValue as Value;
}

const minSafeBigint = -9007199254740991n;
const maxSafeBigint = 9007199254740991n;

function valueToSql(value: InValue): QueryParameter {
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new RangeError(
                "Only finite numbers (not Infinity or NaN) can be passed as arguments"
            );
        }
        return value;
    } else if (typeof value === "bigint") {
        if (value < minInteger || value > maxInteger) {
            throw new RangeError(
                "bigint is too large to be represented as a 64-bit integer and passed as argument"
            );
        }
        return value;
    } else if (typeof value === "boolean") {
        return value ? 1 : 0;
    } else if (value instanceof ArrayBuffer) {
        return Buffer.from(value);
    } else if (value instanceof Date) {
        return value.valueOf();
    } else if (value === undefined) {
        throw new TypeError(
            "undefined cannot be passed as argument to the database"
        );
    } else {
        return value;
    }
}

const minInteger = -9223372036854775808n;
const maxInteger = 9223372036854775807n;

function executeMultiple(db: DB, sql: string): void {
    try {
        db.execute(sql);
    } catch (e) {
        throw mapSqliteError(e);
    }
}

function mapSqliteError(e: unknown): unknown {
    if (e instanceof SqliteError) {
        return new LibsqlError(e.message, "Unknown", e);
    }
    return e;
}
