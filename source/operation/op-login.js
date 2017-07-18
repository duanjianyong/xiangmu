window.onload = function() {
  _init_proxy();
  _init_ui();
};

$(document).ready(function() {
  _init_animation();
  _init_bundle();
});

// ui init
function _init_ui() {
  g_ref.win_height = document.body.offsetHeight || window.screen.availHeight;
  var login_div = document.getElementById("login_div");
  login_div.style.marginTop = (g_ref.win_height - login_div.offsetHeight) / 2 + "px";
}

// animation init
function _init_animation() {
  // add close and open animation
  if (typeof localStorage.bgNy == 'undefined') {
    display_bg(true);
    $(".bjtx").text("打开背景特效");
  } else if (localStorage.bgNy == 'n') {
    random_animation();
    $(".bjtx").text("关闭背景特效");
  } else {
    display_bg(true);
    $(".bjtx").text("打开背景特效");
  }

  $(".bjtx").click(function() {
    if (typeof localStorage.bgNy == 'undefined') {
      localStorage.bgNy = 'n';
      random_animation();
      $(".bjtx").text("关闭背景特效");
    } else if (localStorage.bgNy == 'n') {
      localStorage.bgNy = 'y';
      display_bg(true);
      $(".bjtx").text("开启背景特效");
    } else {
      localStorage.bgNy = 'n';
      random_animation();
      $(".bjtx").text("关闭背景特效");
    }
  });
}

// proxy init
function _init_proxy() {
  var communicator = Ice.initialize();
  var hostname = document.location.hostname || "127.0.0.1";
  var proxy = communicator.stringToProxy("SecurityProvider" +
    ":ws -h " + hostname + " -p 8080 -r /SecurityProvider"
  );

  var timeout = $("#timeout").val();
  proxy = proxy.ice_invocationTimeout(timeout > 0 ? timeout : -1);

  var mode = "twoway";
  if (mode == "twoway") {
    proxy = proxy.ice_twoway();
  } else if (mode == "twoway-secure") {
    proxy = proxy.ice_twoway().ice_secure(true);
  } else if (mode == "oneway") {
    proxy = proxy.ice_oneway();
  } else if (mode == "oneway-secure") {
    proxy = proxy.ice_oneway().ice_secure(true);
  } else if (mode == "oneway-batch") {
    proxy = proxy.ice_batchOneway();
  } else if (mode == "oneway-batch-secure") {
    proxy = proxy.ice_batchOneway().ice_secure(true);
  }
  this.SecurityProviderPrx = NetCore.SecurityProviderPrx.uncheckedCast(proxy);
}

// event bind init
function _init_bundle() {
  $(document).keydown(function(e) {
    if (e.keyCode == 13) {
      login_submit();
    }
  });
  $("#btn_submit").click(function() {
    login_submit();
  });
}

function random_animation() {
  display_bg(false);
  var rd = parseInt(Math.random() * (7 - 4)) + 4;
  var ai_src = "animation/a" + rd + ".html";
  $(".baniframe").attr("src", ai_src);
}

function display_bg(boolean_display) {
  if (boolean_display) {
    $('.bg_img').css("display", "block");
  } else {
    $('.bg_img').css("display", "none");
  }
}


function print_object(object) {
  var obj = object;
  var str = "";
  for (each in obj) {
    str += each + ":" + obj[each] + "<br/>";
  }
  console.log(str);
}


