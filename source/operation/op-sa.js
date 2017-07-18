window.onload = function() {
  _init_proxy();
  _init_ui();
  _init_bundle();
};

// ui init
function _init_ui() {
  this.userobj = JSON.parse(localStorage.user);
  if (!this.userobj) {
    alert("登录失效");
    window.location.href = "login.html";
  }
  console.log(this.userobj);

  g_ref.sa_menu = "account";
  load_account();
}

// proxy init
function _init_proxy() {
  var communicator = Ice.initialize();
  var hostname = document.location.hostname || "127.0.0.1";
  var proxy = communicator.stringToProxy("ObjMgtProvider" +
    ":ws -h " + hostname + " -p 8080 -r /ObjMgtProvider"
  );

  var timeout = $("#timeout").val();
  proxy = proxy.ice_invocationTimeout(timeout > 0 ? timeout : -1);
  proxy = proxy.ice_twoway();
  ObjMgtPrx = NetCore.ObjMgtPrx.uncheckedCast(proxy);
}

// event bind init
function _init_bundle() {
  this.users = [];
  this.devices = [];

  $("#menu li").click(function() {
    var liname = $(this).attr("name");
    if (g_ref.sa_menu == liname) {
      return;
    }
    var liname_div = document.getElementById(g_ref.sa_menu + "_div");
    liname_div.style.display = "none";
    if (liname == "account") {
      load_account()
    } else if (liname == "device") {
      load_device();
    } else if (liname == "update_pwd") {
      load_pwd();
    } else if (liname == "logout") {
      logout();
    }
    $("#menu li").removeClass("active");
    this.setAttribute('class', "active");
    g_ref.sa_menu = liname;
  });

  $("#add_account").click(function() {
    add_account();
  });

  $("#update_account").click(function() {
    update_account();
  });

  $("#delete_account").click(function() {
    delete_account();
  });

  $("#add_device").click(function() {
    add_device();
  });

  $("#update_device").click(function() {
    update_device();
  });

  $("#delete_device").click(function() {
    delete_device();
  });

  $("#update_pwd_submit").click(function() {
    update_pwd();
  });
}

// 加载系统状态快
function load_system() {
  var system_staus_div = document.getElementById("system_staus_div");
  system_staus_div.style.display = "block";

  //var l_panel=createElement({type:"div",classname:"panel_div",Parentclass:system_staus_div});
  var system_panel_div = document.getElementById("system_panel_div");
  system_panel_div.innerHTML = "" + "<p>运行报告</p>" + "<div class='info_div'>" + "<p>当前开机时间：xxxx年xx月x日 12:00:00</p>" + "<p>当前运行时长：xxxx小时（x年x月x天）</p>" + "<p>总运行时长：xxxxxxxx小时（x年x月x天）</p>" + "</div>" + "<p>数据报告</p>" + "<div class='info_div'>" + "<p>数据记录总数：123,234,345,66条，其中包含IMSI 123,234,330,47个，IMEI 21,331,953,21个</p>" + "<p>黑名单号码：137个</p>" + "<p>共创建分析器：79个 </p>" + "<p>敏感地区号码：1230个 </p>" + "</div>" + "<p>使用报告</p>" + "<div class='info_div'>" + "<p>全系统共中标黑名单号码：xxx次，其中xxx次已反馈，xx次未反馈</p>" + "<p>中标次数最多的车辆是：长风巡逻一号，共79次</p>" + "<p>中标次数最多的月份是2017年3月，共31次</p>" + "</div>" + "<p>环境报告</p>" + "<div class='info_div'>" + "<p>全系统共中标黑名单号码：xxx次，其中xxx次已反馈，xx次未反馈</p>" + "<p>中标次数最多的车辆是：长风巡逻一号，共79次</p>" + "<p>中标次数最多的月份是2017年3月，共31次</p>" + "</div>" + "<p>环境报告</p>"
}

// 加载修改密码块
function load_pwd() {
  var update_pwd_div = document.getElementById("update_pwd_div");
  update_pwd_div.style.display = "block";
}

// 退出登录
function logout() {
  localStorage.user = "";
  window.location.href = "login.html"
}

// 加载管理员账户块
function load_account() {
  localStorage.sa_load = "account";
  var self = this;
  var account_div = document.getElementById("account_div");
  var account_body = document.getElementById("account_body");
  account_div.style.display = "block";
  getUsers(userobj.UserName, 0, 1, 15, function(msg) {
    // console.log(msg);
    refresh_account(msg.users);
    var account_data = msg;
  });
}

