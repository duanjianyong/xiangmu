$(document).ready(function() {
  initSetting();
  initPie();
  initBar();
  BMaps();
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

function init() {
  BMaps(); //创建迁移图
  pie(); //创建大饼图
  bar(1);
  events(); //创建事件
}

function events() { //
  $('#ul_class li').click(function() {
    var liname = $(this).attr("name");
    if (liname == "domestic") {
      //国内
      bar(1);
    } else if (liname == "Province") {
      //省内
      bar(2);
    } else if (liname == "Outside") {
      //境外
      bar(3);
    }
    $("#ul_class li").removeClass("active");
    this.setAttribute('class', "active");
  })
}

function BMaps() {
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
      /* $('#map').css({
            height:$('body').height(),
            width: $('body').width()
        });*/
      // 初始化地图
      var BMapExt = new BMapExtension($('#map')[0], BMap, echarts, {
        enableMapClick: false
      });
      var map = BMapExt.getMap();
      var container = BMapExt.getEchartsContainer();

      var startPoint = {
        x: 104.114129,
        y: 37.550339
      };

      var point = new BMap.Point(startPoint.x, startPoint.y);
      map.centerAndZoom(point, 5);
      map.enableScrollWheelZoom(true);
      // 地图自定义样式
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

      option = {
        color: ['gold', 'aqua', 'lime'],
        title: {
          text: '模拟迁徙',
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
          orient: 'vertical',
          x: 'left',
          data: ['太原', '上海', '广州'],
          selectedMode: 'single',
          selected: {
            '上海': false,
            '广州': false
          },
          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
          show: true,
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
          min: 0,
          max: 100,
          range: {
            start: 10,
            end: 90
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
            '上海': [121.4648, 31.2891],
            '东莞': [113.8953, 22.901],
            '东营': [118.7073, 37.5513],
            '中山': [113.4229, 22.478],
            '临汾': [111.4783, 36.1615],
            '临沂': [118.3118, 35.2936],
            '丹东': [124.541, 40.4242],
            '丽水': [119.5642, 28.1854],
            '乌鲁木齐': [87.9236, 43.5883],
            '佛山': [112.8955, 23.1097],
            '保定': [115.0488, 39.0948],
            '兰州': [103.5901, 36.3043],
            '包头': [110.3467, 41.4899],
            '北京': [116.4551, 40.2539],
            '北海': [109.314, 21.6211],
            '南京': [118.8062, 31.9208],
            '南宁': [108.479, 23.1152],
            '南昌': [116.0046, 28.6633],
            '南通': [121.1023, 32.1625],
            '厦门': [118.1689, 24.6478],
            '台州': [121.1353, 28.6688],
            '合肥': [117.29, 32.0581],
            '呼和浩特': [111.4124, 40.4901],
            '咸阳': [108.4131, 34.8706],
            '哈尔滨': [127.9688, 45.368],
            '唐山': [118.4766, 39.6826],
            '嘉兴': [120.9155, 30.6354],
            '大同': [113.7854, 39.8035],
            '大连': [122.2229, 39.4409],
            '天津': [117.4219, 39.4189],
            '太原': [112.3352, 37.9413],
            '威海': [121.9482, 37.1393],
            '宁波': [121.5967, 29.6466],
            '宝鸡': [107.1826, 34.3433],
            '宿迁': [118.5535, 33.7775],
            '常州': [119.4543, 31.5582],
            '广州': [113.5107, 23.2196],
            '廊坊': [116.521, 39.0509],
            '延安': [109.1052, 36.4252],
            '张家口': [115.1477, 40.8527],
            '徐州': [117.5208, 34.3268],
            '德州': [116.6858, 37.2107],
            '惠州': [114.6204, 23.1647],
            '成都': [103.9526, 30.7617],
            '扬州': [119.4653, 32.8162],
            '承德': [117.5757, 41.4075],
            '拉萨': [91.1865, 30.1465],
            '无锡': [120.3442, 31.5527],
            '日照': [119.2786, 35.5023],
            '昆明': [102.9199, 25.4663],
            '杭州': [119.5313, 29.8773],
            '枣庄': [117.323, 34.8926],
            '柳州': [109.3799, 24.9774],
            '株洲': [113.5327, 27.0319],
            '武汉': [114.3896, 30.6628],
            '汕头': [117.1692, 23.3405],
            '江门': [112.6318, 22.1484],
            '沈阳': [123.1238, 42.1216],
            '沧州': [116.8286, 38.2104],
            '河源': [114.917, 23.9722],
            '泉州': [118.3228, 25.1147],
            '泰安': [117.0264, 36.0516],
            '泰州': [120.0586, 32.5525],
            '济南': [117.1582, 36.8701],
            '济宁': [116.8286, 35.3375],
            '海口': [110.3893, 19.8516],
            '淄博': [118.0371, 36.6064],
            '淮安': [118.927, 33.4039],
            '深圳': [114.5435, 22.5439],
            '清远': [112.9175, 24.3292],
            '温州': [120.498, 27.8119],
            '渭南': [109.7864, 35.0299],
            '湖州': [119.8608, 30.7782],
            '湘潭': [112.5439, 27.7075],
            '滨州': [117.8174, 37.4963],
            '潍坊': [119.0918, 36.524],
            '烟台': [120.7397, 37.5128],
            '玉溪': [101.9312, 23.8898],
            '珠海': [113.7305, 22.1155],
            '盐城': [120.2234, 33.5577],
            '盘锦': [121.9482, 41.0449],
            '石家庄': [114.4995, 38.1006],
            '福州': [119.4543, 25.9222],
            '秦皇岛': [119.2126, 40.0232],
            '绍兴': [120.564, 29.7565],
            '聊城': [115.9167, 36.4032],
            '肇庆': [112.1265, 23.5822],
            '舟山': [122.2559, 30.2234],
            '苏州': [120.6519, 31.3989],
            '莱芜': [117.6526, 36.2714],
            '菏泽': [115.6201, 35.2057],
            '营口': [122.4316, 40.4297],
            '葫芦岛': [120.1575, 40.578],
            '衡水': [115.8838, 37.7161],
            '衢州': [118.6853, 28.8666],
            '西宁': [101.4038, 36.8207],
            '西安': [109.1162, 34.2004],
            '贵阳': [106.6992, 26.7682],
            '连云港': [119.1248, 34.552],
            '邢台': [114.8071, 37.2821],
            '邯郸': [114.4775, 36.535],
            '郑州': [113.4668, 34.6234],
            '鄂尔多斯': [108.9734, 39.2487],
            '重庆': [107.7539, 30.1904],
            '金华': [120.0037, 29.1028],
            '铜川': [109.0393, 35.1947],
            '银川': [106.3586, 38.1775],
            '镇江': [119.4763, 31.9702],
            '长春': [125.8154, 44.2584],
            '长沙': [113.0823, 28.2568],
            '长治': [112.8625, 36.4746],
            '阳泉': [113.4778, 38.0951],
            '青岛': [120.4651, 36.3373],
            '韶关': [113.7964, 24.7028]
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
            data: [
              [{ name: '太原' }, { name: '上海', value: 95 }],
              [{ name: '太原' }, { name: '广州', value: 90 }],
              [{ name: '太原' }, { name: '大连', value: 80 }],
              [{ name: '太原' }, { name: '南宁', value: 70 }],
              [{ name: '太原' }, { name: '南昌', value: 60 }],
              [{ name: '太原' }, { name: '拉萨', value: 50 }],
              [{ name: '太原' }, { name: '长春', value: 40 }],
              [{ name: '太原' }, { name: '包头', value: 30 }],
              [{ name: '太原' }, { name: '重庆', value: 20 }],
              [{ name: '太原' }, { name: '常州', value: 10 }]
            ]
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
            data: [
              { name: '上海', value: 95 },
              { name: '广州', value: 90 },
              { name: '大连', value: 80 },
              { name: '南宁', value: 70 },
              { name: '南昌', value: 60 },
              { name: '拉萨', value: 50 },
              { name: '长春', value: 40 },
              { name: '包头', value: 30 },
              { name: '重庆', value: 20 },
              { name: '常州', value: 10 }
            ]
          }

        }, {
          name: '上海',
          type: 'map',
          mapType: 'none',
          data: [],
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
            data: [
              [{ name: '上海' }, { name: '包头', value: 95 }],
              [{ name: '上海' }, { name: '昆明', value: 90 }],
              [{ name: '上海' }, { name: '广州', value: 80 }],
              [{ name: '上海' }, { name: '郑州', value: 70 }],
              [{ name: '上海' }, { name: '长春', value: 60 }],
              [{ name: '上海' }, { name: '重庆', value: 50 }],
              [{ name: '上海' }, { name: '长沙', value: 40 }],
              [{ name: '上海' }, { name: '北京', value: 30 }],
              [{ name: '上海' }, { name: '丹东', value: 20 }],
              [{ name: '上海' }, { name: '大连', value: 10 }]
            ]
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
            data: [
              { name: '包头', value: 95 },
              { name: '昆明', value: 90 },
              { name: '广州', value: 80 },
              { name: '郑州', value: 70 },
              { name: '长春', value: 60 },
              { name: '重庆', value: 50 },
              { name: '长沙', value: 40 },
              { name: '北京', value: 30 },
              { name: '丹东', value: 20 },
              { name: '大连', value: 10 }
            ]
          }
        }, {
          name: '广州',
          type: 'map',
          mapType: 'none',
          data: [],
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
            data: [
              [{ name: '广州' }, { name: '福州', value: 95 }],
              [{ name: '广州' }, { name: '太原', value: 90 }],
              [{ name: '广州' }, { name: '长春', value: 80 }],
              [{ name: '广州' }, { name: '重庆', value: 70 }],
              [{ name: '广州' }, { name: '西安', value: 60 }],
              [{ name: '广州' }, { name: '成都', value: 50 }],
              [{ name: '广州' }, { name: '常州', value: 40 }],
              [{ name: '广州' }, { name: '北京', value: 30 }],
              [{ name: '广州' }, { name: '北海', value: 20 }],
              [{ name: '广州' }, { name: '海口', value: 10 }]
            ]
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
            data: [
              { name: '福州', value: 95 },
              { name: '太原', value: 90 },
              { name: '长春', value: 80 },
              { name: '重庆', value: 70 },
              { name: '西安', value: 60 },
              { name: '成都', value: 50 },
              { name: '常州', value: 40 },
              { name: '北京', value: 30 },
              { name: '北海', value: 20 },
              { name: '海口', value: 10 }
            ]
          }
        }, {
          name: '全国',
          type: 'map',
          mapType: 'none',
          data: [],
          markLine: {
            smooth: true,
            symbol: ['none', 'circle'],
            symbolSize: 1,
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 1,
                borderColor: 'rgba(30,144,255,0.5)'
              }
            },
            data: [
              [{ name: '北京' }, { name: '包头' }],
              [{ name: '北京' }, { name: '北海' }],
              [{ name: '北京' }, { name: '广州' }],
              [{ name: '北京' }, { name: '郑州' }],
              [{ name: '北京' }, { name: '长春' }],
              [{ name: '北京' }, { name: '长治' }],
              [{ name: '北京' }, { name: '重庆' }],
              [{ name: '北京' }, { name: '长沙' }],
              [{ name: '北京' }, { name: '成都' }],
              [{ name: '北京' }, { name: '常州' }],
              [{ name: '北京' }, { name: '丹东' }],
              [{ name: '北京' }, { name: '大连' }],
              [{ name: '北京' }, { name: '东营' }],
              [{ name: '北京' }, { name: '延安' }],
              [{ name: '北京' }, { name: '福州' }],
              [{ name: '北京' }, { name: '海口' }],
              [{ name: '北京' }, { name: '呼和浩特' }],
              [{ name: '北京' }, { name: '合肥' }],
              [{ name: '北京' }, { name: '杭州' }],
              [{ name: '北京' }, { name: '哈尔滨' }],
              [{ name: '北京' }, { name: '舟山' }],
              [{ name: '北京' }, { name: '银川' }],
              [{ name: '北京' }, { name: '衢州' }],
              [{ name: '北京' }, { name: '南昌' }],
              [{ name: '北京' }, { name: '昆明' }],
              [{ name: '北京' }, { name: '贵阳' }],
              [{ name: '北京' }, { name: '兰州' }],
              [{ name: '北京' }, { name: '拉萨' }],
              [{ name: '北京' }, { name: '连云港' }],
              [{ name: '北京' }, { name: '临沂' }],
              [{ name: '北京' }, { name: '柳州' }],
              [{ name: '北京' }, { name: '宁波' }],
              [{ name: '北京' }, { name: '南京' }],
              [{ name: '北京' }, { name: '南宁' }],
              [{ name: '北京' }, { name: '南通' }],
              [{ name: '北京' }, { name: '上海' }],
              [{ name: '北京' }, { name: '沈阳' }],
              [{ name: '北京' }, { name: '西安' }],
              [{ name: '北京' }, { name: '汕头' }],
              [{ name: '北京' }, { name: '深圳' }],
              [{ name: '北京' }, { name: '青岛' }],
              [{ name: '北京' }, { name: '济南' }],
              [{ name: '北京' }, { name: '太原' }],
              [{ name: '北京' }, { name: '乌鲁木齐' }],
              [{ name: '北京' }, { name: '潍坊' }],
              [{ name: '北京' }, { name: '威海' }],
              [{ name: '北京' }, { name: '温州' }],
              [{ name: '北京' }, { name: '武汉' }],
              [{ name: '北京' }, { name: '无锡' }],
              [{ name: '北京' }, { name: '厦门' }],
              [{ name: '北京' }, { name: '西宁' }],
              [{ name: '北京' }, { name: '徐州' }],
              [{ name: '北京' }, { name: '烟台' }],
              [{ name: '北京' }, { name: '盐城' }],
              [{ name: '北京' }, { name: '珠海' }],
              [{ name: '上海' }, { name: '包头' }],
              [{ name: '上海' }, { name: '北海' }],
              [{ name: '上海' }, { name: '广州' }],
              [{ name: '上海' }, { name: '郑州' }],
              [{ name: '上海' }, { name: '长春' }],
              [{ name: '上海' }, { name: '重庆' }],
              [{ name: '上海' }, { name: '长沙' }],
              [{ name: '上海' }, { name: '成都' }],
              [{ name: '上海' }, { name: '丹东' }],
              [{ name: '上海' }, { name: '大连' }],
              [{ name: '上海' }, { name: '福州' }],
              [{ name: '上海' }, { name: '海口' }],
              [{ name: '上海' }, { name: '呼和浩特' }],
              [{ name: '上海' }, { name: '合肥' }],
              [{ name: '上海' }, { name: '哈尔滨' }],
              [{ name: '上海' }, { name: '舟山' }],
              [{ name: '上海' }, { name: '银川' }],
              [{ name: '上海' }, { name: '南昌' }],
              [{ name: '上海' }, { name: '昆明' }],
              [{ name: '上海' }, { name: '贵阳' }],
              [{ name: '上海' }, { name: '兰州' }],
              [{ name: '上海' }, { name: '拉萨' }],
              [{ name: '上海' }, { name: '连云港' }],
              [{ name: '上海' }, { name: '临沂' }],
              [{ name: '上海' }, { name: '柳州' }],
              [{ name: '上海' }, { name: '宁波' }],
              [{ name: '上海' }, { name: '南宁' }],
              [{ name: '上海' }, { name: '北京' }],
              [{ name: '上海' }, { name: '沈阳' }],
              [{ name: '上海' }, { name: '秦皇岛' }],
              [{ name: '上海' }, { name: '西安' }],
              [{ name: '上海' }, { name: '石家庄' }],
              [{ name: '上海' }, { name: '汕头' }],
              [{ name: '上海' }, { name: '深圳' }],
              [{ name: '上海' }, { name: '青岛' }],
              [{ name: '上海' }, { name: '济南' }],
              [{ name: '上海' }, { name: '天津' }],
              [{ name: '上海' }, { name: '太原' }],
              [{ name: '上海' }, { name: '乌鲁木齐' }],
              [{ name: '上海' }, { name: '潍坊' }],
              [{ name: '上海' }, { name: '威海' }],
              [{ name: '上海' }, { name: '温州' }],
              [{ name: '上海' }, { name: '武汉' }],
              [{ name: '上海' }, { name: '厦门' }],
              [{ name: '上海' }, { name: '西宁' }],
              [{ name: '上海' }, { name: '徐州' }],
              [{ name: '上海' }, { name: '烟台' }],
              [{ name: '上海' }, { name: '珠海' }],
              [{ name: '广州' }, { name: '北海' }],
              [{ name: '广州' }, { name: '郑州' }],
              [{ name: '广州' }, { name: '长春' }],
              [{ name: '广州' }, { name: '重庆' }],
              [{ name: '广州' }, { name: '长沙' }],
              [{ name: '广州' }, { name: '成都' }],
              [{ name: '广州' }, { name: '常州' }],
              [{ name: '广州' }, { name: '大连' }],
              [{ name: '广州' }, { name: '福州' }],
              [{ name: '广州' }, { name: '海口' }],
              [{ name: '广州' }, { name: '呼和浩特' }],
              [{ name: '广州' }, { name: '合肥' }],
              [{ name: '广州' }, { name: '杭州' }],
              [{ name: '广州' }, { name: '哈尔滨' }],
              [{ name: '广州' }, { name: '舟山' }],
              [{ name: '广州' }, { name: '银川' }],
              [{ name: '广州' }, { name: '南昌' }],
              [{ name: '广州' }, { name: '昆明' }],
              [{ name: '广州' }, { name: '贵阳' }],
              [{ name: '广州' }, { name: '兰州' }],
              [{ name: '广州' }, { name: '拉萨' }],
              [{ name: '广州' }, { name: '连云港' }],
              [{ name: '广州' }, { name: '临沂' }],
              [{ name: '广州' }, { name: '柳州' }],
              [{ name: '广州' }, { name: '宁波' }],
              [{ name: '广州' }, { name: '南京' }],
              [{ name: '广州' }, { name: '南宁' }],
              [{ name: '广州' }, { name: '南通' }],
              [{ name: '广州' }, { name: '北京' }],
              [{ name: '广州' }, { name: '上海' }],
              [{ name: '广州' }, { name: '沈阳' }],
              [{ name: '广州' }, { name: '西安' }],
              [{ name: '广州' }, { name: '石家庄' }],
              [{ name: '广州' }, { name: '汕头' }],
              [{ name: '广州' }, { name: '青岛' }],
              [{ name: '广州' }, { name: '济南' }],
              [{ name: '广州' }, { name: '天津' }],
              [{ name: '广州' }, { name: '太原' }],
              [{ name: '广州' }, { name: '乌鲁木齐' }],
              [{ name: '广州' }, { name: '温州' }],
              [{ name: '广州' }, { name: '武汉' }],
              [{ name: '广州' }, { name: '无锡' }],
              [{ name: '广州' }, { name: '厦门' }],
              [{ name: '广州' }, { name: '西宁' }],
              [{ name: '广州' }, { name: '徐州' }],
              [{ name: '广州' }, { name: '烟台' }],
              [{ name: '广州' }, { name: '盐城' }]
            ]
          }
        }]
      };

      var myChart = BMapExt.initECharts(container);
      window.onresize = myChart.onresize;
      BMapExt.setOption(option);
    }
  );
}

