window.onload = function() {
    // test_interface();

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
        return;
    } else if (this.userobj.Role != "Manager") {
        // debug
        // alert("您的账户没有管理员的权限!");
        // window.location.href = "login.html";
        // return;
    }

    if (localStorage.approve_state && localStorage.approve_state == 0) {
        $("#approve_all").prop("checked", false);
        $("#approve_reject").prop("checked", true);
        localStorage.approve_state = 0;
    } else {
        $("#approve_all").prop("checked", true);
        $("#approve_reject").prop("checked", false);
        localStorage.approve_state = 2;
    }
    localStorage.page = 1;
    localStorage.pagesize = 15;

    $("#acc-ana-dep").val(this.userobj.Department);
    $("#acc-mon-dep").val(this.userobj.Department);

    // g_ref.admin_menu = "set_sensitive";
    // load_sens();
    
    g_ref.admin_menu = "blacklist";
    load_blacklist();
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
    this.blacklist_array = [];

    // bind menu event
    $("#menu li").click(function() {
        var liname = $(this).attr("name");
        if (g_ref.sa_menu == liname) {
            return;
        }
        var liname_div = document.getElementById(g_ref.admin_menu + "_div");
        liname_div.style.display = "none";
        if (liname == "blacklist") {
            load_blacklist();
        } else if (liname == "set_sensitive") {
            load_sens();
        } else if (liname == "analysis_account") {
            load_analysis_account();
        } else if (liname == "monitor_account") {
            load_monitor_account();
        } else if (liname == "own_info") {
            load_own_info();
        } else if (liname == "logout") {
            logout()
        }

        $("#menu li").removeClass("active");
        this.setAttribute('class', "active");
        g_ref.admin_menu = liname;
    });

    // bind add analysis account button event
    $("#btn-add-analysis-account").click(function() {
        add_analysis_account();
    });

    // bind delete analysis account button event
    $("#del-ayalysis-account").click(function() {
        del_analysis_account();
    });

    // bind update analysis account button event
    $("#up-ana-btn").click(function() {
        update_analysis_account();
    });

    // bind add monitor account button event
    $("#btn-add-mon-account").click(function() {
        add_monitor_account();
    });

    // bind delete monitor account button event
    $("#del-mon-account").click(function() {
        del_monitor_account();
    });

    // bind update monitor account button event
    $("#up-mon-btn").click(function() {
        update_monitor_account();
    });

    // bind blacklist radio button event
    $("input[name=radiotype]").click(function() {
        if (this.value == "all") {
            localStorage.approve_state = 2;
        } else if (this.value == "reject") {
            localStorage.approve_state = 0;
        }
        load_blacklist();
    });

    // bind update sensitive
    $("#add-sens-ac").click(function() {
        add_sens_init();
    });
}

function init() {
    events() //加载事件
    load_log()
    g_ref.admin_menu = "business_log";
    if (localStorage.user) {
        userobj = JSON.parse(localStorage.user);
        if (!userobj) {
            //window.location.href="login.html";
        }
    }
    test_interface();
}

function events() { //事件初始化
    $("#menu li").click(function() {
        var liname = $(this).attr("name");
        if (g_ref.sa_menu == liname) {
            return;
        }
        var liname_div = document.getElementById(g_ref.admin_menu + "_div");
        liname_div.style.display = "none";
        if (liname == "business_log") {
            load_log();
        } else if (liname == "blacklist") {
            load_blacklist();
        } else if (liname == "account") {
            load_account();
        } else if (liname == "own_info") {
            load_own_info();
        } else if (liname == "logout") {
            logout()
        }
        $("#menu li").removeClass("active");
        this.setAttribute('class', "active");
        g_ref.admin_menu = liname;
    });
}

//显示子账户模块
function load_account() {
    var account_div = document.getElementById("account_div");
    account_div.style.display = "block";
}

function load_sens() {
    $("#set_sensitive_div").css('display', 'block');

    get_sensitive(self.userobj.Role, self.userobj.Department, function(msg) {
        console.log(msg);
        refresh_sens(msg.sensitive_data);
    });
}

