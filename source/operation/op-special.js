// **********************************************************************
//
// liguangming 2017/06/01 
// 特定号码操作接口测试代码
//
// **********************************************************************

// 获取特定号码轨迹 -- liguangming
function getSpecial(imsi, imei, startime, endtime, department, callback) {
  console.log('getActPositions');
  ObjMgtPrx.GetActPath(imsi, imei, startime, endtime, department).then(
    function(result, act_list) {
      console.log('getActPositions callback');
      callback({ result: result, act_list: act_list });
    },
    function(exception, result) {
      console.log(exception);
    });
}

// 获取特定号码轨迹结果
function get_acts_test(){
  console.log("get_acts");
  getActPositions("460003443793217", "460003443793217", 1497126293, 1499126293, "", function(msg){
    console.log(msg);
  });
}