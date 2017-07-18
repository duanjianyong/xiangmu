window.onload = function() {
  this.userobj = null;
  this.blacklist = "" //黑名单
  // _init_proxy();
  _init_ui();
};

$(document).ready(function() {
  // _init_animation();
  _init_bundle();
});

function _init_ui() {
  if (localStorage.user) {
    this.userobj = JSON.parse(localStorage.user);
    if (!this.userobj) {
      window.location.href = "login.html";
      return;
    }
  }
  // console.log(this.userobj);

  localStorage.page = 1;
  localStorage.pagesize = 15;

  // load_blacklist();
  // g_ref.analysis_menu = "my_black";

  load_accompany();
  g_ref.analysis_menu = "follow_number";

  // load_suspect();
  // g_ref.analysis_menu = "suspect_number";

  // load_special();
  // g_ref.analysis_menu = "special_number";


  $("#menu li").removeClass("active");
  $("li[name=" + g_ref.analysis_menu + "]").eq(0).attr('class', 'active');

  if (localStorage.approve_state && localStorage.approve_state == 1) {
    $("#approve_all").prop("checked", false);
    $("#approve_reject").prop("checked", true);
    localStorage.approve_state = 1;
  } else {
    $("#approve_all").prop("checked", true);
    $("#approve_reject").prop("checked", false);
    localStorage.approve_state = 2;
  }
}

// proxy init
function _init_proxy() {
  var communicator = Ice.initialize();
  var hostname = document.location.hostname || "127.0.0.1";
  var proxy = communicator.stringToProxy("SecurityProvider" +
    ":ws -h " + hostname + " -p 8080 -r /SecurityProvider"
  );

  var timeout = $("#timeout").val();
  proxy = proxy.ice_invocationTimeout(timeout > 0 ? timeout : -1);

  var mode = "twoway";
  if (mode == "twoway") {
    proxy = proxy.ice_twoway();
  } else if (mode == "twoway-secure") {
    proxy = proxy.ice_twoway().ice_secure(true);
  } else if (mode == "oneway") {
    proxy = proxy.ice_oneway();
  } else if (mode == "oneway-secure") {
    proxy = proxy.ice_oneway().ice_secure(true);
  } else if (mode == "oneway-batch") {
    proxy = proxy.ice_batchOneway();
  } else if (mode == "oneway-batch-secure") {
    proxy = proxy.ice_batchOneway().ice_secure(true);
  }
  this.SecurityProviderPrx = NetCore.SecurityProviderPrx.uncheckedCast(proxy);
}

