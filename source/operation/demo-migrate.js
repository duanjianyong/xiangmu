$(document).ready(function() {
  var self = this;
  _init_bundle();
  _init_ui();
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

window.color_list = [window.chartColors.red,
  window.chartColors.orange,
  window.chartColors.yellow,
  window.chartColors.green,
  window.chartColors.blue,
  window.chartColors.purple,
  window.chartColors.grey
];

function _init_ui() {
  this.userobj = JSON.parse(localStorage.user);
  // 默认查询一年内数据
  init_setting();
  setTimeout(function() {
    load_pie();
  }, 100);
  setTimeout(function() {
    load_migrate();
  }, 200);
  setTimeout(function() {
    load_bar();
  }, 300);
}

function _init_bundle() {
  var self = this;
  // 查询按钮
  $("#search").click(function() {
    setTimeout(function() {
      load_pie();
    }, 100);
    setTimeout(function() {
      load_migrate();
    }, 200);
    setTimeout(function() {
      load_bar();
    }, 300);
  });

  // 时间设置按钮
  $("#one_day").click(function() {
    console.log("one_day");
    var s_d = getOneDayAgoFormatDate();
    var e_d = getNowFormatDate();
    $("#starttime").val(s_d);
    $("#endtime").val(e_d);
  });

  $("#one_week").click(function() {
    console.log("one_week");
    var s_d = getOneWeekAgoFormatDate();
    var e_d = getNowFormatDate();
    $("#starttime").val(s_d);
    $("#endtime").val(e_d);
  });

  $("#one_month").click(function() {
    console.log("one_month");
    var s_d = getOneMonthAgoFormatDate();
    var e_d = getNowFormatDate();
    $("#starttime").val(s_d);
    $("#endtime").val(e_d);
  });

  $("#three_month").click(function() {
    console.log("three_month");
    var s_d = getThreeMonthAgoFormatDate();
    var e_d = getNowFormatDate();
    $("#starttime").val(s_d);
    $("#endtime").val(e_d);
  });

  $("#one_year").click(function() {
    console.log("one_year");
    var s_d = getOneYearAgoFormatDate();
    var e_d = getNowFormatDate();
    $("#starttime").val(s_d);
    $("#endtime").val(e_d);
  });

  $(".bar_ac_btn").click(function() {
    self.active_bar_name = $(this).val();
    $(".bar_ac_btn").attr('class', 'bar_ac_btn');
    $(this).attr('class', 'bar_ac_btn active');
    load_bar();
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 设置菜单
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function init_setting() {
    var start_d = getOneYearAgoFormatDate();
    // var start_d = getThreeMonthAgoFormatDate();
    // var start_d = getOneMonthAgoFormatDate();
    // var start_d = getOneWeekAgoFormatDate();
    // var end_d = getNowFormatDate();
    var end_d = getOneYearLaterFormatDate();

    $("#starttime").val(start_d);
    $("#endtime").val(end_d);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 敏感、省内、国内、境外条状数据
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_bar() {
    // get active bar name
    if (this.active_bar_name == null) {
      // debug
      // this.active_bar_name = "省内"; // default value
      this.active_bar_name = "境外"; // default value
      var btns = $(".bar_ac_btn");
      var btn = null;
      console.log(btns);
      for (var i = 0; i < btns.length; i++) {
        if (btns.eq(i).val() == this.active_bar_name) {
          btns.eq(i).attr('class', 'bar_ac_btn active');
        }
      }
    }

    console.log('load_bar: ' + this.active_bar_name);

    // get start time and end time
    var s_t = Date.parse(new Date($("#starttime").val())) / 1000 - 8 * 3600;
    var e_t = Date.parse(new Date($("#endtime").val())) / 1000 + 16 * 3600;

    // 0:新疆 1：敏感地区 2：国内 3：省内 4：境外
    if (this.active_bar_name == '省内') {
      type = 3;
    } else if (this.active_bar_name == '国内') {
      type = 2;
    } else if (this.active_bar_name == '境外') {
      type = 4;
    } else if (this.active_bar_name == '敏感地区') {
      type = 1;
    } else {
      type = 3;
      this.active_bar_name = '省内'; // default value
    }

    // api request 
    getMigrate(s_t, e_t, type, this.userobj.Department, function(msg) {
      console.log(msg);
      // api callback to refresh bar data
      refresh_bar(msg.migrate_data);
    });
  }

  function refresh_bar(bar_data) {
    console.log("refresh_bar");
    console.log(bar_data);

    var labels_list = [];
    var data_list = [];
    Chart.defaults.global.defaultFontColor = "#fff";
    var color = Chart.helpers.color;
    var border_color = window.chartColors.red;
    if (this.active_bar_name == '省内') {
      border_color = window.chartColors.white;
      for (var i = 0; i < bar_data.length; i++) {
        labels_list.push(bar_data[i].city);
        data_list.push(bar_data[i].imsinum);
      }
    } else if (this.active_bar_name == '国内') {
      border_color = window.chartColors.red;
      for (var i = 0; i < bar_data.length; i++) {
        labels_list.push(bar_data[i].province);
        data_list.push(bar_data[i].imsinum);
      }
      type = 2;
    } else if (this.active_bar_name == '境外') {
      border_color = window.chartColors.blue;
      for (var i = 0; i < bar_data.length; i++) {
        labels_list.push(bar_data[i].country);
        data_list.push(bar_data[i].imsinum);
      }
      type = 4;
    } else if (this.active_bar_name == '敏感地区') {
      border_color = window.chartColors.orange;
      for (var i = 0; i < bar_data.length; i++) {
        labels_list.push(bar_data[i].city);
        data_list.push(bar_data[i].imsinum);
      }
      type = 1;
    } else {
      alert("获取数据失败，请点击重试");
      return;
    }
    var bar_color = color(border_color).alpha(1).rgbString();
    var bar_label = this.active_bar_name;

    var ctx = document.getElementById("bar").getContext("2d");
    if (window.myBar) {
      console.log("update");
      window.myBar.data.labels = labels_list;
      window.myBar.data.datasets[0].data = data_list;
      window.myBar.update();
    } else {
      var barChartData = {
        labels: labels_list,
        datasets: [{
          label: bar_label,
          backgroundColor: bar_color,
          borderColor: border_color,
          borderWidth: 1,
          data: data_list
        }]
      };
      window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: true,
            text: ''
          }
        }
      });
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 迁徙图数据
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_migrate() {
    // get start time and end time
    var s_t = Date.parse(new Date($("#starttime").val())) / 1000 - 8 * 3600;
    var e_t = Date.parse(new Date($("#endtime").val())) / 1000 + 16 * 3600;

    // api request 
    // 0:新疆 1：敏感地区 2：国内 3：省内 4：境外
    getMigrate(s_t, e_t, 2, this.userobj.Department, function(msg) {
      // api callback to refresh pie data
      refresh_migrate(msg.migrate_data);
    });
  }

  function migrate_set_style(map) {
    map.setMapStyle({
      styleJson: [{
        "featureType": "water",
        "elementType": "all",
        "stylers": {
          "color": "#044161"
        }
      }, {
        "featureType": "land",
        "elementType": "all",
        "stylers": {
          "color": "#004981"
        }
      }, {
        "featureType": "boundary",
        "elementType": "geometry",
        "stylers": {
          "color": "#064f85"
        }
      }, {
        "featureType": "railway",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
          "color": "#004981"
        }
      }, {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#005b96",
          "lightness": 1
        }
      }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
          "color": "#004981"
        }
      }, {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#00508b"
        }
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "green",
        "elementType": "all",
        "stylers": {
          "color": "#056197",
          "visibility": "off"
        }
      }, {
        "featureType": "subway",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "manmade",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "local",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "arterial",
        "elementType": "labels",
        "stylers": {
          "visibility": "off"
        }
      }, {
        "featureType": "boundary",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#029fd4"
        }
      }, {
        "featureType": "building",
        "elementType": "all",
        "stylers": {
          "color": "#1a5787"
        }
      }, {
        "featureType": "label",
        "elementType": "all",
        "stylers": {
          "visibility": "off"
        }
      }]
    });
  }

  function refresh_migrate(migrate_data) {
    var data_list = [];
    var data_list_with_dest = [];
    var data_max = 0;

    // console.log("refresh_migrate");
    // console.log(migrate_data);
    for (var i = 0; i < migrate_data.length; i++) {
      if (migrate_data[i].province == '山西') {
        continue;
      }
      // value = Math.ceil(migrate_data[i].imsinum / 10);
      value = Math.ceil(migrate_data[i].imsinum / 10);
      data_list.push({ name: migrate_data[i].province, value: value });
      data_list_with_dest.push([{ name: migrate_data[i].province, value: value }, { name: '太原' }]);
      if (value > data_max) {
        data_max = value;
      }
    }

    // data_max = data_max + 10; // 最大数值
    data_max = 1000; // 最大数值
    // console.log(data_list);
    // console.log(data_list_with_dest);
    // console.log(data_max);

    option = {
      color: ['gold', 'aqua', 'lime'],
      title: {
        text: '太原人口迁徙图（单位：10人）',
        subtext: '',
        x: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(v) {
          return v[1].replace(':', ' > ');
        }
      },
      legend: {
        show: false,
        orient: 'vertical',
        x: 'left',
        data: ['太原'],
        selectedMode: 'single',
        textStyle: {
          color: '#fff'
        }
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        x: 'right',
        y: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      dataRange: {
        show: false,
        min: 0,
        max: data_max,
        range: {
          start: 0,
          end: data_max
        },
        x: 'right',
        calculable: true,
        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
        textStyle: {
          color: '#fff'
        }
      },
      series: [{
        name: '太原',
        type: 'map',
        mapType: 'none',
        data: [],
        geoCoord: {
          '太原': [112.3352, 37.9413],
          '北京': [116.4551, 40.2539],
          '上海': [121.4648, 31.2891],
          '山西': [112.3352, 37.9413],
          '天津': [117.4219, 39.4189],
          '重庆': [107.7539, 30.1904],
          '广东': [113.5107, 23.2196],
          '江苏': [118.8062, 31.9208],
          '浙江': [119.5313, 29.8773],
          '山东': [117.1582, 36.8701],
          '河南': [113.4668, 34.6234],
          '河北': [114.4995, 38.1006],
          '湖南': [113.0823, 28.2568],
          '湖北': [114.3896, 30.6628],
          '陕西': [109.1162, 34.2004],
          '四川': [103.9526, 30.7617],
          '安徽': [117.2900, 32.0581],
          '江西': [116.0046, 28.6633],
          '甘肃': [103.5901, 36.3043],
          '青海': [101.4038, 36.8207],
          '辽宁': [123.1238, 42.1216],
          '吉林': [125.8154, 44.2584],
          '福建': [119.4543, 25.9222],
          '云南': [102.9199, 25.4663],
          '贵州': [106.6992, 26.7682],
          '海南': [110.3893, 19.8516],
          '宁夏': [106.3586, 38.1775],
          '广西': [108.4790, 23.1152],
          '新疆': [87.9236, 43.5883],
          '西藏': [91.1865, 30.1465],
          '香港': [114.1720, 22.2810],
          '澳门': [113.5556, 22.2048],
          '台湾': [121.5200, 25.0307],
          '黑龙江': [127.9688, 45.368],
          '内蒙古': [111.4124, 40.4901],
        },
        markLine: {
          smooth: true,
          effect: {
            show: true,
            scaleSize: 1,
            period: 30,
            color: '#fff',
            shadowBlur: 10
          },
          itemStyle: {
            normal: {
              borderWidth: 1,
              lineStyle: {
                type: 'solid',
                shadowBlur: 10
              }
            }
          },
          data: data_list_with_dest
        },
        markPoint: {
          symbol: 'emptyCircle',
          symbolSize: function(v) {
            return 10 + v / 10
          },
          effect: {
            show: true,
            shadowBlur: 0
          },
          itemStyle: {
            normal: {
              label: { show: false }
            }
          },
          data: data_list
        }
      }]
    };

    if (!window.bmap_migrate) {
      console.log("init migrate map");
      require.config({
        paths: {
          echarts: 'plugin/echarts/js',
        },
        packages: [{
          name: 'BMap',
          location: 'plugin/echarts/src',
          main: 'main'
        }]
      });

      require(
        [
          'echarts',
          'BMap',
          'echarts/chart/map',
          'echarts/chart/pie',
          'echarts/chart/bar'
        ],
        function(echarts, BMapExtension) {
          console.log("require callback");
          window.bmap_migrate = new BMapExtension($('#map')[0], BMap, echarts, {
            enableMapClick: false
          });
          var map = window.bmap_migrate.getMap();
          var container = window.bmap_migrate.getEchartsContainer();
          var startPoint = { x: 112.3352, y: 37.9413 };
          var point = new BMap.Point(startPoint.x, startPoint.y);
          map.centerAndZoom(point, 5);
          map.enableScrollWheelZoom(true);
          map.setMapStyle({
            styleJson: [{
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                "color": "#044161"
              }
            }, {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                "color": "#004981"
              }
            }, {
              "featureType": "boundary",
              "elementType": "geometry",
              "stylers": {
                "color": "#064f85"
              }
            }, {
              "featureType": "railway",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "highway",
              "elementType": "geometry",
              "stylers": {
                "color": "#004981"
              }
            }, {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#005b96",
                "lightness": 1
              }
            }, {
              "featureType": "highway",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "arterial",
              "elementType": "geometry",
              "stylers": {
                "color": "#004981"
              }
            }, {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#00508b"
              }
            }, {
              "featureType": "poi",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "green",
              "elementType": "all",
              "stylers": {
                "color": "#056197",
                "visibility": "off"
              }
            }, {
              "featureType": "subway",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "manmade",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "local",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "arterial",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            }, {
              "featureType": "boundary",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#029fd4"
              }
            }, {
              "featureType": "building",
              "elementType": "all",
              "stylers": {
                "color": "#1a5787"
              }
            }, {
              "featureType": "label",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }]
          });
          var echart = window.bmap_migrate.initECharts(container);
          window.onresize = echart.onresize;
          window.bmap_migrate.setOption(option);
          window.bmap_migrate.refresh();
        }
      );
    } else {
      console.log("refresh migrate map");
      window.bmap_migrate.setOption(option);
      window.bmap_migrate.refresh();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 新疆地区饼图数据
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_pie() {
    // get start time and end time
    var s_t = Date.parse(new Date($("#starttime").val())) / 1000 - 8 * 3600;
    var e_t = Date.parse(new Date($("#endtime").val())) / 1000 + 16 * 3600;

    // api request 
    // 0:新疆 1：敏感地区 2：国内 3：省内 4：境外
    getMigrate(s_t, e_t, 0, this.userobj.Department, function(msg) {
      // api callback to refresh pie data
      // console.log(msg);
      // todo
      refresh_pie(msg.migrate_data);
    });
  }

  function refresh_pie(pie_data) {
    console.log(pie_data);
    var labels_list = [];
    var data_list = [];
    var color_list = [];

    for (var i = 0; i < pie_data.length; i++) {
      labels_list.push(pie_data[i].city);
      data_list.push(pie_data[i].imsinum);
      color_list.push(window.color_list[i % 7]);
    }

    var color = Chart.helpers.color;
    var config = {
      type: 'pie',
      data: {
        datasets: [{
          borderColor: color(window.chartColors.red).alpha(0.0).rgbString(),
          data: data_list,
          backgroundColor: color_list,
          label: 'Dataset 1'
        }],
        labels: labels_list
      },
      options: {
        responsive: true
      }
    };

    if (!window.chart) {
      Chart.defaults.global.defaultFontColor = "#fff";
      var ctx = document.getElementById("pie").getContext("2d");
      window.chart = new Chart(ctx, config);
    } else {
      window.chart.config = config;
      window.chart.update();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 工具函数
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }

  function getOneYearAgoFormatDate() {
    var date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }

  function getThreeMonthAgoFormatDate() {
    var date = new Date();
    date.setMonth(date.getMonth() - 3);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }

  function getOneMonthAgoFormatDate() {
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }

  function getOneWeekAgoFormatDate() {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }

  function getOneDayAgoFormatDate() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }

  function getOneYearLaterFormatDate() {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }

    var seperator = "-";
    return year + seperator + month + seperator + day;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 接口测试
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// liguangming 接口测试
function test_interface() {
  var self = this;
  setTimeout(function() {
    var obj = {
      starttime: 1497119000,
      endtime: 1499119000,
      type: 0,
      department: self.userobj.Department
    };

    get_migrate(obj, function(msg) {
      console.log(msg);
    });
  }, 1000);

  setTimeout(function() {
    get_migrate_data_test();
  }, 2000);
}
