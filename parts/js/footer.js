$(function () {
    $("#year").text(new Date().getFullYear());
});

$(function () {
    var $ftr = $('#footer');
    if (window.innerHeight > $ftr.offset().top + $ftr.outerHeight()) {
        $ftr.attr({ 'style': 'position:fixed; top:' + (window.innerHeight - $ftr.outerHeight()) + 'px;' });
    }
});

$(function () {
    setInterval(function () {
        var $ftr = $('#footer');
        if (window.innerHeight > $ftr.offset().top + $ftr.outerHeight()) {
            $ftr.attr({ 'style': 'position:fixed; top:' + (window.innerHeight - $ftr.outerHeight()) + 'px;' });
        }
    }, 3000);
});