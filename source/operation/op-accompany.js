// **********************************************************************
//
// liguangming 2017/06/01 
// 伴随号码操作接口测试代码
// 
//  struct AccompTask        //存储伴随号码任务信息
// {
//   string     taskid;
//   string     taskname;
//   string     username;
//   string     department;
//   double     startime;
//   double     endtime;
//   string     addrs;         //json string
// }; 
// **********************************************************************

/* 
获取伴随号码分析器执行结果 -- liguangming
obj { 
  department, 
  imsi, 
  imei, 
  startime, 
  endtime, 
  addrs
}
struct AddrArea
{
  double     dwlng;
  double     uplng;
  double     dwlat;
  double     uplat;      
};
*/
function execAccompany(obj, callback) {
  var addrs = JSON.parse(obj.addrs);
  var addrarea = []
  for (var i = 0; i < addrs.length; i++) {
    // 修改传入参数值顺序错误的BUG 20170621 start
    // var addr = new NetCore.AddrArea(addrs[i].dwlat,addrs[i].dwlng,addrs[i].uplat,addrs[i].uplng)
    var addr = new NetCore.AddrArea(addrs[i].dwlng,addrs[i].uplng,addrs[i].dwlat,addrs[i].uplat)
    // 修改传入参数值顺序错误的BUG 20170621 end
    addrarea.push(addr);
  }
  ObjMgtPrx.GetAccompTarget(obj.department, obj.imsi, obj.imei, obj.startime, obj.endtime, addrarea).then(
    function(result, act_list) {
      console.log('getAccompany callback');
      callback({ result: result, act_list: act_list });
    },
    function(exception, result) {
      console.log(exception);
    });
}

/*
获取伴随号码分析历史记录 -- liguangming
param
obj {
  username,
  department
}
*/
function getAccompany(obj, callback) {
  console.log(obj);
  ObjMgtPrx.GetAccompTask(obj.username, obj.department).then(
    function(result, accompany_list) {
      console.log('getAccompany callback');
      callback({ result: result, accompany_list: accompany_list });
    },
    function(exception, result) {
      console.log(exception);
    });
}
 
/*
新增伴随号码分析 -- liguangming
obj {
  taskid,
  taskname,
  username,
  department,
  startime,
  endtime,
  addrs
}
*/
function addAccompany(obj, callback) {
  var accompany = new NetCore.AccompTask(obj.taskid, 
    obj.taskname, 
    obj.username, 
    obj.department, 
    obj.startime, 
    obj.endtime, 
    obj.imsi, 
    "",  // TODO 暂时先传空的IMEI，后面再改
    obj.addrs);
  var accompanyarray = [];
  accompanyarray.push(accompany);

  console.log(accompany);
  ObjMgtPrx.UpdateAccompTask(accompanyarray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      console.log('addAccompany callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 删除伴随号码分析 -- liguangming
function deleteAccompany(obj, callback) {
  var accompanyarray = [];
  accompanyarray.push(obj);

  ObjMgtPrx.UpdateAccompTask(accompanyarray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      console.log("deleteAccompany callback");
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 更新伴随号码分析 -- liguangming
function updateAccompany(obj, callback) {
  var accompany = new NetCore.AccompTask(obj.taskid, 
    obj.taskname, 
    obj.username, 
    obj.department, 
    obj.startime, 
    obj.endtime, 
    obj.imsi, 
    "",  // TODO 暂时先传空的IMEI，后面再改
    obj.addrs);
  var accompanyarray = [];
  accompanyarray.push(accompany);
  
  ObjMgtPrx.UpdateAccompTask(accompanyarray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      console.log("updateAccompany callback");
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 获取伴随号码分析器执行结果
function exec_accompany_test() {
  console.log("get_accompany");
  var addr = new NetCore.AddrArea(112.4, 112.5, 37.8, 37.9);
  var addrs = [];
  addrs.push(addr);
  execAccompany("", "460028026871071", "460028026871071", 1497119000, 1499119000, addrs, function(msg) {
    console.log(msg);
  });
}

// 获取伴随号码分析历史记录
function get_accompany_test() {
  console.log("get_accompany");
  // return;
  getAccompany("llb", "1", function(msg) {
    console.log(msg);
  });
}

// 增加伴随号码分析器
function add_accompany_test() {
  console.log("add_accompany");
  var addr = { "lng_start": 112.4, "lng_end": 112.5, "lat_start": 37.8, "lat_end": 37.9 };
  var addrs = [addr, addr, addr];
  // console.log(JSON.stringify(addrs));
  // return;
  var accompany = new NetCore.AccompTask("1", "伴随号码分析器-1", "llb", "1", 1497119000, 1499119000, JSON.stringify(addrs));
  addAccompany(accompany, function(msg) {
    console.log(msg);
  });
}

// 删除伴随号码分析器
function delete_accompany_test() {
  console.log("delete_accompany");
  var accompany = new NetCore.AccompTask("1", "伴随号码分析器-1改", "llb", "1", -858993460, -858993460, '{"lng_start": 112.4, "lng_end": 112.5, "lat_start": 37.8, "lat_end": 37.9}');
  deleteAccompany(accompany, function(msg) {
    console.log(msg);
  });
}

// 删除伴随号码分析器
function update_accompany_test() {
  console.log("update_accompany");
  var addr = { "lng_start": 112.4, "lng_end": 112.5, "lat_start": 37.8, "lat_end": 37.9 };
  var addrs = [addr, addr, addr];
  var accompany = new NetCore.AccompTask("1", "伴随号码分析器-1改", "llb", "1", 1497119000, 1499119000, JSON.stringify(addrs));
  updateAccompany(accompany, function(msg) {
    console.log(msg);
  });
}
