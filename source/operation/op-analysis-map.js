window.onload = function() {
  _init_ui();
};

$(document).ready(function() {
  _init_bundle();
});

function _init_ui() {
  load_map();
}

function _init_bundle() {

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 百度地图
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_map() {
  if (localStorage.map_type == "accpompany_add") {
    load_map_accompany_add();
  } else if (localStorage.map_type == "accpompany_modify") {
    load_map_accompany_modify();
  } else if (localStorage.map_type == "special_list") {
    console.log("map-type : special_list")
    load_map_special_list();
  } else {
    alert("加载地图出错，请刷新重试！");
    return;
  }
}

// 缓存对象
function acc_cache(size, area_array_str) {
  this.cache_list = [];
  this.size = size;

  for (var i = 0; i < size; i++) {
    // index 编号， area API参数-空间， point 中心点， map_point 地图上的点控件, map_border 地图上的边框线
    this.cache_list[i] = {
      index: i,
      area: null,
      point: null,
      border: null,
      map_point: null,
      map_border: null
    };
  }

  if (area_array_str) {
    var area_array = JSON.parse(area_array_str);
    for (var i = 0; i < area_array.length; i++) {
      if (area_array[i] == null) {
        continue;
      }
      var area = {
        dwlng: parseFloat(area_array[i].dwlng),
        uplng: parseFloat(area_array[i].uplng),
        dwlat: parseFloat(area_array[i].dwlat),
        uplat: parseFloat(area_array[i].uplat)
      };
      this.cache_list[i].area = area;
      this.cache_list[i].point = this.area2point(area);
      this.cache_list[i].border = this.area2border(area);
      this.cache_list[i].map_point = null;
      this.cache_list[i].map_border = null;
    }
  }

  // console.log(this);
}

acc_cache.prototype.area2point = function(area) {
  var lng = ((area.uplng + area.dwlng) / 2).toFixed(6);
  var lat = ((area.uplat + area.dwlat) / 2).toFixed(6);
  return { lng: lng, lat: lat };
};

acc_cache.prototype.point2area = function(point, radius) {
  console.log("radius: " + radius)
  if (!radius) {
    radius = 500; // default value
  }
  var width_s = radius / 100 * 0.0009;
  var area = {
    dwlng: (point.lng - width_s).toFixed(6),
    uplng: (point.lng + width_s).toFixed(6),
    dwlat: (point.lat - width_s).toFixed(6),
    uplat: (point.lat + width_s).toFixed(6)
  };

  return area;
};

acc_cache.prototype.area2border = function(area) {
  var border = [];
  border[0] = { lng: area.dwlng, lat: area.dwlat };
  border[1] = { lng: area.dwlng, lat: area.uplat };
  border[2] = { lng: area.uplng, lat: area.dwlat };
  border[3] = { lng: area.uplng, lat: area.uplat };
  return border;
};

acc_cache.prototype.get = function(i) {
  return this.cache_list[i];
};

acc_cache.prototype.clear = function(i) {
  this.cache_list[i].area = null;
  this.cache_list[i].point = null;
  this.cache_list[i].border = null;
  this.cache_list[i].map_point = null;
  this.cache_list[i].map_border = null;
};

// save only area to localStorage.area_array_str for API request
acc_cache.prototype.save = function() {
  var area_array = [];
  for (var i = 0; i < this.cache_list.length; i++) {
    if (this.cache_list[i].area) {
      area_array.push(this.cache_list[i].area);
    }
  }

  localStorage.area_array_str = JSON.stringify(area_array);
}

acc_cache.prototype.set_map_point = function(i, map_point) {
  this.cache_list[i].map_point = map_point;
};

acc_cache.prototype.set_map_border = function(i, map_border) {
  this.cache_list[i].map_border = map_border;
};

acc_cache.prototype.availibale_index = function() {
  for (var i = 0; i < this.cache_list.length; i++) {
    if (this.cache_list[i].point == null) {
      return i;
    }
  }
  return null;
};

// 地图对象
function acc_map(id, lng, lat, zoom) {
  this.lng = 112.561671;
  // this.lng = 111.561671;
  this.lat = 37.863751;
  if (lng != null) {
    this.lng = lng;
  }
  if (lat != null) {
    this.lat = lat;
  }
  this.zoom = 12;
  if (!id) {
    console.log("FATAL ERROR: map no id");
    return;
  }
  this.map_div_id = id;
  var map_div = document.getElementById(this.map_div_id);
  this.map = new BMap.Map(map_div);
  var point = new BMap.Point(this.lng, this.lat);
  this.map.centerAndZoom(point, this.zoom);
  var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM });
  this.map.addControl(ctrl_nav);
}

