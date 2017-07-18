//创建和初始化地图函数：
function initMap(map_div) {
  createMap(map_div); //创建地图
  setMapEvent(); //设置地图事件
  addMapControl(); //向地图添加控件
}
//创建地图函数：
function createMap(map_div) {
  var map = new BMap.Map(map_div); //在百度地图容器中创建一个地图
  var point = new BMap.Point(112.5552, 37.9013); //定义一个中心点坐标112.3352,37.9413
  map.centerAndZoom(point, 14); //设定地图的中心点和坐标并将地图显示在地图容器中
  window.map = map; //将map变量存储在全局
  //addMarker(point);
  //addpoint()
}

//地图事件设置函数：
function setMapEvent() {
  map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
  map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
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
  //var myIcon = new BMap.Icon("images/j.png", new BMap.Size(50,50));
  var marker = new BMap.Marker(point);
  marker.addEventListener('click', function() {
    //alert('您点击了');
  });
  // 将标注添加到地图中
  map.addOverlay(marker);
  return marker;
  /*setInterval(function(){
  	marker.point.lat+=0.001;
  	map.addOverlay(marker);
  },2000)*/
}
var indexs = 0;

function addpoint() {
  // 百度地图API功能
  // var map = new BMap.Map("allmap");            
  // map.centerAndZoom("重庆",12);           
  // 单击获取点击的经纬度
  map.addEventListener("click", function(e) {
    // alert(e.point.lng + "," + e.point.lat);
    if (indexs == 9) {
      return;
    }
    var point = new BMap.Point(e.point.lng, e.point.lat - 0.00005);
    var marker = new BMap.Marker(point); // 创建标注


    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
      offset: new BMap.Size(10, 25),
      imageOffset: new BMap.Size(0, 0 - indexs * 25)
    });
    indexs++;
    var marker = new BMap.Marker(point, { icon: myIcon });
    map.addOverlay(marker);
    //map.removeOverlay(marker);
    // 将标注添加到地图中
    //addline(e.point.lng,e.point.lat)
    marker.addEventListener("click", getAttr);

    function getAttr() {
      var p = marker.getPosition(); //获取marker的位置
      alert("marker的位置是" + p.lng + "," + p.lat);
    }
  });

}

function addline(lng, lat) {
  var width_s = 0.0005;
  var polyline = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat + width_s),
    new BMap.Point(lng - width_s, lat - width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polylines = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat + width_s),
    new BMap.Point(lng + width_s, lat + width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polylinetwo = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat - width_s),
    new BMap.Point(lng + width_s, lat - width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polylinesi = new BMap.Polyline([
    new BMap.Point(lng + width_s, lat - width_s),
    new BMap.Point(lng + width_s, lat + width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  map.addOverlay(polyline);
  map.addOverlay(polylines);
  map.addOverlay(polylinetwo);
  map.addOverlay(polylinesi);
}
