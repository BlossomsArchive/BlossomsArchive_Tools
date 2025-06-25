const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const parameter_text = decodeURI(params.get('text'));
const parameter_ret = decodeURI(params.get('result'));
if (parameter_text != "null") {
    $('.tyuusen-input').val(parameter_text);
}
if (parameter_ret != "null") {
    $('#str').text(parameter_ret);
}

function lottery() {
    var text = document.forms["testForm"].elements["user"].value;

    var arr = text.split(/\x0D\x0A|\x0A|\x0D/);

    var ret = arr[Math.floor(Math.random() * arr.length)];

    if (ret) {
        document.getElementById("str").textContent = ret;
        encode_text = encodeURI(text);
        encode_ret = encodeURI(ret);
        shareOpts = {
            title: '抽選あぷり - 抽選結果',
            text: '当たったのは『' + ret + '』でした',
            url: location.href + '?text=' + encode_text + '&result=' + encode_ret,
        };
    }
}

$(document).on("click", "#chkid2", function () {
    $('.tyuusen-input').val(null);
    $('#str').text(null);
});

$(document).on("click", "#share", function () {
    navigator.share(shareOpts);
});
