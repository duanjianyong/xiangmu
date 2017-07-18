// **********************************************************************
//
// liguangming 2017/06/01 
// 用户操作接口测试代码
// liguangming 2017/06/03
// 新增用户操作接口，增删改查用户，Prx对象由相关页面初始化
//
// **********************************************************************

// 添加用户 -- liguangming
// string username;
// string password;
// string rolename;
// string department;
// string position;
// string tel;
// string email;
// string manager;
// string description;
function addUser(obj, callback) {
  var user = new NetCore.UserInfo(obj.username, obj.password, obj.rolename, obj.department, "", "", "", obj.creater, obj.description);
  var userarray = [];
  userarray.push(user);

  ObjMgtPrx.UpdateUsers(userarray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      callback(result);
    });
}

//删除用户 -- liguangming
function delUser(obj, callback) {
  var user = new NetCore.UserInfo(obj.username, obj.password, obj.rolename, obj.department, "", "", "", obj.creater, obj.description);
  var userarray = [];
  userarray.push(user);
  ObjMgtPrx.UpdateUsers(userarray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      callback(result);
    });
}

//更新用户 -- liguangming
function updateUser(obj, callback) {
  console.log(obj);
  var user = new NetCore.UserInfo(obj.username, obj.password, obj.rolename, obj.department, "", "", "", obj.creater, obj.description);
  var userarray = [];
  userarray.push(user);

  ObjMgtPrx.UpdateUsers(userarray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      callback(result);
    });
}

// 获取用户列表 -- liguangming
function getUsers(username, type, page, pagesize, callback) {
  ObjMgtPrx.GetUsers(username, type, page, pagesize).then(
    function(result, total, users) {
      callback({ result: result, total: total, users: users });
    });
}

// test proxy
function test_proxy() {
  var hostname = document.location.hostname || "127.0.0.1";
  var proxy = communicator.stringToProxy("ObjMgtProvider" +
    ":ws -h " + hostname + " -p 8080 -r /ObjMgtProvider"
  );

  var timeout = $("#timeout").val();
  proxy = proxy.ice_invocationTimeout(timeout > 0 ? timeout : -1);
  proxy = proxy.ice_twoway();
  ObjMgtPrx = NetCore.ObjMgtPrx.uncheckedCast(proxy);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// liguangming 接口测试

// 获取用户列表
function test_get_users(){
  getUsers("sa", 0, 15, function(msg){
    console.log(msg);
  });
}

// 添加用户
function test_add_user(){
  var user = new NetCore.UserInfo("liu", "123456", "Manager", "太原市万柏林区公安分局", "", "", "", "sa");
  addUser(user, function(msg){
    console.log(msg);
  });
}

// 删除用户
function test_delete_user(){
  var user = new NetCore.UserInfo("004", "004", "Analyzer", "004", "", "", "", "sa");
  delUser(user, function(msg){
    console.log(msg);
  });
}

// 更新用户
// PS 只能更新除用户名之外的内容
function test_update_user(){
  var user = new NetCore.UserInfo("liu", "1234567", "Manager", "太原市万柏林区公安分局", "", "", "", "sa");
  updateUser(user, function(msg){
    console.log(msg);
  });
}