function refresh_sens(sens_list) {
    var self = this;
    $("#sensitive_list").empty();
    var tab = $("<table></table>").appendTo($("#sensitive_list"));
    tab.attr("class", "sens_list");
    var cap = $("<caption>敏感地区列表</caption>").appendTo(tab);
    var thead = $("<thead></thead>").appendTo(tab);
    $("<th>编号</th>").appendTo(thead);
    $("<th>省份</th>").appendTo(thead);
    $("<th>城市</th>").appendTo(thead);
    $("<th>修改</th>").appendTo(thead);
    $("<th>删除</th>").appendTo(thead);
    var tb = $("<tbody></tbody>").appendTo(tab);
    if (sens_list == null || sens_list.length == 0) {
        $("<tr colspan='4' style='text-align:center;'>空</tr>").appendTo(tb);
    } else {
        window.sens_list = sens_list;
        for (var i = 0; i < sens_list.length; i++) {
            var tr = $("<tr sen_id='" + i + "'></tr>").appendTo(tb);
            $("<td></td>").text(i + 1).appendTo(tr);
            $("<td></td>").text(sens_list[i].province).appendTo(tr);
            $("<td></td>").text(sens_list[i].city).appendTo(tr);
            var td_ac_up = $("<td></td>").appendTo(tr);
            var td_ac_del = $("<td></td>").appendTo(tr);
            var ul_ac_up = $("<ul style='width: 50px; margin: 0 auto;'>").appendTo(td_ac_up);
            var ul_ac_del = $("<ul style='width: 50px; margin: 0 auto;'>").appendTo(td_ac_del);
            var ac_up = $("<li>修改</li>").appendTo(ul_ac_up);
            var ac_del = $("<li>删除</li>").appendTo(ul_ac_del);
            ac_up.click(function() {
                $("#sensitive-modal-up").modal("show");
                var index = $(this).parent().parent().siblings().eq(0).text() - 1;
                up_sens_init(window.sens_list[index]);
            });
            ac_del.click(function() {
                // todo
                var index = $(this).parent().parent().siblings().eq(0).text() - 1;
                console.log(window.sens_list[index]);
                delete_sensitive(window.sens_list[index])
            });
        }
    }
}

function add_sens_init() {
    var prov = $("#sens-prov");
    var city = $("#sens-city");
    prov.empty();
    city.empty();
    getProvince("中国", function(msg) {
        if (msg.result == 1) {
            $("<option></option>").text("").appendTo(prov);
            for (var i = 0; i < msg.items.length; i++) {
                $("<option></option>").text(msg.items[i]).appendTo(prov);
            }
        }
    });

    prov.change(function() {
        city.empty();
        if ($(this).val() != "") {
            getCity("中国", $(this).val(), function(msg) {
                if (msg.result == 1) {
                    $("<option></option>").text("").appendTo(city);
                    for (var i = 0; i < msg.items.length; i++) {
                        $("<option></option>").text(msg.items[i]).appendTo(city);
                    }
                }
            });
        }
    });

    $("#sens-add-ac").off("click").on("click", (function() {
        if (prov.val() == '' || city.val() == '') {
            alert("省份和城市不得为空")
            return;
        } else {
            add_sensitive(prov.val(), city.val(), function(msg) {
                if (msg.result == 0) {
                    alert("添加成功");
                    $("#sensitive-modal").modal("hide");
                    load_sens();
                }
            });
        }
    }));
}

function add_sensitive(prov, city, callback) {
    var sens_id = new UUID().id;
    var sens = {
        id: sens_id,
        country: "中国",
        province: prov,
        city: city,
        department: this.userobj.Department,
    }
    console.log(sens);
    addSensitive(sens, callback);
}

function up_sens_init(sens) {
    var prov = $("#sens-prov-up");
    var city = $("#sens-city-up");
    var id = sens.id;
    var self = this;

    prov.empty();
    city.empty();

    getProvince("中国", function(msg) {
        if (msg.result == 1) {
            $("<option></option>").text("").appendTo(prov);
            for (var i = 0; i < msg.items.length; i++) {
                $("<option></option>").text(msg.items[i]).appendTo(prov);
            }
        }
        prov.val(sens.province);
    });

    getCity("中国", sens.province, function(msg) {
        if (msg.result == 1) {
            $("<option></option>").text("").appendTo(city);
            for (var i = 0; i < msg.items.length; i++) {
                $("<option></option>").text(msg.items[i]).appendTo(city);
            }
        }
        city.val(sens.city);
    });

    prov.change(function() {
        city.empty();
        if ($(this).val() != "") {
            getCity("中国", $(this).val(), function(msg) {
                if (msg.result == 1) {
                    $("<option></option>").text("").appendTo(city);
                    for (var i = 0; i < msg.items.length; i++) {
                        $("<option></option>").text(msg.items[i]).appendTo(city);
                    }
                }
            });
        }
    });


    $("#sens-up-ac").off("click").on("click", function() {
        sens.province = prov.val();
        sens.city = city.val();
        sens.department = self.userobj.Department;
        console.log(sens);
        updateSensitive(sens, function(msg) {
            if (msg.result == 0) {
                alert("修改成功");
            } else {
                alert("修改失败，错误代码：" + msg.result);
            }
        });
    });
}

