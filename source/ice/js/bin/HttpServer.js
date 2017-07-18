// **********************************************************************
//
// Copyright (c) 2003-2016 ZeroC, Inc. All rights reserved.
//
// **********************************************************************

var crypto = require("crypto");
var fs = require("fs");
var http = require("http");
var httpProxy = require("http-proxy");
var https = require("https");
var path = require("path");
var url = require("url");

function isdir(p) {
  try {
    return fs.statSync(path.join(p)).isDirectory();
  } catch (e) {}
  return false;
}

function Init() {
  var MimeTypes = {
    css: "text/css",
    html: "text/html",
    ico: "image/x-icon",
    js: "text/javascript",
  };

  var libraries = ["/lib/Ice.js", "/lib/Ice.min.js",
    "/lib/Glacier2.js", "/lib/Glacier2.min.js",
    "/lib/IceStorm.js", "/lib/IceStorm.min.js",
    "/lib/IceGrid.js", "/lib/IceGrid.min.js",
  ];

  var libraryMaps = libraries.map(
    function(f) {
      return f + ".map";
    });

  var HttpServer = function(host, ports) {
    this._host = host;
    this._ports = ports;
    this._basePath = path.resolve(path.join(__dirname, ".."));
  };

  HttpServer.prototype.processRequest = function(req, res) {
    var filePath;

    var iceLib = libraries.indexOf(req.url.pathname) !== -1;
    var iceLibMap = libraryMaps.indexOf(req.url.pathname) !== -1;
    filePath = path.resolve(path.join(this._basePath, req.url.pathname));

    // 
    // If OPTIMIZE is set resolve Ice libraries to the corresponding minified
    // versions.
    //
    if (process.env.OPTIMIZE == "yes") {
      if (iceLib && filePath.substr(-7) !== ".min.js") {
        filePath = filePath.replace(".js", ".min.js");
      } else if (iceLibMap && filePath.substr(-11) !== ".min.js.map") {
        filePath = filePath.replace(".js.map", ".min.js.map");
      }
    }

    var ext = path.extname(filePath).slice(1);

    //
    // When the browser ask for a .js or .css file and it has support for gzip content
    // check if a gzip version (.js.gz or .css.gz) of the file exists and use that instead.
    //
    if ((ext == "js" || ext == "css" || ext == "map") && req.headers["accept-encoding"].indexOf("gzip") !== -1) {
      fs.stat(filePath + ".gz",
        function(err, stats) {
          if (err || !stats.isFile()) {
            fs.stat(filePath,
              function(err, stats) {
                doRequest(err, stats, filePath);
              });
          } else {
            doRequest(err, stats, filePath + ".gz");
          }
        });
    } else {
      fs.stat(filePath,
        function(err, stats) {
          doRequest(err, stats, filePath);
        });
    }

    var doRequest = function(err, stats, filePath) {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end("404 Page Not Found");
          console.log("HTTP/404 (Page Not Found)" + req.method + " " + req.url.pathname + " -> " + filePath);
        } else {
          res.writeHead(500);
          res.end("500 Internal Server Error");
          console.log("HTTP/500 (Internal Server Error) " + req.method + " " + req.url.pathname + " -> " +
            filePath);
        }
      } else {
        if (!stats.isFile()) {
          res.writeHead(403);
          res.end("403 Forbiden");
          console.log("HTTP/403 (Forbiden) " + req.method + " " + req.url.pathname + " -> " + filePath);
        } else {
          //
          // Create a md5 using the stats attributes
          // to be used as Etag header.
          //
          var hash = crypto.createHash("md5");
          hash.update(stats.ino.toString());
          hash.update(stats.mtime.toString());
          hash.update(stats.size.toString());

          var headers = {
            "Content-Type": MimeTypes[ext] || "text/plain",
            "Content-Length": stats.size,
            "Etag": hash.digest("hex")
          };

          if (path.extname(filePath).slice(1) == "gz") {
            headers["Content-Encoding"] = "gzip";
          }

          //
          // Check for conditional request header if-none-match.
          //
          var modified = true;
          if (req.headers["if-none-match"] !== undefined) {
            modified = req.headers["if-none-match"].split(" ").every(
              function(element, index, array) {
                return element !== headers.Etag;
              });
          }

          //
          // Not Modified
          //
          if (!modified) {
            res.writeHead(304, headers);
            res.end();
            console.log("HTTP/304 (Not Modified) " + req.method + " " + req.url.pathname + " -> " + filePath);
          } else {
            res.writeHead(200, headers);
            if (req.method === "HEAD") {
              res.end();
            } else {
              fs.createReadStream(filePath, { "bufferSize": 4 * 1024 }).pipe(res);
            }
            console.log("HTTP/200 (Ok) " + req.method + " " + req.url.pathname + " -> " + filePath);
          }
        }
      }
    };
  };

  //
  // Proxy configuration for the different demos.
  //
  var proxyConfig = [
    // { resource: "/SecurityProvider", target: "http://192.168.3.202:10000", protocol: "ws" },
    // { resource: "/ObjMgtProvider", target: "http://192.168.3.202:10004", protocol: "ws" },

    { resource: "/SecurityProvider", target: "http://120.26.43.114:10000", protocol: "ws" },
    { resource: "/ObjMgtProvider", target: "http://120.26.43.114:10004", protocol: "ws" },
  ];

  var proxies = {};
  
  HttpServer.prototype.start = function() {
    var self = this;
    if (self.status != undefined && self.status != 'end') {
      return;
    }
    self.status = 'start';
    console.log('[gm-debug] the http-server is starting...');
    var options = {
      passphrase: "password",
      pfx: fs.readFileSync(path.join(__dirname, "../../certs", "server.p12")),
    };

    var httpServer = http.createServer();
    var httpsServer = https.createServer(options);

    if (httpProxy) {
      proxyConfig.forEach(
        function(conf) {
          console.log("[gm-debug] ice proxy target is: " + conf.target + ', protocol is: ' + conf.protocol);
          proxies[conf.resource] = {
            server: httpProxy.createProxyServer({ target: conf.target, secure: false }),
            protocol: conf.protocol
          };
        });
    }

    [httpServer, httpsServer].forEach(function(server) {
      server.on("request", function(req, res) {
        //
        // Dummy data callback required so request end event is emitted.
        //
        var dataCB = function(data) {};

        var endCB = function() {
          req.url = url.parse(req.url);
          self.processRequest(req, res);
        };

        req.on("data", dataCB);
        req.on("end", endCB);
      });
    });

    if (httpProxy) {
      var requestCB = function(protocols) {
        return function(req, socket, head) {
          var errCB = function(err) {
            // add error process -- liguangming
            console.log('[gm-debug] An error occurred on the http-server. The error message is: ' + err);
            socket.end();
            httpsServer.close(function(){
              console.log('[gm-debug] close the https-server right now');
            });
            httpServer.close(function(){
              console.log('[gm-debug] close the http-server right now');
              console.log('[gm-debug] the http-server will restart in 3 seconds ... ');
              self.status = 'end';
              setTimeout(function() {
                // restart server
                console.log('[gm-debug] the http-server is restarting...');
                self.start();
              }, 3000);
            });
          };
          var proxy = proxies[req.url];
          if (proxy && protocols.indexOf(proxy.protocol) !== -1) {
            proxy.server.ws(req, socket, head, errCB);
          } else {
            console.log('[gm-debug] this protocal type is not supported by the http-server.');
            socket.end();
          }
        };
      };

      httpServer.on("upgrade", requestCB(["ws"]));
      httpsServer.on("upgrade", requestCB(["ws", "wss"]));
    }

    httpServer.listen(8080, this._host);
    httpsServer.listen(9090, this._host);
    console.log("[gm-debug] server was listening on ports 8080 (http) and 9090 (https)...");
  };

  new HttpServer("0.0.0.0", [8080, 9090]).start();
}

module.exports = Init;