acc_map.prototype.draw_border = function(border) {
  if (!this.map) {
    return null;
  }
  var polyline_one = new BMap.Polyline([
    new BMap.Point(border[0].lng, border[0].lat),
    new BMap.Point(border[1].lng, border[1].lat)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_three = new BMap.Polyline([
    new BMap.Point(border[0].lng, border[0].lat),
    new BMap.Point(border[2].lng, border[2].lat)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_two = new BMap.Polyline([
    new BMap.Point(border[3].lng, border[3].lat),
    new BMap.Point(border[1].lng, border[1].lat)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var polyline_four = new BMap.Polyline([
    new BMap.Point(border[3].lng, border[3].lat),
    new BMap.Point(border[2].lng, border[2].lat)
  ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 1 });
  var map_border = []
  map_border[0] = polyline_one;
  map_border[1] = polyline_two;
  map_border[2] = polyline_three;
  map_border[3] = polyline_four;
  this.map.addOverlay(polyline_one);
  this.map.addOverlay(polyline_three);
  this.map.addOverlay(polyline_two);
  this.map.addOverlay(polyline_four);

  return map_border;
}

acc_map.prototype.undraw_border = function(map_border) {
  for (var i = 0; i < map_border.length; i++) {
    this.map.removeOverlay(map_border[i]);
  }
}

acc_map.prototype.draw_point = function(index, point) {
  if (!this.map) {
    return null;
  }
  console.log("draw_point: ");
  console.log(point);
  var myIcon = new BMap.Icon("style/img/markers.png", new BMap.Size(23, 26));
  myIcon.setImageOffset(new BMap.Size(0, -25 * index));
  var map_point = new BMap.Marker(point, { icon: myIcon });
  this.map.addOverlay(map_point);
  return map_point;
}

acc_map.prototype.undraw_point = function(map_point) {
  this.map.removeOverlay(map_point);
}

acc_map.prototype.undraw_all = function() {
  for (var i = 0; i < this.size.length; i++) {
    this.undraw_point(this.cache_list[i].map_point);
    this.undraw_border(this.cache_list[i].map_border);
  }
};

acc_map.prototype.set_center = function(center_point) {
  var point = new BMap.Point(center_point.lng, center_point.lat);
  this.map.centerAndZoom(point, this.zoom);
  this.map.centerAndZoom(center_point, this.zoom);
};

acc_map.prototype.set_click_callback = function(callback) {
  this.map.addEventListener("click", function(e) {
    callback(e.point);
  });
}

function draw_list(index, onclick_callback) {
  var self = this;
  var parse_rex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var li = $("<li>地点" + parse_rex[index] + "</li>");
  li.attr("list_id", index)
  var img = $("<img src='style/img/u693.png'></img>").appendTo(li);
  li.click(function() {
    list_click(this);
  });
  $("#point_ul").append(li);
}

function list_click(li) {
  var index = $(li).attr("list_id");
  $(li).remove();
  var temp_ac = this.cache.get(index);
  this.map.undraw_point(temp_ac.map_point);
  this.map.undraw_border(temp_ac.map_border);
  this.cache.clear(index);
  this.cache.save();
}

function draw_list_readonly(index, time, point) {
  var self = this;
  var parse_rex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var li = $("<li></li>");
  var img = $("<img src='style/img/btn/btn-prev.png'></img>").appendTo(li);
  img.css("float", "left");
  img.css("padding-right", "4px");
  img.css("on", "4px");
  var span = $("<span></span>").text("地点" + parse_rex[index] + " " + time).appendTo(li);

  li.click(function() {
    self.map.set_center(point);
  });

  $("#point_ul").append(li);
}

function load_map_accompany_add() {
  // init map and cache
  this.map = new acc_map("map", null, null, null);
  this.cache = new acc_cache(6);
  this.map.set_click_callback(function(point) {
    var index = self.cache.availibale_index();
    console.log("index: " + index);
    if (index == null) {
      alert("您最多可设置" + self.cache.size + "个地点");
      return;
    } else {
      var temp_ac = self.cache.get(index);
      temp_ac.point = point;
      console.log("localStorage.radius: " + localStorage.radius);
      temp_ac.area = self.cache.point2area(point, localStorage.radius);
      temp_ac.border = self.cache.area2border(temp_ac.area);
      temp_ac.map_point = self.map.draw_point(index, point);
      temp_ac.map_border = self.map.draw_border(temp_ac.border);
      draw_list(index, function() {
        list_click(this)
      });
      this.cache.save();
    }
  });
}

function load_map_accompany_modify() {
  var self = this;

  // init map and cache
  this.map = new acc_map("map", null, null, null);
  this.cache = new acc_cache(6, localStorage.area_array_str);

  for (var i = 0; i < cache.size; i++) {
    var temp_ac = cache.get(i);
    if (temp_ac.point != null && temp_ac.border != null) {
      console.log('draw_point and draw_border');
      var map_point = map.draw_point(i, temp_ac.point);
      var map_border = map.draw_border(temp_ac.border);
      temp_ac.map_point = map_point;
      temp_ac.map_border = map_border;
      if (i == 0) {
        map.set_center(temp_ac.point);
      }
      draw_list(i, function() {
        list_click(this);
      });
    }
  }

  this.map.set_click_callback(function(point) {
    var index = self.cache.availibale_index();
    console.log("index: " + index);
    if (index == null) {
      alert("您最多可设置" + self.cache.size + "个地点");
      return;
    } else {
      var temp_ac = self.cache.get(index);
      temp_ac.point = point;
      console.log("localStorage.radius_modify: " + localStorage.radius_modify);
      temp_ac.area = self.cache.point2area(point, localStorage.radius_modify);
      temp_ac.border = self.cache.area2border(temp_ac.area);
      temp_ac.map_point = self.map.draw_point(index, point);
      temp_ac.map_border = self.map.draw_border(temp_ac.border);
      draw_list(index, function() {
        list_click(this)
      });
      this.cache.save();
    }
  });
}

function load_map_special_list() {
  var act_list = JSON.parse(localStorage.act_array_str);
  this.cache = new acc_cache(act_list.length);
  $("#pointlist").css("width", "260px");
  $("#point_ul").empty();

  var lng = null;
  var lat = null;
  if (act_list.length != 0) {
    lng = act_list[0].lng;
    lat = act_list[0].lat;
  } else {
    console.log("length = 0");
    return;
  }

  // init map and cache
  var self = this;
  this.map = new acc_map("map", lng, lat, null);
  for (var i = 0; i < act_list.length; i++) {
    var point = { lng: act_list[i].lng, lat: act_list[i].lat };
    map_point = this.map.draw_point(i, point);
    var time = new Date(act_list[i].time * 1000).toLocaleString().substr(0, 17);
    draw_list_readonly(i, time, point);
  }
}
