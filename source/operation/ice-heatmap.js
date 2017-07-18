// **********************************************************************
//
// liguangming 2017/06/01 
// 热力图数据操作接口测试代码
// 
// GetHeatMapData
// [in]
//   double    starttime,    //起始绝对时间
//   double    endtime,     //结束绝对时间
//   DevIDSeq  devIDs,
//   string    department,  //所在部门
// [out]
//   string    jsonCont     //获取的内容（json格式）
// **********************************************************************


// 获取热力图数据 -- liguangming
function getHeatmap(obj, callback){
  ObjMgtPrx.GetHeatMapData(obj.starttime, obj.endtime, obj.devids, obj.department).then(
    function(result, heatmap_data) {
      console.log('getHeatmap callback');
      callback({ result: result, heatmap_data: heatmap_data });
    },
    function(exception, result) {
      console.log(exception);
      callback({result: 'exception', heatmap_data: ''});
    });
}

// GetHeatMapData
function test_get_heatmap() {
  getHeatmap(149811899, 1498119008, "1", function(msg) {
    // console.log(msg);
    var data = JSON.parse(msg.heatmap_data);
    console.log(data.Data);
  });
}
