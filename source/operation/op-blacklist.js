// **********************************************************************
//
// liguangming 2017/06/01 
// 黑名单操作接口测试代码
//
// BlackList object struct
// string  imsi;
// string  imeiesn;
// string  name;             //姓名
// string  ID;               //身份证号
// string  crimtype;         //布控类型
// string  briefinfo;        //简要案情
// string  submitter;        //提交人
// string  submittime;       //提交时间
// int     approved;         //是否批准：0否 1是
// string  department;       //部门
// 
// **********************************************************************

// 黑名单状态
var approve_state = {
  reject: 0, // 拒绝
  accept: 1, // 允许
  all: 2, // 所有
}


// 添加黑名单列表 -- liguangming
function addBlacklist(obj, callback) {
  var blacklist = new NetCore.BlackList(obj.imsi,
    obj.imei,
    obj.name,
    obj.ID,
    obj.crimtype,
    obj.briefinfo,
    obj.submitter,
    obj.submittime,
    0,
    obj.department);
  var blacklistarray = [];
  blacklistarray.push(blacklist);
  console.log(blacklistarray);
  ObjMgtPrx.UpdateBlackList(blacklistarray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      callback(result);
    });
}

// 删除黑名单列表 -- liguangming
function deleteBlacklist(obj, callback) {
  var blacklist = new NetCore.BlackList(obj.imsi,
    obj.imeiesn,
    obj.name,
    obj.ID,
    obj.crimtype,
    obj.briefinfo,
    obj.submitter,
    obj.submittime,
    obj.approved,
    obj.department);
  var blacklistarray = [];
  blacklistarray.push(blacklist);
  // console.log(blacklistarray);
  ObjMgtPrx.UpdateBlackList(blacklistarray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      callback(result);
    });
}

// 更新黑名单列表 -- liguangming
function updateBlacklist(obj, callback) {
  var blacklistarray = [];
  blacklistarray.push(obj);
  ObjMgtPrx.UpdateBlackList(blacklistarray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      callback(result);
    });
}

// 获取黑名单列表 -- liguangming
function getBlacklist(role, department, page, pagesize, status, callback) {
  ObjMgtPrx.GetBlackList(role, department, page, pagesize, status).then(
    function(result, total, blacklist) {
      callback({ result: result, total: total, blacklist: blacklist });
    });
}

// 获取全部黑名单列表 -- liguangming
function getBlacklistAll(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetBlackList(role, department, page, pagesize, approve_state.all).then(
    function(result, total, blacklist) {
      callback({ result: result, total: total, blacklist: blacklist });
    });
}

// 获取已审批黑名单列表 -- liguangming
function getBlacklistAccept(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetBlackList(role, department, page, pagesize, approve_state.accept).then(
    function(result, total, blacklist) {
      callback({ result: result, total: total, blacklist: blacklist });
    });
}

// 获取未审批黑名单列表 -- liguangming
function getBlacklistReject(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetBlackList(role, department, page, pagesize, approve_state.reject).then(
    function(result, total, blacklist) {
      callback({ result: result, total: total, blacklist: blacklist });
    });
}

// 获取黑名单列表
function get_blacklist_test() {
  getBlacklist("SuperManager", "1", 0, 15, approve_state.all, function(msg) {
    console.log(msg);
  });
}

// 添加黑名单
function add_blacklist_test() {
  var blacklist = new NetCore.BlackList(imei, imei, imei, imei, imei, imei, imei, "2017年6月1日 16:26", "true", "太原市万柏林区公安分局");
  addBlacklist(blacklist, function(msg) {
    console.log(msg);
  });
}

// 删除黑名单
function delete_blacklist_test() {
  var blacklist = new NetCore.BlackList("IMEI133133133", "IMEISN133133133", "张三", "ID133133133", "入室盗窃", "简单介绍", "黑猫警长", "2017年6月1日 16:26", "true", "太原市万柏林区公安分局");
  deleteBlacklist(blacklist, function(msg) {
    console.log(msg);
  });
}

// 修改黑名单
function update_blacklist_test() {
  var blacklist = new NetCore.BlackList("IMEI133133133", "IMEISN133133133", "张三修改", "ID133133133", "入室盗窃", "简单介绍", "黑猫警长", "2017年6月1日 16:26", "true", "太原市万柏林区公安分局");
  updateBlacklist(blacklist, function(msg) {
    console.log(msg);
  });
}
