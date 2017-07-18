///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// struct SensArea    //敏感地区
// {
//  string           id;
//  string           country;
//  string           province;
//  string           city;
//  string           department;
// };
// sequence<SensArea> SensAreaSeq;
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// 获取敏感地区 -- liguangming
function getSensitive(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetSensAreas(role, department, page, pagesize).then(
  // ObjMgtPrx.GetSensAreas(role, "1", page, pagesize).then(
    function(result, total, sensitive_data) {
      console.log('getSensitive callback');
      callback({ result: result, total: total, sensitive_data: sensitive_data });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 增加敏感地区 -- liguangming
function addSensitive(obj, callback) {
  var sens = new NetCore.SensArea(obj.id, obj.country, obj.province, obj.city, obj.department);
  var areaarray = [];
  areaarray.push(sens);

  ObjMgtPrx.UpdateSensAreas(areaarray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      console.log('addSensitive callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 删除敏感地区 -- liguangming
function deleteSensitive(obj, callback) {
  var sens = new NetCore.SensArea(obj.id, obj.country, obj.province, obj.city, obj.department);
  // var sens = new NetCore.SensArea(obj.id, obj.country, obj.province, obj.city, "1");
  var areaarray = [];
  areaarray.push(sens);

  ObjMgtPrx.UpdateSensAreas(areaarray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      console.log('deleteSensitive callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 更新敏感地区 -- liguangming
function updateSensitive(obj, callback) {
  var sens = new NetCore.SensArea(obj.id, obj.country, obj.province, obj.city, obj.department);
  var areaarray = [];
  areaarray.push(sens);

  ObjMgtPrx.UpdateSensAreas(areaarray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      console.log('updateSensitive callback');
      callback({ result: result });
    },
    function(exception, result) {
      console.log(exception);
    });
}
