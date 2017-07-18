// **********************************************************************
//
// Copyright (c) 2003-2016 ZeroC, Inc. All rights reserved.
//
// **********************************************************************

var fs = require("fs");
var path = require("path");

var iceDist = "Ice-3.6b";

var defaultInstallLocations = [
    "C:\\Program Files\\ZeroC",
    "C:\\Program Files (x86)\\ZeroC",
    "/Library/Developer",
    "/opt",
    "/usr"];

var iceHome = process.env.ICE_HOME;
var useBinDist = process.env.USE_BIN_DIST == "yes";

var srcDist;
try
{
    srcDist = fs.statSync(path.join(__dirname, "..", "lib")).isDirectory();
}
catch(e)
{
}

var slice2js = process.platform == "win32" ? "slice2js.exe" : "slice2js";
var libSubDir = process.platform == "win32" ? "bin" : "lib";

var libraryPath = process.platform == "win32" ? "PATH" :
                  process.platform == "darwin" ? "DYLD_LIBRARY_PATH" : "LD_LIBRARY_PATH";

if(process.platform == "linux")
{
    (require("os").arch() == "x64" ? ["lib/x86_64-linux-gnu", "lib64"] : ["lib/i386-linux-gnu", "lib"]).some(
        function(element)
        {
            try
            {
                if(fs.statSync(path.join("/usr", element)).isDirectory())
                {
                    libSubDir = element;
                    return true;
                }
            }
            catch(e)
            {                
            }
            return false;
        });
}

//
// If this is a source distribution and ICE_HOME isn't set, ensure that slice2js has been built.
//
if(srcDist && !useBinDist)
{
    var build;
    try
    {
        build = fs.statSync(path.join(__dirname, "..", "..", "cpp", "bin", slice2js)).isFile();
    }
    catch(e)
    {
    }

    if(!build)
    {
        console.error("error: Unable to find " + slice2js + " in " + path.join(__dirname, "..", "..", "cpp", "bin") +
                      ", please verify that the sources have been built or configure ICE_HOME to use a binary distribution.");
        process.exit(1);
    }
}

//
// If this is a demo distribution ensure that ICE_HOME and ICE_JS_HOME are set or installed in their default locations.
//
if(!srcDist || useBinDist)
{
    //
    // If ICE_HOME is not set, check if it is installed in the default location.
    //
    if(!process.env.ICE_HOME)
    {
        defaultInstallLocations.some(
            function(basePath)
            {
                try
                {
                    if(fs.statSync(path.join(basePath, iceDist, "bin", slice2js)).isFile())
                    {
                        iceHome = path.join(basePath, iceDist);
                        return true;
                    }
                }
                catch(e)
                {
                }
                return false;
            });
    }

    if(!iceHome)
    {
        console.error("error: Ice not found in the default installation directories. Set the ICE_HOME environment\n" +
                      "variable to point to the Ice installation directory.");
        process.exit(1);
    }

    //
    // If ICE_HOME is not set, check if it is installed in the default location.
    //
    if(!process.env.ICE_HOME)
    {
        defaultInstallLocations.some(
            function(basePath)
            {
                try
                {
                    if(fs.statSync(path.join(basePath, iceDist, "bin", slice2js)).isFile())
                    {
                        iceHome = path.join(basePath, iceDist);
                        return true;
                    }
                }
                catch(e)
                {
                }
                return false;
            });
    }

    if(!iceHome)
    {
        console.error("error: Ice not found in the default installation directories. Set the ICE_HOME environment\n" +
                      "variable to point to the Ice installation directory.");
        process.exit(1);
    }
}


var sliceDir = iceHome ? (iceHome == "/usr" ? path.join(iceHome, "share", iceDist, "slice") : path.join(iceHome, "slice")) :
                         path.join(__dirname, "..", "..", "slice");

var binDir = iceHome ? path.join(iceHome, "bin") :
                       path.join(__dirname, "..", "..", "cpp", "bin");

var libDir = iceHome ? path.join(iceHome, libSubDir) :
                       path.join(__dirname, "..", "..", "cpp", libSubDir);

module.exports.build = function(basePath, files, args)
{
    console.log("Building " + basePath);
    slice2js = path.join(binDir, slice2js);
    args = args || [];
    function buildFile(file)
    {
        var commandArgs = [];

        commandArgs.push("-I" + sliceDir);
        args.forEach(
            function(arg)
            {
                commandArgs.push(arg);
            });
        commandArgs.push(file);

        var env = {};
        for(var k in process.env)
        {
            env[k] = process.env[k];
        }
        if(env[libraryPath])
        {
            env[libraryPath] = libDir + path.delimiter + env[libraryPath];
        }
        else
        {
            env[libraryPath] = libDir;
        }
        console.log(slice2js + " " + commandArgs.join(" "));
        var spawn = require("child_process").spawn;
        var build  = spawn(slice2js, commandArgs, {env:env});

        build.stdout.on("data", function(data)
        {
            process.stdout.write(data);
        });

        build.stderr.on("data", function(data)
        {
            process.stderr.write(data);
        });

        build.on("close", function(code)
        {
            if(code !== 0)
            {
                process.exit(code);
            }
            else
            {
                if(files.length > 0)
                {
                    buildFile(files.shift());
                }
            }
        });
    }
    buildFile(files.shift());
};

module.exports.buildDirectory = function(basePath)
{
    console.log("Building " + basePath);
    fs.readdir(basePath,
        function(err, files)
        {
            if(err)
            {
                console.log("Error reading dir: " + basePath);
                console.log(err);
                process.exit(1);
            }

            function chekFile(f)
            {
                fs.stat(f,
                        function(err, stat)
                        {
                            if(err)
                            {
                                console.log(err);
                                process.exit(1);
                            }
                            else if(stat.isDirectory())
                            {
                                fs.stat(path.join(basePath, f, "build.js"),
                                        function(err, stat)
                                        {
                                            if(err)
                                            {
                                                if(err.code == "ENOENT")
                                                {
                                                    // The file not exists, build next
                                                    next();
                                                }
                                                else
                                                {
                                                    console.log(err);
                                                    process.exit(1);
                                                }
                                            }
                                            else if(stat.isFile())
                                            {
                                                var spawn = require("child_process").spawn;
                                                var build  = spawn(process.execPath, [path.join(basePath, f, "build.js")], {cwd: path.join(basePath, f)});

                                                build.stdout.on("data", function(data)
                                                {
                                                    process.stdout.write(data);
                                                });

                                                build.stderr.on("data", function(data)
                                                {
                                                    process.stderr.write(data);
                                                });

                                                build.on("close", function(code)
                                                {
                                                    if(code !== 0)
                                                    {
                                                        process.exit(code);
                                                    }
                                                    else
                                                    {
                                                        next();
                                                    }
                                                });
                                            }
                                        });
                            }
                            else
                            {
                                next();
                            }
                        });
            }

            function next()
            {
                if(files.length > 0)
                {
                    chekFile(files.shift());
                }
            }
            next();
        });
};
