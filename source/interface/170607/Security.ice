////////////////////////////////////////////////////////////////////////////////////////////
//  版权      : 版权所有 (C) 北京神州天鸿科技有限公司
//  文件名    : Security.ice
//  作者      : 
//  版本      : V1.0
//  日期      : 2011-02-28
//  描述      : 
//              
//              
//
//  其它      : 无
//
//  Slice命令 : slice2cpp Security.ice -Ic:\Ice-3.3.1-VC90\slice  --stream
//              slice2cs Security.ice -Ic:\Ice-3.3.1-VC90\slice --stream
// 
//
//
////////////////////////////////////////////////////////////////////////////////////////////

#ifndef IAS_SECURITY
#define IAS_SECURITY

#include <Ice/BuiltinSequences.ice>

module NetCore
{
    //lm modified on 2017/03/23
	struct UserInfo     //用户信息
	{
		["cpp:type:wstring"]
		string           username;
		["cpp:type:wstring"]
		string           password;
		["cpp:type:wstring"]
		string           rolename;
		["cpp:type:wstring"]
		string           department;
		["cpp:type:wstring"]
		string           position;
		["cpp:type:wstring"]
		string           tel;
		["cpp:type:wstring"]
		string           email;
		["cpp:type:wstring"]
		string           manager;
		["cpp:type:wstring"]
		string           description;
    };    
    sequence<UserInfo> UserInfoSeq;
    
	struct DeviceInfo   //设备信息
	{
		["cpp:type:wstring"]
		string           devid;
		["cpp:type:wstring"]
		string           devname;
		["cpp:type:wstring"]
		string           department;
		["cpp:type:wstring"]
		string           peoincharge;
		["cpp:type:wstring"]
		string           regtime;
    };    
    sequence<DeviceInfo> DevInfoSeq;

	struct BlackList   //黑名单
	{
		["cpp:type:wstring"]
		string           imsi;
		["cpp:type:wstring"]
		string           imeiesn;
		["cpp:type:wstring"]
		string           name;             //姓名
		["cpp:type:wstring"]
		string           ID;               //身份证号
		["cpp:type:wstring"]
		string           crimtype;         //布控类型
		["cpp:type:wstring"]
		string           briefinfo;        //简要案情
		["cpp:type:wstring"]
		string           submitter;        //提交人
		["cpp:type:wstring"]
		string           submittime;       //提交时间
		int              approved;         //是否批准：0否 1是
		["cpp:type:wstring"]
		string           department;       //部门
    };    
    sequence<BlackList> BlackListSeq;

	struct WarningInfo   //告警信息
	{
		["cpp:type:wstring"]
		string           warnid;            //预警ID
		double           time;              //绝对时间
		["cpp:type:wstring"]
		string           devname;           //设备名称
		["cpp:type:wstring"]
		string           peoincharge;       //代班领导
		["cpp:type:wstring"]
		string           mobile;            //手机号码
		int              inform;            //0:未反馈 1：反馈
		["cpp:type:wstring"]
		string           crimname;          //姓名
		["cpp:type:wstring"]
		string           crimsex;           //性别
		["cpp:type:wstring"]
		string           captinfo;          //中标方式或信息
		["cpp:type:wstring"]
		string           homeaddr;          //家庭住址
		["cpp:type:wstring"]	            
		string           liveaddr;          //现居住住址
		["cpp:type:wstring"]	            
		string           certifid;          //身份证号
		["cpp:type:wstring"]	            
		string           captype;           //布控类型
		["cpp:type:wstring"]	            
		string           captaddr;          //布控地点
    };    
    sequence<WarningInfo> WarnInfoSeq;

	struct SensArea    //敏感地区
	{
	    string           id;
		["cpp:type:wstring"]
		string           country;
		["cpp:type:wstring"]
		string           province;
		["cpp:type:wstring"]
		string           city;
		["cpp:type:wstring"]
		string           department;
	};
	sequence<SensArea> SensAreaSeq;
    
    struct PosInfo               
    { 
        double       lng;
        double       lat;
        double       time;
    };
    sequence<PosInfo> PosInfoSeq;