function delete_sensitive(sens) {
    sens.department = this.userobj.Department;
    deleteSensitive(sens, function(msg) {
        if (msg.result == 0) {
            alert("删除成功");
        } else {
            alert("删除失败，错误代码：" + msg.result);
        }
        load_sens();
    });
}

function get_sensitive(role, department, callback) {
    getSensitive(role, department, 0, 15, callback);
}

//个人信息块
function load_own_info() {
    var own_info_div = document.getElementById("own_info_div");
    own_info_div.style.display = "block";
}

//点击修改活着删除处理函数
function process(val) {
    for (var i = 0; i < blacklist_array.length; i++) {
        if (val == i) {
            if (blacklist_array[i].approved) {
                //blacklist_array[i].approved=0;
                delblack(blacklist_array[i], function(msg) {
                    load_blacklist();
                })
            } else {
                blacklist_array[i].approved = 1;
                updateblack(blacklist_array[i], function(msg) {
                    load_blacklist();
                })
            }

        }
    }
}

//加载日志模块
function load_log() {
    var business_log_div = document.getElementById("business_log_div");
    business_log_div.style.display = "block";
    var log_panel_div = document.getElementById("log_panel_div");
    log_panel_div.innerHTML = "";

    var select_div = createElement({ type: "div", Parentclass: log_panel_div });
    var office = createElement({ type: "select", Parentclass: select_div });

    office.innerHTML = "" + "<option>全部</option>" + "<option>长风派出所</option>" + "<option>天鸿派出所</option>" + "<option>一号派出所</option>"
    var car = createElement({ type: "select", Parentclass: select_div });
    car.innerHTML = "" + "<option>默认</option>" + "<option>长江一号</option>" + "<option>黄江二号</option>"

    var img = createElement({ type: "img", style: "width:30px;", Parentclass: select_div });
    img.src = "style/img/u20.png";
    var ul = createElement({ type: "ul", Parentclass: log_panel_div });
    logs(ul);
    logs(ul);
    logs(ul);

    var floor_div = createElement({ type: "div", style: "height:40px;margin:0px auto;", Parentclass: log_panel_div })
    // <ul class="page" maxshowpageitem="3" pagelistcount="5"  id="page"></ul>
    var floor_ul = createElement({ type: "div", classname: "page", id: "page", Parentclass: floor_div });
    $(floor_ul).initPage(81, 2, function(val) {

    });
}