// 刷新账户信息列表
function refresh_account(account_data) {
  $("#account_body").empty();
  this.users = account_data;
  for (var i = 0; i < account_data.length; i++) {
    var tr = $("<tr></tr>");
    var checkbox = $("<td><input class='choice' type='checkbox' value='" + account_data[i].username + "'/></td>");
    var username = $("<td></td>").text(account_data[i].username);
    var password = $("<td></td>").text(account_data[i].password);
    var department = $("<td></td>").text(account_data[i].department);
    var role = "";
    if (account_data[i].rolename == "Manager") {
      role = "普通管理员";
    } else if (account_data[i].rolename == "SuperManager") {
      role = "超级管理员";
    } else if (account_data[i].rolename == "Monitor") {
      role = "监控账号";
    } else if (account_data[i].rolename == "Analyzer") {
      role = "分析账号";
    } else {
      role = "未知类型";
    }

    var rolename = $("<td></td>").text(role);
    var description = $("<td></td>").text(account_data[i].description);
    // var change = $("<td><input type='button' value='修改'/></td>");
    var change = $("<td><input class='upuser' type='button' value='修改' id='" + account_data[i].username + "'/></td>");
    tr.append(checkbox, username, password, department, rolename, description, change);
    $("#account_body").append(tr);
  }

  $(".upuser").click(function() {
    console.log($(this).attr("id"));
    $("#account_update").modal('show');

    var user = _get_user($(this).attr("id"));
    if (user == undefined) {
      alert("修改出错, 请刷新重试");
    } else {
      $("#account_name_up").val(user.username);
      $("#account_role_up").val(user.rolename);
      $("#account_department_up").val(user.department);
      $("#account_description_up").val(user.description);
    }
  });
}

// 添加账户
function add_account() {
  // console.log($("#account_name").val());
  // console.log($("#account_role").val());
  // console.log($("#account_department").val());
  // console.log($("#account_password").val());
  // console.log($("#account_password_check").val());
  // console.log($("#account_description").val());
  if ($("#account_name").val().length == 0 ||
    $("#account_role").val().length == 0 ||
    $("#account_department").val().length == 0 ||
    $("#account_password").val().length == 0 ||
    $("#account_password_check").val().length == 0) {
    alert("输入不能为空");
    return;
  }

  if ($("#account_password").val() != $("#account_password_check").val()) {
    alert("密码两次输入不一致，请检查!");
    return;
  }

  var user = {
    username: $("#account_name").val(),
    password: $('#account_password').val(),
    rolename: $('#account_role').val(),
    department: $("#account_department").val(),
    creater: this.userobj.UserName,
    description: $("#account_description").val(),
  }

  addUser(user, function(result) {
    if (result == 0) {
      alert('添加成功!');
    } else {
      alert('添加失败，错误代码：' + result);
    }
    $("#account_add").modal("hide");
    load_account();
  });
}

// 删除账户
function delete_account() {
  // console.log(this.users);
  // console.log();
  for (var i = 0; i < $('.choice').length; i++) {
    if ($('.choice')[i].checked) {
      var user = _get_user($('.choice').eq(i).val())
      if (user != undefined) {
        delUser(user, function(result) {
          if (result == 0) {
            alert("删除成功!");
          } else {
            alert("删除失败, 错误代码:" + result);
          }
          load_account();
        });
      } else {
        alert("删除出错, 请刷新重试");
      }
    }
  }
}

// 修改账户
function update_account() {
  if ($("#account_name_up").val().length == 0 ||
    $("#account_role_up").val().length == 0 ||
    $("#account_department_up").val().length == 0) {
    alert("输入不能为空");
    return;
  }

  var user_old = _get_user($("#account_name_up").val());

  if ($("#account_password_up").val() != $("#account_password_check_up").val()) {
    alert("密码两次输入不一致，请检查!");
    return;
  }

  var password = '';
  if ($("#account_password_up").val().length == 0) {
    password = user_old.password;
  } else {
    password = $("#account_password_up").val();
  }

  var user = {
    username: $("#account_name_up").val(),
    password: password,
    rolename: $('#account_role_up').val(),
    department: $("#account_department_up").val(),
    creater: this.userobj.UserName,
    description: $("#account_description_up").val(),
  }

  updateUser(user, function(result) {
    if (result == 0) {
      alert('修改成功!');
    } else {
      alert('修改失败，错误代码：' + result);
    }
    $("#account_update").modal("hide");
    load_account();
  });
}

// 获取缓存用户信息
function _get_user(username) {
  for (var i = 0; i < this.users.length; i++) {
    if (this.users[i].username == username) {
      return this.users[i];
    }
  }
  return undefined;
}

// 加载设备列表
function load_device() {
  localStorage.sa_load = "device";
  device_div.style.display = "block";
  getDevice(userobj.Role, "", 1, 15, function(msg) {
    // console.log(msg);
    refresh_device(msg.devices);
  });
}

