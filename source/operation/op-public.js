var communicator = Ice.initialize();
var flushEnabled = false;
var batch = 0;
var ObjMgtPrx = null;

// create proxy
function updateProxy() {
  console.log('updateProxy');
  var hostname = document.location.hostname || "127.0.0.1";
  var proxy = communicator.stringToProxy("ObjMgtProvider" +
    ":ws -h " + hostname + " -p 8080 -r /ObjMgtProvider"
  );

  var timeout = $("#timeout").val();
  proxy = proxy.ice_invocationTimeout(timeout > 0 ? timeout : -1);
  proxy = proxy.ice_twoway();
  ObjMgtPrx = NetCore.ObjMgtPrx.uncheckedCast(proxy);
}

// 获取预警信息列表 -- liguangming
function getAlarms(role, department, page, pagesize, callback) {
  ObjMgtPrx.GetWarningInfo(role, department, page, pagesize).then(
    function(result, total, alarms) {
      callback({ result: result, total: total, alarms: alarms });
    },
    function(exception, result) {
      console.log(exception);
    });

  ObjMgtPrx.GetActPath("imsi", "imei", 1234, 1234, "123").then(
    function(result, act_list) {
      console.log('getActPositions callback');
      callback({ result: result, act_list: act_list });
    },
    function(exception, result) {
      console.log(exception);
    });
}

//查询黑名单
function getblack(obj, callback) {
  ObjMgtPrx.GetBlackList(obj.role, obj.department).then(
    function(prx, msg) {
      if (prx == 0) {
        callback(msg)
      }
      console.log(prx)
    }
  )
}

//添加黑名单
function addblack(obj, callback) {
  var blackList = new NetCore.BlackList(obj.imsi, obj.imeiesn, obj.name, obj.ID, obj.crimtype, obj.briefinfo, obj.submitter, obj.submittime, obj.approved, obj.department);
  var black_array = [];
  black_array.push(blackList);
  ObjMgtPrx.UpdateBlackList(black_array, NetCore.OBJOPTYPE.SECOBJADD).then(
    function(prx) {
      callback(prx);
      console.log(prx);
    }
  )
}

//修改黑名单
function updateblack(obj, callback) {
  var blackList = new NetCore.BlackList(obj.imsi, obj.imeiesn, obj.name, obj.ID, obj.crimtype, obj.briefinfo, obj.submitter, obj.submittime, obj.approved, obj.department);
  var black_array = [];
  black_array.push(blackList);
  ObjMgtPrx.UpdateBlackList(black_array, NetCore.OBJOPTYPE.SECOBJMODIFY).then(
    function(prx) {
      console.log(prx);
    }
  )
}

//删除黑名单
function delblack(obj, callback) {
  var blackList = new NetCore.BlackList(obj.imsi, obj.imeiesn, obj.name, obj.ID, obj.crimtype, obj.briefinfo, obj.submitter, obj.submittime, obj.approved, obj.department);
  var black_array = [];
  black_array.push(blackList);
  ObjMgtPrx.UpdateBlackList(black_array, NetCore.OBJOPTYPE.SECOBJDELETE).then(
    function(prx) {
      console.log(prx);
    }
  )
}

// Return an event handler suitable for "click" methods. The
// event handler calls the given function, handles exceptions
// and resets the state to Idle when the promise returned by
// the function is fulfilled.
//
var performEventHandler = function(fn) {
  return function() {
    Ice.Promise.try(
      function() {
        return fn.call();
      }
    ).exception(
      function(ex) {
        $("#output").val(ex.toString());
      }
    ).finally(
      function() {
        setState(State.Idle);
      }
    );
    return false;
  };
};

//
// Handle the client state.
//
var State = {
  Idle: 0,
  SendRequest: 1,
  FlushBatchRequests: 2
};

var state;

function setState(newState, ex) {
  function assert(v) {
    if (!v) {
      throw new Error("Assertion failed");
    }
  }

  if (state === newState) {
    //
    // This event was queued before the event handler has time
    // to disable the button, just ignore it.
    //
    return;
  }

  switch (newState) {
    case State.Idle:
      {
        assert(state === undefined || state === State.SendRequest || state === State.FlushBatchRequests);

        //
        // Hide the progress indicator.
        //
        $("#progress").hide();
        $("body").removeClass("waiting");

        //
        // Enable buttons.
        //

        // $("#add_management").removeClass("disabled").click(addUserClickHandler);
        break;
      }
    case State.SendRequest:
    case State.FlushBatchRequests:
      {
        /*
            assert(state === State.Idle);

            //
            // Reset the output.
            //
            $("#output").val("");

            //
            // Disable buttons.
            //
            $("#hello").addClass("disabled").off("click");
            $("#shutdown").addClass("disabled").off("click");
            $("#flush").addClass("disabled").off("click");

            //
            // Display the progress indicator and set the wait cursor.
            //
            $("#progress .message").text(
                newState === State.SendRequest ? "Sending Request..." : "Flush Batch Requests...");
            $("#progress").show();
            $("body").addClass("waiting");
      */
        break;
      }
  }
  state = newState;
}

//
// Start in the idle state
//
setState(State.Idle);
updateProxy();
