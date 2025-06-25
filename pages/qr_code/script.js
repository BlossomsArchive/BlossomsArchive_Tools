function generateQRCode() {
    const text = document.getElementById("text").value;
    document.getElementById("qrcode").style.display = "block";
    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
        text: text,
        width: 256,
        height: 256
    });
}
