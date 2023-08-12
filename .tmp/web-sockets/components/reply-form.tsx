type ReplyFormProps = {
    id: string;
    autofocus?: boolean;
    "hx-swap-oob"?: string;
};

export function ReplyForm({
    id,
    autofocus,
    ["hx-swap-oob"]: hxSwapOob,
}: ReplyFormProps) {
    return (
        <form hx-swap-oob={hxSwapOob} id={id} ws-send>
            <input type="text" name="message" autofocus={autofocus} />
        </form>
    );
}
