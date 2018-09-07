// pages/activity_detail/activity_detail.js
import requestUrl from "../../common/api.js"
const WxParse = require('../../wxParse/wxParse.js'); 
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail:"",
    trd_session: "",
    isCollection:"",
    markers: [{
      iconPath: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAPFBMVEUAAADz6inz6yj/7yD06iv17Cn06ir06in37yj06in06Sn06inz6Snz6Sr16yr06ij06ij06irz6Sr06io4VOu/AAAAE3RSTlMA8EAQMFDQwCCg4JCvgH9gX8+wnx2uygAAAJJJREFUKM+l0kkOg0AMRNE27pkx8f3vmk3kCt2lbPjbJ1EWEJBe7WVWtquGOT3Evsmho8ZuP/U4qNgtubm6umtAxaY26GKkxbkxbs7CWPxsoymZJuPPOHD2y99Mi3NifP59qT2gSA9D+6g7jDw+Q8gXlwoh16cwtUJX9qtmPozfEcOsE8O0hmFaxjCrCoZZaRj+AE+NIBAR63yIAAAAAElFTkSuQmCC",
      id: 0,
      latitude: "",
      longitude:"",
      width: 30,
      height: 30
    }],
    richText: "<p><img alt='' src='https://www.xianlaifeng.com/xlf_web/userfiles/1/images/uploads/u%3D2427966612%2C2626913361%26fm%3D26%26gp%3D0.jpg' style= 'width: 533px; height: 300px;' /></p>"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        let trd_session = res.data
        this.setData({
          trd_session: trd_session
        })
        var id = options.id
        this.getActivityDetail(id, trd_session);
      },
    })
  
  },

//请求活动详情
  getActivityDetail(id, trd_session){
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: requestUrl.activityDetail + id + "&trd_session=" + trd_session,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: (res) => {
      this.setData({
        activityDetail: res.data.obj,
        ["activityDetail.activityStartTime"]: util.ridSecond(res.data.obj.activityStartTime),
        ["activityDetail.activityEndTime"]: util.ridSecond(res.data.obj.activityEndTime),
        isCollection: res.data.obj.collect,
        ["markers[0].longitude"]: res.data.obj.activityLongitude,
        ["markers[0].latitude"]: res.data.obj.activityLatitude,
      })
      var article = res.data.obj.activityDetails;
      WxParse.wxParse('article', 'html', article, this, 5);
wx.hideLoading();
    }
  })
},


//点击地图坐标导航
  markertap(){
    var latitude = this.data.activityDetail.activityLatitude
    var longitude = this.data.activityDetail.activityLongitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
  },

  //收藏或取消收藏活动
  optionpCollection() {
    wx.request({
      url: this.data.isCollection == 0? requestUrl.addCollection + "?trd_session=" + this.data.trd_session: requestUrl.delCollection + "?trd_session=" + this.data.trd_session,
      method: "POST",
      data: {
        "obj": {
          "methodId": 1,// 1: 表示活动 2：表示兼职
          "actId": this.data.id     //所要报名的活动或者兼职的Id
        }
      },
      success: res => {
        if (res.data.success) {
          this.setData({
            isCollection: this.data.isCollection =="0"? "1":"0"
          })
          

        }
      }
    })
  },
  //点击报名
  handleEnlist(e) {
    var id = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time + ":00"
    wx.getSystemInfo({
      success: res => {

        if (res.model.indexOf('iPhone') > -1) {//苹果手机

          time = time.replace(/\//g, "-");

        }

      }
    })
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        wx.request({
          url: requestUrl.enlist + "?trd_session=" + res.data,
          method: "POST",
          data: {
            "obj": {
              "methodId": 1,
              "actId": id,
              "joinTime": time
            }
          },
          success: res => {
           
            if (res.data.success) {
              wx.showToast({
                title: '报名已申请！',
                duration:1000,
                success: res => {
                   setTimeout(function(){
                     wx.switchTab({
                       url: '/pages/activity/activity',
                     })
                   }, 1000)
                  
                }
              })
            } else {
              var toastMsg = res.data.msg
              wx.showToast({
                title: toastMsg,
                duration: 2000,
                image: "/imgs/warn.png"
              })
            }
          }
        })
      },
    })

  },

  onShareAppMessage: function () {
    return {
      title: this.data.activityDetail.activityName,
      desc: "活动时间" + this.data.activityDetail.activityStartTime + "~" + this.data.activityDetail.activityEndTime,
      path: '/pages/activity_detail/activity_detail?id=' +this.data.id,
    }
  }
})