/*
  var menu_div = document.getElementById("menu_ul");

  $("#menu_ul li").click(function(e) {
    var center = document.getElementById("center");
    var info = document.getElementById("info");
    var footer = document.getElementById("footer");
    var liname = $(this).attr("name");
    $("#menu_ul li").removeClass("active");
    $("#menu_ul li").css({ "backgroundColor": "blue" });
    $(this).addClass("active");

    if (liname == "userManager" && g_ref.page != "userManager") //用户管理
    {
      center.innerHTML = "";
      g_ref.page = "userManager";
    } else if (liname == "realMonitor" && g_ref.page != "realMonitor") { //实时监控
      center.innerHTML = "";
      var light_panel = createElement({ type: "div", Parentclass: center, style: "width:100%;height:100%;" });
      initMap(light_panel); //创建和初始化地图
      g_ref.page = "realMonitor";
    } else if (liname == "info_up" && g_ref.page != "info_up") { //信息导入
      center.innerHTML = "";
      g_ref.page = "info_up";
    } else if (liname == "playback" && g_ref.page != "playback") { //回放
      center.innerHTML = "";
      var playback_panel = createElement({ type: "div", Parentclass: center, style: "width:100%;height:100%;" });
      initMap(playback_panel); //创建和初始化地图
      g_ref.page = "playback";
    }
  })
  $("#menu_ul li").mousemove(function() {
    $(this).css({ "backgroundColor": "#000099" });
  })
  $("#menu_ul li").mouseout(function() {
      if (!$(this).hasClass("active")) {
        $(this).css({ "backgroundColor": "blue" });
      }
    })
    //用户管理 事件
  $("#header_right").click(function() {
    var user_center = document.getElementById("user_center");
    if (user_center.style.display == "block") {
      user_center.style.display = "none";
    } else {
      user_center.style.display = "block";
    }
  })

  $("#user_center_absolute li").mousemove(function() {
    $(this).css({ "backgroundColor": "blue" });
  })
  $("#user_center_absolute li").mouseout(function() {
    $(this).css({ "backgroundColor": "" });
  })
  $("#logout").click(function() {
    window.location.href = "login.html"
  })

  //数据更新
  var real_time_data = document.getElementById("real_time_data");
  if (real_time_data) {
    var real_ul = real_time_data.children[1];
    setInterval(function() {
      var real_li = createElement({ type: "li", Parentclass: real_ul });
      real_li.innerHTML = "幸运星" + Math.random();
      if (real_ul.offsetHeight > real_time_data.offsetHeight - 30) {
        real_ul.removeChild(real_ul.children[0]);
      }
    }, 2000)
  }
  $("#info_up").click(function() {
    if ($("#info").hasClass("show_block")) {
      $("#info").removeClass("show_block");
    } else {
      $("#info").addClass("show_block");
    }
  })
  $("#convict").click(function() {
    if ($("#convict_div").hasClass("show_block")) {
      $("#convict_div").removeClass("show_block");
    } else {
      $("#convict_div").addClass("show_block");
    }
  })
*/

$("#set_up").click(function() {
  if ($("#set_up_div").hasClass("show_block")) {
    $("#set_up_div").removeClass("show_block");
  } else {
    $("#set_up_div").addClass("show_block");
  }
});

var print_list = [];
//分区初始数据
var Partition_array = [{ id: 1, name: "万柏林区公安分局", value: "1" }, { id: 2, name: "南山区公安分局", value: "2" }, { id: 3, name: "宝安区公安分局", value: "3" }];
var car_array = [{ Partitionid_id: 1, name: "巡逻1车" }, { Partitionid_id: 1, name: "巡逻2车" }, { Partitionid_id: 1, name: "巡逻3车" }, { Partitionid_id: 1, name: "巡逻4车" }]

function init() {
  var Partition = document.getElementById("Partition");
  Partition.innerHTML = "万柏林区公安分局"
  var warning = document.getElementById("warning");

  Partition_init();

  var ul = document.getElementById("warning");
  Cloth_control(ul);
  Cloth_control(ul);
  Cloth_control(ul);
}

