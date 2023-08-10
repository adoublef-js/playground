import { Component } from "$deps/hono.ts";

export type SVGProps = {
    viewBox: [number, number, number, number];
    children: Component | Component[];
    class?: string;
    styles?: string;
    width?: number;
    height?: number;
};

export const Svg = ({ viewBox, children, ...props }: SVGProps) => (
    <svg
        viewBox={viewBox.join(" ")}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        {children}
    </svg>
);
