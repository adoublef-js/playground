import {
    Handler,
    Hono,
    HtmlEscapedString,
    logger,
    serveStatic,
} from "$deps/hono.ts";
import { titleCase } from "$deps/case.ts";
import { Html } from "$components/dom/html.tsx";

const { serve } = Deno;

/* 
1, https://lsnrae.medium.com/accessible-form-validation-9fa637ddb0fc
2, https://blog.pope.tech/2022/10/03/a-beginners-complete-guide-to-form-accessibility-the-5-things-accessible-forms-needs-and-how-to-fix-common-errors/
3, https://kittygiraudel.com/2022/08/05/the-required-fault-in-our-stars/
4, https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/#:~:text=Accessibility%20In%20Forms,-Before%20we%20get&text=This%20is%20mostly%20about%20setting,indicator%20for%20each%20form%20control.&text=Each%20form%20field%20must%20have,field%20name%20to%20its%20user.
*/

if (import.meta.main) {
    const app = new Hono();

    app.use("*", logger());

    app.get("/", handleMainPage());

    app.use(
        "/css/*",
        serveStatic({
            root: "/static/",
            rewriteRequestPath: (path) => path.replace(/^\/css/, "/css"),
        })
    );
    app.use(
        "/js/*",
        serveStatic({
            root: "/static/",
            rewriteRequestPath: (path) => path.replace(/^\/js/, "/js"),
        })
    );

    serve(app.fetch);
}

function handleMainPage(): Handler {
    return ({ html }) => {
        console.log("done");
        return html(
            <Html stylesheets={["/css/aria-forms.css"]}>
                <main>
                    <Form>
                        <Input
                            id="username"
                            pattern="[a-z]{4,8}"
                            title="Must be 4 to 8 lowercase letters"
                        />
                        <Input id="phoneNumber" type="tel" />
                        <TextArea id="bio" rows={10} />
                    </Form>
                </main>
            </Html>
        );
    };
}

type FormProps = JSX.FormHTMLAttributes<HTMLElement> &
    Pick<JSX.InputHTMLAttributes<HTMLElement>, "value" | "disabled">;

const Form = ({
    children,
    action = "/",
    method = "get",
    value = "Submit",
}: FormProps) => {
    return (
        <form action={action} method={method}>
            {children as HtmlEscapedString}
            <input type="submit" value={value} />
        </form>
    );
};

type FormFieldProps = Pick<
    JSX.InputHTMLAttributes<HTMLElement>,
    "type" | "inputmode" | "required" | "pattern" | "title"
> &
    Required<Pick<JSX.HTMLAttributes<HTMLElement>, "id">>;

const Input = ({
    id,
    inputmode,
    type,
    required,
    pattern,
    title,
}: FormFieldProps) => (
    <div role="group">
        <label for={id}>{titleCase(id)}</label>
        <input
            type={type}
            inputmode={inputmode}
            name={id}
            id={id}
            required={required}
            pattern={pattern}
            title={title}
        />
    </div>
);

type TextAreaProps = Pick<
    JSX.TextareaHTMLAttributes<HTMLElement>,
    "inputmode" | "required" | "cols" | "rows"
> &
    Required<Pick<JSX.HTMLAttributes<HTMLElement>, "id">>;

const TextArea = ({ id, inputmode, required, cols, rows }: TextAreaProps) => (
    <div role="group">
        <label for={id}>{titleCase(id)}</label>
        <textarea
            inputmode={inputmode}
            name={id}
            id={id}
            required={required}
            cols={cols}
            rows={rows}
        ></textarea>
    </div>
);