//日志详情
function logs(obj) {
    var log_div = createElement({ type: "li", classname: "li_s", Parentclass: obj });
    log_div.innerHTML = "预警ID:000389   时间：2017.3.22 15:39:13  巡逻车：兴华巡逻一号 代班领导：梁东红  手机号码：672175  反馈状态：未反馈";
    var span = createElement({ type: "span", style: "float:right", Parentclass: log_div });
    span.innerHTML = "展开";
    var i = createElement({ type: "i", classname: "triangle-down", Parentclass: span });

    var Details = createElement({ type: "div", classname: "Details", style: "display:none", Parentclass: log_div });

    var Details_img = createElement({ type: "div", style: "float:left;margin:0px 5px;", Parentclass: Details });
    Details_img.innerHTML = "<img src='style/img/fanren.png'/>"

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

//退出登录
function logout() {
    localStorage.user = "";
    window.location.href = "login.html"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 分析账户
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_analysis_account() {
    $("#analysis_account_div").css("display", "block");
    getUsers(this.userobj.UserName, 1, 1, 15, function(msg) {
        console.log(msg);
        refresh_analysis_account(msg.users);
    });
}

function refresh_analysis_account(users) {
    var body = $("#ana-acc-body");
    body.empty();
    this.ana_users = users;
    for (var i = 0; i < users.length; i++) {
        var tr = $("<tr></tr>");
        var checkbox = $("<td><input class='analysis-choice' type='checkbox' value='" + users[i].username + "'/></td>");
        var username = $("<td></td>").text(users[i].username);
        var password = $("<td></td>").text(users[i].password);
        var department = $("<td></td>").text(users[i].department);
        var role = "";
        if (users[i].rolename == "Manager") {
            role = "普通管理员";
        } else if (users[i].rolename == "SuperManager") {
            role = "超级管理员";
        } else if (users[i].rolename == "Monitor") {
            role = "监控账户";
        } else if (users[i].rolename == "Analyzer") {
            role = "分析账户";
        } else {
            role = "未知类型";
        }

        var rolename = $("<td></td>").text(role);
        var description = $("<td></td>").text(users[i].description);
        // var change = $("<td><input type='button' value='修改'/></td>");
        var change = $("<td><input class='up-ana' type='button' value='修改' id='" + users[i].username + "'/></td>");
        tr.append(checkbox, username, department, rolename, password, description, change);
        body.append(tr);
    }

    // 添加修改btn的点击事件处理
    $(".up-ana").click(function() {
        console.log($(this).attr("id"));
        $("#up-ana-modal").modal('show');

        var user = _get_ana_users($(this).attr("id"));
        if (user == undefined) {
            alert("修改出错, 请刷新重试");
        } else {
            $("#acc-ana-name-up").val(user.username);
            $("#acc-ana-role-up").val(user.rolename);
            $("#acc-ana-dep-up").val(user.department);
            $("#acc-ana-desc-up").val(user.description);
        }
    });
}

function add_analysis_account() {
    if ($("#acc-ana-name").val().length == 0 ||
        $("#acc-ana-role").val().length == 0 ||
        $("#acc-ana-dep").val().length == 0 ||
        $("#acc-ana-pwd").val().length == 0 ||
        $("#acc-ana-pwd-ck").val().length == 0) {
        alert("输入不能为空");
        return;
    }

    if ($("#acc-ana-pwd").val() != $("#acc-ana-pwd-ck").val()) {
        alert("密码两次输入不一致，请检查!");
        return;
    }

    var user = {
        username: $("#acc-ana-name").val(),
        password: $('#acc-ana-pwd').val(),
        rolename: $('#acc-ana-role').val(),
        department: $("#acc-ana-dep").val(),
        creater: this.userobj.UserName,
        description: $("#acc-ana-desc").val(),
    }

    console.log(user);

    addUser(user, function(result) {
        if (result == 0) {
            alert('添加成功!');
        } else {
            alert('添加失败，错误代码：' + result);
        }
        $("#add-analysis-account").modal("hide");
        load_analysis_account();
    });
}

function del_analysis_account() {
    var list = $('.analysis-choice');
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
            var user = _get_ana_users(list.eq(i).val());
            if (user != undefined) {
                // 管理员删除账户时，必须填充创建者内容
                user.creater = this.userobj.UserName;
                console.log(user);
                delUser(user, function(result) {
                    if (result == 0) {
                        alert("删除成功!");
                    } else {
                        alert("删除失败, 错误代码:" + result);
                    }
                });
            } else {
                alert("删除出错, 请刷新重试");
            }
        }
    }
    load_analysis_account();
}

function update_analysis_account() {
    if ($("#acc-ana-name-up").val().length == 0 ||
        $("#acc-ana-role-up").val().length == 0 ||
        $("#acc-ana-dep-up").val().length == 0) {
        alert("输入不能为空");
        return;
    }

    var user_old = _get_ana_users($("#acc-ana-name-up").val());

    if ($("#acc-ana-pwd-up").val() != $("#acc-ana-pwd-ck-up").val()) {
        alert("密码两次输入不一致，请检查!");
        return;
    }

    var password = '';
    if ($("#acc-ana-pwd-up").val().length == 0) {
        password = user_old.password;
    } else {
        password = $("#acc-ana-pwd-up").val();
    }

    var user = {
        username: $("#acc-ana-name-up").val(),
        password: password,
        rolename: $('#acc-ana-role-up').val(),
        department: $("#acc-ana-dep-up").val(),
        creater: this.userobj.UserName,
        description: $("#acc-ana-desc-up").val(),
    }

    updateUser(user, function(result) {
        if (result == 0) {
            alert('修改成功!');
        } else {
            alert('修改失败，错误代码：' + result);
        }
        $("#up-ana-modal").modal("hide");
        load_analysis_account();
    });
}

