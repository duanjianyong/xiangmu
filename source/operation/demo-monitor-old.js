


return;

  console.log("new imsi: " + msg.Imsi);

  var device = get_device(msg.ColEquipid);
  if (device != null) {
    if (!device.msg_list) {
      device.msg_list = [];
    }
    if (device.msg_list.length == 50) {
      device.msg_list.shift();
    }
    device.msg_list.push(msg);
    console.log(device.msg_list);

    // 刷新地图点位
    if (device.map_marker) {
      this.map.removeOverlay(device.map_marker);
    }

    if (device.info_window) {
      device.info_window.close();
    }

    if (device.display) {
      // 显示点位
      // var myIcon = new BMap.Icon("style/img/police5.gif", new BMap.Size(58, 42));
      // var myIcon = new BMap.Icon("style/img/markers_new2x_fbb9e99.png", new BMap.Size(36, 54), { offset: new BMap.Size(36, 54), imageOffset: new BMap.Size(0, -278) });
      var myIcon = new BMap.Icon("style/img/red_local.png", new BMap.Size(35, 54));
      device.map_point = new BMap.Point(msg.ColEquipLong, msg.ColEquipLat);
      device.map_marker = new BMap.Marker(device.map_point, { icon: myIcon });
      device.map_marker.addEventListener("click", function() {
        // console.log(device);
        var opts = {
          width: 200, // 信息窗口宽度
          height: 140, // 信息窗口高度
          title: "车辆：" + device.devname, // 信息窗口标题
          enableMessage: true, //设置允许信息窗发送短息
          message: "",
          enableCloseOnClick: true,
        }
        device.info_window = new BMap.InfoWindow(get_device_imsi_list(device).join("<br>"), opts); // 创建信息窗口对象 
        device.map_marker.addEventListener("click", function() {
          map.openInfoWindow(device.info_window, device.map_point); //开启信息窗口
        });
      });
      this.map.centerAndZoom(device.map_point, 15);
      this.map.addOverlay(device.map_marker);
    } else {
      // todo
    }
  }

  function get_device_imsi_list(device) {
    var imsi_list = []
    for (var i = 0; i < device.msg_list.length; i++) {
      imsi_list.push(device.msg_list[i].Imsi);
    }
    return imsi_list;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                       OLD
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function mapAddTerminal() {}

  function mapRemoveTerminal() {}

  // 初始化消息列表
  function initMessageList() {
    var list = getMessageList();
    console.log(list);
    if (list.length > 3) {
      $("#message_ul").css("overflow-y", "scroll")
    }

    for (var i = 0; i < list.length; i++) {
      var li = $("<li>").appendTo($("#message_ul"));
      li.attr("class", "message_item");
      refresh_patrol_list(list[i].patrol, li);
      createSuspectTable(list[i].suspect, li);
    }
  }

  // 初始化筛选列表
  function initScreenList() {
    var value = getSubstationCookie();
    createSubstationSelect(value);
    createTerminalForm(value);
  }

  // 消息项视图 - 嫌疑人信息表
  function createSuspectTable(suspect_data, li) {
    var table = $("<table>").appendTo(li);
    table.attr("class", "msg-suspect-table");

    var thead = $("<thead>").appendTo(table);
    var tr_0 = $("<tr>").appendTo(table);
    var tr_1 = $("<tr>").appendTo(table);
    var tr_2 = $("<tr>").appendTo(table);
    var tr_3 = $("<tr>").appendTo(table);
    var tr_4 = $("<tr>").appendTo(table);
    var tr_5 = $("<tr>").appendTo(table);
    var tr_6 = $("<tr>").appendTo(table);

    var td = $("<td colspan='4'>").appendTo(tr_0);


    var td = $("<td style='font-weight: bold;'>").appendTo(thead);
    td.html("布控类型：");
    var td = $("<td>").appendTo(thead);
    td.html(suspect_data.criminal_type)
    var td = $("<td style='font-weight: bold;'>").appendTo(thead);
    td.html("布控地点：");
    var td = $("<td>").appendTo(thead);
    td.html(suspect_data.monitor_addr);

    var td = $("<td rowspan='6'>").appendTo(tr_1);
    var div_avatar = $("<div>").appendTo(td);
    div_avatar.attr("class", "suspect-avatar");
    var img = $("<img>").appendTo(div_avatar);
    img.attr("src", suspect_data.avatar);

    var td = $("<td>").appendTo(tr_1);
    td.html("姓名：");
    var td = $("<td colspan='2'>").appendTo(tr_1);
    td.html(suspect_data.name);

    var td = $("<td>").appendTo(tr_2);
    td.html("性别：");
    var td = $("<td colspan='2'>").appendTo(tr_2);
    td.html(suspect_data.sex);

    var td = $("<td>").appendTo(tr_3);
    td.html("家庭住址：");
    var td = $("<td colspan='2'>").appendTo(tr_3);
    td.html(suspect_data.family_place);

    var td = $("<td>").appendTo(tr_4);
    td.html("居住住址：");
    var td = $("<td colspan='2'>").appendTo(tr_4);
    td.html(suspect_data.living_place);

    var td = $("<td>").appendTo(tr_5);
    td.html("中标方式：");
    var td = $("<td colspan='2'>").appendTo(tr_5);
    td.html(suspect_data.find_type + "\t" + suspect_data.find_content);

    var td = $("<td>").appendTo(tr_6);
    td.html("身份证号码：");
    var td = $("<td colspan='2'>").appendTo(tr_6);
    td.html(suspect_data.id_card);
  }

  // 筛选视图 - 分局筛选栏
  function createSubstationSelect(sub_value) {
    var sub_list = getSubstationList();
    var select = $("<select>").appendTo($(".content"));
    select.attr("id", "selector");

    for (var i = 0; i < sub_list.length; i++) {
      var option = $("<option>").appendTo(select);
      option.html(sub_list[i].name);
      option.val(sub_list[i].id);
    }

    if (sub_value != null) {
      select.val(sub_value)
    }

    select.change(function() {
      onSubstationSelect(this.value);
      console.log("select change: " + this.value);
    });

    // var btn_confirm = $("<input type='button'>").appendTo($(".content"));
    // btn_confirm.val("收起");
    // btn_confirm.attr("style", "float:right; background-color:rgba(3, 93, 103, 0.6); border:1px solid #2079b0; margin: 10px;");
    // btn_confirm.click(function() {
    //   var form = $(".content").find("form");
    //   if (form.is(':visible')) {
    //     form.slideUp("fast");
    //     btn_confirm.val("展开");
    //   } else {
    //     form.slideDown("fast");
    //     btn_confirm.val("收起");
    //   }
    // });
  }

  // 筛选视图 - 分局的终端列表
  function createTerminalForm(sub_value) {
    var form = $("<form>").appendTo($(".content"));
    var list = getTerminalList();
    for (var i = 0; i < list.length; i++) {
      var p = $("<p>").appendTo(form);
      var checkbox = $("<input type='checkbox'>").appendTo(p);
      checkbox.val(list[i].id);
      checkbox.change(function() {
        onTerminalSelect($(this));
      });
      var span = $("<span>").appendTo(p);
      span.html(list[i].name);
    }

    // $(".screen").click(function() {
    //   if (form.is(':visible')) {
    //     // form.slideUp("fast");
    //   } else {
    //     form.slideDown("fast");
    //   }
    // });
  }

  function onSubstationSelect(substation_id) {
    // change car list
    // clean car list

    // add car listw

    // set cookie
    setSubstationCookie(substation_id);
  }

  function onTerminalSelect(terminal) {
    if (terminal.get(0).checked) {
      startShowTerminalAtMap(terminal.get(0).value);
    } else {
      stopShowTernimalAtMap(terminal.get(0).value);
    }
  }

  function startShowTerminalAtMap(terminal_id) {
    //创建小狐狸
    var pt = new BMap.Point(112.557 + (terminal_id % 2 - 1) * terminal_id * 0.02, 37.878 + (terminal_id % 2) * terminal_id * 0.01);
    var myIcon = new BMap.Icon("style/img/police5.gif", new BMap.Size(58, 42));
    var marker = new BMap.Marker(pt, { icon: myIcon });
    if (!this.map_marker_list) {
      this.map_marker_list = [];
    }
    this.map.centerAndZoom(pt, 15);
    this.map.addOverlay(marker);
    this.map_marker_list.push({ "id": terminal_id, "marker": marker });
  }

  function stopShowTernimalAtMap(terminal_id) {
    if (this.map_marker_list) {
      for (var i = 0; i < this.map_marker_list.length; i++) {
        if (this.map_marker_list[i].id == terminal_id) {
          this.map.removeOverlay(this.map_marker_list[i].marker);
        }
      }
    }
  }

  function getMessageList() {
    return formatMessageList(iceMessageList());
  }

  function setSubstationCookie(value) {
    $.cookie('substation', value, { expires: 7, path: '/' });
  }

  function getSubstationCookie() {
    return $.cookie('substation');
  }

  function getSubstationList() {
    return [{ "name": "万柏林区公安分局", "id": 1 }, { "name": "小店区公安分局", "id": 2 }, { "name": "杏花岭区公安分局", "id": 3 }];
  }

  function getTerminalList(substation_id) {
    var list = [{ "id": 1, "name": "兴华巡逻一号" },
      { "id": 2, "name": "干峰巡逻一号" },
      { "id": 3, "name": "兴华巡逻一号" },
      { "id": 4, "name": "兴华巡逻四号" },
      { "id": 5, "name": "兴华巡逻二号" },
      { "id": 6, "name": "兴华巡逻三号" },
      { "id": 7, "name": "南路巡逻一号" }
    ];

    return list;
  }

  function formatMessageList(list) {
    // var format_list = [{
    //   'patrol': {
    //     'id': '10010',
    //     'time': '1495174791',
    //     'monitor_terminal': '兴化巡逻一号',
    //     'leader': '梁东红',
    //     'telephone': '13912345678',
    //     'response': 'no',
    //   },
    //   'suspect': {
    //     'criminal_type': '吸毒人员',
    //     'monitor_addr': '海上世界',
    //     'name': '罪犯名字',
    //     'sex': '男',
    //     'id_card': '403424034243243243',
    //     'avatar': 'style/img/suspect-avatar.png',
    //     'find_type': 'IMEI',
    //     'find_content': 'xxxxxxxxx',
    //     'family_place': '深圳海上世界',
    //     'mobile': '13918919426',
    //     'living_place': '海上世界龟山别墅',
    //   }
    // }, {
    //   'patrol': {
    //     'id': '10011',
    //     'time': '1495174710',
    //     'monitor_terminal': '兴化巡逻二号',
    //     'leader': '梁东红',
    //     'telephone': '13912345678',
    //     'response': 'no',
    //   },
    //   'suspect': {
    //     'criminal_type': '吸毒人员',
    //     'monitor_addr': '海外世界',
    //     'name': '罪犯名字',
    //     'sex': '男',
    //     'id_card': '403424034243243243',
    //     'mobile': '13918919426',
    //     'avatar': 'style/img/suspect-avatar.png',
    //     'find_type': 'IMEI',
    //     'find_content': 'xxxxxxxxx',
    //     'family_place': '深圳海上世界',
    //     'living_place': '海上世界龟山别墅',
    //   }
    // }, {
    //   'patrol': {
    //     'id': '10011',
    //     'time': '1495174710',
    //     'monitor_terminal': '兴化巡逻二号',
    //     'leader': '梁东红',
    //     'telephone': '13912345678',
    //     'response': 'no',
    //   },
    //   'suspect': {
    //     'criminal_type': '吸毒人员',
    //     'monitor_addr': '海外世界',
    //     'name': '罪犯名字',
    //     'sex': '男',
    //     'id_card': '403424034243243243',
    //     'mobile': '13918919426',
    //     'avatar': 'style/img/suspect-avatar.png',
    //     'find_type': 'IMEI',
    //     'find_content': 'xxxxxxxxx',
    //     'family_place': '深圳海上世界',
    //     'living_place': '海上世界龟山别墅',
    //   }
    // }, {
    //   'patrol': {
    //     'id': '10011',
    //     'time': '1495174710',
    //     'monitor_terminal': '兴化巡逻二号',
    //     'leader': '梁东红',
    //     'telephone': '13912345678',
    //     'response': 'no',
    //   },
    //   'suspect': {
    //     'criminal_type': '吸毒人员',
    //     'monitor_addr': '海外世界',
    //     'name': '罪犯名字',
    //     'sex': '男',
    //     'id_card': '403424034243243243',
    //     'mobile': '13918919426',
    //     'avatar': 'style/img/suspect-avatar.png',
    //     'find_type': 'IMEI',
    //     'find_content': 'xxxxxxxxx',
    //     'family_place': '深圳海上世界',
    //     'living_place': '海上世界龟山别墅',
    //   }
    // }, {
    //   'patrol': {
    //     'id': '10011',
    //     'time': '1495174710',
    //     'monitor_terminal': '兴化巡逻二号',
    //     'leader': '梁东红',
    //     'telephone': '13912345678',
    //     'response': 'no',
    //   },
    //   'suspect': {
    //     'criminal_type': '吸毒人员',
    //     'monitor_addr': '海外世界',
    //     'name': '罪犯名字',
    //     'sex': '男',
    //     'id_card': '403424034243243243',
    //     'mobile': '13918919426',
    //     'avatar': 'style/img/suspect-avatar.png',
    //     'find_type': 'IMEI',
    //     'find_content': 'xxxxxxxxx',
    //     'family_place': '深圳海上世界',
    //     'living_place': '海上世界龟山别墅',
    //   }
    // }];

    var format_list = [{
      'patrol': {
        'id': '10010',
        'time': '1495174791',
        'monitor_terminal': '兴化巡逻一号',
        'leader': '梁东红',
        'telephone': '13912345678',
        'response': 'no',
      },
      'suspect': {
        'criminal_type': '吸毒人员',
        'monitor_addr': '海上世界',
        'name': '罪犯名字',
        'sex': '男',
        'id_card': '403424034243243243',
        'avatar': 'style/img/suspect-avatar.png',
        'find_type': 'IMEI',
        'find_content': 'xxxxxxxxx',
        'family_place': '深圳海上世界',
        'mobile': '13918919426',
        'living_place': '海上世界龟山别墅',
      }
    }, {
      'patrol': {
        'id': '10011',
        'time': '1495174710',
        'monitor_terminal': '兴化巡逻二号',
        'leader': '梁东红',
        'telephone': '13912345678',
        'response': 'no',
      },
      'suspect': {
        'criminal_type': '吸毒人员',
        'monitor_addr': '海外世界',
        'name': '罪犯名字',
        'sex': '男',
        'id_card': '403424034243243243',
        'mobile': '13918919426',
        'avatar': 'style/img/suspect-avatar.png',
        'find_type': 'IMEI',
        'find_content': 'xxxxxxxxx',
        'family_place': '深圳海上世界',
        'living_place': '海上世界龟山别墅',
      }
    }, {
      'patrol': {
        'id': '10011',
        'time': '1495174710',
        'monitor_terminal': '兴化巡逻二号',
        'leader': '梁东红',
        'telephone': '13912345678',
        'response': 'no',
      },
      'suspect': {
        'criminal_type': '吸毒人员',
        'monitor_addr': '海外世界',
        'name': '罪犯名字',
        'sex': '男',
        'id_card': '403424034243243243',
        'mobile': '13918919426',
        'avatar': 'style/img/suspect-avatar.png',
        'find_type': 'IMEI',
        'find_content': 'xxxxxxxxx',
        'family_place': '深圳海上世界',
        'living_place': '海上世界龟山别墅',
      }
    }, {
      'patrol': {
        'id': '10011',
        'time': '1495174710',
        'monitor_terminal': '兴化巡逻二号',
        'leader': '梁东红',
        'telephone': '13912345678',
        'response': 'no',
      },
      'suspect': {
        'criminal_type': '吸毒人员',
        'monitor_addr': '海外世界',
        'name': '罪犯名字',
        'sex': '男',
        'id_card': '403424034243243243',
        'mobile': '13918919426',
        'avatar': 'style/img/suspect-avatar.png',
        'find_type': 'IMEI',
        'find_content': 'xxxxxxxxx',
        'family_place': '深圳海上世界',
        'living_place': '海上世界龟山别墅',
      }
    }]

    return format_list;
  }

  function iceMessageList() {
    return null;
  }
}
