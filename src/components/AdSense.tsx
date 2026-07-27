import { createEffect, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";

interface AdSenseProps {
    slot?: string; // 🌟 オプショナルにして、指定がなくても動くようにする
    format?: string;
    class?: string;
}

export default function AdSense(props: AdSenseProps) {
    // 環境変数からクライアントIDと、デフォルトのスロットIDを取得する
    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    const defaultSlot = import.meta.env.VITE_ADSENSE_DEFAULT_SLOT;

    // クライアントIDがない場合は何も表示しない（エラー防止）
    if (!clientId) return null;

    const location = useLocation();

    // propsで直接指定があればそれを最優先し、なければ環境変数のデフォルトIDを使う
    const currentSlot = () => props.slot ?? defaultSlot;

    // 現在のルートとスロットIDの組み合わせを監視するキー
    const key = createMemo(() => location.pathname + currentSlot());

    let container!: HTMLDivElement;

    createEffect(() => {
        // key() を内部で実行して依存関係に登録し、ルート変化やslot変更を検知する
        const activeKey = key();
        const activeSlot = currentSlot();

        // コンテナの参照がない、またはスロットIDが空っぽの場合は処理をスキップ
        if (!container || !activeSlot) return;

        // 1. 古い広告の中身を一度完全に空にする
        container.innerHTML = "";

        // 2. <ins> 要素を新しく生成して設定を流し込む
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", clientId);
        ins.setAttribute("data-ad-slot", activeSlot);
        ins.setAttribute("data-ad-format", props.format ?? "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);

        // 3. AdSenseの初期化処理を走らせる
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    });

    return (
        <div
            ref={container!}
            class={`my-6 flex justify-center overflow-hidden w-full ${props.class ?? ""}`}
        />
    );
}