	struct AccompTarget        //存储目标伴随号码结果
	{
	    string       imsi;
		string       imei;
		["cpp:type:wstring"]
		string       name;
	};
	sequence<AccompTarget> AccompTargetSeq;

	struct AccompTask        //存储伴随号码任务信息
	{
	    string     taskid;
		["cpp:type:wstring"]
		string     taskname;
		["cpp:type:wstring"]
		string     username;
		["cpp:type:wstring"]
		string     department;
		double     startime;
		double     endtime;
		string     addrs;         //json
	}; 
	sequence<AccompTask> AccompTaskSeq;

	struct SuspectTarget      //存储目标疑似号码结果
	{
	    string       imsi;
		string       imei;
		["cpp:type:wstring"]
		string       name;
		double       credlev;     //可信度
	};
	sequence<SuspectTarget> SuspectTargetSeq;


	struct SuspectTask    //存储疑似号码任务信息
	{
	    string      taskid;
		["cpp:type:wstring"]
		string      taskname;
		["cpp:type:wstring"]
		string      username;
		["cpp:type:wstring"]
		string      department;
		double      startime;
		double      endtime;
		string      imsi;            
		string      imei;
	};
	sequence<SuspectTask> SuspectTaskSeq;


	struct MigrateData
	{
	    ["cpp:type:wstring"]
	    string       country;     //国家
		["cpp:type:wstring"]
	    string       province;    //省份
		["cpp:type:wstring"]
		string       city;        //城市
        int          imsinum;     //imsi数目
	};
	sequence<MigrateData> MigrateDataSeq;

	struct AddrArea
	{
	    double     dwlng;
		double     uplng;
		double     dwlat;
		double     uplat;      
	};
	sequence<AddrArea> AddrAreaSeq;   
	
	struct ImsiInfo
	{
	    string     imsi;
		string     imei;
		double     captime;
		["cpp:type:wstring"]
		string     devname;
		["cpp:type:wstring"]
		string     county;   
		["cpp:type:wstring"]   
		string     province;
		["cpp:type:wstring"]
		string     city;
	};
	sequence<ImsiInfo> ImsiInfoSeq;     
    
    // 对象操作类型
    enum OBJOPTYPE
    { 
        SECOBJADD,                         // 增加
        SECOBJMODIFY,                      // 修改
        SECOBJDELETE,                      // 删除
    };

    
    //lm modified on 2017/03/23
    interface ObjMgt
    {
		int GetUsers
        (
		   ["cpp:type:wstring"]
		    string                       MngerName,             // 用户创建者
			int                          type,                  // 查询用户类型 0：所有 1：分析账户 2：监控账户
			int                          page,                  // 界面页数
			int                          pagesize,              // 每页显示条数
			out int                      total,                 // 记录总条数    
            out UserInfoSeq              Items                  // 用户序列
        );

		int UpdateUsers
        (
            UserInfoSeq                  Items,                  // 用户序列
            OBJOPTYPE                    op
        );

		int GetDevices
        (
		    string                       role,                  // 用户角色
			["cpp:type:wstring"]
			string                       department,            // 部门  
			int                          page,                  // 界面页数
			int                          pagesize,              // 每页显示条数
			out int                      total,                 // 记录总条数        
            out DevInfoSeq               Items                  // 用户序列
        );

		int UpdateDevices
        (
            DevInfoSeq                   Items,                  // 设备序列
            OBJOPTYPE                    op
        );

	    int GetWarningInfo    //管理员获取预警信息
	       (
		       string                        role,                  // 角色
			   ["cpp:type:wstring"]
			   string                        dept,                  // 部门
			   int                           page,                  // 界面页数
			   int                           pagesize,              // 每页显示条数
			   out int                       total,                 // 记录总条数    
			   out WarnInfoSeq               Items
		   );


		int GetSensAreas      // 获取敏感地区
        (
		    string                       role,                   // 用户角色
			["cpp:type:wstring"]
			string                       department,             // 部门
			int                          page,                   // 界面页数
			int                          pagesize,               // 每页显示条数
			out int                      total,                  // 记录总条数 
            out SensAreaSeq              Items                   // 敏感地区序列
        );

		int UpdateSensAreas  // 更新敏感地区
        (
            SensAreaSeq                  Items,                  // 敏感地区序列
            OBJOPTYPE                    op
        );

