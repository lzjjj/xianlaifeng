//格式化时间 xx年xx月xx日
const formatTime = date => {
  wx.getSystemInfo({
    success: res => {

      if (res.model.indexOf('iPhone') > -1) {//苹果手机

        date = date.replace(/\-/g, "/");

      }

    }
  })
  date =new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return month+"月"+day+"日";
}
//计算距离发布时间的工具函数
var  pastTime=startTime=> {
  wx.getSystemInfo({
    success: res => {

      if (res.model.indexOf('iPhone') > -1) {//苹果手机

        startTime = startTime.replace(/\-/g, "/");

      }

    }
  })

  var sTime = new Date(startTime); //开始时间
  var eTime = new Date(); //结束时间
  var intervalTime = eTime.getTime() - sTime.getTime();//间隔毫秒数
  //作为除数的数字
  var timeType = 1000;
  var diffType = intervalTime < 1000 * 60 ? "" : (intervalTime < 1000 * 3600 && intervalTime >= 1000 * 60 ? "分钟前" : (intervalTime < 1000 * 3600 * 24 && intervalTime >= 1000 * 3600 ? "小时前" : "天前"));
  switch (diffType) {

    case "分钟前":
      timeType = 1000 * 60;
      break;
    case "小时前":
      timeType = 1000 * 3600;
      break;
    case "天前":
      timeType = 1000 * 3600 * 24;
      break;
    default:
      return "刚刚"
      break;
  }
  return parseInt(intervalTime / parseInt(timeType)) + diffType;

}

//计算年龄的工具函数
const getAge=birthDate=>{
  wx.getSystemInfo({
    success: res => {

      if (res.model.indexOf('iPhone') > -1) {//苹果手机

        birthDate = birthDate.replace(/\-/g, "/");

      }

    }
  })
  var sTime = new Date(birthDate); //出生日期时间
  var eTime = new Date(); //当前时间
  var timeType = 1000 * 3600 * 24*30*12;
  var intervalTime = eTime.getTime() - sTime.getTime();//间隔毫秒数
  return parseInt(intervalTime / parseInt(timeType));
}

//去掉时间的类型参数的秒
const ridSecond = date=>{
 
  wx.getSystemInfo({
    success: res => {

      if (res.model.indexOf('iPhone') > -1) {//苹果手机

        date = date.replace(/\-/g, "/");
        
      }

    }
  })
 
  return date.substring(0, date.length - 3);
}

//获取手机高度
const getwindowHeight=()=>{
  wx.getSystemInfo({
    success: (res)=> {
      if (res.windowHeight){
        console.log("------------------");
        console.log(res.windowHeight);
        return res.windowHeight;
      }
    },
  })
}


  module.exports = {
    getwindowHeight: getwindowHeight,
    ridSecond: ridSecond,
    formatTime: formatTime,
    pastTime: pastTime,
    getAge: getAge
  }