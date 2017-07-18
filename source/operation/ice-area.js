///////////////////////////////////////////////////////////////////////////////////////////////////
// 获取国家和省市列表
///////////////////////////////////////////////////////////////////////////////////////////////////
// sequence<string> wsSeq;     //字符串数组

// int QueryCountry            //国家查询
// (      
// out wsSeq      Items               
// );

// int QueryProvince          //省份查询
// (  
// string         country,    // 国家    
// out wsSeq      Items               
// );

// int QueryCity              //城市查询
// (      
// string         country,    // 国家 
// string         province,   // 省份
// out wsSeq      Items               
// );

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function getCountry(callback) {
  ObjMgtPrx.QueryCountry().then(
    function(items) {
      callback(items);
    },
    function(exception, items) {
      // todo
      console.log(exception);
    });
}

function getProvince(country, callback) {
  ObjMgtPrx.QueryProvince(country).then(
    function(result, items) {
      callback({ result: result, items: items });
    },
    function(exception, items) {
      // todo
      console.log(exception);
    });
}

function getCity(country, province, callback) {
  ObjMgtPrx.QueryCity(country, province).then(
    function(result, items) {
      callback({ result: result, items: items });
    },
    function(exception, items) {
      // todo
      console.log(exception);
    });
}
