// struct WarningInfo   //告警信息
// {
// string           warnid;            //预警ID
// double           time;              //绝对时间
// string           devname;           //设备名称
// string           peoincharge;       //代班领导
// string           mobile;            //手机号码
// int              inform;            //0:未反馈 1：反馈
// string           crimname;          //姓名
// string           crimsex;           //性别
// string           captinfo;          //中标方式或信息
// string           homeaddr;          //家庭住址
// string           liveaddr;          //现居住住址
// string           certifid;          //身份证号
// string           captype;           //布控类型
// string           captaddr;          //布控地点
// };    
// sequence<WarningInfo> WarnInfoSeq;

// int GetWarningInfo    //管理员获取预警信息
// (
// string             role,      // 角色
// string             dept,      // 部门
// int                page,      // 界面页数
// int                pagesize,  // 每页显示条数
// out int            total,     // 记录总条数    
// out WarnInfoSeq    Items
// );

// 获取信息列表
function getMessages(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetWarningInfo(role, department, page, pagesize).then(
    function(result, messages) {
      callback({ result: result, messages: messages });
    },
    function(exception, messages) {
      // todo
      console.log(exception);
    });
}

// 回调函数
function startSubscribe(callback) {
  var CallbackReceiverI = Ice.Class(NetCore.CallbackReceiver, {
    callback: function(str, current) {
      callback({ messages: str, index: current });
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
