const globalUrl ="https://www.xianlaifeng.com/xianlaifeng/"
let requestUrl={
  "activityList": globalUrl +"atc/getActShow.do",//活动列表接口
  "activityDetail": globalUrl +"atc/getActDetails.do?id=",//活动详情
  "releaseJob": globalUrl +"ptj/add.do",//发布活动接口
  "login": globalUrl +"usc/WeChatlogin.do",//登录
  "setUserInfo": globalUrl+ "usc/updateWeChat.do",//存储用户信息到数据库
  "getResume": globalUrl + "usc/getWeChatUserInfo.do",// 获取用户个人简历信息
  "getSchoolList": globalUrl +"sc/getSchool.do",//获取学校列表
  "setUSerImage": globalUrl +"pict/uploadImg.do?method=user",//上传用户头像
  "updateWeChatUserInfo": globalUrl +"usc/updateWeChatUserInfo.do",//更新简历信息
  "getArea": globalUrl +"area/selectArea.do",//获取区域接口
  "getJobType": globalUrl +"ptj/getALLPtjType.do",//获取兼职类型接口
  "getJobList": globalUrl +"ptj/findList.do",//获取兼职列表
  "releaseActivity": globalUrl + "atc/insertActWechat.do",//发布活动
  "uploadActivityImg": globalUrl +"pict/uploadImg.do",//上传活动图片
  "getJobDetail": globalUrl +"ptj/details.do",//获取兼职详情
  "enlist": globalUrl + "jct/add.do",//点击报名
  "enlistRecord": globalUrl + "jct/getMyJoin.do",//报名记录  
  "getCityList": globalUrl +"area/selectByCity.do",//所有城市数据
  "getSearchHistory": globalUrl +"shc/getSearch.do",//获取用户搜索历史
  "clearSearchHistory": globalUrl+"shc/clearSearch.do",//清除搜索记录
  "addCollection": globalUrl +"cc/addCollection.do",//添加收藏
  "delCollection": globalUrl +"cc/delCollection.do",//取消收藏
  "getMyCollection": globalUrl+"cc/getMyCollection.do",//获取收藏列表
  "getMyPublish": globalUrl +"usc/getMyPublish.do",//获取我的发布列表
  "getJoinUser": globalUrl +"jct/getJoinUser.do",//获取我的发布报名列表
  "updateJoinStatus": globalUrl + "jct/updateJoinStatus.do",//更改用户报名状态
  "updateActWechat": globalUrl + "atc/updateActWechat.do",//下架活动 
  "updatePtjWechat": globalUrl +"ptj/updatePtjWechat.do",//下架兼职
  "getActPic": globalUrl +"atc/getActPic.do",//获取模板图片
  }
export default requestUrl