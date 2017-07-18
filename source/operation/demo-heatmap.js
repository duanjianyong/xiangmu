$(document).ready(function() {
  init_ui();
  init_bundle();
});

window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

function init_ui() {
  if (!localStorage.user) {
    alert("登录状态已失效");
    window.location.href = "login.html";
    return;
  }
  this.userobj = JSON.parse(localStorage.user);

  // 默认获取全部车辆信息
  localStorage.device_show = 'all';
  $("#btn-all").addClass("disabled");
  $("#btn-important").removeClass("disabled");
  $("#btn-hot").removeClass("disabled");

  init_setting();
  init_heatmap();
  init_graph();
}

function init_bundle() {
  var self = this;
  // 绑定开始按钮
  $("#btn-refresh").click(function() {
    if ($(this).val() == "开始刷新") {
      init_heatmap_data();
      $(this).val("停止刷新");
      clear_graph_data();
    } else {
      cancel_heatmap_data_timer();
      $(this).val("开始刷新");
    }
  });

  // 绑定重点关注
  $("#btn-important").click(function() {
    localStorage.device_show = 'important';
    $("#btn-important").addClass("disabled");
    $("#btn-all").removeClass("disabled");
    $("#btn-hot").removeClass("disabled");
    window.important = $("#important_select").find("option:selected").attr('id');

    if ($("#btn-refresh").val() != "开始刷新") {
      cancel_heatmap_data_timer();
      $("#btn-refresh").val("开始刷新");
    }
  });

  $("#important_select").change(function() {
    window.important = $("#important_select").find("option:selected").attr('id');
    if ($("#btn-refresh").val() != "开始刷新") {
      cancel_heatmap_data_timer();
      $("#btn-refresh").val("开始刷新");
    }
  });

  // 绑定全部
  $("#btn-all").click(function() {
    localStorage.device_show = 'all';
    $("#btn-all").addClass("disabled");
    $("#btn-important").removeClass("disabled");
    $("#btn-hot").removeClass("disabled");
    if ($("#btn-refresh").val() != "开始刷新") {
      cancel_heatmap_data_timer();
      $("#btn-refresh").val("开始刷新");
    }
  });

  // 绑定热点
  $("#btn-hot").click(function() {
    localStorage.device_show = 'hot';
    $("#btn-hot").addClass("disabled");
    $("#btn-all").removeClass("disabled");
    $("#btn-important").removeClass("disabled");
    if ($("#btn-refresh").val() != "开始刷新") {
      cancel_heatmap_data_timer();
      $("#btn-refresh").val("开始刷新");
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 设置菜单
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function init_setting() {
    console.log('init_setting');
    var self = this;
    get_device(this.userobj.Role, this.userobj.Department, function(msg) {
      console.log(msg.result);
      console.log(msg.total);
      console.log(msg.devices);
      var options = $("#important_select");
      options.empty();
      for (var i = 0; i < msg.devices.length; i++) {
        $("<option></option>").text(msg.devices[i].devname).attr('id', msg.devices[i].devid).appendTo(options);
      }
      self.devices = msg.devices;
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 设备操作
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function get_device(role, department, callback) {
    getDevice(role, department, 1, 15, callback);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  热力图数据
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function init_heatmap() {
    var point = new BMap.Point(112.557, 37.876);
    window.map = new BMap.Map("map", {
      mapType: BMAP_NORMAL_MAP
    });
    window.map.centerAndZoom(point, 11);
    window.map.addControl(new BMap.NavigationControl());
    window.map.enableScrollWheelZoom();
    window.map.enableKeyboard();

    init_heatmap_style();
    // init_heatmap_data();
  }

  // 初始化地图风格
  function init_heatmap_style() {
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

  // 获取数据
  function init_heatmap_data() {
    // get interval time
    var self = this;
    self.interval = parseInt($("#endtime_select").val());
    
    var _start_time_str = $("#starttime").val();
    _start_time_str = _start_time_str.replace("T", " ");
    console.log(_start_time_str);
    var _start_time_milliseconds = Date.parse(_start_time_str);
    console.log(_start_time_milliseconds);
    var _start_time_seconds = _start_time_milliseconds / 1000;
    self.start_time = _start_time_seconds;
    self.end_time = self.start_time + self.interval;

    // get devices
    // debug
    self.devids = [];
    // self.devids = ["1", "2", "3"];
    if (self.devices == null || self.devices.length == 0) {
      alert("未获取到设备，请选择关注车辆后重试!");
      return;
    }

    if (localStorage.device_show == 'important') {
      self.devids.push(window.important);
    } else {
      for (var i = 0; i < self.devices.length; i++) {
        self.devids.push(self.devices[i].devid);
      }
    }
    console.log(this.devids);

    // start timer
    start_heatmap_data_timer();
  }

  function start_heatmap_data_timer() {
    var self = this;
    // console.log(this.devids);
    // console.log(this.userobj.Department);
    get_heatmap(this.start_time, this.end_time, this.devids, this.userobj.Department, function(msg) {
      if (msg.result == 'exception') {
        console.log("服务器数据出现故障, 重新请求");
        self.timer = setTimeout(function() {
          self.start_time += self.interval;
          self.end_time += self.interval;
          start_heatmap_data_timer();
        }, self.interval * 50);
        return;
      }
      console.log(msg);
      refresh_heatmap_data(msg.heatmap_data);

      var date = new Date(self.end_time * 1000);
      var currentdate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒";
      $("#uptime").val(currentdate);

      self.timer = setTimeout(function() {
        self.start_time += self.interval;
        self.end_time += self.interval;
        start_heatmap_data_timer();
      }, self.interval * 50);
    }, function(exception) {
      console.log()
    });
  }

  function refresh_heatmap_data(heatmap_data) {
    if (heatmap_data != "") {
      heatmap_data = JSON.parse(heatmap_data)
    } else {
      heatmap_data = [];
    }
    // console.log(heatmap_data);
    var date = new Date(self.end_time * 1000);
    var currentdate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒";
    $("#uptime").val(currentdate);

    var points = [];

    var dev_point_count_list = [];
    _dev_list_init();
    if (heatmap_data.length != 0) {
      for (var i = 0; i < heatmap_data.length; i++) {
        for (var j = 0; j < heatmap_data[i].results.length; j++) {
          var info = heatmap_data[i].results[j];
          info.lat = heatmap_data[i].lat;
          info.lng = heatmap_data[i].lng;
          _dev_list_update(info);
        }
      }

      if (localStorage.device_show == "hot") {
        points = _dev_list_get_max();
      } else if (localStorage.device_show == "important") {
        points = _dev_list_get_dev(window.important);
      } else if (localStorage.device_show == "all") {
        points = _dev_list_get_all();
      } else {
        points = _dev_list_get_all();
      }
    } else {
      points = [];
    }

    console.log(points);

    // refresh graph
    var g_count = 0;
    for (var i = 0; i < points.length; i++) {
      g_count += points[i].count;
    }
    var time = $("#uptime").val();
    time = time.split("日")[1];
    refresh_graph_data({ count: g_count, time: time });

    // debug to blowup count
    for (var i = 0; i < points.length; i++) {
      points[i].count = points[i].count * 100;
    }
    // return;

    if (!window.heatmapOverlay) {
      window.heatmapOverlay = new BMapLib.HeatmapOverlay({
        'radius': 20
      });
      window.map.addOverlay(window.heatmapOverlay);
    }    
    
    window.heatmapOverlay.setDataSet({
      data: points,
      max: 100
    });
    window.heatmapOverlay.draw();
  }

  function _dev_list_init() {
    window.dev_list = undefined;
  }

  function _dev_list_update(info) {
    if (window.dev_list == undefined) {
      window.dev_list = [];
      var dev_info = {
        devid: info.devid,
        devname: info.devname,
        count_all: info.imsinum,
        points: [{
          lat: info.lat,
          lng: info.lng,
          count: info.imsinum
        }]
      };
      window.dev_list.push(dev_info);
    } else {
      for (var i = 0; i < window.dev_list.length; i++) {
        if (window.dev_list[i].devid == info.devid) {
          window.dev_list[i].count_all = window.dev_list[i].count_all + info.imsinum;
          window.dev_list[i].points.push({
            lat: info.lat,
            lng: info.lng,
            count: info.imsinum
          });
          return;
        }
      }

      var dev_info = {
        devid: info.devid,
        devname: info.devname,
        count_all: info.imsinum,
        points: [{
          lat: info.lat,
          lng: info.lng,
          count: info.imsinum
        }]
      };
      window.dev_list.push(dev_info);
    }
  }

  function _dev_list_get_max() {
    var index = -1;
    var max = 0;
    for (var i = 0; i < window.dev_list.length; i++) {
      if (window.dev_list[i].count_all > max) {
        max = window.dev_list[i].count_all;
        index = i;
      }
    }

    if (index != -1) {
      return window.dev_list[index].points;
    }
  }

  function _dev_list_get_all() {
    var dev_list = [];
    for (var i = 0; i < window.dev_list.length; i++) {
      dev_list = dev_list.concat(window.dev_list[i].points);
    }
    return dev_list;
  }

  function _dev_list_get_dev(devid) {
    for (var i = 0; i < window.dev_list.length; i++) {
      if (devid == window.dev_list[i].devid) {
        return dev_list[i].points;
      }
    }

    return [];
  }

  function cancel_heatmap_data_timer() {
    clearTimeout(this.timer);
  }

  function get_heatmap(starttime, endtime, devids, department, callback) {
    console.log('get_heatmap');
    var obj = {
      starttime: starttime,
      endtime: endtime,
      devids: devids,
      department: department
    }
    getHeatmap(obj, callback);
  }

  function show_heatmap() {
    window.heatmapOverlay.show();
  }

  function hide_heatmap() {
    window.heatmapOverlay.hide();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  曲线图数据
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  // 初始化曲线图
  function init_graph() {
    var config = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: "热力值数据",
          fill: false,
          backgroundColor: "#28d3ff",
          borderColor: "#28d3ff",
          data: []
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
  }

  function refresh_graph_test() {
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
      refresh_graph_test();
    }, 1500);
  }

  // 动态刷新曲线图
  function refresh_graph_data(data) {
    // 0. 获取当前是什么样的数据，放在title里
    var title = "热力值"
    switch (localStorage.device_show) {
      case 'hot':
        title = "热点车辆热力值"
        break;
      case 'all':
        title = "全部车辆热力值"
        break;
      case 'important':
        title = "重点车辆热力值"
        break;
    }

    // 1. 获取时间点，放在label里
    var time = data.time;

    // 2. 获取数量，放在data里
    var count = data.count;

    // 3. 检查数据量是否超过10个，超过10个要移除老数据
    if (window.chart.data.datasets[0].data.length == 0) {
      window.chart.data.labels.push("开始");
      window.chart.data.datasets[0].data.push(0);
    }
    if (window.chart.data.datasets[0].data.length == 5) {
      window.chart.data.datasets[0].data.shift();
      window.chart.data.labels.shift();
    }
    // 更新数据
    window.chart.data.datasets[0].data.push(count);
    window.chart.data.labels.push(time);
    window.chart.data.datasets[0].label = title;
    window.chart.update();
  }

  // 清空曲线图
  function clear_graph_data() {
    window.chart.data.datasets[0].data = [];
    window.chart.data.labels = [];
    window.chart.data.datasets[0].label = "热力值";
    window.chart.update();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   工具
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  //判断浏览区是否支持canvas
  function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  // 随机数据
  function randomScalingFactor() {
    return (1.0) * Math.round(Math.random() * 100);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   TODO
////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// 根据分辨率修改曲线图大小
function resolutionGraph() {

}
