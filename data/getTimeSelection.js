
var _date;

self.port.on('date', function (date) {
    var fromTimePreview = $("#fromTimePreview"); //document.getElementById("fromTimePreview");
    var toTimePreview = $("#toTimePreview"); //document.getElementById("toTimePreview");

    _date = moment(date);

    fromTimePreview.text(_date.format("YYYY-MM-DD HH:mm:ss:SSS"));
    toTimePreview.text(_date.format("YYYY-MM-DD HH:mm:ss:SSS"));

    updatePreviewDates();
});

$("#btnFetchRows").on('click', function () {
    var timeBefore = $("#timeAmountBefore").val();
    var timeAfter = $("#timeAmountAfter").val();
    var timeUnit = $("#timeUnit").val();

    var dateFrom = moment(_date);
    var dateTo = moment(_date);

    var fromTime = dateFrom.subtract(timeBefore, timeUnit);
    var toTime = dateTo.add(timeAfter, timeUnit);

    self.port.emit("timeEntered", { "from": fromTime.format("YYYY-MM-DD HH:mm:ss:SSS"), "to": toTime.format("YYYY-MM-DD HH:mm:ss:SSS"), "unit": timeUnit });
});

$("#timeUnit").on('blur', function () {
    updatePreviewDates();
});

$("#timeAmountBefore").on('blur', function () {
    updatePreviewDates();
});

$("#timeAmountAfter").on('blur', function () {
    updatePreviewDates();
});

function updatePreviewDates() {
    var timeUnit = $("#timeUnit").val();

    if (['h', 'm', 's', 'ms'].includes(timeUnit)) {
        var timeBefore = $("#timeAmountBefore").val();
        var timeAfter = $("#timeAmountAfter").val();

        var dateFrom = moment(_date);
        var dateTo = moment(_date);

        var fromPreview = dateFrom.subtract(timeBefore, timeUnit).format("YYYY-MM-DD HH:mm:ss:SSS");
        var toPreview = dateTo.add(timeAfter, timeUnit).format("YYYY-MM-DD HH:mm:ss:SSS");

        $("#fromTimePreview").text(fromPreview);
        $("#toTimePreview").text(toPreview);
    }
}