//登录事件
function login_submit() {
  console.log('login_submit')
  var username = document.getElementById("username").value;
  var pwd = document.getElementById("pwd").value;
  if (username == "") {
    alert("请输入用户名");
    return;
  }
  if (pwd == "") {
    alert("请输入密码");
    return;
  }
  var user = {};
  // console.log("123");
  this.SecurityProviderPrx.GetPrincipal(username, pwd).then(
    function(prx) {

      // console.log(prx);
      // print_object(prx);

      // prx.Role().then(function(value) {
      //   console.log("role: " + value);
      // });

      // prx.UserName().then(function(value) {
      //   console.log("username: " + value);
      // });

      // prx.Department().then(function(value) {
      //   console.log("department: " + value);
      // });

      // return;

      //var prx = ...; // Get a proxy from somewhere...
      prx.Role().then(function(value) {
        console.log('role: ' + value);
        user.Role = value;
        prx.UserName().then(function(value) {
          console.log('username: ' + value);
          console.log(prx.Department());
          user.UserName = value;
          prx.Department().then(function(value) {
            console.log('department: ' + value);
            user.Department = value;
            localStorage.user = JSON.stringify(user);
            console.log(user);
            if (user.Role == "SuperManager") {
              window.location.href = "sa.html";
            } else if (user.Role == "Manager") {
              window.location.href = "admin.html";
            } else if (user.Role == "Monitor") {
              window.location.href = "menu.html";
            } else if (user.Role == "Analyzer") {
              window.location.href = "analysis.html";
            }
          });
        });
      });
    });
}

// deprecate
var batch = 0;

// deprecate
// Flush batch requests.
function flush() {
  batch = 0;
  setState(State.FlushBatchRequests);
  return SecurityProviderPrx.ice_flushBatchRequests();
}

// deprecate
// Shutdown the server.
function shutdown() {
  setState(State.SendRequest);

  if (SecurityProviderPrx.ice_isBatchOneway()) {
    batch++;
  }
  return SecurityProviderPrx.shutdown();
}

// deprecate
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

// deprecate
var login_submitClickHandler = performEventHandler(login_submit);

// deprecate
var state;

// deprecate
// Handle the client state.
var State = {
  Idle: 0,
  SendRequest: 1,
  FlushBatchRequests: 2
};

// deprecate
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
        $("#hello").removeClass("disabled").click(sayHelloClickHandler);
        //$("#btn_submit").removeClass("disabled").click(sayHelloClickHandler);
        $("#shutdown").removeClass("disabled").click(shutdownClickHandler);
        if (batch > 0) {
          $("#flush").removeClass("disabled").click(flushClickHandler);
        }


        break;
      }
    case State.SendRequest:
    case State.FlushBatchRequests:
      {
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
        break;
      }
  }
  state = newState;
}

// deprecate
// Start in the idle state
// setState(State.Idle);

// deprecate
// Extract the url GET variables and put them in the _GET object.
// var _GET = {};
// if (window.location.search.length > 1) {
//   window.location.search.substr(1).split("&").forEach(
//     function(pair) {
//       pair = pair.split("=");
//       if (pair.length > 0) {
//         _GET[decodeURIComponent(pair[0])] = pair.length > 1 ? decodeURIComponent(pair[1]) : "";
//       }
//     });
// }

// deprecate
// If the mode param is set, initialize the mode select box with that value.
// if (_GET.mode) {
//   $("#mode").val(_GET.mode);
// }

// deprecate
// If the user selects a secure mode, ensure that the page is loaded over HTTPS
// so the web server SSL certificate is obtained.
// $("#mode").on("change",
//   function(e) {
//     var newMode = $(this).val();
//     var href;
//     if (document.location.protocol === "http:" &&
//       (newMode === "twoway-secure" || newMode === "oneway-secure" || newMode === "oneway-batch-secure")) {
//       href = document.location.protocol + "//" + document.location.host +
//         document.location.pathname + "?mode=" + newMode;
//       href = href.replace("http", "https");
//       href = href.replace("8080", "9090");
//       document.location.assign(href);
//     } else if (document.location.protocol === "https:" &&
//       (newMode === "twoway" || newMode === "oneway" || newMode === "oneway-batch")) {
//       href = document.location.protocol + "//" + document.location.host +
//         document.location.pathname + "?mode=" + newMode;
//       href = href.replace("https", "http");
//       href = href.replace("9090", "8080");
//       document.location.assign(href);
//     }
//     console.log(newMode);
//     updateProxy();
//   });

// $("#timeout").on("change",
//   function(e) {
//     updateProxy();
//   });
