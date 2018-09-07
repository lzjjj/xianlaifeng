// pages/myrelease/myrelease.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isParttime: false,
    showPTJNone:false,
    showActivityNone:false,
  },

  
  onLoad: function (options) {
    wx.getStorage({
      key: 'trd_session',
      success:(res)=> {
        this.setData({
          trd_session:res.data
        })
        this.getMycollect(2);//兼职
        this.getMycollect(1);//活动
        
      },
    })
  },


  //选择模块
  selectRecord(e) {
    var id = e.currentTarget.dataset.id
   if(id==2){
     this.setData({
       isParttime: true
     })
   }else{
     this.setData({
       isParttime: false
     })
   }
    
   
  },
  
  //跳转活动或兼职详情
  moveToDetail(e){
    let typeId = e.currentTarget.dataset.typeid;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: typeId == 2 ? "/pages/job_detail/job_detail?id=" + id : "/pages/activity_detail/activity_detail?id=" + id,
    })
  },

  //删除收藏兼职或活动
  optionpCollection(e) {
    let typeId = e.currentTarget.dataset.typeid;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您将删除该收藏！',
      success:  (res)=> {
        if (res.confirm) {
          wx.request({
            url: requestUrl.delCollection + "?trd_session=" + this.data.trd_session + "&get=1",
            method: "POST",
            data: {
              "obj": {
                "methodId": typeId,// 1: 表示活动 2：表示兼职
                "actId": id     //所要报名的活动或者兼职的Id
              }
            },
            success: res => {
              if (res.data.success) {
                wx.showToast({
                  title: '成功取消收藏！',
                })
                if (typeId == 2) {
                  this.setData({
                    ptjCollection: res.data.obj,
                    showPTJNone: res.data.obj.length > 0 ? false : true
                  })
                } else {
                  this.setData({
                    activityCollection: res.data.obj,
                    showActivityNone: res.data.obj.length > 0 ? false : true
                  })
                }

              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
   
  },

  //我收藏的兼职和活动列表
  getMycollect(key){
    wx.showLoading({
      title:"加载中...",
    })
    wx.request({
      url: requestUrl.getMyCollection + "?trd_session=" + this.data.trd_session ,
      method:"POST",
      data:{
        "obj": { "methodId": key==2 ? 2 : 1, }// 1:表示活动 2：表示兼职
      },
      success:res=>{
        if(key==2){
          this.setData({
            ptjCollection: res.data.obj,
            showPTJNone: res.data.obj.length > 0 ? false : true
          })
        }else{
          this.setData({
            activityCollection: res.data.obj,
            showActivityNone: res.data.obj.length > 0 ? false : true
            
          })
        }
       
      }
    })
    wx.hideLoading();
      },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})