// **********************************************************************
//
// liguangming 2017/06/03
// 监控数据操作接口测试代码
// 
// **********************************************************************

function init() {
  // 回调函数
  var CallbackReceiverI = Ice.Class(NetCore.CallbackReceiver, {
    callback: function(str, current) {
      console.log("received callback# " + str);
    }
  });

  var id = new Ice.InitializationData();
  id.properties = Ice.createProperties();

  var communicator = Ice.initialize(id);

  // 开始展开回调
  Ice.Promise.try(
    function() {
      // 创建代理proxy
      // var hostname = "192.168.3.202";
      // var hostname = "127.0.0.1";
      var hostname = "120.26.43.114";
      var proxy = communicator.stringToProxy("sender:ws -p 10007 -h " + hostname);
      // var proxy = communicator.stringToProxy("sender:ws -p 8080 -h " + hostname);

      return NetCore.CallbackSenderPrx.checkedCast(proxy).then(
        function(server) {
          return communicator.createObjectAdapter("").then(
            function(adapter) {
              // 注册回调函数
              var r = adapter.addWithUUID(new CallbackReceiverI());
              proxy.ice_getCachedConnection().setAdapter(adapter);
              return server.addClient(r.ice_getIdentity());
            });
        });
    }
  ).exception(
    function(ex) {
      console.log(ex.toString());
      Ice.Promise.try(
        function() {
          if (communicator) {
            return communicator.destroy();
          }
        }
      ).finally(
        function() {
          process.exit(1);
        });
    });
}
