import { memo } from "$deps/hono.ts";
import { SVGProps, Svg } from "./svg.tsx";

export const Deno = memo((props: Omit<SVGProps, "children" | "viewBox">) => (
    <Svg {...props} viewBox={[0, 0, 256, 256]}>
        <path d="M117.926 0.0658136C117.327 0.128776 115.407 0.349144 113.675 0.50655C89.0561 3.08801 64.8146 13.5083 45.0436 30.0674C41.3916 33.0896 33.0802 41.4006 30.0579 45.0524C13.687 64.6022 4.11634 86.5446 0.590297 112.517C-0.196766 118.278 -0.196766 137.733 0.590297 143.494C4.11634 169.466 13.687 191.408 30.0579 210.958C33.0802 214.61 41.3916 222.921 45.0436 225.943C64.5942 242.314 86.5375 251.884 112.511 255.41C118.272 256.197 137.728 256.197 143.489 255.41C169.462 251.884 191.406 242.314 210.956 225.943C214.608 222.921 222.92 214.61 225.942 210.958C242.313 191.408 251.884 169.466 255.41 143.494C256.197 137.733 256.197 118.278 255.41 112.517C251.884 86.5446 242.313 64.6022 225.942 45.0524C222.92 41.4006 214.608 33.0896 210.956 30.0674C191.469 13.7601 169.305 4.06392 143.678 0.632475C140.908 0.254701 136.878 0.0972947 129.417 0.0343324C123.718 -0.02863 118.524 0.00285118 117.926 0.0658136ZM119.5 13.6657C119.5 17.349 119.752 25.3452 120.098 32.9322C120.287 36.647 120.507 41.9673 120.602 44.7376C120.948 54.5597 121.987 80.3428 122.144 82.641L122.302 84.9391L120.885 84.7817C120.098 84.7187 119.374 84.5298 119.248 84.4354C119.153 84.3095 118.933 82.1373 118.807 79.5873C118.24 68.38 116.383 24.9045 116.194 18.5453L116.005 11.5564L116.887 11.4305C117.359 11.3676 118.146 11.2731 118.65 11.2416L119.5 11.2102V13.6657ZM149.628 12.9101C149.66 12.9416 149.754 22.4489 149.849 34.034C149.975 45.6506 150.132 56.0708 150.227 57.2042C150.321 58.369 150.29 59.3764 150.132 59.4393C150.006 59.5338 149.219 59.5338 148.432 59.4393L146.984 59.3134L146.764 50.1524C146.638 45.0839 146.48 39.4803 146.417 37.6544C146.165 32.0822 145.945 13.162 146.134 12.6898C146.26 12.3435 146.606 12.312 147.928 12.5324C148.841 12.7213 149.597 12.8787 149.628 12.9101ZM76.8094 23.4563C76.9983 23.7397 78.478 41.0858 80.304 63.7837C80.9022 71.4966 81.5003 78.5484 81.5948 79.4299C81.7522 81.0354 81.7207 81.0984 80.7133 81.728C80.1466 82.0743 79.5799 82.3576 79.454 82.3576C79.3595 82.3576 79.1706 81.5391 79.0762 80.5317C78.6354 76.4392 76.9354 56.669 75.739 42.3765C75.0464 33.9711 74.4168 26.447 74.3223 25.6285C74.1649 24.2434 74.1964 24.1174 75.0149 23.6767C76.0224 23.1415 76.5891 23.0471 76.8094 23.4563ZM163.481 29.7841C164.362 30.0989 164.457 30.2563 164.646 32.0507C164.96 35.1988 164.866 50.2468 164.52 50.2468C163.607 50.2468 161.718 49.1765 161.56 48.5783C161.466 48.2005 161.371 43.7302 161.371 38.6617C161.371 28.4304 161.246 29.0285 163.481 29.7841ZM105.333 31.2637C105.333 32.1137 105.553 36.8044 105.805 41.7469C106.057 46.6895 106.34 52.9542 106.466 55.6616C106.686 61.1393 106.749 60.9504 104.64 61.0764C103.601 61.1078 103.601 61.1078 103.538 59.5338C103.475 58.6523 103.318 55.9134 103.129 53.3949C102.971 50.8765 102.594 45.4302 102.342 41.2747C102.09 37.1192 101.775 32.9951 101.681 32.1137C101.492 30.5396 101.523 30.4766 102.373 30.1618C102.877 29.9729 103.758 29.8155 104.325 29.8155C105.333 29.7841 105.333 29.7841 105.333 31.2637ZM192.665 35.5766L193.735 36.0173L193.956 40.2358C194.05 42.5339 194.113 47.508 194.05 51.2542L193.956 58.1171L192.634 57.456L191.311 56.8264L191.217 46.3746C191.154 40.6136 191.185 35.734 191.248 35.5136C191.374 35.0414 191.374 35.0414 192.665 35.5766ZM135.178 39.7006C135.367 39.8895 135.808 55.1579 135.839 62.9023L135.871 67.5615L134.391 67.3411C133.541 67.2467 132.848 67.1522 132.817 67.1207C132.722 67.0578 131.778 43.7302 131.778 41.4636V39.134L133.384 39.3229C134.297 39.4488 135.084 39.6062 135.178 39.7006ZM207.682 41.9358C208.06 42.3765 208.123 49.2709 208.217 87.3002C208.312 130.965 208.312 132.098 207.745 132.098C207.399 132.098 206.927 131.909 206.643 131.689C206.171 131.342 206.108 127.533 205.951 90.2279C205.825 67.6244 205.667 47.0987 205.573 44.6117L205.384 40.0784L206.297 40.7395C206.832 41.1173 207.43 41.6525 207.682 41.9358ZM179.442 48.3894C179.6 48.5154 179.757 50.3098 179.789 52.3561C179.946 59.3134 179.978 101.97 179.82 102.096C179.757 102.159 179.191 102.002 178.561 101.75L177.428 101.278V74.4873V47.7283L178.309 47.9172C178.781 48.0431 179.285 48.232 179.442 48.3894ZM92.5507 50.1524C92.6451 51.0024 92.8026 52.9227 92.897 54.4968C92.9915 56.0394 93.2118 59.5653 93.4007 62.3041C93.7785 67.8448 93.7156 68.1911 91.921 68.1911C90.9766 68.1911 90.8506 68.0967 90.7247 67.1522C90.4099 65.2948 89.308 49.8061 89.4654 49.5542C89.6228 49.3339 91.2599 48.7672 92.0155 48.7042C92.2044 48.6728 92.4563 49.3339 92.5507 50.1524ZM40.4786 58.1801C40.8249 61.5171 41.5176 68.5059 42.0213 73.7003C42.5565 78.8947 42.9972 83.3021 42.9972 83.491C42.9972 83.8687 40.5731 85.065 40.3212 84.8132C40.1638 84.6558 37.0156 56.7949 37.0156 55.5357C37.0156 54.7801 39.4397 51.6005 39.7545 51.9468C39.849 52.0098 40.1638 54.8116 40.4786 58.1801ZM163.922 61.4856L164.835 62.0208L164.866 68.8207C164.897 72.5355 164.96 76.691 164.96 78.0447C165.023 80.878 164.677 81.3502 162.977 80.7521L162.001 80.4058V77.6984C162.001 76.1873 161.907 71.8114 161.781 67.9393L161.592 60.9504H162.316C162.694 60.9504 163.418 61.2023 163.922 61.4856ZM54.2995 73.7003C54.8661 79.7447 55.7791 89.9446 56.3773 96.3668L57.4477 108.015L56.2199 109.243L55.0236 110.47L54.8032 107.983C54.6772 106.598 54.0476 100.176 53.3865 93.6909C52.7253 87.2057 51.7809 77.7929 51.3086 72.7874L50.4271 63.7208L51.6549 62.5875C52.7568 61.5486 52.8827 61.5171 53.1031 62.0838C53.229 62.3986 53.7643 67.6244 54.2995 73.7003ZM30.7191 77.5095C31.4117 83.7113 33.2377 100.207 34.8118 114.154C36.3859 128.1 37.8656 141.542 38.1489 144.061C38.4008 146.579 38.8415 150.388 39.0934 152.561C39.5342 156.244 39.5342 156.496 39.0304 156.874C38.2749 157.44 37.96 157.377 37.96 156.716C37.96 156.433 37.6767 154.04 37.3304 151.459C36.7637 147.146 35.8192 139.842 33.7099 123.441C33.2691 120.135 32.4191 113.555 31.8209 108.802C31.1913 104.048 30.2783 96.9649 29.7746 93.0612C29.2709 89.1576 28.4208 82.4836 27.8856 78.1706C27.3189 73.8892 26.9726 70.08 27.0671 69.6707C27.2875 68.8207 29.1449 65.8615 29.3338 66.0504C29.3968 66.1448 30.0264 71.2763 30.7191 77.5095ZM21.0854 91.0779C21.5576 94.8557 22.4392 101.75 23.0373 106.441C23.6355 111.1 24.3911 116.924 24.7374 119.348L25.3355 123.755L24.6744 124.322C24.2966 124.637 23.9188 124.763 23.7929 124.637C23.667 124.511 23.4151 123.252 23.2262 121.867C23.0373 120.481 21.8725 112.391 20.6132 103.922L18.3779 88.4965L19.102 86.3557C19.4798 85.1909 19.8891 84.2465 19.9835 84.2465C20.1095 84.2465 20.5817 87.3317 21.0854 91.0779ZM193.924 86.9539C194.365 87.3946 194.428 89.3465 194.428 103.796V120.135H193.547C191.626 120.135 191.658 120.607 191.532 102.726L191.437 86.4502H192.445C192.98 86.4502 193.673 86.6706 193.924 86.9539ZM125.009 92.589C132.124 93.6594 138.326 95.6427 144.465 98.7908C148.432 100.837 150.321 102.254 154.729 106.472C161.277 112.737 165.307 118.215 169.085 125.959C174.594 137.229 176.735 147.209 179.442 173.968C180.67 185.962 182.276 207.716 182.622 216.625C182.717 219.206 182.937 223.456 183.126 226.069C183.472 231.61 183.881 230.854 179.002 233.215C172.233 236.49 165.716 238.756 157.121 240.865C146.606 243.447 139.806 244.265 129.417 244.297L121.861 244.328L121.924 240.708C121.924 238.725 122.113 234.097 122.302 230.477C123.246 212.942 123.057 190.81 121.829 178.533C121.137 171.481 119.783 162.918 119.027 161.029C118.87 160.62 119.594 160.274 122.711 159.203C128.409 157.22 133.352 154.733 134.108 153.505C135.461 151.176 133.037 147.839 129.952 147.839C129.417 147.839 127.811 148.405 126.331 149.066C119.279 152.309 105.144 156.118 96.9897 156.968C91.3544 157.566 82.6022 157.22 76.5261 156.118C73.2204 155.52 67.3017 153.285 62.359 150.735C56.6606 147.776 53.1661 143.84 52.1272 139.181C51.5605 136.663 51.7179 131.626 52.442 128.792C53.229 125.676 55.4328 121.142 57.4477 118.498C66.4202 106.693 84.9319 96.4612 103.916 92.8724C109.961 91.739 118.524 91.6131 125.009 92.589ZM222.133 93.5649C223.266 94.0372 223.392 94.1631 223.392 95.2334C223.455 103.828 223.266 123.472 223.109 124.291C223.077 124.574 221.44 124.605 220.747 124.354C220.307 124.196 220.244 122.496 220.244 108.613C220.244 98.6649 220.37 93.0612 220.559 93.0612C220.716 93.0612 221.44 93.2816 222.133 93.5649ZM235.891 110.848L237.024 111.32L236.804 137.387C236.552 170.599 236.52 171.575 235.324 174.44C233.372 179.131 233.466 180.075 233.655 159.487C233.718 149.192 233.876 138.772 233.939 136.348C234.002 133.924 234.065 127.092 234.096 121.142C234.096 113.965 234.19 110.376 234.411 110.376C234.6 110.376 235.261 110.596 235.891 110.848ZM46.5548 118.687C46.7437 121.237 46.6807 121.489 45.7677 123.504L44.7603 125.644L44.3825 122.496C43.7843 117.459 43.7843 117.239 44.9806 116.483C45.5158 116.105 46.0825 115.854 46.177 115.917C46.2714 115.98 46.4603 117.239 46.5548 118.687ZM27.0986 137.67C27.3819 140.252 29.5857 157.377 30.7191 165.783C32.4191 178.785 32.545 180.642 31.7895 179.855C31.695 179.76 30.9709 175.385 30.2153 170.127C25.3041 136.19 25.3355 136.411 25.7448 136.159C26.5948 135.592 26.8782 135.907 27.0986 137.67ZM49.766 152.088C49.9549 152.875 50.8679 161.407 50.8679 162.446C50.8679 163.327 49.7345 164.146 49.2308 163.642C49.0734 163.485 48.6641 160.809 48.3493 157.724C48.003 154.607 47.6566 151.364 47.5622 150.514L47.3733 148.94L48.4752 150.2C49.1048 150.892 49.6715 151.742 49.766 152.088ZM75.1724 163.957C75.5187 164.272 75.739 165.531 76.0224 168.931C76.4946 175.07 76.5576 174.598 75.2668 174.598C73.9445 174.598 73.976 174.692 73.5353 169.151C73.0945 163.516 73.0945 163.579 73.9445 163.579C74.3538 163.579 74.889 163.768 75.1724 163.957ZM100.107 164.429C100.169 164.744 100.327 166.633 100.453 168.616C100.547 170.599 100.831 175.07 101.082 178.533C101.964 191.251 101.995 192.857 101.46 192.857C100.862 192.857 100.799 192.384 100.107 183.412C99.8546 179.697 99.3824 173.842 99.0676 170.411C98.7842 166.979 98.5953 164.114 98.6898 164.051C99.0361 163.674 99.9491 163.957 100.107 164.429ZM40.9194 170.473C41.1083 170.757 42.3046 180.831 43.7843 194.588C44.2251 198.744 44.6658 202.742 44.7603 203.497L44.9177 204.851L44.1306 204.347C43.5324 203.938 43.3121 203.529 43.3121 202.805C43.3121 200.821 41.9583 187.757 40.9194 179.76C40.3212 175.227 39.849 171.229 39.849 170.851C39.849 170.19 40.6046 169.938 40.9194 170.473ZM222.605 183.633L222.385 196.792L221.597 197.957C219.803 200.601 219.897 201.105 219.992 186.371L220.055 172.866L221.22 171.67C221.849 171.04 222.479 170.505 222.605 170.505C222.699 170.505 222.699 176.423 222.605 183.633ZM193.484 204.505C193.641 222.795 193.61 224.212 193.106 224.779C192.791 225.125 192.508 225.345 192.413 225.251C192.193 224.999 191.878 185.112 192.13 184.892C192.256 184.766 192.571 184.703 192.854 184.734C193.263 184.829 193.358 187.064 193.484 204.505ZM90.6617 191.975C90.8821 193.927 91.6692 203.277 91.984 207.684C92.1729 210.643 92.1729 210.738 91.4803 210.958C91.1025 211.084 90.6617 211.053 90.5358 210.895C90.3154 210.675 89.6228 203.686 88.7728 192.92L88.5524 190.338H89.5284C90.4414 190.338 90.5043 190.401 90.6617 191.975ZM65.9165 202.994C66.1369 203.214 66.2943 204.001 66.2943 204.788C66.2943 205.606 66.6721 209.856 67.0814 214.264C68.2777 226.321 68.3721 227.958 67.8369 227.643C67.0184 227.171 66.2943 226.447 66.4517 226.258C66.5147 226.132 66.3887 224.558 66.1369 222.764C65.9165 220.938 65.6332 217.979 65.5072 216.153C65.3813 214.327 65.098 210.99 64.8461 208.755C64.2479 203.245 64.2794 202.616 64.972 202.616C65.2868 202.616 65.6961 202.773 65.9165 202.994ZM80.8077 224.18C80.9022 224.873 81.0911 227.454 81.217 229.91C81.4374 234.632 81.3429 234.978 80.0521 234.003C79.6744 233.719 79.4225 232.523 79.0447 228.934C78.3836 222.449 78.3521 222.701 79.5799 222.827C80.4929 222.921 80.6188 223.047 80.8077 224.18Z" />
        <path d="M69.5685 107.668C66.2943 109.085 66.0424 113.524 69.1277 115.098C71.363 116.231 73.6297 115.696 74.7946 113.744C76.9984 110.156 73.4093 106 69.5685 107.668Z" />
        <path d="M90.9136 110.691C87.8913 112.548 87.8913 117.018 90.9136 118.876C93.9044 120.67 97.7768 118.309 97.7768 114.72C97.7768 111.257 93.81 108.928 90.9136 110.691Z" />
    </Svg>
));