//加载车辆
function Partition_init() {
  var Partition = document.getElementById("Partition");
  var car_ul = document.getElementById("car_ul");
  car_ul.innerHTML = "";

  getDevice({ role: "Monitor", department: "111" }, function(msg) {
    //console.log(msg)
    for (var i = 0; i < msg.length; i++) {
      var li_s = createElement({ type: "li", Parentclass: car_ul });
      li_s.innerHTML = "<input type='checkbox' class='cars' checked='checked'  name='" + msg[i].devid + "'>" + msg[i].devname;

      //var point = new BMap.Point(114.066112,22.548515);//定义一个中心点坐标
      var point = new BMap.Point(112.5552, 37.9013);
      var point_obj = addMarker(point);
      print_list.push({ point_obj: point_obj, devid: msg[i].devid });
    }
    $("input[class='cars']").click(function() {

      if (this.checked) {
        //var point = new BMap.Point(114.066112,22.548515);//定义一个中心点坐标
        var point = new BMap.Point(112.5552, 37.9013);
        var point_obj = addMarker(point);
        print_list.push({ point_obj: point_obj, devid: this.name });
      } else {
        for (var i = 0; i < print_list.length; i++) {
          if (this.name == print_list[i].devid) {
            map.removeOverlay(print_list[i].point_obj);
            print_list.splice(i, 1);
          }
        }
      }
      counts();
    })
    counts();
  })

  //只显示未反馈信息
  $("#feedback").change(function() {
    if (this.checked) {

    } else {

    }
  })
}

//创建虚拟的监听数据
function Cloth_control(obj) {

  var log_div = createElement({ type: "li", classname: "li_s", Parentclass: obj });
  log_div.innerHTML = "预警ID:000389   时间：2017.3.22 15:39:13  巡逻车：兴华巡逻一号 代班领导：梁东红  手机号码：672175  反馈状态：未反馈";
  var span = createElement({ type: "span", style: "float:right", Parentclass: log_div });
  span.innerHTML = "展开";
  var i = createElement({ type: "i", classname: "triangle-down", Parentclass: span });

  var Details = createElement({ type: "div", classname: "Details", style: "display:none", Parentclass: log_div });

  var Details_img = createElement({ type: "div", style: "float:left;margin:0px 5px;", Parentclass: Details });
  Details_img.innerHTML = "<img src='images/fanren.png'/>"

  var Details_type = createElement({ type: "div", style: "float:left;color:red;margin:20px;font-weight:bold", Parentclass: Details });
  Details_type.innerHTML = "<p>布控类型:吸毒人员</p><p>布控地点:海上世界</p>";
  var Details_content = createElement({ type: "div", style: "height:150px; margin:10px;float:left;line-height:25px;", Parentclass: Details });
  Details_content.innerHTML = "" + "<p>姓名：猪强奸</p>" + "<p>性别：男</p>" + "<p>中标方式：IMSI 460xxxxxxxx</p>" + "<p>家庭地址：深圳海上世界</p>" + "<p>现居住地址：海上世界龟山别墅</p>" + "<p>身份证号码：23432345432345432</p>"
  span.onclick = function() {
    if (Details.style.display == "block") {
      i.setAttribute('class', "triangle-down")
      Details.style.display = "none";
    } else {
      i.setAttribute('class', "triangle-up")
      Details.style.display = "block";
    }
  }
}

//计算出当前车辆跟显示车辆
function counts() {
  var car_count_htm = "当前显示" + $("input[class='cars']:checked").length + "台,共" + $("input[class='cars']").length + "台";
  $("#car_count").html(car_count_htm);
}


// Ice接收消息

var CallbackSenderPrx = NetCore.CallbackSenderPrx;

//
// Define a servant class that implements the Demo.CallbackReceiver
// interface.
//
var counts = 1;
//Ice接收消息
var CallbackReceiverI = Ice.Class(NetCore.CallbackReceiver, {
  // callback: function(num, current) {
  callback: function(msg) {
    console.log("call CallbackReceiverI's callback ");
    //var ds=Ice.Util.createInputStream(communicator,num.paramValue);
    //CallbackSenderPrx
    //var val=Ice.BoolHelper.read(num.paramValue);
    // console.log("received callback #" + num);
    // for (var i = 0; i < print_list.length; i++) {
    //   if (print_list[i].devid == "006") {
    //     var content = "<table style='color:black;'>";
    //     content = content + "<tr><td> sImsi：" + (parseInt(num.sImsi) + counts) + "</td></tr>";
    //     content = content + "<tr><td> sMobile：" + (parseInt(num.sMobile) + counts) + "</td></tr>";
    //     //content = content + "<tr><td> sTerID："+num.sTerID+"</td></tr>";  
    //     //content = content + "<tr><td> sTerIDType："+num.sTerIDType+"</td></tr>";  
    //     content += "</table>";
    //     counts++;
    //     var infowindow = new BMap.InfoWindow(content);
    //     print_list[i].point_obj.addEventListener("click", function() {
    //       this.openInfoWindow(infowindow);
    //     });
    //     print_list[i].point_obj.point.lat += 0.001;
    //     map.addOverlay(print_list[i].point_obj);
    //   }
    //   console.log(print_list[i].devid);
    // }
  }
});

