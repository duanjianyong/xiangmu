/*local.js本地处理js*/


var g_ref={
	win_height:"",
	win_width:"",
	page:""
}
  
window.g_ref=g_ref;
function local_req()
{
	 this.get_url="php/api_get.php";
	 this.post_url="php/api_post.php"
}
//通过php post请求
local_req.prototype.submit_POST=function(obj,callback)
{
	//local_req.log("post"+JSON.stringify(obj.data));
	$.ajax({
		url: obj.url || "php/api_post.php",
		type:'POST',
		data:obj.data,
		dataType:'JSON',//here
		jsonp:"callback",
		jsonpCallback : "handler", 
		success: function (data) {
			callback(obj,data);
		}
	});
}
//通过php get请求
local_req.prototype.submit_GET=function(obj,callback){
	$.ajax({
		url: obj.url || "php/api_http_get.php",		  
		type:'GET',
		data:obj.data,
		dataType:obj.type || 'JSON',//here
		jsonp:"callback",
		jsonpCallback : "handler", 
		success: function (data) {
			   if(data && data["Rescode"]==10000)
			   {
					callback(obj,data);	
			   }else if(data["Rescode"]==20022)
			   {
					//alert(str_json(obj.data));
					window.location.href="login.html";
			   }else
			   {
					callback(obj,data);
			   }
		}
   });
}
//var light_panel=createElement({type:"div",classname:"panel_div",Parentclass:obj});
//创建对象obj.type 创建类型（如div） obj.classname class 属性 obj.id id属性  obj.style 设置css样式   obj.Parentclass父类，又谁创建
function createElement(obj)
{
	var element=document.createElement(obj.type);
	if(obj.classname)
	{
		element.className=obj.classname;
	}
	if(obj.Parentclass)
	{
		obj.Parentclass.appendChild(element);
	}
	if(obj.id)
	{
		element.id=obj.id;
	}if(obj.style)
	{
		element.style.cssText=obj.style;
	}
	return element;
}
function load_html(){
	/*
	网页可见区域宽：document.body.clientWidth
	网页可见区域高：document.body.clientHeight (html下获取浏览器高度，xhtml下获取元素总高度)
	网页可见区域高：document.documentElement.clientHeight (xhtml下获取浏览器高度)
	网页可见区域宽：document.body.offsetWidth (包括边线的宽)
	网页可见区域高：document.body.offsetHeight (包括边线的宽)
	网页正文全文宽：document.body.scrollWidth
	网页正文全文高：document.body.scrollHeight
	网页被卷去的高：document.body.scrollTop
	网页被卷去的左：document.body.scrollLeft
	网页正文部分上：window.screenTop
	网页正文部分左：window.screenLeft
	屏幕分辨率的高：window.screen.height
	屏幕分辨率的宽：window.screen.width
	屏幕可用工作区高度：window.screen.availHeight
	屏幕可用工作区宽度：window.screen.availWidth*/
	g_ref.win_height=document.body.offsetHeight||window.screen.availHeight;
	g_ref.win_width=document.body.offsetWidth||window.screen.availWidth;
	console.log(g_ref.win_height);
	console.log(g_ref.win_width);
	
	
	var s_height=g_ref.win_height-60-150;
	
	var menu=document.getElementById("menu");
	menu.style.heihgt=s_height+"px";
	menu.style.width="200px";
	
	var center=document.getElementById("center");
	center.style.height=s_height+"px"; 
	center.style.width=g_ref.win_width-400+"px";
	
	var info=document.getElementById("info");
	info.style.height=s_height+"px";
	info.style.width="200px";
	
	var menu_div=document.getElementById("menu_div");
	menu_div.style.height=s_height-20+"px";
	
	
	var info_div=document.getElementById("info_div");
	info_div.style.height=s_height-50+"px";
	//加载实时视频
	$('li[name="realMonitor"]').click();
	$('li[name="realMonitor"]').css({"backgroundColor":"#000099"});	
}
function load_map(){
	
	g_ref.win_height=document.body.offsetHeight||window.screen.availHeight;
	g_ref.win_width=document.body.offsetWidth||window.screen.availWidth;
	console.log(g_ref.win_height);
	console.log(g_ref.win_width);
	
	var light_panel=createElement({type:"div",Parentclass:bodys,style:"width:100%;height:100%;"});
		initMap(light_panel);//创建和初始化地图
		init();
}
//加载时间
function load_dete()
{
	var myDate=new Date();
	var getFullYear=myDate.getFullYear(); 
	var getMonth=myDate.getMonth()+1;
	var getDate=myDate.getDate(); 
	var getHours=myDate.getHours();
	var getMinutes=myDate.getMinutes();
	var getSeconds=myDate.getSeconds();
	
	return getFullYear+"年"+getMonth+"月"+getDate+"日"+getHours+":"+getMinutes+":"+getSeconds
}