// event bind init
function _init_bundle() {
  ////////////////////////////////////////////菜单栏///////////////////////////////////////////////
  $("#menu li").click(function() {
    var liname = $(this).attr("name");
    if (g_ref.analysis_menu == liname) {
      return;
    }

    var liname_div = document.getElementById(g_ref.analysis_menu + "_div");
    liname_div.style.display = "none";
    if (liname == "my_black") {
      load_blacklist();
    } else if (liname == "follow_number") {
      load_accompany();
    } else if (liname == "suspect_number") {
      load_suspect();
    } else if (liname == "special_number") {
      load_special();
    } else if (liname == "update_pwd") {
      update_pwd();
    } else if (liname == "logout") {
      logout();
    }
    $("#menu li").removeClass("active");
    this.setAttribute('class', "active");
    g_ref.analysis_menu = liname;
  });
  ////////////////////////////////////////////黑名单///////////////////////////////////////////////
  {
    // 添加黑名单
    $("#add_blacklist").click(function() {
      add_blacklist();
    });
  }
  ////////////////////////////////////////////伴随号码/////////////////////////////////////////////
  {
    // 创建伴随号码向导
    $("#create_follow").click(function() {
      // console.log("create_follow");
      localStorage.map_type = "accpompany_add";
      $("#map_acc_add").empty();
      // init end time
      $("#acc_endtime").val(getFormatDatetimeLocalEnd(Date.parse(new Date())));
      var map = $("<iframe src='analysis-map.html'></iframe>").appendTo($("#map_acc_add"));
    });

    // 创建伴随号码
    $("#add_accompany_ac").click(function() {
      add_accompany();
    });

    // 修改伴随号码分析器向导
    $("#modify_follow").click(function() {
      localStorage.map_type = "accpompany_modify";
      modify_accompany_init();
    });

    // 修改伴随号码
    $("#modify_accompany_ac").click(function() {
      modify_accompany();
    });

    // 删除伴随号码分析器
    $("#delete_follow").click(function() {
      delete_accompany();
    });

    // 执行伴随号码分析器
    $("#start_follow").click(function() {
      exec_accompany();
    });

    // 切换全选和部分选
    $("input[name=radiotype]").click(function() {
      if (this.value == "all") {
        localStorage.approve_state = 2;
      } else if (this.value == "approved") {
        localStorage.approve_state = 1;
      }
      load_blacklist();
    });

    // 伴随号码创建页面中的半径
    localStorage.radius = $("input[name='radius']:checked").val();
    $("input[name=radius]").click(function() {
      localStorage.radius = $("input[name='radius']:checked").val();
      console.log("click : " + localStorage.radius);
    });

    // 伴随号码修改页面中的半径
    localStorage.radius_modify = $("input[name='radius-modify']:checked").val();
    $("input[name=radius-modify]").click(function() {
      localStorage.radius_modify = $("input[name='radius-modify']:checked").val();
      console.log("click : " + localStorage.radius_modify);
    });
  }
  ////////////////////////////////////////////疑似号码/////////////////////////////////////////////
  {
    // 初始化疑似号码分析器创建
    $("#create_suspect").click(function(){
      $("#sus_e_time").val(getFormatDatetimeLocalEnd(Date.parse(new Date())));
    });

    // 增加疑似号码分析器
    $("#add_sus").click(function() {
      add_suspect();
    });

    // 删除疑似号码分析器
    $("#delete_sus").click(function() {
      del_suspect();
    });

    // 开始疑似号码分析器
    $("#start_sus").click(function() {
      exec_suspect();
    });

    // 修改疑似号码分析器modal
    $("#modify_sus").click(function() {
      load_suspect_modify();
      $("#modal-suspect-modify").modal("show");
    });

    $("#modify_sus_ac").click(function() {
      modify_suspect();
    });

    // 切换疑似分析器
    $("#suspect_number_list li").click(function() {
      $("#suspect_number_list li").removeClass("active");
      this.setAttribute('class', "active");
    });
  }
  ////////////////////////////////////////////特定号码/////////////////////////////////////////////
  {
    $("#get_spec_ac").click(function() {
      get_special();
    })
  }
  ////////////////////////////////////////////密码修改/////////////////////////////////////////////
  {
    $("#up_pwd_ac").click(function() {
      change_password();
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 黑名单
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_blacklist() {
    console.log("approve_state: " + localStorage.approve_state);
    $("#my_black_div").css("display", "block");

    getBlacklist(this.userobj.Role, this.userobj.Department, localStorage.page, localStorage.pagesize, localStorage.approve_state, function(msg) {
      console.log(msg);
      $("#my_black_page").initPage(msg.total, localStorage.page, function(val) {
        console.log(val);
        localStorage.page = val;
        load_blacklist_page();
        // refresh_blacklist(msg.blacklist)
      });
    });
  }

  function load_blacklist_page() {
    getBlacklist(this.userobj.Role, this.userobj.Department, localStorage.page, localStorage.pagesize, localStorage.approve_state, function(msg) {
      // console.log(msg);
      // { result: result, total: total, blacklist: blacklist }
      if (msg.total && msg.total > 0) {
        refresh_blacklist(msg.blacklist);
      }
    });
  }

  function refresh_blacklist(blacklist) {
    $("#black_list").empty();
    this.blacklist = blacklist;

    for (var i = 0; i < blacklist.length; i++) {
      // blacklist[i]
      var tr = $("<tr></tr>");
      // var checkbox = $("<td><input class='choice' type='checkbox' value='" + account_data[i].username + "'/></td>");
      var index = $("<td></td>").text(i + 1);
      var imsi = $("<td></td>").text(blacklist[i].imsi);
      var imei = $("<td></td>").text(blacklist[i].imeiesn);
      var name = $("<td></td>").text(blacklist[i].name);
      var id = $("<td></td>").text(blacklist[i].ID);
      var crimtype = $("<td></td>").text(blacklist[i].crimtype);
      var briefinfo = $("<td></td>").text(blacklist[i].briefinfo);
      var approved = blacklist[i].approved;
      var submittime;
      if (approved == 0) {
        submittime = $("<td></td>");
        var btn = $("<input type='button' value='撤销' class='cancel_bl_action' id='" + blacklist[i].imsi + "'></input>").appendTo(submittime);
      } else {
        submittime = $("<td></td>").text(blacklist[i].submittime);
      }
      tr.append(index, imsi, imei, name, id, crimtype, briefinfo, submittime);
      $("#black_list").append(tr);
    }

    $(".cancel_bl_action").click(function() {
      var blacklist = _get_blacklist($(this).attr('id'));
      deleteBlacklist(blacklist, function(result) {
        console.log(result);
        if (result == 0) {
          alert('撤销成功！');
        } else {
          alert('撤销失败，错误代码:' + result);
        }
        load_blacklist();
      });
    });
  }

  function add_blacklist() {
    // console.log($("#black_imsi").val());
    // console.log($("#black_imei").val());
    // console.log($("#black_criminal_name").val());
    // console.log($("#black_id").val());
    // console.log($("#black_crimtype").val());
    // console.log($("#black_briefinfo").val());

    var imsi = $("#black_imsi").val();
    var imei = $("#black_imei").val();
    var name = $("#black_criminal_name").val();
    var id = $("#black_id").val();
    var crimtype = $("#black_crimtype").val();
    var briefinfo = $("#black_briefinfo").val();

    if (
      // imsi.length == 0 || // imsi 与 imei二选一
      // imei.length == 0 || 
      name.length == 0 ||
      id.length == 0 ||
      crimtype.length == 0 ||
      briefinfo.length == 0) {
      alert("输入不能为空");
      return;
    }

    if (imsi.length == 0 && imei.length == 0) {
      alert("IMSI与IMEI不能同时为空");
      return;
    }

    var reg_hex = /^[0-9]*$/;
    var reg_id = /^[0-9]*[0-9|x|X]$/;
    if (imsi.length != 0 && (imsi.length != 15 || !reg_hex.test(imsi))) {
      alert("IMSI 是15位纯数字数据");
      return;
    }

    if (imei.length != 0 && (imei.length != 15 || !reg_hex.test(imei))) {
      alert("IMEI / ESN 是15位纯数字数据");
      return;
    }
    console.log(id.length);
    if ((id.length != 15 && id.length != 18) || !reg_id.test(id)) {
      alert("身份证号输入有误");
      return;
    }

    var blacklist = {
      imsi: imsi,
      imei: imei,
      name: name,
      ID: id,
      crimtype: crimtype,
      briefinfo: briefinfo,
      submitter: this.userobj.UserName,
      submittime: getNowFormatDate(),
      // submittime: "",
      department: this.userobj.Department,
    }

    addBlacklist(blacklist, function(result) {
      console.log(result);
      if (result == 0) {
        alert("添加成功");
      } else {
        alert("添加失败，错误代码：" + result);
      }
      $("#black_add").modal('hide');
      load_blacklist();
    });
  }

  function _get_blacklist(imsi) {
    for (var i = 0; i < this.blacklist.length; i++) {
      if (this.blacklist[i].imsi == imsi) {
        return this.blacklist[i];
      }
    }
  }

  function _t() {
    var imei = Math.floor(Math.random() * 100000000000000);
    var blacklist = {
      imsi: imei,
      imei: imei,
      name: imei,
      ID: imei,
      crimtype: imei,
      briefinfo: imei,
      submitter: this.userobj.UserName,
      submittime: getNowFormatDate(),
      // submittime: "",
      department: this.userobj.Department,
    }

    addBlacklist(blacklist, function(result) {
      console.log(result);
      if (result == 0) {
        alert("添加成功");
      } else {
        alert("添加失败，错误代码：" + result);
      }
      $("#black_add").modal('hide');
      load_blacklist();
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 伴随号码
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_accompany() {
    $("#follow_number_div").css("display", "block");

    getAccompany({ username: this.userobj.UserName, department: this.userobj.Department }, function(msg) {
      console.log(msg);
      refresh_accompany(msg.accompany_list);
    });
  }

  function refresh_accompany(accompany_list) {
    console.log(accompany_list);
    var ul_div = $("#follow_number_list");
    $(".result").slideUp(300);
    $(".content").slideUp(300);
    ul_div.empty();
    this.accompany_list = accompany_list;
    if (this.accompany_list.length == 0) {
      ul_div.text("空");
      return;
    }

    if (this.accompany_show_index == null) {
      this.accompany_show_index = 0;
    }

    for (var i = 0; i < accompany_list.length; i++) {
      var l = $("<li value='" + accompany_list[i].taskid + "'></li>").text(accompany_list[i].taskname);
      l.val(accompany_list[i].taskid);
      l.attr("id", accompany_list[i].taskid);
      if (this.accompany_show_index == i) {
        l.attr('class', 'active');
        var accompany = _get_accompany(l.attr('id'));
        if (accompany != undefined) {
          load_accompany_content(accompany);
        } else {
          alert("加载出错，请刷新页面后重试");
        }
      }
      ul_div.append(l);
    }

    var self = this;
    $("#follow_number_list li").click(function() {
      $("#follow_number_list li").removeClass("active");
      $(this).attr('class', 'active');
      var accompany = _get_accompany($(this).attr('id'));
      if (accompany != undefined) {
        self.accompany_show_index = $(this).index();
        console.log("show index is: " + self.accompany_show_index);
        $(".result").slideUp(300);
        $(".content").slideUp(300, function() {
          load_accompany_content(accompany);
        });
      } else {
        alert("加载出错，请刷新页面后重试");
      }
    });
  }

  function load_accompany_content(accompany) {
    console.log("load_accompany_content");
    console.log(accompany);

    $("#acc_content_table").empty();

    var table = $("<table></table>");
    var caption = $("<caption><h4>" + accompany.taskname + "</h4></caption>");
    var tb_body = $("<tbody></tbody>");

    var tr_imsi = $("<tr></tr>");
    $("<td>已知IMSI</td>").appendTo(tr_imsi);
    $("<td>" + accompany.imsi + "</td>").appendTo(tr_imsi);

    var tr_stime = $("<tr></tr>");
    $("<td>开始时间</td>").appendTo(tr_stime);
    var startime = new Date(parseInt(accompany.startime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    $("<td>" + startime + "</td>").appendTo(tr_stime);

    var tr_etime = $("<tr></tr>");
    $("<td>结束时间</td>").appendTo(tr_etime);
    var endtime = new Date(parseInt(accompany.endtime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    $("<td>" + endtime + "</td>").appendTo(tr_etime);

    var tr_addrs = $("<tr></tr>");
    $("<td>地址范围</td>").appendTo(tr_addrs);
    var addrs = JSON.parse(accompany.addrs);
    var addrs_text = "共 " + addrs.length + " 个地址范围";
    for (var i = 0; i < addrs.length; i++) {
      if (addrs[i] == null) {
        continue;
      }
      var addr_text = "[" + (i + 1) + "]";
      addr_text += "经度范围：" + addrs[i].dwlng + " - " + addrs[i].uplng;
      addr_text += ", 纬度范围：" + addrs[i].dwlat + " - " + addrs[i].uplat;
      addrs_text += "<br />" + addr_text;
    }
    $("<td>" + addrs_text + "</td>").appendTo(tr_addrs);

    tb_body.append(tr_imsi, tr_stime, tr_etime, tr_addrs);

    table.append(caption, tb_body);
    $("#acc_content_table").append(table);

    $(".content").slideDown(300);
  }

  function add_accompany() {
    // new iframe
    var taskid = new UUID().id;
    var taskname = $("#acc_name").val();
    var starttime_stamp = Math.ceil(new Date($("#acc_starttime").val()).getTime() / 1000);
    var endtime_stamp = Math.ceil(new Date($("#acc_endtime").val()).getTime() / 1000);
    var imsi = $("#acc_imsi").val();

    // console.log(uuid.id);
    // console.log($("#acc_name").val());
    // console.log(this.userobj.UserName);
    // console.log($("#acc_imsi").val());
    // console.log(this.userobj.Department);
    // console.log(starttime_stamp);
    // console.log(endtime_stamp);
    // console.log(localStorage.area_array);

    // 删除imsi必须填入
    // if (taskname.length == 0 || imsi.length == 0) {
    if (taskname.length == 0) {
      alert("输入不能为空");
      return;
    }

    var reg_hex = /^[0-9]*$/;
    if ((imsi.length != 0 && imsi.length != 15) || !reg_hex.test(imsi)) {
      alert("IMSI 是15位纯数字数据");
      return;
    }

    if (starttime_stamp >= endtime_stamp) {
      alert("开始时间必须早于结束时间");
      return;
    }

    if (JSON.parse(localStorage.area_array_str).length == 0) {
      alert("请选择至少1个地点范围");
      return;
    }

    var accompany = {
      taskid: taskid,
      taskname: taskname,
      username: this.userobj.UserName,
      department: this.userobj.Department,
      startime: starttime_stamp,
      endtime: endtime_stamp,
      imsi: imsi,
      addrs: localStorage.area_array_str
    }

    addAccompany(accompany, function(msg) {
      if (msg.result == 0) {
        alert("分析器创建成功");
      } else {
        alert("分析器创建失败，错误代码：" + msg.result);
      }
      $("#modal-accompany").modal('hide');
      load_accompany();
    });
  }

  function modify_accompany_init() {
    var active_id = $("#follow_number_list li.active").attr("id");

    if (active_id == undefined) {
      alert("编辑失败，请刷新后重试！");
      return;
    } else {
      var acc = _get_accompany(active_id);
      $("#map_acc_modify").val(acc.taskid);
      $("#acc_name_modify").val(acc.taskname);
      $("#acc_imsi_modify").val(acc.imsi);
      $("#acc_starttime_modify").val(getFormatDatetimeLocal(acc.startime * 1000));
      $("#acc_endtime_modify").val(getFormatDatetimeLocal(acc.endtime * 1000));
      localStorage.area_array_str = acc.addrs;
      $("#map_acc_modify").empty();
      var map = $("<iframe src='analysis-map.html'></iframe>").appendTo($("#map_acc_modify"));
      $("#modal-accompany-modify").modal("show");
    }
  }

  function modify_accompany() {
    var taskid = $("#follow_number_list li.active").attr("id");
    var taskname = $("#acc_name_modify").val();
    var starttime_stamp = Math.ceil(new Date($("#acc_starttime_modify").val()).getTime() / 1000);
    var endtime_stamp = Math.ceil(new Date($("#acc_endtime_modify").val()).getTime() / 1000);
    var imsi = $("#acc_imsi_modify").val();

    // console.log(uuid.id);
    // console.log($("#acc_name").val());
    // console.log(this.userobj.UserName);
    // console.log($("#acc_imsi").val());
    // console.log(this.userobj.Department);
    // console.log(starttime_stamp);
    // console.log(endtime_stamp);
    // console.log(localStorage.area_array);

    if (taskname.length == 0 || imsi.length == 0) {
      alert("输入不能为空");
      return;
    }

    var reg_hex = /^[0-9]*$/;
    if (imsi.length != 15 || !reg_hex.test(imsi)) {
      alert("IMSI 是15位纯数字数据");
      return;
    }

    if (starttime_stamp >= endtime_stamp) {
      alert("开始时间必须早于结束时间");
      return;
    }

    if (JSON.parse(localStorage.area_array_str).length == 0) {
      alert("请选择至少1个地点范围");
      return;
    }

    var accompany = {
      taskid: taskid,
      taskname: taskname,
      username: this.userobj.UserName,
      department: this.userobj.Department,
      startime: starttime_stamp,
      endtime: endtime_stamp,
      imsi: imsi,
      addrs: localStorage.area_array_str
    }

    console.log("modify_accompany");
    console.log(accompany);

    updateAccompany(accompany, function(msg) {
      if (msg.result == 0) {
        alert("分析器更新成功");
      } else {
        alert("分析器更新失败，错误代码：" + msg.result);
      }
      $("#modal-accompany-modify").modal('hide');
      load_accompany();
    });
  }

  function delete_accompany() {
    var active_id = $("#follow_number_list li.active").attr("id");
    if (active_id == undefined) {
      alert("删除失败，请刷新后重试！");
      return;
    } else {
      var acc = _get_accompany(active_id);
      deleteAccompany(acc, function(msg) {
        if (msg.result == 0) {
          alert("删除成功");
          self.accompany_show_index = 0;
        } else {
          alert("删除失败，错误代码：" + msg.result);
        }
        load_accompany();
      });
    }
  }

  function exec_accompany() {
    var active_id = $("#follow_number_list li.active").attr("id");
    console.log("exec_accompany active_id: " + active_id);

    if (active_id == undefined) {
      alert("分析失败，请刷新后重试！");
      return;
    } else {
      var acc = _get_accompany(active_id);
      console.log(acc);

      execAccompany(acc, function(msg) {
        console.log(msg);
        load_accompany_result(msg.act_list);
      });
    }
  }

  function load_accompany_result(act_list) {
    console.log(act_list);
    $("#acc_result_table").empty();
    var tab = $("<table></table>").appendTo($("#acc_result_table"));
    tab.attr("class", "table table-striped");
    var cap = $("<caption></caption").text("分析结果").appendTo(tab);
    var thead = $("<thead><tr style='border-top:1px solid #fff;'><th>编号</th><th>IMSI</th><th>IMEI / ESN</th><th>姓名</th></tr></thead>").appendTo(tab);
    var tb = $("<tbody></tbody>").appendTo(tab);

    if (act_list.length == 0) {
      console.log("未捕获到相关信息，请调整相关条件后重试");
      var tr_empty = $("<tr></tr>").appendTo(tb);
      var td = $("<td colspan='3'></td>").text("未捕获到相关信息，请调整相关条件后重试").appendTo(tr_empty);
    } else {
      for (var i = 0; i < act_list.length; i++) {
        var tr = $("<tr></tr>").appendTo(tb);
        $("<td></td>").text(i + 1).appendTo(tr);
        $("<td></td>").text(act_list[i].imsi).appendTo(tr);
        $("<td></td>").text(act_list[i].imei).appendTo(tr);
        $("<td></td>").text(act_list[i].name).appendTo(tr);
      }
    }

    $("#acc_result").slideDown(300);
  }

  function _get_accompany(taskid) {
    for (var i = 0; i < this.accompany_list.length; i++) {
      if (this.accompany_list[i].taskid == taskid) {
        return this.accompany_list[i];
      }
    }
    return undefined;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 疑似号码
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{

  function load_suspect() {
    $("#suspect_number_div").css("display", "block");

    getSuspect({ username: this.userobj.UserName, department: this.userobj.Department }, function(msg) {
      console.log(msg);
      refresh_suspect(msg.suspect_list);
    });
  }

  function refresh_suspect(suspect_list) {
    var ul_div = $("#suspect_number_list");
    var li_list = $("#suspect_number_list li");
    // console.log(suspect_list);
    $(".result").slideUp(300);
    $(".content").slideUp(300);
    ul_div.empty();
    this.suspect_list = suspect_list;
    if (this.suspect_list.length == 0) {
      ul_div.text("空");
      return;
    }

    if (this.suspect_show_index == null) {
      this.suspect_show_index = 0;
    }

    for (var i = 0; i < suspect_list.length; i++) {
      var l = $("<li value='" + suspect_list[i].taskid + "'></li>").text(suspect_list[i].taskname);
      l.val(suspect_list[i].taskid);
      l.attr("id", suspect_list[i].taskid);
      ul_div.append(l);
    }

    var li_active = $("#suspect_number_list li").eq(this.suspect_show_index);
    li_active.attr('class', 'active');
    var suspect = _get_suspect(li_active.attr('id'));
    if (suspect != null) {
      load_suspect_content(suspect);
    } else {
      alert("加载出错，请刷新页面后重试");
    }

    var self = this;
    $("#suspect_number_list li").click(function() {
      $("#suspect_number_list li").removeClass("active");
      $(this).attr('class', 'active');
      var suspect = _get_suspect($(this).attr('id'));
      if (suspect != undefined) {
        self.suspect_show_index = $(this).index();
        $(".result").slideUp(300);
        $(".content").slideUp(300, function() {
          load_suspect_content(suspect);
        });
      } else {
        alert("加载出错，请刷新页面后重试");
      }
    });
  }

  function load_suspect_content(suspect) {
    console.log("load_suspect_content");
    console.log(suspect);

    $("#sus_content_table").empty();
    $("#special_number_div").css('display', 'none');

    var table = $("<table></table>");
    var caption = $("<caption><h4>" + suspect.taskname + "</h4></caption>");
    var tb_body = $("<tbody></tbody>");

    var tr_imsi = $("<tr></tr>");
    $("<td>已知IMSI</td>").appendTo(tr_imsi);
    $("<td>" + suspect.imsi + "</td>").appendTo(tr_imsi);

    var tr_imei = $("<tr></tr>");
    $("<td>已知IMEI / ESN</td>").appendTo(tr_imei);
    $("<td>" + suspect.imei + "</td>").appendTo(tr_imei);

    var tr_stime = $("<tr></tr>");
    $("<td>开始时间</td>").appendTo(tr_stime);
    var startime = new Date(parseInt(suspect.startime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    $("<td>" + startime + "</td>").appendTo(tr_stime);

    var tr_etime = $("<tr></tr>");
    $("<td>结束时间</td>").appendTo(tr_etime);
    var endtime = new Date(parseInt(suspect.endtime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    $("<td>" + endtime + "</td>").appendTo(tr_etime);

    tb_body.append(tr_imsi, tr_imei, tr_stime, tr_etime);

    table.append(caption, tb_body);
    $("#sus_content_table").append(table);

    $(".content").slideDown(300);
  }

  function add_suspect() {
    var taskid = new UUID().id;
    var starttime_stamp = Math.ceil(new Date($("#sus_s_time").val()).getTime() / 1000);
    var endtime_stamp = Math.ceil(new Date($("#sus_e_time").val()).getTime() / 1000);
    var taskname = $("#sus_name").val();
    var imsi = $("#sus_imsi").val();
    var imei = $("#sus_imei").val();
    console.log($("#sus_name").val());
    console.log($("#sus_imsi").val());
    console.log($("#sus_imei").val());
    console.log(starttime_stamp);
    console.log(endtime_stamp);

    if (imsi.length == 0 && imei.length == 0) {
      alert("IMSI/IMEI必须填一项");
      return;
    }

    if (imei.length != 0 && imei.length != 15) {
      alert("IMEI必须是15位整数");
      return;
    }

    if (imsi.length != 0 && imsi.length != 15) {
      alert("IMSI必须是15位整数");
      return;
    }

    var suspect = {
      taskid: taskid,
      taskname: taskname,
      username: this.userobj.UserName,
      department: this.userobj.Department,
      startime: starttime_stamp,
      endtime: endtime_stamp,
      imsi: imsi,
      imei: imei,
    };

    addSuspect(suspect, function(msg) {
      if (msg.result == 0) {
        alert("添加成功");
      } else {
        alert("添加失败，错误代码：" + msg.result);
      }
      $("#modal-suspect").modal("hide");
      load_suspect();
    })
  }

  function load_suspect_modify() {
    var active_id = $("#suspect_number_list li.active").attr("id");
    if (active_id == undefined) {
      alert("编辑失败，请刷新后重试！");
      return;
    } else {
      var sus = _get_suspect(active_id);
      console.log(sus);
      $("#sus_name_up").val(sus.taskname);
      $("#sus_imsi_up").val(sus.imsi);
      $("#sus_imei_up").val(sus.imei);
      $("#sus_s_time_up").val(getFormatDatetimeLocal(sus.startime * 1000));
      $("#sus_e_time_up").val(getFormatDatetimeLocal(sus.endtime * 1000));
    }
  }

  function modify_suspect() {
    var taskid = $("#suspect_number_list li.active").attr("id");
    var starttime_stamp = Math.ceil(new Date($("#sus_s_time_up").val()).getTime() / 1000);
    var endtime_stamp = Math.ceil(new Date($("#sus_e_time_up").val()).getTime() / 1000);
    var taskname = $("#sus_name_up").val();
    var imsi = $("#sus_imsi_up").val();
    var imei = $("#sus_imei_up").val();
    // console.log($("#sus_name_up").val());
    // console.log($("#sus_imsi_up").val());
    // console.log($("#sus_imei_up").val());
    console.log(starttime_stamp);
    console.log(endtime_stamp);

    if (imsi.length == 0 && imei.length == 0) {
      alert("IMSI/IMEI必须填一项");
      return;
    }

    if (imei.length != 0 && imei.length != 15) {
      alert("IMEI必须是15位整数");
      return;
    }

    if (imsi.length != 0 && imsi.length != 15) {
      alert("IMSI必须是15位整数");
      return;
    }

    var suspect = {
      taskid: taskid,
      taskname: taskname,
      username: this.userobj.UserName,
      department: this.userobj.Department,
      startime: starttime_stamp,
      endtime: endtime_stamp,
      imsi: imsi,
      imei: imei,
    };

    updateSuspect(suspect, function(msg) {
      if (msg.result == 0) {
        alert("添加成功");
      } else {
        alert("添加失败，错误代码：" + msg.result);
      }
      $("#modal-suspect-modify").modal("hide");
      load_suspect();
    })
  }

  function load_suspect_modify() {
    var active_id = $("#suspect_number_list li.active").attr("id");
    if (active_id == undefined) {
      alert("编辑失败，请刷新后重试！");
      return;
    } else {
      var sus = _get_suspect(active_id);
      console.log(sus);
      $("#sus_name_up").val(sus.taskname);
      $("#sus_imsi_up").val(sus.imsi);
      $("#sus_imei_up").val(sus.imei);
      $("#sus_s_time_up").val(getFormatDatetimeLocal(sus.startime * 1000));
      $("#sus_e_time_up").val(getFormatDatetimeLocal(sus.endtime * 1000));
    }
  }

  function del_suspect() {
    var active_id = $("#suspect_number_list li.active").attr("id");
    if (active_id == undefined) {
      alert("删除失败，请刷新后重试！");
      return;
    } else {
      var sus = _get_suspect(active_id);
      deleteSuspect(sus, function(msg) {
        if (msg.result == 0) {
          alert("删除成功");
          self.suspect_show_index = 0;
        } else {
          alert("删除失败，错误代码：" + msg.result);
        }
        load_suspect();
      });
    }
  }

  function exec_suspect() {
    var active_id = $("#suspect_number_list li.active").attr("id");
    if (active_id == undefined) {
      alert("删除失败，请刷新后重试！");
      return;
    } else {
      var sus = _get_suspect(active_id);
      // execSuspect(sus.department, sus.imsi, sus.imei, sus.startime, sus.endtime, function(msg) {
      execSuspect("1", sus.imsi, sus.imei, sus.startime, sus.endtime, function(msg) {
        if (msg.result == 0) {
          load_suspect_result(msg.exec_result);
        } else {
          // if (msg.result == -1) {
          //   alert("分析失败，不存在此IMSI");
          // } else if (msg.result == -2) {
          if (msg.result == -2) {
            alert("分析失败，数据库中未搜索到相关数据！");
          } else {
            alert("分析失败，错误代码：" + msg.result);
          }
        }
      });
    }
  }

  function load_suspect_result(exec_result) {
    var self = this;
    $("#sus_result_table").empty();
    var tb = $("<table></table>").appendTo($("#sus_result_table"));
    var cap = $("<caption><h3>执行结果</h3></caption>").appendTo(tb);
    if (exec_result.length) {
      var thead = $("<thead></thead>").appendTo(tb);
      $("<th></th>").text("序号").appendTo(thead);
      $("<th></th>").text("IMSI").appendTo(thead);
      $("<th></th>").text("IMEI/ESN").appendTo(thead);
      $("<th></th>").text("姓名").appendTo(thead);
      $("<th></th>").text("可信度").appendTo(thead);
      $("<th></th>").text("查询轨迹").appendTo(thead);

      var tbody = $("<tbody></tbody>").appendTo(tb);

      for (var i = 0; i < exec_result.length; i++) {
        var tr = $("<tr></tr>").appendTo(tbody);
        $("<td></td>").text(i + 1).appendTo(tr);
        $("<td></td>").text(exec_result[i].imsi).appendTo(tr);
        $("<td></td>").text(exec_result[i].imei).appendTo(tr);
        $("<td></td>").text(exec_result[i].name).appendTo(tr);
        $("<td></td>").text(exec_result[i].credlev).appendTo(tr);
        var query = $("<td></td>").appendTo(tr);
        var query_btn = $("<li style='width:60px; margin:0 auto;'></li>").text("查询").appendTo(query);
        query_btn.attr('imsi', exec_result[i].imsi)
        query_btn.click(function() {
          self.special_imsi_value = $(this).attr('imsi');
          load_special();
        });
      }
    } else {
      var tbody = $("<tbody></tbody>").appendTo(tb);
      var tr = $("<tr></tr>").appendTo(tbody);
      $("<td colspan='5'></td>").text("没有获取到匹配的数据").appendTo(tr);
    }
    $(".result").slideDown(300);
  }

  function _get_suspect(id) {
    for (var i = 0; i < this.suspect_list.length; i++) {
      if (this.suspect_list[i].taskid == id) {
        return this.suspect_list[i];
      }
    }
    return null;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 特定号码轨迹
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function load_special() {
    $("#special_number_div").css('display', 'block');
    console.log("spec imsi:" + this.special_imsi_value)
    console.log("spec imei:" + this.special_imei_value)
    if (this.special_imsi_value != undefined) {
      $("#special_imsi").val(this.special_imsi_value);
    } else {
      $("#special_imsi").val("");
    }
    if (this.special_imei_value != undefined) {
      $("#special_imei").val(this.special_imei_value);
    } else {
      $("#special_imei").val("");
    }
  }

  function get_special() {
    var imsi = $("#special_imsi").val();
    // var imsi = 460028026871071;
    // var imsi = "460025731021755";
    var imei = $("#special_imei").val();
    var startime = new Date($("#special_s_time").val()).getTime();
    startime = Math.ceil(startime / 1000);
    var endtime = new Date($("#special_e_time").val()).getTime(); // 一天86400秒
    endtime = Math.ceil(endtime / 1000);
    // var department = this.userobj.Department;
    var department = "1";
    console.log(imsi, imei, startime, endtime, department);

    if (imsi.length != 15) {
      alert("IMSI 是15位纯数字数据");
      return;
    }

    getSpecial(imsi, imei, startime, endtime, department, function(msg) {
      console.log(msg)
      special_init(msg.act_list);
    });
  }

  function special_init(act_list) {
    if (act_list.length == 0) {
      $("#result_text").text("未获取到任何数据");
      return;
    }
    $("#result_text").text("一共获取到" + act_list.length + "条轨迹数据.");

    $("#spec_result").slideUp(300, function() {
      $("#spec_map").empty();
      console.log("localStorage.act_array_str");
      localStorage.act_array_str = JSON.stringify(act_list);
      console.log(localStorage.act_array_str);
      localStorage.map_type = "special_list";
      var map = $("<iframe src='analysis-map.html'></iframe>").appendTo($("#spec_map"));
      map.css("width", "100%");
      map.css("height", "500px");
      $("#spec_result").slideDown(300);
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 修改密码
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function update_pwd() {
    var update_pwd_div = document.getElementById("update_pwd_div");
    update_pwd_div.style.display = "block";
  }

  function change_password() {
    // var pwd_old = $("#pwd_old").val();
    var pwd_new = $("#pwd_new").val();
    var pwd_new_ck = $("#pwd_new_ck").val();

    if (pwd_new != pwd_new_ck) {
      alert("两次密码输入不一致");
      return;
    }
    var user = {
      username: this.userobj.UserName,
      password: pwd_new,
      department: this.userobj.Department,
      creater: "",
      rolename: this.userobj.Role,
      description: ""
    };
    updateUser(user, function(result) {
      if (result == 0) {
        alert("修改成功，请重新登录");
        logout();
      } else {
        alert("修改失败，错误代码：" + result);
      }
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 登出
////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  function logout() {
    localStorage.user = "";
    window.location.href = "login.html"
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
    var currentdate = date.getFullYear() + "年" + month + "月" + strDate + "日" + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒";
    return currentdate;
  }

  function getFormatDatetimeLocal(timestamp) {
    var fmt = "yyyy-MM-ddThh:mm";
    date = new Date(timestamp);
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  function getFormatDatetimeLocalEnd(timestamp) {
    var fmt = "yyyy-MM-dd";
    date = new Date(timestamp);
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    fmt = fmt + "T23:59";
    return fmt;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 接口测试
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function test_interface() {
  setTimeout(function() {
    // get_acts();

    // add_accompany();
    // delete_accompany();
    // update_accompany();
    // get_accompany();
    // exec_accompany();

    // add_suspect();
    // delete_suspect();
    // update_suspect();
    // get_suspect();
    // exec_suspect();
  }, 1000);
}
