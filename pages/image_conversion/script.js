document.getElementById("convertBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("inputFile");
    const format = document.getElementById("formatSelect").value;
    const preview = document.getElementById("previewArea");

    if (!fileInput.files.length) {
        alert("画像ファイルを選択してください。");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            try {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert("変換に失敗しました。");
                        return;
                    }
                    const url = URL.createObjectURL(blob);

                    preview.innerHTML = `
                        <p>変換結果（${format.split("/")[1].toUpperCase()}）</p>
                        <a href="${url}" download="converted.${format.split("/")[1]}">ダウンロード</a><br>
                        <img src="${url}">
                    `;
                }, format, 0.92); // JPEG/WEBP品質 0.92
            } catch (err) {
                alert("変換エラー: " + err.message);
            }
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});
