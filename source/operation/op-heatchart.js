//创建和初始化地图函数：
function initMap(map_div) {
  createMap(map_div); //创建地图
  setMapEvent(); //设置地图事件
  addMapControl(); //向地图添加控件
  test_interface();
}
//创建地图函数：
function createMap(map_div) {
  var map = new BMap.Map(map_div); //在百度地图容器中创建一个地图
  var point = new BMap.Point(112.066112, 37.548515); //定义一个中心点坐标
  map.centerAndZoom(point, 14); //设定地图的中心点和坐标并将地图显示在地图容器中
  window.map = map; //将map变量存储在全局
  //addMarker(point);
}

//地图事件设置函数：
function setMapEvent() {
  map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
  //map.enableScrollWheelZoom();//启用地图滚轮放大缩小
  //map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
  map.enableKeyboard(); //启用键盘上下左右键移动地图
}
//地图控件添加函数：
function addMapControl() {
  //向地图中添加缩放控件
  //var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
  //map.addControl(ctrl_nav);
  //向地图中添加缩略图控件
  //var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
  //map.addControl(ctrl_ove);
  //向地图中添加比例尺控件
  //var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
  //map.addControl(ctrl_sca);
}
// 百度地图API功能

// 编写自定义函数,创建标注
function addMarker(point) {
  var myIcon = new BMap.Icon("images/j.png", new BMap.Size(50, 50));
  var marker = new BMap.Marker(point, { icon: myIcon });
  marker.addEventListener('click', function() {
    alert('您点击了');
  });
  // 将标注添加到地图中
  map.addOverlay(marker);
  /*setInterval(function(){
  	marker.point.lat+=0.001;
  	map.addOverlay(marker);
  },2000)*/
}
//测试数据
var heatmapOverlayss = [{
  points: [
    { "lng": 112.063112, "lat": 37.548515, "count": 500 },
    { "lng": 112.063712, "lat": 37.548615, "count": 5 },
    { "lng": 112.061312, "lat": 37.541515, "count": 70 },
    { "lng": 112.064412, "lat": 37.548515, "count": 0 },
    { "lng": 112.065112, "lat": 37.548515, "count": 14 },
    { "lng": 112.066112, "lat": 37.548695, "count": 20 },
    { "lng": 112.066112, "lat": 37.5482, "count": 30 },
    { "lng": 112.065112, "lat": 37.548785, "count": 50 },
    { "lng": 112.063112, "lat": 37.548315, "count": 46 },
    { "lng": 112.065512, "lat": 37.548215, "count": 28 },
    { "lng": 112.066412, "lat": 37.547325, "count": 7 },
    { "lng": 112.069212, "lat": 37.545635, "count": 65 },
    { "lng": 112.056612, "lat": 37.544585, "count": 26 },
    { "lng": 112.062812, "lat": 37.548515, "count": 19 },
    { "lng": 112.064812, "lat": 37.548215, "count": 7 },
    { "lng": 112.066812, "lat": 37.544635, "count": 63 },
    { "lng": 112.066712, "lat": 37.541595, "count": 39 },
    { "lng": 112.066812, "lat": 37.549715, "count": 46 },
    { "lng": 112.066512, "lat": 37.540565, "count": 58 },
  ]
}, {
  points: [
    { "lng": 112.066112, "lat": 37.548515, "count": 500 },
    { "lng": 112.066212, "lat": 37.548615, "count": 5 },
    { "lng": 112.066312, "lat": 37.541515, "count": 70 },
    { "lng": 112.066412, "lat": 37.548515, "count": 0 },
    { "lng": 112.061112, "lat": 37.548515, "count": 14 },
    { "lng": 112.062112, "lat": 37.548615, "count": 20 },
    { "lng": 112.063112, "lat": 37.548215, "count": 30 },
    { "lng": 112.064112, "lat": 37.548715, "count": 50 },
    { "lng": 112.065112, "lat": 37.548115, "count": 46 },
    { "lng": 112.065612, "lat": 37.548515, "count": 28 },
    { "lng": 112.066112, "lat": 37.548325, "count": 7 },
    { "lng": 112.069112, "lat": 37.548635, "count": 65 },
    { "lng": 112.056112, "lat": 37.548585, "count": 26 },
    { "lng": 112.062112, "lat": 37.548515, "count": 19 },
    { "lng": 112.064512, "lat": 37.548115, "count": 7 },
    { "lng": 112.066312, "lat": 37.548635, "count": 63 },
    { "lng": 112.066912, "lat": 37.548595, "count": 39 },
    { "lng": 112.066712, "lat": 37.548715, "count": 46 },
    { "lng": 112.066912, "lat": 37.548565, "count": 58 },
  ]
}, {
  points: [
    { "lng": 112.066312, "lat": 37.548515, "count": 500 },
    { "lng": 112.066212, "lat": 37.548315, "count": 5 },
    { "lng": 112.066312, "lat": 37.541915, "count": 70 },
    { "lng": 112.066312, "lat": 37.548215, "count": 0 },
    { "lng": 112.061212, "lat": 37.548615, "count": 14 },
    { "lng": 112.063712, "lat": 37.548815, "count": 20 },
    { "lng": 112.063212, "lat": 37.548915, "count": 30 },
    { "lng": 112.064312, "lat": 37.548815, "count": 50 },
    { "lng": 112.065312, "lat": 37.548715, "count": 46 },
    { "lng": 112.065212, "lat": 37.548515, "count": 28 },
    { "lng": 112.066212, "lat": 37.548325, "count": 7 },
    { "lng": 112.069212, "lat": 37.548435, "count": 65 },
    { "lng": 112.056312, "lat": 37.548285, "count": 26 },
    { "lng": 112.062312, "lat": 37.548815, "count": 19 },
    { "lng": 112.064912, "lat": 37.548215, "count": 7 },
    { "lng": 112.066112, "lat": 37.548335, "count": 63 },
    { "lng": 112.066212, "lat": 37.548495, "count": 39 },
    { "lng": 112.066312, "lat": 37.548115, "count": 46 },
    { "lng": 112.066412, "lat": 37.548265, "count": 58 },
  ]
}]

