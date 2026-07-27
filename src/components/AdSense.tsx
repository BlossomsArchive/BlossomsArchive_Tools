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

        // 過去のタイマーが動いていたらクリアする
        if (timerId) clearTimeout(timerId);

        // 1. 中身を一度完全に空にする
        container.innerHTML = "";

        // 2. <ins> 要素を新しく生成
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", clientId);
        ins.setAttribute("data-ad-slot", activeSlot);
        ins.setAttribute("data-ad-format", props.format ?? "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);

        // 3. 親要素の横幅（availableWidth）が確定してからpushする関数
        const pushAd = () => {
            if (!container) return;

            // コンテナの実際の横幅をチェックする
            const width = container.offsetWidth;

            // 🌟 横幅が0px（まだ描画が終わっていない）の場合は、50ms待ってリトライする！
            if (width === 0) {
                timerId = window.setTimeout(pushAd, 50);
                return;
            }

            // 横幅がちゃんとあれば、安全にGoogleに初期化を要求する
            try {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
            } catch (e) {
                console.error("AdSense push error inside safety check:", e);
            }
        };

        // 最初の実行を少しだけ遅らせてブラウザの描画を待つ
        timerId = window.setTimeout(pushAd, 10);
    });

    // コンポーネントが消えるときにタイマーも消す安全対策
    onCleanup(() => {
        if (timerId) clearTimeout(timerId);
    });

    return (
        <div
            ref={container!}
            // 🌟 CSS側でも確実に横幅が潰れないように明示的に指定を足した
            class={`my-6 flex justify-center overflow-hidden w-full min-h-[90px] ${props.class ?? ""}`}
            style={{ width: "100%", "min-width": "250px" }}
        />
    );
}