		int GetBlackList     //获取黑名单
        (
		    string                       role,                  // 用户角色
			["cpp:type:wstring"]
			string                       department,            // 部门       
			int                          page,                  // 界面页数
			int                          pagesize,              // 每页显示条数  
			int                          approv,                // 0：未批准 1：批准 2：所有           
			out int                      total,                 // 记录总条数      
            out BlackListSeq             Items                  // 用户序列
        );

		int UpdateBlackList   //更新黑名单
        (
            BlackListSeq                 Items,                 //黑名单序列
            OBJOPTYPE                    op
        );

		int GetHeatMapData                //获取热力图数据
			(
			    double                       startime,              //起始绝对时间
				double                       endtime,               //结束绝对时间
				["cpp:type:wstring"]
				string                       department,            //所在部门
				out ["cpp:type:wstring"]
				string                       jsonCont               //获取的内容（json格式）
			);

	    int GetMigrateData                //获取迁徙图数据
			(
			    double                       startime,              //起始绝对时间
				double                       endtime,               //结束绝对时间
				int                          type,                  //0:新疆 1：敏感地区 2：国内 3：省内 4：境外
				["cpp:type:wstring"]
				string                       department,            //所在部门
				out MigrateDataSeq           Items                  
			);
			
		int GetActPath                    //获取特定号码轨迹（分析研判）
			(
			    string                       imsi,
			    string                       imei,
			    double                       startime,
			    double                       endtime,
				["cpp:type:wstring"]
				string                       department,
			    out PosInfoSeq               Items              
			);

		int GetAccompTarget              //获取伴随号码（分析研判）
			(
			    ["cpp:type:wstring"]
				string                       dept,
				string                       imsi,
				string                       imei,
				double                       startime,
				double                       endtime,
			    AddrAreaSeq                  addrs,
				out AccompTargetSeq          Items
			);

	    int GetAccompTask              //获取伴随号码分析器（分析研判）
		   (
		       ["cpp:type:wstring"]
			   string                        username,
			   ["cpp:type:wstring"]
			   string                        department,
			   out AccompTaskSeq             Items
		   );

	   int UpdateAccompTask               //更新伴随号码分析器（分析研判）    
		   (
		       AccompTaskSeq                 Items,
			   OBJOPTYPE                     op
		   );

	    int GetSuspectTarget               //获取疑似号码（分析研判）
			(
			   ["cpp:type:wstring"]
				string                       dept,
				string                       imsi,
				string                       imei,
				double                       startime,
				double                       endtime,
				out SuspectTargetSeq         Items
			);

		int GetSuspectTask                //获取疑似号码分析器（分析研判）
		   (
		       ["cpp:type:wstring"]
			   string                        username,
			   ["cpp:type:wstring"]
			   string                        department,
			   out SuspectTaskSeq            Items
		   );

	   int UpdateSuspectTask              //更新疑似号码分析器（分析研判）
		   (
		       SuspectTaskSeq                Items,
			   OBJOPTYPE                     op
		   );

	    int IMSIQuery                  //号码批量查询（分析研判）
		   (
		       int                           qrytype, //0:查询所有 1：按设备名查询
			   ["cpp:type:wstring"]
			   string                        devname,
			   ["cpp:type:wstring"]
			   string                        department,
		       double                        startime,
			   double                        endtime,
			   out ImsiInfoSeq               Items
		   );
    };
      
    
	exception UserOwnInvalidCertificateException{
		string reason;
	};
	exception UserHasNoPrincipalException {
		string reason;
	};
	
	// 包含了用户名和对应的角色 lm modified on 2017/03/23
	interface Principal
	{
	    ["cpp:type:wstring"]
		string UserName();

		string Role();

		["cpp:type:wstring"]
		string Department();
	};

	// 根据Context，验证principle是否有访问的权限
	interface AuthorizationProvider
	{
		bool Authorize(Principal* p, string context);
	};
	    
	// 通过该接口，客户端可以获取用户名对应的Principal
	interface SecurityProvider
	{
		Principal* GetPrincipal(["cpp:type:wstring"] string name,string password) throws UserOwnInvalidCertificateException, UserHasNoPrincipalException;
	};
};

#endif
