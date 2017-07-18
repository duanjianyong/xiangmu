$(document).ready(function() {
  init_ui();
  init_bundle();
});

function init_ui() {
  this.userobj = JSON.parse(localStorage.user);
  if (!this.userobj) {
    alert("登录状态已失效");
    window.location.href = "login.html";
    return;
  }

  init_map();
  // initMessageList();
  // initScreenList();

  init_message_list();
  init_device_list();
}

function init_bundle() {
  subscribe_message(function(msg) {
    console.log(msg);
    refresh_message_add(msg);
  }, function(msg) {
    console.log(msg);
    refresh_device_location(msg);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                       地图
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init_map() {
  var self = this;
  var point = new BMap.Point(112.557, 37.876);
  this.map = new BMap.Map("map", {
    mapType: BMAP_NORMAL_MAP
  });
  this.map.centerAndZoom(point, 11);
  this.map.addControl(new BMap.NavigationControl());
  this.map.enableScrollWheelZoom();
  this.map.enableKeyboard();
  this.map.setMapStyle({
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

  this.map.addEventListener('rightclick', function() {
    if (self.terminal_list) {
      self.terminal_list.hideAllImsi();
    }
  });

  this.map.addEventListener('dragstart', function() {
    if (self.terminal_list) {
      self.terminal_list.hideAllImsi();
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                       设备
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function init_device_list() {
    var self = this;
    // set title 
    var title = $("<p></p>").text("部门： " + this.userobj.Department);
    $("#device-list").append(title);

    // set devices list
    getDevice(this.userobj.Role, this.userobj.Department, 0, 15, function(msg) {
      console.log(msg);
      if (msg.result != 0) {
        alert("获取车辆列表失败");
        return;
      }
      self.device_list = msg.devices;
      var form = $("<form style='padding:0;'>").appendTo($("#device-list"));
      for (var i = 0; i < msg.devices.length; i++) {
        self.device_list[i].display = true;
        var p = $("<p>").appendTo(form);
        var checkbox = $("<input type='checkbox' checked='true'>").appendTo(p);
        checkbox.val(msg.devices[i].devid);
        checkbox.change(function() {
          if ($(this).is(":checked")) {
            if (self.terminal_list) {
              var t = self.terminal_list.getTerminal($(this).val());
              t.show();
            }
          } else {
            if (self.terminal_list) {
              var t = self.terminal_list.getTerminal($(this).val());
              t.hide();
            }
          }
        });
        var span = $("<span>").appendTo(p);
        span.html(msg.devices[i].devname);
      }
    });
  }

  function up_device_list(id, display) {
    for (var i = 0; i < this.device_list.length; i++) {
      if (this.device_list[i].devid == id) {
        this.device_list[i].display = display;
      }
    }
  }

  function get_device(id) {
    for (var i = 0; i < this.device_list.length; i++) {
      if (this.device_list[i].devid == id) {
        return this.device_list[i];
      }
    }
    return null;
  }

  function refresh_device_location(msg) {
    if (!this.terminal_list) {
      this.terminal_list = new TerminalList(msg, this.map);
    } else {
      this.terminal_list.updateList(msg);
    }
  }

  /* 
    Brand:"00000000"
    Carrier:1
    ColEquipLat:"37.8447"
    ColEquipLong:"112.518"
    ColEquipType:1
    ColEquipid:"1"
    EquipName:"长风一号"
    Imsi:"460013410647471"
    Mobile:"00000000"
    MsgType:"BSIMSIIMEI"
    NetbarWacode:"00000000"
    TerFieldStrength:"00000000"
    TerID:"00000000"
    TerIDType:1
    sAscrip:"000000000"
  */
  // 终端对象
  function Terminal(msg, bmap) {
    if (!msg) {
      alert("车辆初始化失败，请检查信息来源");
      return;
    }
    console.log('terminal init start.');
    // 列表上限
    this.MAX_SIZE = 5;
    // 百度地图对象
    this.bmap = bmap;
    // 百度地图缩放级别
    this.bmap_view_lv = 15;
    // 消息列表
    this.msg_list = [];
    this.msg_list.push(msg);
    // 终端id
    this.id = msg.ColEquipid;
    // 终端名称
    this.name = msg.EquipName;
    // 当前坐标信息
    this.lat = msg.ColEquipLat;
    this.lng = msg.ColEquipLong;
    // 百度地图图标对象
    // TODO 需要区分在线、离线、带警报，三种类型的设备初始化
    this.bmap_icon = new BMap.Icon("style/img/red_local.png", new BMap.Size(24, 37));
    // 百度地图坐标对象
    this.bmap_point = new BMap.Point(this.lng, this.lat);
    this.bmap.centerAndZoom(this.bmap_point, this.bmap_view_lv);
    // 坐标对象列表
    this.bmap_point_array = [];
    this.bmap_point_array.push(this.bmap_point);
    // 百度地图点对象
    this.bmap_marker = new BMap.Marker(this.bmap_point, { icon: this.bmap_icon });
    this.bmap.addOverlay(this.bmap_marker);
    // imsi列表
    this.imsi_list = [];
    this.imsi_list.push(msg.Imsi);
    // imsi信息列表内容
    this.label_content = "<h4 style='padding-left: 20px;'>" + this.name + "</h4>" + "<p style='margin: 0; padding-left: 20px;'>" + this.imsi_list[0] + "</p>";
    // 百度地图信息列表对象
    this.bmap_label = new BMap.Label(this.label_content, { offset: new BMap.Size(20, -15 * this.msg_list.length) });;
    // 当前是否显示
    this.display = true;
    // 当前是否显示imsi列表
    this.display_imsi = false;
    this.initHandle();
    console.log('terminal init end.');
  }

  Terminal.prototype.update = function(msg) {
    this.updatePosition(msg.ColEquipLong, msg.ColEquipLat);
    this.updateImsi(msg.Imsi);
    this.initHandle();
    if (this.display_imsi) {
      this.showImsi();
    }
  }

  // 刷新当前位置
  Terminal.prototype.updatePosition = function(lng, lat) {
    // 更新坐标
    this.lat = lat;
    this.lng = lng;

    // 更新point
    this.bmap_point.lng = this.lng;
    this.bmap_point.lat = this.lat;

    // 设置中心
    // this.bmap.centerAndZoom(this.bmap_point, this.bmap_view_lv);

    // 更新轨迹列表
    this.bmap_point_array.push(this.bmap_point);

    // 移除原mark
    this.bmap.removeOverlay(this.bmap_marker);

    // 加入新mark
    this.bmap_marker = new BMap.Marker(this.bmap_point, { icon: this.bmap_icon });
    this.bmap.addOverlay(this.bmap_marker);
  };

  // 刷新当前车辆的imsi信息列表, 至多显示50条，单页10条
  Terminal.prototype.updateImsi = function(imsi) {
    // 更新imsi列表
    this.imsi_list.push(imsi);
    if (this.imsi_list.length > this.MAX_SIZE) {
      this.imsi_list.shift();
    }
    console.log(this.imsi_list);

    this.label_content = "<h4 style='padding-left: 20px;'>" + this.name + "</h4>";
    for (var i = 0; i < this.imsi_list.length; i++) {
      this.label_content = this.label_content + "<p style='margin: 0; padding-left: 20px;'>" + this.imsi_list[i] + "</p>";
    }
    this.bmap_label.setContent(this.label_content);
  };

  // 自身事件初始化
  Terminal.prototype.initHandle = function() {
    var self = this;
    this.bmap_marker.addEventListener('click', function() {
      console.log("marker click, display imsi? " + self.display_imsi);
      if (self.display_imsi) {
        self.hideImsi();
      } else {
        self.showImsi();
      }
    }, false);
  }

  // 在地图中显示
  Terminal.prototype.show = function() {
    this.bmap.addOverlay(this.bmap_marker);
  }

  // 在地图中取消显示
  Terminal.prototype.hide = function() {
    this.bmap.centerAndZoom(this.bmap_point, this.bmap_view_lv);
    this.bmap.removeOverlay(this.bmap_marker);
  }

  // 在地图中显示imsi列表
  Terminal.prototype.showImsi = function() {
    var style = {
      display: "block",
      color: "#BEE9FF",
      fontSize: "12px",
      backgroundColor: "rgba(3, 93, 103, 0.6)",
      height: '120px',
      width: "150px",
      // maxHeight: '300px',
      overflowX: 'auto',
      margin: '0 auto',
      border: '2px solid #2079b0'
    };
    this.bmap_label.setStyle(style);
    var x_offset = 40
    var y_offset = -45;
    // if (this.imsi_list.length <= 9) {
    //   y_offset = -20 + -10 * this.imsi_list.length;
    // } else {
    //   y_offset = -110;
    // }
    this.bmap_label.setOffset(new BMap.Size(x_offset, y_offset));
    this.bmap_marker.setLabel(this.bmap_label);
    this.display_imsi = true;
  }

  // 在地图中取消显示imsi列表
  Terminal.prototype.hideImsi = function() {
    var style = {
      display: "none",
      color: "#BEE9FF",
      fontSize: "12px",
      backgroundColor: "rgba(3, 93, 103, 0.6)",
      height: '120px',
      width: "150px",
      // maxHeight: '300px',
      overflowX: 'auto',
      margin: '0 auto',
      border: '2px solid #2079b0'
    };
    this.bmap_label.setStyle(style);
    this.bmap_marker.setLabel(this.bmap_label);
    this.display_imsi = false;
  }

  // 终端对象列表
  function TerminalList(msg, bmap) {
    this.terminal = [];
    this.bmap = bmap;
    this._add_ternimal(msg, this.bmap);
  }

  TerminalList.prototype.updateList = function(msg) {
    for (var i = 0; i < this.terminal.length; i++) {
      var terminal = this.terminal[i];
      if (terminal.id == msg.ColEquipid) {
        terminal.update(msg);
        return terminal;
      }
    }
    return this._add_ternimal(msg, this.bmap);
  }

  TerminalList.prototype.getTerminal = function(id) {
    for (var i = 0; i < this.terminal.length; i++) {
      if (this.terminal[i].id == id) {
        return this.terminal[i];
      }
    }
    return null;
  }

  TerminalList.prototype._add_ternimal = function(msg, bmap) {
    var t = new Terminal(msg, bmap);
    this.terminal.push(t);
    return t;
  }

  TerminalList.prototype.hideAllImsi = function() {
    for (var i = this.terminal.length - 1; i >= 0; i--) {
      this.terminal[i].hideImsi();
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                       告警
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function alarm(data) {
    this.id = data.warnid;
    this.time = data.time;
    this.devname = data.devname;
    this.peoincharge = data.peoincharge;
    this.mobile = data.mobile;
    this.response = data.response;
  }

  alarm.prototype.showAlert = function() {
    var content = "警报！编号" + this.id + ". 车辆" + this.devname + "侦测到黑名单人员信息，请派发指令。";
    // 修改警告框内容
    $("#alarm-content").text(content);

    // 设置警告框显示
    $("#alarm").fadeOut();
    $("#alarm").fadeIn();
  };

  alarm.prototype.hideAlert = function() {
    // 设置警告框显示
    $("#alarm").fadeOut();
  }

  function init_message_list() {
    this.message_list = [];
  }

  function refresh_message_add(msg) {
    this.message_list.push(msg);
    if (this.message_list.length > 3) {
      $("#message_ul").css("overflow-y", "scroll")
    }

    if (this.message_list.length > 5) {
      // 1. remove ui
      $("#message_ul li:last-child").remove();
      // 2. remove message from list
      this.message_list.pop();
    }

    var li = $("<li>").attr("class", "message_item");
    $("#message_ul").prepend(li);
    refresh_patrol_list(msg, li);
  }

  // 消息项视图 - 终端信息表
  function refresh_patrol_list(patrol_data, li) {
    var table = $("<table>").appendTo(li);
    table.attr("class", "msg-patrol-table");
    var tr_1 = $("<tr>").appendTo(table);
    var tr_2 = $("<tr>").appendTo(table);
    var tr_3 = $("<tr>").appendTo(table);

    var td = $("<td>").appendTo(tr_1);
    td.html("编号:");
    var td = $("<td>").appendTo(tr_1);
    td.html(patrol_data.warnid);
    var td = $("<td>").appendTo(tr_1);
    td.html("时间:");
    var td = $("<td>").appendTo(tr_1);
    td.html(patrol_data.time);
    li.click(function() {
      if (table.next().is(':visible')) {
        table.next().slideUp("normal", function() {
          li.css("background-image", "url('style/img/msg-bg.png')");
        });
      } else {
        $(".message_item").css("background-image", "url('style/img/msg-bg.png')");
        $(".msg-suspect-table").slideUp("fast");
        table.next().slideDown("normal");
        li.css("background-image", "url()");
      }
    });

    var td = $("<td>").appendTo(tr_2);
    td.html("巡逻车:");
    var td = $("<td>").appendTo(tr_2);
    td.html(patrol_data.devname);
    var td = $("<td>").appendTo(tr_2);
    td.html("带班领导:");
    var td = $("<td>").appendTo(tr_2);
    td.html(patrol_data.peoincharge);

    var td = $("<td>").appendTo(tr_3);
    td.html("手机号码:");
    var td = $("<td>").appendTo(tr_3);
    td.html(patrol_data.mobile);
    var td = $("<td>").appendTo(tr_3);
    td.html("反馈状态:");
    var td = $("<td>").appendTo(tr_3);
    if (patrol_data.response == "no") {
      td.html("未反馈");
      td.attr("class", "response_no");
    } else {
      td.html("已反馈");
      td.attr("class", "response_yes");
    }
    var a = new alarm(patrol_data);
    a.showAlert();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  // 获取历史消息列表 -- 暂时无用
  function get_messages() {
    getMessages(this.userobj.Role, this.userobj.Department, 1, 15, function(msg) {
      console.log(msg);
    });
  }

  // 订阅实时告警消息
  function subscribe_message(alarm_callback, device_callback) {
    var msg_json;
    startSubscribe(function(msg) {
      msg_json = JSON.parse(msg.messages);
      switch (msg_json.MsgType) {
        case "WARNMSG":
          alarm_callback(msg_json);
          break;
        case "BSIMSIIMEI":
          device_callback(msg_json);
          break;
      }
    });
  }
}
