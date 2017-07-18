// **********************************************************************
//
// liguangming 2017/06/01 
// 迁徙图数据操作接口测试代码
// 

// int     starttime,   // 起始绝对时间
// int     endtime,     // 结束绝对时间
// int     type,        // 0:新疆 1：敏感地区 2：国内 3：省内 4：境外
// string  department,  // 所在部门
// **********************************************************************

// 获取迁徙图数据 -- liguangming 
function getMigrate(starttime, endtime, type, department, callback) {
  console.log("st: %d, et:%d, t:%d, d:%s", starttime, endtime, type, department)
  if (!ObjMgtPrx) {
    console.log('ice init failure.');
    return;
  }

  ObjMgtPrx.GetMigrateData(starttime, endtime, type, department).then(
    function(result, migrate_data) {
      console.log('getMigrateData callback');
      callback({ result: result, migrate_data: migrate_data });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 获取迁徙图数据列表测试
function get_migrate_data_test() {
  console.log("get_migrate_data");
  getMigrate(1497119000, 1499119000, 1, "1", function(msg) {
    console.log(msg);
  });
}