function _get_ana_users(username) {
    for (var i = 0; i < this.ana_users.length; i++) {
        if (this.ana_users[i].username == username) {
            return this.ana_users[i];
        }
    }
    return undefined;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 监控账户
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_monitor_account() {
    $("#monitor_account_div").css("display", "block");
    getUsers(this.userobj.UserName, 2, 1, 15, function(msg) {
        console.log(msg);
        refresh_monitor_account(msg.users);
    });
}

function refresh_monitor_account(users) {
    var body = $("#mon-acc-body");
    body.empty();
    this.mon_users = users;
    for (var i = 0; i < users.length; i++) {
        var tr = $("<tr></tr>");
        var checkbox = $("<td><input class='monitor-choice' type='checkbox' value='" + users[i].username + "'/></td>");
        var username = $("<td></td>").text(users[i].username);
        var password = $("<td></td>").text(users[i].password);
        var department = $("<td></td>").text(users[i].department);
        var role = "";
        if (users[i].rolename == "Manager") {
            role = "普通管理员";
        } else if (users[i].rolename == "SuperManager") {
            role = "超级管理员";
        } else if (users[i].rolename == "Monitor") {
            role = "监控账户";
        } else if (users[i].rolename == "Analyzer") {
            role = "分析账户";
        } else {
            role = "未知类型";
        }

        var rolename = $("<td></td>").text(role);
        var description = $("<td></td>").text(users[i].description);
        // var change = $("<td><input type='button' value='修改'/></td>");
        var change = $("<td><input class='up-mon' type='button' value='修改' id='" + users[i].username + "'/></td>");
        tr.append(checkbox, username, department, rolename, password, description, change);
        body.append(tr);
    }

    // 添加修改btn的点击事件处理
    $(".up-mon").click(function() {
        console.log($(this).attr("id"));
        $("#up-mon-modal").modal('show');

        var user = _get_mon_users($(this).attr("id"));
        if (user == undefined) {
            alert("修改出错, 请刷新重试");
        } else {
            $("#acc-mon-name-up").val(user.username);
            $("#acc-mon-role-up").val(user.rolename);
            $("#acc-mon-dep-up").val(user.department);
            $("#acc-mon-desc-up").val(user.description);
        }
    });
}

function add_monitor_account() {
    if ($("#acc-mon-name").val().length == 0 ||
        $("#acc-mon-role").val().length == 0 ||
        $("#acc-mon-dep").val().length == 0 ||
        $("#acc-mon-pwd").val().length == 0 ||
        $("#acc-mon-pwd-ck").val().length == 0) {
        alert("输入不能为空");
        return;
    }

    if ($("#acc-mon-pwd").val() != $("#acc-mon-pwd-ck").val()) {
        alert("密码两次输入不一致，请检查!");
        return;
    }

    var user = {
        username: $("#acc-mon-name").val(),
        password: $('#acc-mon-pwd').val(),
        rolename: $('#acc-mon-role').val(),
        department: $("#acc-mon-dep").val(),
        creater: this.userobj.UserName,
        description: $("#acc-mon-desc").val(),
    }

    console.log(user);

    addUser(user, function(result) {
        if (result == 0) {
            alert('添加成功!');
        } else {
            alert('添加失败，错误代码：' + result);
        }
        $("#add-mon-modal").modal("hide");
        load_monitor_account();
    });
}

function del_monitor_account() {
    var list = $('.monitor-choice');
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
            var user = _get_mon_users(list.eq(i).val());
            if (user != undefined) {
                // 管理员删除账户时，必须填充创建者内容
                user.creater = this.userobj.UserName;
                console.log(user);
                delUser(user, function(result) {
                    if (result == 0) {
                        alert("删除成功!");
                    } else {
                        alert("删除失败, 错误代码:" + result);
                    }
                });
            } else {
                alert("删除出错, 请刷新重试");
            }
        }
    }
    load_monitor_account();
}

function update_monitor_account() {
    if ($("#acc-mon-name-up").val().length == 0 ||
        $("#acc-mon-role-up").val().length == 0 ||
        $("#acc-mon-dep-up").val().length == 0) {
        alert("输入不能为空");
        return;
    }

    var user_old = _get_mon_users($("#acc-mon-name-up").val());

    if ($("#acc-mon-pwd-up").val() != $("#acc-mon-pwd-ck-up").val()) {
        alert("密码两次输入不一致，请检查!");
        return;
    }

    var password = '';
    if ($("#acc-mon-pwd-up").val().length == 0) {
        password = user_old.password;
    } else {
        password = $("#acc-mon-pwd-up").val();
    }

    var user = {
        username: $("#acc-mon-name-up").val(),
        password: password,
        rolename: $('#acc-mon-role-up').val(),
        department: $("#acc-mon-dep-up").val(),
        creater: this.userobj.UserName,
        description: $("#acc-mon-desc-up").val(),
    }

    updateUser(user, function(result) {
        if (result == 0) {
            alert('修改成功!');
        } else {
            alert('修改失败，错误代码：' + result);
        }
        $("#up-mon-modal").modal("hide");
        load_monitor_account();
    });
}

