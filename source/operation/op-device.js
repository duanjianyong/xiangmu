// **********************************************************************
//
// liguangming 2017/06/01 
// 设备操作接口测试代码
// liguangming 2017/06/03
// 新增设备操作接口，增删改查设备，Prx对象由相关页面初始化
//
// **********************************************************************

//添加设备 -- liguangming
function addDevice(obj, callback) {
  console.log(obj);
  var device = new NetCore.DeviceInfo(obj.devid, obj.devname, obj.department, obj.peoincharge, obj.regtime);
  var devicearray = [];
  devicearray.push(device);
  ObjMgtPrx.UpdateDevices(devicearray, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(result) {
      callback(result);
    });
}

//删除设备 -- liguangming
function delDevice(obj, callback) {
  var device = new NetCore.DeviceInfo(obj.devid, obj.devname, obj.department, obj.peoincharge, obj.regtime);
  var devicearray = [];
  devicearray.push(device);
  ObjMgtPrx.UpdateDevices(devicearray, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(result) {
      callback(result);
    });
}

//更新设备 -- liguangming
function updateDevice(obj, callback) {
  var device = new NetCore.DeviceInfo(obj.devid, obj.devname, obj.department, obj.peoincharge, obj.regtime);
  var devicearray = [];
  devicearray.push(device);
  ObjMgtPrx.UpdateDevices(devicearray, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(result) {
      callback(result);
    });
}

//查询设备列表 -- liguangming
function getDevice(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetDevices(role, department, page, pagesize).then(
    function(result, total, devices) {
      callback({ result: result, total: total, devices: devices });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// liguangming 接口测试

// 获取设备列表
function test_get_devices() {
  getDevice("SuperManager", "太原市万柏林区公安分局", 1, 15, function(msg) {
    console.log(msg);
  });
}

// 添加设备
function test_add_device() {
  var device = new NetCore.DeviceInfo("1", "设备名", "1", "sa", "2017年6月1日 16:26");

  addDevice(device, function(msg) {
    console.log(msg);
  });
}

// 删除设备
function test_delete_device() {
  var device = new NetCore.DeviceInfo("1001", "设备名", "太原市万柏林区公安分局", "sa", "2017年6月1日 16:26");
  delDevice(device, function(msg) {
    console.log(msg);
  });
}

// 更新设备
function test_update_device() {
  var device = new NetCore.DeviceInfo("1001", "修改后的设备名", "太原市万柏林区公安分局", "sa", "2017年6月1日 16:26");
  updateDevice(device, function(msg) {
    console.log(msg);
  });
}
