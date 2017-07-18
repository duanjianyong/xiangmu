// **********************************************************************
//
// liguangming 2017/06/03
// 敏感地区数据操作接口测试代码
// 
// 敏感地区
// struct SensArea{
//   string id;
//   string country;
//   string province;
//   string city;
//   string department;
// }
// **********************************************************************

// 获取敏感地区数据
function get_sensitive_test() {
  console.log("get_sensitive");
  getSensitive("SuperManage", "1", 0, 15, function(msg) {
    console.log(msg);
  });
}

// 增加敏感地区数据
function add_sensitive_test() {
  var sensitive = new NetCore.SensArea("1", "中国", "上海市", "上海市", "1");
  console.log("add_sensitive");
  addSensitive(sensitive, function(msg) {
    console.log(msg);
  });
}

// 删除敏感地区数据
function delete_sensitive_test() {
  var sensitive = new NetCore.SensArea("1", "中国", "上海市", "上海市", "1");
  console.log("add_sensitive");
  deleteSensitive(sensitive, function(msg) {
    console.log(msg);
  });
}
// 更新敏感地区数据
function update_sensitive_test() {
  var sensitive = new NetCore.SensArea("1", "中国", "上海市", "上海市改", "1");
  console.log("update_sensitive");
  updateSensitive(sensitive, function(msg) {
    console.log(msg);
  });
}
