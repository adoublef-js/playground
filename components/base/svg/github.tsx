import { memo } from "$deps/hono.ts";
import { Svg, SVGProps } from "./svg.tsx";

export const GitHub = memo((props: Omit<SVGProps, "children" | "viewBox">) => (
    <Svg {...props} viewBox={[0, 0, 256, 252]}>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M128.106 0C57.2667 0 0 57.6888 0 129.058C0 186.107 36.6927 234.398 87.5952 251.489C93.9594 252.774 96.2905 248.712 96.2905 245.296C96.2905 242.304 96.0807 232.048 96.0807 221.363C60.4448 229.056 53.0239 205.978 53.0239 205.978C47.297 191.021 38.8115 187.177 38.8115 187.177C27.1478 179.271 39.6611 179.271 39.6611 179.271C52.5991 180.126 59.388 192.518 59.388 192.518C70.8393 212.174 89.2918 206.62 96.7153 203.201C97.7747 194.868 101.17 189.099 104.776 185.894C76.3538 182.902 46.45 171.792 46.45 122.219C46.45 108.117 51.5371 96.579 59.5978 87.6057C58.326 84.4014 53.8709 71.1513 60.8722 53.4172C60.8722 53.4172 71.6889 49.9979 96.0781 66.6647C106.52 63.8397 117.289 62.4026 128.106 62.3905C138.923 62.3905 149.949 63.8878 160.131 66.6647C184.523 49.9979 195.34 53.4172 195.34 53.4172C202.341 71.1513 197.883 84.4014 196.611 87.6057C204.885 96.579 209.762 108.117 209.762 122.219C209.762 171.792 179.858 182.687 151.223 185.894C155.891 189.954 159.919 197.645 159.919 209.825C159.919 227.131 159.709 241.021 159.709 245.293C159.709 248.712 162.043 252.774 168.404 251.492C219.307 234.395 255.999 186.107 255.999 129.058C256.209 57.6888 198.733 0 128.106 0Z"
        />
    </Svg>
));