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
// Generated from file `Security.ice'
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

    NetCore.UserInfo = Slice.defineStruct(
        function(username, password, rolename, department, position, tel, email, manager, description)
        {
            this.username = username !== undefined ? username : "";
            this.password = password !== undefined ? password : "";
            this.rolename = rolename !== undefined ? rolename : "";
            this.department = department !== undefined ? department : "";
            this.position = position !== undefined ? position : "";
            this.tel = tel !== undefined ? tel : "";
            this.email = email !== undefined ? email : "";
            this.manager = manager !== undefined ? manager : "";
            this.description = description !== undefined ? description : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.username);
            __os.writeString(this.password);
            __os.writeString(this.rolename);
            __os.writeString(this.department);
            __os.writeString(this.position);
            __os.writeString(this.tel);
            __os.writeString(this.email);
            __os.writeString(this.manager);
            __os.writeString(this.description);
        },
        function(__is)
        {
            this.username = __is.readString();
            this.password = __is.readString();
            this.rolename = __is.readString();
            this.department = __is.readString();
            this.position = __is.readString();
            this.tel = __is.readString();
            this.email = __is.readString();
            this.manager = __is.readString();
            this.description = __is.readString();
        },
        9, 
        false);
    Slice.defineSequence(NetCore, "UserInfoSeqHelper", "NetCore.UserInfo", false);

    NetCore.DeviceInfo = Slice.defineStruct(
        function(devid, devname, department, peoincharge, regtime)
        {
            this.devid = devid !== undefined ? devid : "";
            this.devname = devname !== undefined ? devname : "";
            this.department = department !== undefined ? department : "";
            this.peoincharge = peoincharge !== undefined ? peoincharge : "";
            this.regtime = regtime !== undefined ? regtime : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.devid);
            __os.writeString(this.devname);
            __os.writeString(this.department);
            __os.writeString(this.peoincharge);
            __os.writeString(this.regtime);
        },
        function(__is)
        {
            this.devid = __is.readString();
            this.devname = __is.readString();
            this.department = __is.readString();
            this.peoincharge = __is.readString();
            this.regtime = __is.readString();
        },
        5, 
        false);
    Slice.defineSequence(NetCore, "DevInfoSeqHelper", "NetCore.DeviceInfo", false);

    NetCore.BlackList = Slice.defineStruct(
        function(imsi, imeiesn, name, ID, crimtype, briefinfo, submitter, submittime, approved, department)
        {
            this.imsi = imsi !== undefined ? imsi : "";
            this.imeiesn = imeiesn !== undefined ? imeiesn : "";
            this.name = name !== undefined ? name : "";
            this.ID = ID !== undefined ? ID : "";
            this.crimtype = crimtype !== undefined ? crimtype : "";
            this.briefinfo = briefinfo !== undefined ? briefinfo : "";
            this.submitter = submitter !== undefined ? submitter : "";
            this.submittime = submittime !== undefined ? submittime : "";
            this.approved = approved !== undefined ? approved : 0;
            this.department = department !== undefined ? department : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.imsi);
            __os.writeString(this.imeiesn);
            __os.writeString(this.name);
            __os.writeString(this.ID);
            __os.writeString(this.crimtype);
            __os.writeString(this.briefinfo);
            __os.writeString(this.submitter);
            __os.writeString(this.submittime);
            __os.writeInt(this.approved);
            __os.writeString(this.department);
        },
        function(__is)
        {
            this.imsi = __is.readString();
            this.imeiesn = __is.readString();
            this.name = __is.readString();
            this.ID = __is.readString();
            this.crimtype = __is.readString();
            this.briefinfo = __is.readString();
            this.submitter = __is.readString();
            this.submittime = __is.readString();
            this.approved = __is.readInt();
            this.department = __is.readString();
        },
        13, 
        false);
    Slice.defineSequence(NetCore, "BlackListSeqHelper", "NetCore.BlackList", false);

    NetCore.WarningInfo = Slice.defineStruct(
        function(warnid, time, devname, peoincharge, mobile, inform, crimname, crimsex, captinfo, homeaddr, liveaddr, certifid, captype, captaddr)
        {
            this.warnid = warnid !== undefined ? warnid : "";
            this.time = time !== undefined ? time : 0.0;
            this.devname = devname !== undefined ? devname : "";
            this.peoincharge = peoincharge !== undefined ? peoincharge : "";
            this.mobile = mobile !== undefined ? mobile : "";
            this.inform = inform !== undefined ? inform : 0;
            this.crimname = crimname !== undefined ? crimname : "";
            this.crimsex = crimsex !== undefined ? crimsex : "";
            this.captinfo = captinfo !== undefined ? captinfo : "";
            this.homeaddr = homeaddr !== undefined ? homeaddr : "";
            this.liveaddr = liveaddr !== undefined ? liveaddr : "";
            this.certifid = certifid !== undefined ? certifid : "";
            this.captype = captype !== undefined ? captype : "";
            this.captaddr = captaddr !== undefined ? captaddr : "";
        },
        false,
        function(__os)
        {
            __os.writeString(this.warnid);
            __os.writeDouble(this.time);
            __os.writeString(this.devname);
            __os.writeString(this.peoincharge);
            __os.writeString(this.mobile);
            __os.writeInt(this.inform);
            __os.writeString(this.crimname);
            __os.writeString(this.crimsex);
            __os.writeString(this.captinfo);
            __os.writeString(this.homeaddr);
            __os.writeString(this.liveaddr);
            __os.writeString(this.certifid);
            __os.writeString(this.captype);
            __os.writeString(this.captaddr);
        },
        function(__is)
        {
            this.warnid = __is.readString();
            this.time = __is.readDouble();
            this.devname = __is.readString();
            this.peoincharge = __is.readString();
            this.mobile = __is.readString();
            this.inform = __is.readInt();
            this.crimname = __is.readString();
            this.crimsex = __is.readString();
            this.captinfo = __is.readString();
            this.homeaddr = __is.readString();
            this.liveaddr = __is.readString();
            this.certifid = __is.readString();
            this.captype = __is.readString();
            this.captaddr = __is.readString();
        },
        24, 
        false);
    Slice.defineSequence(NetCore, "WarnInfoSeqHelper", "NetCore.WarningInfo", false);

    NetCore.SensArea = Slice.defineStruct(
        function(id, country, province, city, department)
        {
            this.id = id !== undefined ? id : "";
            this.country = country !== undefined ? country : "";
            this.province = province !== undefined ? province : "";
            this.city = city !== undefined ? city : "";
            this.department = department !== undefined ? department : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.id);
            __os.writeString(this.country);
            __os.writeString(this.province);
            __os.writeString(this.city);
            __os.writeString(this.department);
        },
        function(__is)
        {
            this.id = __is.readString();
            this.country = __is.readString();
            this.province = __is.readString();
            this.city = __is.readString();
            this.department = __is.readString();
        },
        5, 
        false);
    Slice.defineSequence(NetCore, "SensAreaSeqHelper", "NetCore.SensArea", false);

    NetCore.PosInfo = Slice.defineStruct(
        function(lng, lat, time)
        {
            this.lng = lng !== undefined ? lng : 0.0;
            this.lat = lat !== undefined ? lat : 0.0;
            this.time = time !== undefined ? time : 0.0;
        },
        false,
        function(__os)
        {
            __os.writeDouble(this.lng);
            __os.writeDouble(this.lat);
            __os.writeDouble(this.time);
        },
        function(__is)
        {
            this.lng = __is.readDouble();
            this.lat = __is.readDouble();
            this.time = __is.readDouble();
        },
        24, 
        true);
    Slice.defineSequence(NetCore, "PosInfoSeqHelper", "NetCore.PosInfo", true);

    NetCore.AccompTarget = Slice.defineStruct(
        function(imsi, imei, name)
        {
            this.imsi = imsi !== undefined ? imsi : "";
            this.imei = imei !== undefined ? imei : "";
            this.name = name !== undefined ? name : "";
        },
        true,
        function(__os)
        {
            __os.writeString(this.imsi);
            __os.writeString(this.imei);
            __os.writeString(this.name);
        },
        function(__is)
        {
            this.imsi = __is.readString();
            this.imei = __is.readString();
            this.name = __is.readString();
        },
        3, 
        false);
    Slice.defineSequence(NetCore, "AccompTargetSeqHelper", "NetCore.AccompTarget", false);

    NetCore.AccompTask = Slice.defineStruct(
        function(taskid, taskname, username, department, startime, endtime, imsi, imei, addrs)
        {
            this.taskid = taskid !== undefined ? taskid : "";
            this.taskname = taskname !== undefined ? taskname : "";
            this.username = username !== undefined ? username : "";
            this.department = department !== undefined ? department : "";
            this.startime = startime !== undefined ? startime : 0.0;
            this.endtime = endtime !== undefined ? endtime : 0.0;
            this.imsi = imsi !== undefined ? imsi : "";
            this.imei = imei !== undefined ? imei : "";
            this.addrs = addrs !== undefined ? addrs : "";
        },
        false,
        function(__os)
        {
            __os.writeString(this.taskid);
            __os.writeString(this.taskname);
            __os.writeString(this.username);
            __os.writeString(this.department);
            __os.writeDouble(this.startime);
            __os.writeDouble(this.endtime);
            __os.writeString(this.imsi);
            __os.writeString(this.imei);
            __os.writeString(this.addrs);
        },
        function(__is)
        {
            this.taskid = __is.readString();
            this.taskname = __is.readString();
            this.username = __is.readString();
            this.department = __is.readString();
            this.startime = __is.readDouble();
            this.endtime = __is.readDouble();
            this.imsi = __is.readString();
            this.imei = __is.readString();
            this.addrs = __is.readString();
        },
        23, 
        false);
    Slice.defineSequence(NetCore, "AccompTaskSeqHelper", "NetCore.AccompTask", false);

    NetCore.SuspectTarget = Slice.defineStruct(
        function(imsi, imei, name, credlev)
        {
            this.imsi = imsi !== undefined ? imsi : "";
            this.imei = imei !== undefined ? imei : "";
            this.name = name !== undefined ? name : "";
            this.credlev = credlev !== undefined ? credlev : 0.0;
        },
        false,
        function(__os)
        {
            __os.writeString(this.imsi);
            __os.writeString(this.imei);
            __os.writeString(this.name);
            __os.writeDouble(this.credlev);
        },
        function(__is)
        {
            this.imsi = __is.readString();
            this.imei = __is.readString();
            this.name = __is.readString();
            this.credlev = __is.readDouble();
        },
        11, 
        false);
    Slice.defineSequence(NetCore, "SuspectTargetSeqHelper", "NetCore.SuspectTarget", false);

    NetCore.SuspectTask = Slice.defineStruct(
        function(taskid, taskname, username, department, startime, endtime, imsi, imei)
        {
            this.taskid = taskid !== undefined ? taskid : "";
            this.taskname = taskname !== undefined ? taskname : "";
            this.username = username !== undefined ? username : "";
            this.department = department !== undefined ? department : "";
            this.startime = startime !== undefined ? startime : 0.0;
            this.endtime = endtime !== undefined ? endtime : 0.0;
            this.imsi = imsi !== undefined ? imsi : "";
            this.imei = imei !== undefined ? imei : "";
        },
        false,
        function(__os)
        {
            __os.writeString(this.taskid);
            __os.writeString(this.taskname);
            __os.writeString(this.username);
            __os.writeString(this.department);
            __os.writeDouble(this.startime);
            __os.writeDouble(this.endtime);
            __os.writeString(this.imsi);
            __os.writeString(this.imei);
        },
        function(__is)
        {
            this.taskid = __is.readString();
            this.taskname = __is.readString();
            this.username = __is.readString();
            this.department = __is.readString();
            this.startime = __is.readDouble();
            this.endtime = __is.readDouble();
            this.imsi = __is.readString();
            this.imei = __is.readString();
        },
        22, 
        false);
    Slice.defineSequence(NetCore, "SuspectTaskSeqHelper", "NetCore.SuspectTask", false);

    NetCore.MigrateData = Slice.defineStruct(
        function(country, province, city, imsinum)
        {
            this.country = country !== undefined ? country : "";
            this.province = province !== undefined ? province : "";
            this.city = city !== undefined ? city : "";
            this.imsinum = imsinum !== undefined ? imsinum : 0;
        },
        true,
        function(__os)
        {
            __os.writeString(this.country);
            __os.writeString(this.province);
            __os.writeString(this.city);
            __os.writeInt(this.imsinum);
        },
        function(__is)
        {
            this.country = __is.readString();
            this.province = __is.readString();
            this.city = __is.readString();
            this.imsinum = __is.readInt();
        },
        7, 
        false);
    Slice.defineSequence(NetCore, "MigrateDataSeqHelper", "NetCore.MigrateData", false);

    NetCore.AddrArea = Slice.defineStruct(
        function(dwlng, uplng, dwlat, uplat)
        {
            this.dwlng = dwlng !== undefined ? dwlng : 0.0;
            this.uplng = uplng !== undefined ? uplng : 0.0;
            this.dwlat = dwlat !== undefined ? dwlat : 0.0;
            this.uplat = uplat !== undefined ? uplat : 0.0;
        },
        false,
        function(__os)
        {
            __os.writeDouble(this.dwlng);
            __os.writeDouble(this.uplng);
            __os.writeDouble(this.dwlat);
            __os.writeDouble(this.uplat);
        },
        function(__is)
        {
            this.dwlng = __is.readDouble();
            this.uplng = __is.readDouble();
            this.dwlat = __is.readDouble();
            this.uplat = __is.readDouble();
        },
        32, 
        true);
    Slice.defineSequence(NetCore, "AddrAreaSeqHelper", "NetCore.AddrArea", true);

    NetCore.ImsiInfo = Slice.defineStruct(
        function(imsi, imei, captime, devname, county, province, city)
        {
            this.imsi = imsi !== undefined ? imsi : "";
            this.imei = imei !== undefined ? imei : "";
            this.captime = captime !== undefined ? captime : 0.0;
            this.devname = devname !== undefined ? devname : "";
            this.county = county !== undefined ? county : "";
            this.province = province !== undefined ? province : "";
            this.city = city !== undefined ? city : "";
        },
        false,
        function(__os)
        {
            __os.writeString(this.imsi);
            __os.writeString(this.imei);
            __os.writeDouble(this.captime);
            __os.writeString(this.devname);
            __os.writeString(this.county);
            __os.writeString(this.province);
            __os.writeString(this.city);
        },
        function(__is)
        {
            this.imsi = __is.readString();
            this.imei = __is.readString();
            this.captime = __is.readDouble();
            this.devname = __is.readString();
            this.county = __is.readString();
            this.province = __is.readString();
            this.city = __is.readString();
        },
        14, 
        false);
    Slice.defineSequence(NetCore, "ImsiInfoSeqHelper", "NetCore.ImsiInfo", false);

    NetCore.OBJOPTYPE = Slice.defineEnum([
        ['SECOBJADD', 0], ['SECOBJMODIFY', 1], ['SECOBJDELETE', 2]]);
    Slice.defineSequence(NetCore, "DevIDSeqHelper", "Ice.StringHelper", false);
    Slice.defineSequence(NetCore, "wsSeqHelper", "Ice.StringHelper", false);

    NetCore.ObjMgt = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::ObjMgt"
        ],
        -1, undefined, undefined, false);

    NetCore.ObjMgtPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.ObjMgt.ice_staticId, undefined);

    Slice.defineOperations(NetCore.ObjMgt, NetCore.ObjMgtPrx,
    {
        "GetUsers": [, , , , , [3], [[7], [3], [3], [3]], [[3], ["NetCore.UserInfoSeqHelper"]], , , ],
        "UpdateUsers": [, , , , , [3], [["NetCore.UserInfoSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "GetDevices": [, , , , , [3], [[7], [7], [3], [3]], [[3], ["NetCore.DevInfoSeqHelper"]], , , ],
        "UpdateDevices": [, , , , , [3], [["NetCore.DevInfoSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "GetWarningInfo": [, , , , , [3], [[7], [7], [3], [3]], [[3], ["NetCore.WarnInfoSeqHelper"]], , , ],
        "GetSensAreas": [, , , , , [3], [[7], [7], [3], [3]], [[3], ["NetCore.SensAreaSeqHelper"]], , , ],
        "UpdateSensAreas": [, , , , , [3], [["NetCore.SensAreaSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "GetBlackList": [, , , , , [3], [[7], [7], [3], [3], [3]], [[3], ["NetCore.BlackListSeqHelper"]], , , ],
        "UpdateBlackList": [, , , , , [3], [["NetCore.BlackListSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "GetHeatMapData": [, , , , , [3], [[6], [6], ["NetCore.DevIDSeqHelper"], [7]], [[7]], , , ],
        "GetMigrateData": [, , , , , [3], [[6], [6], [3], [7]], [["NetCore.MigrateDataSeqHelper"]], , , ],
        "GetActPath": [, , , , , [3], [[7], [7], [6], [6], [7]], [["NetCore.PosInfoSeqHelper"]], , , ],
        "GetAccompTarget": [, , , , , [3], [[7], [7], [7], [6], [6], ["NetCore.AddrAreaSeqHelper"]], [["NetCore.AccompTargetSeqHelper"]], , , ],
        "GetAccompTask": [, , , , , [3], [[7], [7]], [["NetCore.AccompTaskSeqHelper"]], , , ],
        "UpdateAccompTask": [, , , , , [3], [["NetCore.AccompTaskSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "GetSuspectTarget": [, , , , , [3], [[7], [7], [7], [6], [6]], [["NetCore.SuspectTargetSeqHelper"]], , , ],
        "GetSuspectTask": [, , , , , [3], [[7], [7]], [["NetCore.SuspectTaskSeqHelper"]], , , ],
        "UpdateSuspectTask": [, , , , , [3], [["NetCore.SuspectTaskSeqHelper"], [NetCore.OBJOPTYPE.__helper]], , , , ],
        "IMSIQuery": [, , , , , [3], [[3], [7], [7], [6], [6]], [["NetCore.ImsiInfoSeqHelper"]], , , ],
        "BlackListFuzzyQuery": [, , , , , [3], [[7], [7], [3], [3]], [[3], ["NetCore.BlackListSeqHelper"]], , , ],
        "QueryCountry": [, , , , , [3], , [["NetCore.wsSeqHelper"]], , , ],
        "QueryProvince": [, , , , , [3], [[7]], [["NetCore.wsSeqHelper"]], , , ],
        "QueryCity": [, , , , , [3], [[7], [7]], [["NetCore.wsSeqHelper"]], , , ]
    });

    NetCore.UserOwnInvalidCertificateException = Slice.defineUserException(
        function(reason, _cause)
        {
            Ice.UserException.call(this, _cause);
            this.reason = reason !== undefined ? reason : "";
        },
        Ice.UserException,
        "NetCore::UserOwnInvalidCertificateException",
        function(__os)
        {
            __os.writeString(this.reason);
        },
        function(__is)
        {
            this.reason = __is.readString();
        },
        false,
        false);

    NetCore.UserHasNoPrincipalException = Slice.defineUserException(
        function(reason, _cause)
        {
            Ice.UserException.call(this, _cause);
            this.reason = reason !== undefined ? reason : "";
        },
        Ice.UserException,
        "NetCore::UserHasNoPrincipalException",
        function(__os)
        {
            __os.writeString(this.reason);
        },
        function(__is)
        {
            this.reason = __is.readString();
        },
        false,
        false);

    NetCore.Principal = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::Principal"
        ],
        -1, undefined, undefined, false);

    NetCore.PrincipalPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.Principal.ice_staticId, undefined);

    Slice.defineOperations(NetCore.Principal, NetCore.PrincipalPrx,
    {
        "UserName": [, , , , , [7], , , , , ],
        "Role": [, , , , , [7], , , , , ],
        "Department": [, , , , , [7], , , , , ]
    });

    NetCore.AuthorizationProvider = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::AuthorizationProvider"
        ],
        -1, undefined, undefined, false);

    NetCore.AuthorizationProviderPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.AuthorizationProvider.ice_staticId, undefined);

    Slice.defineOperations(NetCore.AuthorizationProvider, NetCore.AuthorizationProviderPrx,
    {
        "Authorize": [, , , , , [1], [["NetCore.PrincipalPrx"], [7]], , , , ]
    });

    NetCore.SecurityProvider = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::NetCore::SecurityProvider"
        ],
        -1, undefined, undefined, false);

    NetCore.SecurityProviderPrx = Slice.defineProxy(Ice.ObjectPrx, NetCore.SecurityProvider.ice_staticId, undefined);

    Slice.defineOperations(NetCore.SecurityProvider, NetCore.SecurityProviderPrx,
    {
        "GetPrincipal": [, , , , , ["NetCore.PrincipalPrx"], [[7], [7]], , 
        [
            NetCore.UserHasNoPrincipalException,
            NetCore.UserOwnInvalidCertificateException
        ], , ]
    });
    exports.NetCore = NetCore;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice.__require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
