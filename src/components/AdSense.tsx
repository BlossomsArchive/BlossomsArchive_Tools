import { createEffect, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";

interface AdSenseProps {
    slot?: string; // 指定がなくても動くようにオプショナルにしている
    format?: string;
    class?: string;
}

export default function AdSense(props: AdSenseProps) {
    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    const defaultSlot = import.meta.env.VITE_ADSENSE_DEFAULT_SLOT;

    // クライアントIDがない場合は何も表示しない（安全対策）
    if (!clientId) return null;

    const location = useLocation();

    // propsの指定を最優先し、なければデフォルトIDを使う
    const currentSlot = () => props.slot ?? defaultSlot;

    // 現在のルートとスロットIDを監視するキー
    const key = createMemo(() => location.pathname + currentSlot());

    let container!: HTMLDivElement;

    createEffect(() => {
        const activeKey = key();
        const activeSlot = currentSlot();

        if (!container || !activeSlot) return;

        // 1. 中身を一度完全に空にする
        container.innerHTML = "";

        // 2. <ins> 要素を新しく生成して設定
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", clientId);
        ins.setAttribute("data-ad-slot", activeSlot);
        ins.setAttribute("data-ad-format", props.format ?? "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);

        // 3. AdSenseの初期化処理
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];

            setTimeout(() => {
                try {
                    (window as any).adsbygoogle.push({});
                } catch (innerErr) {
                    console.error(
                        "AdSense push error inside timeout:",
                        innerErr,
                    );
                }
            }, 1);
        } catch (e) {
            console.error("AdSense error:", e);
        }
    });

    return (
        <div
            ref={container!}
            class={`my-6 flex justify-center overflow-hidden w-full min-h-[90px] ${props.class ?? ""}`}
            style={{ width: "100%" }}
        />
    );
}