function _get_mon_users(username) {
    for (var i = 0; i < this.mon_users.length; i++) {
        if (this.mon_users[i].username == username) {
            return this.mon_users[i];
        }
    }
    return undefined;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 黑名单
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_blacklist() {
    console.log("approve_state: " + localStorage.approve_state);

    $("#blacklist_div").css("display", "block");
    // console.log('load_blacklist');
    getBlacklist(this.userobj.Role, this.userobj.Department, localStorage.page, localStorage.pagesize, localStorage.approve_state, function(msg) {
        $("#blacklist_page").initPage(msg.total, localStorage.page, function(val) {
            // console.log(val);
            localStorage.page = val;
            load_blacklist_page();
            // refresh_blacklist(msg.blacklist)
        });
    });
}

function load_blacklist_page() {
    getBlacklist(this.userobj.Role, this.userobj.Department, localStorage.page, localStorage.pagesize, localStorage.approve_state, function(msg) {
        if (msg.total && msg.total > 0) {
            refresh_blacklist(msg.blacklist);
        }
    });
}



function refresh_blacklist(blacklist) {
    $("#black_list").empty();
    this.blacklist = blacklist;
    console.log(blacklist);

    for (var i = 0; i < blacklist.length; i++) {
        var tr = $("<tr></tr>");
        var index = $("<td></td>").text(i + 1);
        var imsi = $("<td></td>").text(blacklist[i].imsi);
        var imei = $("<td></td>").text(blacklist[i].imeiesn);
        var name = $("<td></td>").text(blacklist[i].name);
        var id = $("<td></td>").text(blacklist[i].ID);
        var crimtype = $("<td></td>").text(blacklist[i].crimtype);
        var briefinfo = $("<td></td>").text(blacklist[i].briefinfo);
        var submitter = $("<td></td>").text(blacklist[i].submitter);
        var set = $("<td></td>");
        console.log(blacklist[i].approved);
        if (blacklist[i].approved == 0) {
            var btn = $("<input type='button' value='批准' class='acc_bl_action' id='" + blacklist[i].imsi + "'></input>").appendTo(set);
        } else {
            var btn = $("<input type='button' value='删除' class='del_bl_action' id='" + blacklist[i].imsi + "'></input>").appendTo(set);
        }
        tr.append(index, imsi, imei, name, id, crimtype, briefinfo, submitter, set);
        $("#black_list").append(tr);
    }

    $(".del_bl_action").click(function() {
        var blacklist = _get_blacklist($(this).attr('id'));
        deleteBlacklist(blacklist, function(result) {
            console.log(result);
            if (result == 0) {
                alert('删除成功！');
            } else {
                alert('删除失败，错误代码:' + result);
            }
            load_blacklist();
        });
    });

    $(".acc_bl_action").click(function() {
        var blacklist = _get_blacklist($(this).attr('id'));
        blacklist.approved = 1;
        updateBlacklist(blacklist, function(result) {
            console.log(result);
            if (result == 0) {
                alert("批准成功");
            } else {
                alert("批准失败，错误代码：" + result);
            }
            $("#black_add").modal('hide');
            load_blacklist();
        });
    });
}

function update_blacklist(imsi) {
    var blacklist = _get_blacklist(imsi);
    blacklist.approved = 1;
    blacklist.submittime = getNowFormatDate();
    updateBlacklist(blacklist, function(result) {
        console.log(result);
        if (result == 0) {
            alert("批准成功");
        } else {
            alert("批准失败，错误代码：" + result);
        }
        $("#black_add").modal('hide');
        load_blacklist();
    });
}

function delete_blacklist(imsi) {
    var blacklist = _get_blacklist(imsi);
    deleteBlacklist(blacklist, function(result) {
        console.log(result);
        if (result == 0) {
            alert("删除成功");
        } else {
            alert("删除失败，错误代码：" + result);
        }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 工具函数
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 接口测试
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function test_interface() {
    setTimeout(function() {
        // add_blacklist();
        // update_blacklist();
        get_blacklist();
    }, 1000);
}