var id = new Ice.InitializationData();
id.properties = Ice.createProperties();

//
// Initialize the communicator
//
var communicator = Ice.initialize(id);

var connection;

var start = function() {
  //
  // Create a proxy to the sender object.
  //
  // var hostname = document.location.hostname || "127.0.0.1";

  // liguangming comment for remote debug
  var hostname = "192.168.3.202";
  var proxy = communicator.stringToProxy("sender:ws -p 10007 -h " + hostname);

  console.log('start');
  console.log(proxy);

  //
  // Down-cast the proxy to the Demo.CallbackSender interface.
  //
  return CallbackSenderPrx.checkedCast(proxy).then(
    function(server) {
      console.log('CallbackSenderPrx.checkedCast');
      //
      // Create the client object adapter.
      //
      return communicator.createObjectAdapter("").then(
        function(adapter) {
          //
          // Create a callback receiver servant and add it to
          // the object adapter.
          //
          var r = adapter.addWithUUID(new CallbackReceiverI());

          //
          // Set the connection adapter and remember the connection.
          //
          connection = proxy.ice_getCachedConnection();
          connection.setAdapter(adapter);

          //
          // Register the client with the bidir server.
          //
          return server.addClient(r.ice_getIdentity());
        });
    });
};

var stop = function() {
  //
  // Close the connection, the server will unregister the client
  // when it tries to invoke on the bi-dir proxy.
  //
  return connection.close(false);
};

//
// Setup button click handlers
//
//开始接收实时数据

function start_data() {
  if (isDisconnected()) {
    setState(State.Connecting);
    Ice.Promise.try(
      function() {
        console.log('start_data');
        return start().then(function() {
          console.log("start then");
          setState(State.Connected);
        });
      }
    ).exception(
      function(ex) {
        //$("#output").val(ex.toString());
        setState(State.Disconnected);
      }
    );
  }
  return false;
}

//结束接收实时数据
function stop_data() {
  if (isConnected()) {
    setState(State.Disconnecting);
    Ice.Promise.try(
      function() {
        return stop();
      }
    ).exception(
      function(ex) {
        // $("#output").val(ex.toString());
      }
    ).finally(
      function() {
        setState(State.Disconnected);
      }
    );
  }
  return false;
}

//
// Handle client state
//
var State = {
  Disconnected: 0,
  Connecting: 1,
  Connected: 2,
  Disconnecting: 3
};

var isConnected = function() {
  return state == State.Connected;
};

var isDisconnected = function() {
  return state == State.Disconnected;
};

var writeLine = function(msg) {
  /*  $("#output").val($("#output").val() + msg + "\n");
   $("#output").scrollTop($("#output").get(0).scrollHeight); */
};

var state;

var setState = function(s) {
  if (state == s) {
    return;
  }
  state = s;
  switch (s) {
    case State.Disconnected:
      {
        /* $("#start").removeClass("disabled");

        $("#progress").hide();
        $("body").removeClass("waiting"); */
        break;
      }
    case State.Connecting:
      {
        /*  $("#output").val("");
         $("#start").addClass("disabled");

         $("#progress .message").text("Connecting...");
         $("#progress").show();
         $("body").addClass("waiting"); */
        break;
      }
    case State.Connected:
      {
        /*  $("#stop").removeClass("disabled");

         $("#progress").hide();
         $("body").removeClass("waiting"); */
        break;
      }
    case State.Disconnecting:
      {
        /*  $("#stop").addClass("disabled");

         $("#progress .message").text("Disconnecting...");
         $("#progress").show();
         $("body").addClass("waiting"); */
        break;
      }
    default:
      {
        break;
      }
  }
};

setState(State.Disconnected);
start_data();
