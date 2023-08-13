import {
    _createWebClient,
    Config,
    ExpandedConfig,
    expandConfig,
    LibSqlClient,
} from "$deps/libsql.ts";
import { _createClient as _createSqlite3Client } from "$lib/libsql/dyedgreen/client.ts";

export function createClient(config: Config): LibSqlClient {
    return _createClient(expandConfig(config, true));
}

/** @private */
function _createClient(config: ExpandedConfig): LibSqlClient {
    if (config.scheme === "file") {
        return _createSqlite3Client(config);
    }

    return _createWebClient(config);
}
