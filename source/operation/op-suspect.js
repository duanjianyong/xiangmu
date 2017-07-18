// **********************************************************************
//
// liguangming 2017/06/02 
// 嫌疑号码操作接口测试代码
//
// **********************************************************************

// 获取疑似号码分析结果 -- liguangming
function execSuspect(department, imsi, imei, startime, endtime, callback) {
  console.log(department, imsi, imei, startime, endtime);
  ObjMgtPrx.GetSuspectTarget(department, imsi, imei, startime, endtime).then(
    function(result, exec_result) {
      console.log('execSuspect callback');
      console.log(result);
      console.log(exec_result);
      callback({ result: result, exec_result: exec_result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 获取疑似号码分析器列表 -- liguangming
function getSuspect(obj, callback){
  ObjMgtPrx.GetSuspectTask(obj.username, obj.department).then(
    function(result, suspect_list) {
      console.log('getSuspect callback');
      callback({ result: result, suspect_list: suspect_list });
    },
    function(exception, result) {
      console.log(exception);
    });
}

/*
  string  taskid;
  string  taskname;
  string  username;
  string  department;
  double  startime;
  double  endtime;
  string  imsi;            
  string  imei;
*/
// 增加疑似号码分析器 -- liguangming
function addSuspect(obj, callback){
  var suspect = new NetCore.SuspectTask(obj.taskid, obj.taskname, obj.username, obj.department, obj.startime, obj.endtime, obj.imsi, obj.imei);
  var suspectarray = [];
  suspectarray.push(suspect);

  ObjMgtPrx.UpdateSuspectTask(suspectarray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      // console.log('addSuspect callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 删除疑似号码分析器 -- liguangming
function deleteSuspect(obj, callback){
  var suspect = new NetCore.SuspectTask(obj.taskid, obj.taskname, obj.username, obj.department, obj.startime, obj.endtime, obj.imsi, obj.imei);
  var suspectarray = [];
  suspectarray.push(suspect);

  ObjMgtPrx.UpdateSuspectTask(suspectarray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      console.log('deleteSuspect callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 更新疑似号码分析器 -- liguangming
function updateSuspect(obj, callback){
  var suspect = new NetCore.SuspectTask(obj.taskid, obj.taskname, obj.username, obj.department, obj.startime, obj.endtime, obj.imsi, obj.imei);
  var suspectarray = [];
  suspectarray.push(suspect);

  ObjMgtPrx.UpdateSuspectTask(suspectarray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      console.log('updateSuspect callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 获取疑似号码分析结果
function exec_suspect_test(){
  console.log("get_subpects");
  execSuspect("1", "460028026871071", "460028026871071", 1497119000, 1499119000, function(msg) {
    console.log(msg);
  });
}

// 添加疑似号码分析器
function add_suspect_test(){
  console.log("add_suspect");
  var suspect = new NetCore.SuspectTask("1", "疑似号码分析器-1", "llb", "1", 1497119000, 1499119000, "460028026871071", "460028026871071");
  addSuspect(suspect, function(msg){
    console.log(msg);
  });
}

// 获取疑似号码分析器列表
function get_suspect_test(){
  console.log("get_suspect");
  getSuspect("llb", "1", function(msg){
    console.log(msg);
  });
}

// 删除疑似号码分析器
function delete_suspect_test(){
  console.log("delete_suspect");
  var suspect = new NetCore.SuspectTask("1", "疑似号码分析器-1改改", "llb", "1", 1497119000, 1499119000, "460028026871071", "460028026871071");
  deleteSuspect(suspect, function(msg){
    console.log(msg);
  });
}

function update_suspect_test(){
  console.log("update_suspect");
  var suspect = new NetCore.SuspectTask("1", "疑似号码分析器-1改改", "llb", "1", 1497119000, 1499119000, "460028026871071", "460028026871071");
  updateSuspect(suspect, function(msg){
    console.log(msg);
  });
}