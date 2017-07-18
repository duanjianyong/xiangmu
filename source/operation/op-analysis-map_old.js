//创建和初始化地图函数：
function initMap(map_div) {
  var map_obj = createMap(map_div); //创建地图
  setMapEvent(map_obj); //设置地图事件
  addMapControl(map_obj); //向地图添加控件
  return map_obj;
}
//创建地图函数：
function createMap(map_div) {
  var map = new BMap.Map(map_div); //在百度地图容器中创建一个地图
  var point = new BMap.Point(114.066112, 22.548515); //定义一个中心点坐标
  map.centerAndZoom(point, 18); //设定地图的中心点和坐标并将地图显示在地图容器中
  //window.map = map;//将map变量存储在全局
  return map;
}

//地图事件设置函数：
function setMapEvent(map) {
  map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
  // map.enableScrollWheelZoom();//启用地图滚轮放大缩小
  //map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
  map.enableKeyboard(); //启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl(map) {
  //向地图中添加缩放控件
  var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
  map.addControl(ctrl_nav);
  //向地图中添加缩略图控件
  //var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
  //map.addControl(ctrl_ove);
  //向地图中添加比例尺控件
  //var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
  //map.addControl(ctrl_sca);
}
// 百度地图API功能
// 编写自定义函数,创建标注
function addMarker(point, map) {
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

this.index = 0;

//添加点
function addpoint(map, Callback) {
  var self = this;
  // 百度地图API功能
  //var map = new BMap.Map("allmap");            
  //map.centerAndZoom("重庆",12);           
  //单击获取点击的经纬度
  map.addEventListener("click", function(e) {
    console.log(e.point.lng + "," + e.point.lat);
    //alert(e.point.lng + "," + e.point.lat);
    //最多选择5点
    if (self.index >= 6) {
      alert("最多选择6个位置");
      return;
    }

    var point = new BMap.Point(e.point.lng, e.point.lat);
    //var marker = new BMap.Marker(point);  // 创建标注
    //点的图片切割
    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
      offset: new BMap.Size(10, 25),
      imageOffset: new BMap.Size(0, 0 - self.index * 25)
    });

    var marker = new BMap.Marker(point, { icon: myIcon });

    map.addOverlay(marker); // 将标注添加到地图中
    var line_array = addline(e.point.lng, e.point.lat, map)
    marker.addEventListener("click", getAttr);

    function getAttr() {
      var p = marker.getPosition(); //获取marker的位置
      //alert("marker的位置是" + p.lng + "," + p.lat);   
    }
    if (Callback) {
      var point_obj = { marker: marker, line_array: line_array, index: index }
      Callback(point_obj);
    }
    self.index++;
  });
  /*var polyline = new BMap.Polyline([    
     new BMap.Point(114.066112,22.548515),    
     new BMap.Point(114.066212,22.548515)    
   ],    
   {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}    
  );    
  map.addOverlay(polyline);
  */
}

//以选中点为中心画出正方形范围
function addline(lng, lat, map) {
  var width_s = localStorage.radius / 100 * 0.0009;
  console.log(localStorage.radius);
  console.log(width_s);
  // var width_s = 0.0005;
  var polyline_one = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat + width_s),
    new BMap.Point(lng - width_s, lat - width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_three = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat + width_s),
    new BMap.Point(lng + width_s, lat + width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_two = new BMap.Polyline([
    new BMap.Point(lng - width_s, lat - width_s),
    new BMap.Point(lng + width_s, lat - width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_four = new BMap.Polyline([
    new BMap.Point(lng + width_s, lat - width_s),
    new BMap.Point(lng + width_s, lat + width_s)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var line_array = []
  line_array[0] = polyline_one;
  line_array[1] = polyline_two;
  line_array[2] = polyline_three;
  line_array[3] = polyline_four;
  map.addOverlay(polyline_one);
  map.addOverlay(polyline_three);
  map.addOverlay(polyline_two);
  map.addOverlay(polyline_four);
  return line_array;
}
