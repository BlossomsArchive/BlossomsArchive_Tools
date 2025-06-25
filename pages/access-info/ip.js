fetch('https://api.ipbase.com/v1/json/')
    .then(res => res.json())
    .then(data => {
        document.getElementById("accessInfo").innerHTML = `
    IPアドレス: ${data.ip}<br>
    国: ${data.country_name} (${data.country_code})<br>
    都道府県: ${data.region_name} (${data.region_code})<br>
    都市: ${data.city}<br>
    郵便番号: ${data.zip_code}<br>
    タイムゾーン: ${data.time_zone}<br>
    緯度: ${data.latitude}<br>
    経度: ${data.longitude}<br>

    `;
    })
    .catch(error => {
        document.getElementById("accessInfo").innerText = "情報を取得できませんでした";
    });
