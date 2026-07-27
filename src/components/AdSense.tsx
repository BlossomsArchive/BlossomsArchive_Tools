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

        // 1. <ins> 要素をステルス生成
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle-stealth";
        ins.style.display = "block";

        // 🌟 ここが超重要！<ins> 自体にもインラインで幅を強制適用して、Googleのチェックをすり抜けさせる！
        ins.style.width = "100%";
        ins.style.minWidth = "250px";

        ins.setAttribute("data-ad-client", clientId);
        ins.setAttribute("data-ad-slot", activeSlot);
        ins.setAttribute("data-ad-format", props.format ?? "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);

        const pushAd = () => {
            if (!container || !ins) return;

            const width = container.offsetWidth;

            // コンテナ自体の幅がまだ0なら当然リトライ
            if (width === 0) {
                timerId = window.setTimeout(pushAd, 100);
                return;
            }

            try {
                // クラス名を本来のものに変える
                ins.className = "adsbygoogle";

                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
            } catch (e) {
                console.error("AdSense push error inside safety check:", e);
            }
        };

        // ブラウザのレンダリングが完全に一段落するのを待つために 100ms に伸ばした
        timerId = window.setTimeout(pushAd, 100);
    });

    onCleanup(() => {
        if (timerId) clearTimeout(timerId);
    });

    return (
        <div
            ref={container!}
            class={`my-6 flex justify-center overflow-hidden w-full min-h-[90px] ${props.class ?? ""}`}
        />
    );
}
