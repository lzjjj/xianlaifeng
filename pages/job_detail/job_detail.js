// pages/job_detail/job_detail.js
import requestUrl from "../../common/api.js"
const util = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    trd_session:"",
    
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    wx.getStorage({
      key: 'trd_session',
      success: (res)=> {
        let trd_session = res.data
        this.setData({
          trd_session: trd_session
        })
        this.getJobDetail(options.id, trd_session);
      },
    })
   
  },
  //获取兼职详情
  getJobDetail(id, trd_session) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: requestUrl.getJobDetail + "?jobId=" + id + "&trd_session=" + trd_session,
      success: res => {
        let jobDetail = res.data.obj
        jobDetail.releaseTime = util.pastTime(jobDetail.releaseTime);
        jobDetail.startWorkTime = util.formatTime(jobDetail.startWorkDate);
        jobDetail.endWorkTime = util.formatTime(jobDetail.endWorkDate);
        this.setData({
          jobDetail: jobDetail,
          isCollection: jobDetail.collect
        })
        var jobContent = res.data.obj.jobContent;
        WxParse.wxParse('jobContent', 'html', jobContent, this, 5);
        wx.hideLoading();
      }
    })
  },

//收藏或删除兼职
optionpCollection(){
  
  wx.request({
    url: this.data.isCollection == 0 ? requestUrl.addCollection + "?trd_session=" + this.data.trd_session : requestUrl.delCollection + "?trd_session=" + this.data.trd_session,
    method:"POST",
    data:{
      "obj":{
        "methodId": 2,// 1: 表示活动 2：表示兼职
        "actId": this.data.id     //所要报名的活动或者兼职的Id
      }
    },
    success:res=>{
      if(res.data.success){
        this.setData({
          isCollection: this.data.isCollection == "0" ? "1" : "0"
        })
      }
    }
  })

},

  //点击报名
  handleEnlist(e) {
    var id = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        wx.request({
          url: requestUrl.enlist+"?trd_session="+ res.data,
          method: "POST",
          data: {
            "obj": {
              "methodId": 2,
              "actId": id,
              "joinTime": time
            }
          },
          success:res=>{
            
            if (res.data.success){
              wx.showToast({
                title: '报名已申请！',
                duration: 1000,
                success:res=>{
                  setTimeout(function(){
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  },1000)
                }
              })
            }else{
              var toastMsg = res.data.msg
              wx.showToast({
                title: toastMsg,
                duration: 2000,
                image:"/imgs/warn.png"
              })
            }
          }
        })
      },
    })

  },

  onShareAppMessage: function () {
    return {
      title: this.data.jobDetail.jobName,
      desc: "兼职时间：" + this.data.jobDetail.startWorkTime + "~" + this.data.jobDetail.endWorkTime,
      path: '/pages/job_detail/job_detail?id='  + this.data.id,
    }
  
  }
})