var heatmapOverlay = "";

function onload() {
  load_line();
  //load_lines()
  init();
  var maps = document.getElementById("map");
  var light_panel = createElement({ type: "div", Parentclass: maps, style: "width:100%;height:100%;" });
  initMap(light_panel); //创建和初始化地图


  heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 50 });
  map.addOverlay(heatmapOverlay);
  heatmapOverlay.setDataSet({ data: heatmapOverlayss[0].points, max: 100 });
  heatmapOverlay.show();
}

function init() {
  $("#show_car").change(function() {
    var ss = $(this).attr("checked");
    if (this.checked) {
      $("#all_car").show()
    } else {
      $("#all_car").hide()
    }
  })
}
var mycharts = [];

//加载折线图
function load_line() {
  var options = {
    calculable: true,
    width: '100%',
    height: '100%',
    backgroundColor: "#FFFFFF",
    legend: {
      data: ['车辆1'],
      y: "bottom",
      textStyle: {
        color: "#444"
      }
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: (function() {
        var now = new Date();
        var res = [];
        var len = 20;
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
          now = new Date(now - 2000);
        }
        return res;
      })()
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: '邮件营销',
      type: 'line',
      stack: '总量',
      //data:[120, 132, 101, 134, 90, 230, 210]
      data: (function() {
        var res = [];
        var len = 20;
        while (len--) {
          res.push(Math.round(Math.random() * 1000));
        }
        return res;
      })()
    }]
  };


  // 路径配置
  require.config({
    paths: {
      echarts: 'Plugin/echarts/dist'
    }
  });
  // 使用
  require(
    [
      'echarts',
      'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
    ],
    function(ec) {
      var Focus_car = document.getElementById('Focus_car');
      line(Focus_car, options, ec);
      var all_car = document.getElementById("car_list");
      for (var i = 0; i < 10; i++) {
        var val = options;
        val.legend.data = ["车辆" + (i + 1)]
        var car_map = createElement({ type: "li", classname: "", style: "width:200px;height:150px;position:relative;float:left;margin:5px;overflow:hidden;", Parentclass: all_car });
        var car_map_div = createElement({ type: "div", classname: "car_li", Parentclass: car_map });
        line(car_map_div, val, ec);
      }

    }
  );
  test() //虚拟数据测试
}
//测试数据5分钟刷新一次
function test() {
  var lastData = 11;
  var axisData;
  clearInterval(timeTicket);
  var count = 0;
  var timeTicket = setInterval(function() {
    lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
    lastData = lastData.toFixed(1) - 0;
    axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
    for (var i = 0; i < mycharts.length; i++) {
      mycharts[i].addData([
        [
          0, // 系列索引
          Math.round(Math.random() * 1000), // 新增数据
          true, // 新增数据是否从队列头部插入
          false // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
        ]
      ]);
    }
    if (count == 3) {
      count = 0;
    }
    heatmapOverlay.setDataSet({ data: heatmapOverlayss[count].points, max: 100 });
    count++;
  }, 2000);

}
//生成图形
function line(line_obj, options, ec) {

  // 基于准备好的dom，初始化echarts图表
  var myChart = ec.init(line_obj);

  // 为echarts对象加载数据 
  myChart.setOption(options);
  mycharts.push(myChart)
    //return myChart;

}





////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// liguangming 接口测试
function test_interface() {
  setTimeout(function() {
    get_heatmap();
  }, 1000);
}
