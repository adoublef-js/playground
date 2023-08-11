type CounterProps = {
    value: number;
    href: string;
};

export function Counter({ value, href }: CounterProps) {
    return (
        <button hx-get={href} hx-swap="outerHTML">
            {value}
        </button>
    );
}
