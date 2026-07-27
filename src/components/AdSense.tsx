import { createEffect, createMemo, onCleanup } from "solid-js";
import { useLocation } from "@solidjs/router";

interface AdSenseProps {
    slot?: string;
    format?: string;
    class?: string;
}

export default function AdSense(props: AdSenseProps) {
    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    const defaultSlot = import.meta.env.VITE_ADSENSE_DEFAULT_SLOT;

    if (!clientId) return null;

    const location = useLocation();
    const currentSlot = () => props.slot ?? defaultSlot;
    const key = createMemo(() => location.pathname + currentSlot());

    let container!: HTMLDivElement;
    let timerId: number | null = null;

    createEffect(() => {
        key();
        const activeSlot = currentSlot();

        if (!container || !activeSlot) return;

        if (timerId) clearTimeout(timerId);

        container.innerHTML = "";

        // 1. 最初はあえて "adsbygoogle" クラスをつけずに生成する！（Googleの自動スキャンを回避）
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle-stealth";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", clientId);
        ins.setAttribute("data-ad-slot", activeSlot);
        ins.setAttribute("data-ad-format", props.format ?? "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);

        const pushAd = () => {
            if (!container || !ins) return;

            const width = container.offsetWidth;

            // 横幅が0pxの間は、クラス名を付けずに泳がせてリトライする
            if (width === 0) {
                timerId = window.setTimeout(pushAd, 50);
                return;
            }

            // 🌟 横幅がちゃんと1px以上あることを確認したら、本来のクラス名に変えてpushする
            try {
                ins.className = "adsbygoogle"; // ここで初めてGoogleに補足される状態にする

                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
            } catch (e) {
                console.error("AdSense push error inside safety check:", e);
            }
        };

        // ブラウザの最初のレイアウト組み立てを待つために少しだけ遅らせる
        timerId = window.setTimeout(pushAd, 50);
    });

    onCleanup(() => {
        if (timerId) clearTimeout(timerId);
    });

    return (
        <div
            ref={container!}
            class={`my-6 flex justify-center overflow-hidden w-full min-h-[90px] ${props.class ?? ""}`}
            style={{ width: "100%", "min-width": "250px" }}
        />
    );
}