function bar(option_index) {
  var domestic_option = {
    calculable: true,
    grid: {
      borderWidth: 0,
      y: 80,
      y2: 60
    },
    /*
    legend: {
      x : 'center',
      y : 'bottom',
      data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
    },*/
    xAxis: [{
      type: 'category',
      show: false,
      data: ['北京', '上海', '广东', '台湾', '海南', '湖南', '湖北', '江西', '福建', '山东', '安徽']
    }],
    yAxis: [{
      type: 'value',
      show: false
    }],
    series: [{
      name: 'ECharts例子个数统计',
      type: 'bar',
      itemStyle: {
        normal: {
          color: function(params) {
            // build a color map as your need.
            var colorList = [
              '#FFFFFF', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
              '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
              '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
            ];
            return colorList[params.dataIndex]
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}\n{c}'
          }
        }
      },
      data: [12, 21, 10, 4, 12, 5, 6, 5, 25, 23, 7],
      markPoint: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function(params) {
            return '<img src="' + params.data.symbol.replace('image://', '') + '"/>';
          }
        },
        data: [
          { xAxis: 0, y: 350, name: 'Line', symbolSize: 20 },
          { xAxis: 1, y: 350, name: 'Bar', symbolSize: 20 },
          { xAxis: 2, y: 350, name: 'Scatter', symbolSize: 20 },
          { xAxis: 3, y: 350, name: 'K', symbolSize: 20 },
          { xAxis: 4, y: 350, name: 'Pie', symbolSize: 20 },
          { xAxis: 5, y: 350, name: 'Radar', symbolSize: 20 },
          { xAxis: 6, y: 350, name: 'Chord', symbolSize: 20 },
          { xAxis: 7, y: 350, name: 'Force', symbolSize: 20 },
          { xAxis: 8, y: 350, name: 'Map', symbolSize: 20 },
          { xAxis: 9, y: 350, name: 'Gauge', symbolSize: 20 },
          { xAxis: 10, y: 350, name: 'Funnel', symbolSize: 20 },
        ]
      }
    }]
  }

  var Province_option = {
    calculable: true,
    grid: {
      borderWidth: 0,
      y: 80,
      y2: 60
    },
    /*
    legend: {
      x : 'center',
      y : 'bottom',
      data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
    },*/
    xAxis: [{
      type: 'category',
      show: false,
      data: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '远城', '忻州', '临汾', '吕梁']
    }],
    yAxis: [{
      type: 'value',
      show: false
    }],
    series: [{
      name: 'ECharts例子个数统计',
      type: 'bar',
      itemStyle: {
        normal: {
          color: function(params) {
            // build a color map as your need.
            var colorList = [
              '#FFFFFF', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
              '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
              '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
            ];
            return colorList[params.dataIndex]
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}\n{c}'
          }
        }
      },
      data: [18, 2, 14, 4, 10, 5, 8, 2, 25, 3, 7],
      markPoint: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function(params) {
            return '<img src="' + params.data.symbol.replace('image://', '') + '"/>';
          }
        },
        data: [
          { xAxis: 0, y: 350, name: 'Line', symbolSize: 20 },
          { xAxis: 1, y: 350, name: 'Bar', symbolSize: 20 },
          { xAxis: 2, y: 350, name: 'Scatter', symbolSize: 20 },
          { xAxis: 3, y: 350, name: 'K', symbolSize: 20 },
          { xAxis: 4, y: 350, name: 'Pie', symbolSize: 20 },
          { xAxis: 5, y: 350, name: 'Radar', symbolSize: 20 },
          { xAxis: 6, y: 350, name: 'Chord', symbolSize: 20 },
          { xAxis: 7, y: 350, name: 'Force', symbolSize: 20 },
          { xAxis: 8, y: 350, name: 'Map', symbolSize: 20 },
          { xAxis: 9, y: 350, name: 'Gauge', symbolSize: 20 },
          { xAxis: 10, y: 350, name: 'Funnel', symbolSize: 20 },
        ]
      }
    }]

  }
  var Outside_option = {
    calculable: true,
    grid: {
      borderWidth: 0,
      y: 80,
      y2: 60
    },
    /*
    legend: {
      x : 'center',
      y : 'bottom',
      data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
    },*/
    xAxis: [{
      type: 'category',
      show: false,
      data: ['日本', '韩国', '朝鲜', '菲律宾', '越南', '俄罗斯', '巴基斯坦', '印度', '越南', '不丹', '新家坡']
    }],
    yAxis: [{
      type: 'value',
      show: false
    }],
    series: [{
      name: 'ECharts例子个数统计',
      type: 'bar',
      itemStyle: {
        normal: {
          color: function(params) {
            // build a color map as your need.
            var colorList = [
              '#FFFFFF', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
              '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
              '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
            ];
            return colorList[params.dataIndex]
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}\n{c}'
          }
        }
      },
      data: [118, 24, 34, 41, 10, 55, 82, 15, 25, 73, 17],
      markPoint: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function(params) {
            return '<img src="' + params.data.symbol.replace('image://', '') + '"/>';
          }
        },
        data: [
          { xAxis: 0, y: 350, name: 'Line', symbolSize: 20 },
          { xAxis: 1, y: 350, name: 'Bar', symbolSize: 20 },
          { xAxis: 2, y: 350, name: 'Scatter', symbolSize: 20 },
          { xAxis: 3, y: 350, name: 'K', symbolSize: 20 },
          { xAxis: 4, y: 350, name: 'Pie', symbolSize: 20 },
          { xAxis: 5, y: 350, name: 'Radar', symbolSize: 20 },
          { xAxis: 6, y: 350, name: 'Chord', symbolSize: 20 },
          { xAxis: 7, y: 350, name: 'Force', symbolSize: 20 },
          { xAxis: 8, y: 350, name: 'Map', symbolSize: 20 },
          { xAxis: 9, y: 350, name: 'Gauge', symbolSize: 20 },
          { xAxis: 10, y: 350, name: 'Funnel', symbolSize: 20 },
        ]
      }
    }]
  }

  var options = "";
  if (option_index == 1) {
    options = domestic_option;
  } else if (option_index == 2) {
    options = Province_option;
  } else if (option_index == 3) {
    options = Outside_option
  }
  require.config({
    paths: {
      echarts: 'echarts/dist'
    }
  });
  // 使用
  require(
    [
      'echarts',
      'echarts/chart/pie',
      'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
    ],
    function(ec) {
      // 基于准备好的dom，初始化echarts图表
      var birChart = ec.init(document.getElementById('Attribution_char'));

      birChart.setOption(options);

    }
  );
}

