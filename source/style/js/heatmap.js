$(document).ready(function() {
  initMap();
  initSetting();
  initGraph();
});

function initMap() {
  var point = new BMap.Point(112.557, 37.876);
  window.map = new BMap.Map("map", {
    mapType: BMAP_NORMAL_MAP
  });
  window.map.centerAndZoom(point, 11);
  window.map.addControl(new BMap.NavigationControl());
  window.map.enableScrollWheelZoom();
  window.map.enableKeyboard();

  initMapStyle();
  initHeatmap();
}

// 初始化地图风格
function initMapStyle() {
  window.map.setMapStyle({
    styleJson: [{
      "featureType": "water",
      "elementType": "all",
      "stylers": {
        "color": "#003250"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#018d8e"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#018d8e"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#018d8e"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#018d8e"
      }
    }, {
      "featureType": "local",
      "elementType": "geometry",
      "stylers": {
        "color": "#018d8e"
      }
    }, {
      "featureType": "land",
      "elementType": "all",
      "stylers": {
        "color": "#013d61",
        "visibility": "on"
      }
    }, {
      "featureType": "railway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#000000"
      }
    }, {
      "featureType": "railway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#08304b"
      }
    }, {
      "featureType": "subway",
      "elementType": "geometry",
      "stylers": {
        "lightness": -70
      }
    }, {
      "featureType": "building",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#000000",
        "visibility": "off"
      }
    }, {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#00dfcd",
        "lightness": 14
      }
    }, {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#001122"
      }
    }, {
      "featureType": "building",
      "elementType": "geometry",
      "stylers": {
        "color": "#003042",
        "lightness": 11,
        "visibility": "off"
      }
    }, {
      "featureType": "green",
      "elementType": "geometry",
      "stylers": {
        "color": "#115985",
        "lightness": -2,
        "saturation": 20
      }
    }, {
      "featureType": "boundary",
      "elementType": "all",
      "stylers": {
        "color": "#1e1c1c",
        "visibility": "off"
      }
    }, {
      "featureType": "manmade",
      "elementType": "all",
      "stylers": {
        "color": "#103a52",
        "visibility": "off"
      }
    }, {
      "featureType": "poi",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }]
  });
}

// 初始化热力图
function initHeatmap() {
  if (!isSupportCanvas()) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
  }
  var points = [{
    "lng": 112.557261,
    "lat": 37.876984,
    "count": 50
  }, {
    "lng": 112.558261,
    "lat": 37.877984,
    "count": 51
  }, {
    "lng": 112.559261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.560261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.561261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.562261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.563261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.564261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.565261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.566261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.567261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.568261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.569261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.570261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.571261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.572261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.573261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.574261,
    "lat": 37.878984,
    "count": 100
  }, {
    "lng": 112.575261,
    "lat": 37.878984,
    "count": 100
  }];

  window.heatmapOverlay = new BMapLib.HeatmapOverlay({
    "radius": 20
  });
  window.map.addOverlay(window.heatmapOverlay);
  window.heatmapOverlay.setDataSet({
    data: points,
    max: 100
  });
  openHeatmap();
}

function openHeatmap() {
  window.heatmapOverlay.show();
}

function closeHeatmap() {
  window.heatmapOverlay.hide();
}

window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

// 初始化设置菜单
function initSetting() {
  initSettingCalendar();
}

// 初始化设置栏内的日期选择插件
function initSettingCalendar() {
  $("#ECalendar_date").ECalendar({
    type: "time", //模式，time: 带时间选择; date: 不带时间选择;
    stamp: true, //是否转成时间戳，默认true;
    offset: [0, 2], //弹框手动偏移量;
    format: "yyyy年mm月dd日 hh:ii", //时间格式 默认 yyyy-mm-dd hh:ii;
    skin: 5, //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
    step: 1, //选择时间分钟的精确度;
    callback: function(v, e) {} //回调函数
  });
}

// 初始化曲线图
function initGraph() {
  var config = {
    type: 'line',
    data: {
      labels: ["13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55", "14:00"],
      datasets: [{
        label: "某车辆获取IMEI数",
        fill: false,
        backgroundColor: "#28d3ff",
        borderColor: "#28d3ff",
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: '时间'
          },
          ticks: {
            beginAtZero: true,
            fontColor: '#28d3ff'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'IMEI数量'
          },
          ticks: {
            beginAtZero: true,
            fontColor: '#02edff'
          }
        }]
      }
    }
  };
  Chart.defaults.global.defaultFontColor = "#fff";
  var ctx = document.getElementById("canvas").getContext("2d");
  window.chart = new Chart(ctx, config);

  setTimeout(function() {
    updateGraph();
  }, 1500);
}

// 根据分辨率修改曲线图大小
function resolutionGraph(){

}

// 动态刷新曲线图
function updateGraph() {
  window.chart.data.datasets[0].data.shift();
  window.chart.data.datasets[0].data.push(randomScalingFactor());
  window.chart.data.labels.shift();
  var time = window.chart.data.labels.slice(-1)[0];
  var times = time.split(":");
  times[0] = parseInt(times[0]);
  times[1] = parseInt(times[1]);
  times[1] += 5;
  if (times[1] == 60) {
    console.log("Reset seconds");
    times[1] = 0;
    times[0] += 1;
  }
  if (times[0] == 24) {
    times[0] = 0;
  }
  window.chart.data.labels.push(times.join(":"));
  window.chart.update();

  setTimeout(function() {
    updateGraph();
  }, 1500);
}

// 随机数据
function randomScalingFactor() {
  return (1.0) * Math.round(Math.random() * 100);
}

//判断浏览区是否支持canvas
function isSupportCanvas() {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
