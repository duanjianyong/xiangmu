// **********************************************************************
//
// Copyright (c) 2003-2016 ZeroC, Inc. All rights reserved.
//
// **********************************************************************

#pragma once

#include <Ice/Identity.ice>
#include <Ice/BuiltinSequences.ice>

module NetCore
{

interface CallbackReceiver
{
    void callback(string param);//param为采用json格式,内容定义见下方
};

interface CallbackSender
{
    void addClient(Ice::Identity ident);
};

};
////////////////////////////////////////////////////////////////
//param
///////////////////////////////////////////////////////////////
//预警信息Json内容
//{
//"MsgType":"WARNMSG",    //表示该Json内容为预警信息
// "warnid" :"___",       //预警ID
// "time":xxx,            //时间
// "devname":"___",       //设备名称   
// "peoincharge":"___",   //负责人
// "department":"___",    //部门
// "mobile":"___",        //手机号
// "imsi":"___",          //imsi
// "imeiesn":"___",       //imei
// "longtitude":"___",    //经度
// "latitude":"___"       //纬度
// }


//实时监控数据Json内容
//{
//"MsgType":"BSIMSIIMEI",    //表示实时监控数据
//"Imsi":"___",              //IMSI
//"Carrier":xxx,             //运营商  1:移动 2：联通 3：电信
//"TerIDType":xxx,           //终端设备标识类型 1：IMEI 2：ESN 3:MEID
//"TerID":"___",             //终端设备的IMEI/ESN/MEID
//"Mobile":"___",            //手机号码
//"Brand":"___",             //终端品牌型号
//"sAscrip":"___",           //手机归属地
//"CaptTime":xxx,            //采集时间 北京1970年1月1日08：00：00开始到结束时间的绝对秒数
//"TerFieldStrength":"___",  //被采终端场强
//"NetbarWacode":"___",      //场所编号
//"ColEquipid":"___",        //采集设备编号
//"EquipName":"___",         //设备名称
//"ColEquipType":xxx,        //采集设备类型
//"ColEquipLong":"___",      //采集设备经度
//"ColEquipLat":"___"        //采集设备纬度
//}