function pie
() {
  // 路径配置
  require.config({
    paths: {
      echarts: 'echarts/dist'
    }
  });
  // 使用
  require(
    [
      'echarts',
      'echarts/chart/pie',
      'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
    ],
    function(ec) {
      // 基于准备好的dom，初始化echarts图表

      var pieChart = ec.init(document.getElementById('pie'));
      option = {
        title: {
          text: '敏感地区人员分布',
          color: "red",
          x: 'center'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城']
        },
        calculable: false,
        series: [{
          name: '访问来源',
          type: 'pie',
          center: ['50%', 150],
          radius: 100,
          itemStyle: {
            normal: {
              label: {
                position: 'inner',
                formatter: function(params) {
                  return (params.percent - 0).toFixed(0) + '%'
                }
              },
              labelLine: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true,
                formatter: "{b}\n{d}%"
              }
            }

          },
          data: [
            { value: 335, name: '上海' },
            { value: 679, name: '新疆' },
            { value: 1548, name: '北京' },
            { value: 335, name: '深圳' },
            { value: 679, name: '广州' },
            { value: 1548, name: '长沙' },
            { value: 679, name: '香港' },
            { value: 1548, name: '重庆' }
          ]
        }]
      };
      pieChart.setOption(option);
      // 为echarts对象加载数据
    }
  );
}