// 刷新设备列表信息
function refresh_device(devices) {
  // for (var i = 0; i < devices.length; i++) {
  //   console.log(devices[i].devid);
  //   console.log(devices[i].devname);
  //   console.log(devices[i].department);
  //   console.log(devices[i].peoincharge);
  //   console.log(devices[i].regtime);
  // }
  // return;

  $("#device_body").empty();
  this.devices = devices;
  for (var i = devices.length - 1; i >= 0; i--) {
    var tr = $("<tr></tr>");
    var checkbox = $("<td><input class='choice_dev' type='checkbox' value='" + devices[i].devid + "'/></td>");
    var devid = $("<td></td>").text(devices[i].devid);
    var devname = $("<td></td>").text(devices[i].devname);
    var department = $("<td></td>").text(devices[i].department);
    var peoincharge = $("<td></td>").text(devices[i].peoincharge);
    var regtime = $("<td></td>").text(devices[i].regtime);
    var change = $("<td><input class='updev' type='button' value='修改' id='" + devices[i].devid + "'/></td>");
    tr.append(checkbox, devid, devname, department, peoincharge, regtime, change);
    $("#device_body").append(tr);
  }

  $(".updev").click(function() {
    console.log($(this).attr("id"));
    $("#update_device_modal").modal('show');

    var device = _get_device($(this).attr("id"));
    if (device == undefined) {
    alert("修改出错, 请刷新重试");
    } else {
    // console.log(device);
      $("#device_id_up").val(device.devid);
      $("#device_name_up").val(device.devname);
      $("#device_department_up").val(device.department);
      $("#device_peoincharge_up").val(device.peoincharge);
      $("#device_regtime_up").val(device.regtime);
    }
  });
}

// 添加设备
function add_device() {
  // console.log($("#device_id").val());
  // console.log($("#device_name").val());
  // console.log($("#device_department").val());
  // console.log($("#device_peoincharge").val());
  // console.log($("#device_regtime").val());

  if ($("#device_id").val().length == 0 ||
    $("#device_name").val().length == 0 ||
    $("#device_department").val().length == 0 ||
    $("#device_peoincharge").val().length == 0 ||
    $("#device_regtime").val().length == 0) {
    alert("输入不能为空");
    return;
  }

  var device = {
    devid: $("#device_id").val(),
    devname: $("#device_name").val(),
    department: $("#device_department").val(),
    peoincharge: $("#device_peoincharge").val(),
    regtime: $("#device_regtime").val(),
  };

  addDevice(device, function(result) {
    if (result == 0) {
      alert("添加成功");
    } else {
      alert("添加失败，错误代码：" + result);
    }
    $("#add_device_modal").modal("hide");
    load_device();
  });
}

// 修改设备
function update_device() {
  if ($("#device_id_up").val().length == 0 ||
    $("#device_name_up").val().length == 0 ||
    $("#device_department_up").val().length == 0 ||
    $("#device_peoincharge_up").val().length == 0 ||
    $("#device_regtime_up").val().length == 0) {
    alert("输入不能为空");
    return;
  }

  var device = {
    devid: $("#device_id_up").val(),
    devname: $("#device_name_up").val(),
    department: $("#device_department_up").val(),
    peoincharge: $("#device_peoincharge_up").val(),
    regtime: $("#device_regtime_up").val(),
  };

  console.log(device);

  updateDevice(device, function(result) {
    if (result == 0) {
      alert('修改成功!');
    } else {
      alert('修改失败，错误代码：' + result);
    }
    $("#update_device_modal").modal("hide");
    load_device();
  });
}

// 删除设备
function delete_device(){
  for (var i = 0; i < $('.choice_dev').length; i++) {
    if ($('.choice_dev')[i].checked) {
      var device = _get_device($('.choice_dev').eq(i).val())
      if (device != undefined) {
        delDevice(device, function(result) {
          if (result == 0) {
            alert("删除成功!");
          } else {
            alert("删除失败, 错误代码:" + result);
          }
          load_device();
        });
      } else {
        alert("删除出错, 请刷新重试");
      }
    }
  }
}

// 获取缓存设备信息
function _get_device(devid) {
  for (var i = 0; i < this.devices.length; i++) {
    if (devid == this.devices[i].devid) {
      return devices[i];
    }
  }
  return undefined;
}

// 更新密码
function update_pwd(){
  var old_pwd = $("#old_pwd").val();
  var new_pwd = $("#new_pwd").val();
  var check_new_pwd = $("#check_new_pwd").val();
  if (old_pwd == "") {
    alert("请输入旧密码!");
    return;
  } else if (new_pwd == "") {
    alert("请输入新密码!");
    return;
  } else if (check_new_pwd == "") {
    alert("请输入确认密码!");
    return;
  } else if (check_new_pwd != new_pwd) {
    alert("新密码跟确认密码不一样!");
    return;
  }

  var me = {
    username: this.userobj.UserName,
    password: new_pwd,
    rolename: this.userobj.Role,
    department: this.userobj.Department,
    creater: "",
    description: "",
  }
  console.log(me);
  // return;

  updateUser(me, function(result){
    if (result == 0) {
      alert("修改密码成功，请重新登录!");
      logout();
    } else {
      alert("修改密码失败，错误代码：" + result);
    }
  });
}

function refresh_window() {
  window.location.reload();
}
