document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const canvas = document.getElementById("canvas");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const downloadBtn = document.getElementById("downloadBtn");
    const formatSelect = document.getElementById("formatSelect");

    let originalImage = null;
    let exifData = null;

    preview.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = preview.src;
    });

    modal.addEventListener("click", () => {
        modal.style.display = "none";
        modalImg.src = "";
    });

    function formatShutterSpeed(value) {
        if (!value) return "";
        if (value >= 1) return `${value.toFixed(1)}s`;
        const denominator = Math.round(1 / value);
        return `1/${denominator}s`;
    }

    function drawImageWithExif(img, exif) {
        const context = canvas.getContext("2d");

        const make = exif.Make || "Unknown";
        const model = exif.Model || "Unknown";
        const fnumber = exif.FNumber ? `f/${exif.FNumber}` : "";
        const iso = exif.ISOSpeedRatings ? `ISO ${exif.ISOSpeedRatings}` : "";
        const shutterSpeed = exif.ExposureTime ? `SS ${formatShutterSpeed(exif.ExposureTime)}` : "";
        const focalLength = exif.FocalLength ? `FL ${exif.FocalLength}mm` : "";

        const line1_1 = `${make} ${model}`;
        const line1_2 = [fnumber, shutterSpeed, focalLength, iso].filter(Boolean).join(" | ");

        const scale = img.height / 1080;
        const padding = Math.round(60 * scale) * 2;
        const fontSizeBig = Math.round(36 * scale);
        const fontSizeSmall = Math.round(24 * scale);
        const lineSpacing = 16;

        const lineHeightBig = fontSizeBig + lineSpacing;
        const lineHeightSmall = fontSizeSmall + lineSpacing;

        const frameColor = document.querySelector('input[name="frameColor"]:checked')?.value || "black";
        const bgColor = frameColor === "white" ? "#fff" : "#000";
        const textColor = frameColor === "white" ? "#000" : "#fff";

        const framePosition = document.querySelector('input[name="framePosition"]:checked')?.value || "bottom";
        const textAlign = document.querySelector('input[name="textAlign"]:checked')?.value || "left";

        let drawX = 0, drawY = 0;
        let canvasWidth = img.width;
        let canvasHeight = img.height;
        const isVertical = (framePosition === "left" || framePosition === "right");

        if (isVertical) {
            canvasWidth += padding;
        } else {
            canvasHeight += padding;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let bandX = 0, bandY = 0;
        if (framePosition === "bottom") {
            bandY = img.height;
        } else if (framePosition === "top") {
            drawY = padding;
        } else if (framePosition === "right") {
            bandX = img.width;
        } else if (framePosition === "left") {
            drawX = padding;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, drawX, drawY);

        context.fillStyle = bgColor;
        if (isVertical) {
            context.fillRect(bandX, 0, padding, canvas.height);
        } else {
            context.fillRect(0, bandY, canvas.width, padding);
        }

        context.fillStyle = textColor;
        context.textBaseline = "top";

        if (isVertical) {
            context.save();

            document.querySelector('input[type="radio"][name="textAlign"][value="left"]').disabled = true;
            document.querySelector('input[type="radio"][name="textAlign"][value="right"]').disabled = true;
            document.querySelector('input[type="radio"][name="textAlign"][value="center"]').checked = true;

            let x = bandX + padding / 2;
            let y = canvas.height / 2;

            context.translate(x, y);

            if (framePosition === "left") {
                context.rotate(Math.PI / 2);
            } else {
                context.rotate(-Math.PI / 2);
            }

            context.textAlign = "center";
            context.textBaseline = "middle";

            context.font = `${fontSizeBig}px 'Segoe UI', sans-serif`;
            context.fillText(line1_1, 0, -lineHeightSmall / 2);

            context.font = `${fontSizeSmall}px 'Segoe UI', sans-serif`;
            context.fillText(line1_2, 0, lineHeightBig / 2);

            context.restore();
        } else {
            document.querySelector('input[type="radio"][name="textAlign"][value="left"]').disabled = false;
            document.querySelector('input[type="radio"][name="textAlign"][value="right"]').disabled = false;

            let textBaseX = 0;
            if (textAlign === "left") {
                context.textAlign = "left";
                textBaseX = 40;
            } else if (textAlign === "center") {
                context.textAlign = "center";
                textBaseX = canvas.width / 2;
            } else {
                context.textAlign = "right";
                textBaseX = canvas.width - 40;
            }

            const textStartY = framePosition === "top"
                ? (padding - (lineHeightBig + lineHeightSmall)) / 2
                : img.height + (padding - (lineHeightBig + lineHeightSmall)) / 2;

            context.font = `${fontSizeBig}px 'Segoe UI', sans-serif`;
            context.fillText(line1_1, textBaseX, textStartY);

            context.font = `${fontSizeSmall}px 'Segoe UI', sans-serif`;
            context.fillText(line1_2, textBaseX, textStartY + lineHeightBig);
        }

        const dataUrl = canvas.toDataURL(formatSelect?.value || "image/jpeg");
        preview.src = dataUrl;

        let originalName = fileInput.files[0]?.name || "image.jpg";
        let baseName = originalName.replace(/\.[^/.]+$/, "");

        if (downloadBtn) {
            downloadBtn.style.display = "inline-block";
            downloadBtn.onclick = () => {
                const format = document.querySelector('input[name="formatSelect"]:checked')?.value || "image/jpeg";
                const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";

                const a = document.createElement("a");
                a.href = canvas.toDataURL(format);
                a.download = `${baseName}_exif-frame.${ext}`;
                a.click();
            };
        }
    }

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                EXIF.getData(img, function () {
                    exifData = EXIF.getAllTags(this);
                    originalImage = img;
                    drawImageWithExif(img, exifData);
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.querySelectorAll('input[name="frameColor"], input[name="framePosition"], input[name="textAlign"]').forEach(input => {
        input.addEventListener("change", () => {
            if (originalImage && exifData) {
                drawImageWithExif(originalImage, exifData);
            }
        });
    });
});