// 初始化设置栏
function initSetting() {
  initCalender();
}

// 初始化ecalendar
function initCalender() {
  $("#ECalendar_date_start").ECalendar({
    type: "time", //模式，time: 带时间选择; date: 不带时间选择;
    stamp: true, //是否转成时间戳，默认true;
    offset: [0, 2], //弹框手动偏移量;
    format: "yyyy年mm月dd日 hh:ii", //时间格式 默认 yyyy-mm-dd hh:ii;
    skin: 5, //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
    step: 1, //选择时间分钟的精确度;
    callback: function(v, e) {} //回调函数
  });

  $("#ECalendar_date_end").ECalendar({
    type: "time", //模式，time: 带时间选择; date: 不带时间选择;
    stamp: true, //是否转成时间戳，默认true;
    offset: [0, 2], //弹框手动偏移量;
    format: "yyyy年mm月dd日 hh:ii", //时间格式 默认 yyyy-mm-dd hh:ii;
    skin: 5, //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
    step: 1, //选择时间分钟的精确度;
    callback: function(v, e) {} //回调函数
  });
}

// 初始化饼图
function initPie() {
  var color = Chart.helpers.color;
  var config = {
    type: 'pie',
    data: {
      datasets: [{
        borderColor: color(window.chartColors.red).alpha(0.0).rgbString(),
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        backgroundColor: [
          window.chartColors.red,
          window.chartColors.orange,
          window.chartColors.yellow,
          window.chartColors.green,
          window.chartColors.blue,
        ],
        label: 'Dataset 1'
      }],
      labels: [
        "苏州",
        "南京",
        "杭州",
        "无锡",
        "嘉兴"
      ]
    },
    options: {
      responsive: true
    }
  };
  Chart.defaults.global.defaultFontColor = "#fff";
  var ctx = document.getElementById("pie").getContext("2d");
  window.chart = new Chart(ctx, config);

  // setTimeout(function() {
  //   updateGraph();
  // }, 1500);
}

// 初始化条状图
function initBar() {
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var color = Chart.helpers.color;
  var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: '省内',
      backgroundColor: color(window.chartColors.red).alpha(1).rgbString(),
      borderColor: window.chartColors.red,
      borderWidth: 1,
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
      ]
    }, {
      label: '国内',
      backgroundColor: color(window.chartColors.blue).alpha(1).rgbString(),
      borderColor: window.chartColors.blue,
      borderWidth: 1,
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
      ]
    }, {
      label: '境外',
      backgroundColor: color(window.chartColors.green).alpha(1).rgbString(),
      borderColor: window.chartColors.green,
      borderWidth: 1,
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
      ]
    }]

  };
  var ctx = document.getElementById("bar").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ''
      }
    }
  });
}

// 随机数据
function randomScalingFactor() {
  return (1.0) * Math.round(Math.random() * 100);
}
