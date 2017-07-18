// **********************************************************************
//
// Copyright (c) 2003-2016 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************
//
// Ice version 3.6.3
//
// <auto-generated>
//
// Generated from file `Callback.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    var Ice = require("ice").Ice;
    var __M = Ice.__M;
    var Slice = Ice.Slice;

    var NetCore = __M.module("NetCore");

    NetCore.CallbackReceiver = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::CallbackReceiver"
        ],
        -1, undefined, undefined, false);

    NetCore.CallbackReceiverPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.CallbackReceiver.ice_staticId, undefined);

    Slice.defineOperations(NetCore.CallbackReceiver, NetCore.CallbackReceiverPrx,
    {
        "callback": [, , , , , , [[7]], , , , ]
    });

    NetCore.CallbackSender = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::CallbackSender"
        ],
        -1, undefined, undefined, false);

    NetCore.CallbackSenderPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.CallbackSender.ice_staticId, undefined);

    Slice.defineOperations(NetCore.CallbackSender, NetCore.CallbackSenderPrx,
    {
        "addClient": [, , , , , , [[Ice.Identity]], , , , ]
    });
    exports.NetCore = NetCore;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));