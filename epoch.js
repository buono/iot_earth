// データ設定
var leftRange = [0, 360];
var data = [
    {
        label: "layer1",
        range: leftRange,
        values: [],
    },
];
//グラフの設定
let chart = $('#myChart').epoch({
    type: 'time.line',
    data: data,
    axes: ['bottom', 'left'],
    fps: 24,
    range: {
        left: leftRange,
    },
    queueSize: 1,
    windowSize: 20,

    // 目盛りの設定
    ticks: {time: 5, left: 5},
    tickFormats: {
        bottom: function (d) {
            return moment(d * 1000).format('HH:mm:ss');
        },
        left: function (d) {
            return (d).toFixed(0) + " °";
        }

    }
});

// リアルタイム表示処理
setInterval(function () {
    chart.push(
        [
            {time: Date.now() / 1000, y: $("#data_text").text(),},
        ],
    );
}, 1000);
