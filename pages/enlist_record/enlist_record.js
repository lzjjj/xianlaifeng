// pages/enlist_record/enlist_record.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNone1:false,
    showNone2: false,
    isParttime: false,//判断是否是兼职
    ptjList:[],
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.enlistRecord(2);
    this.enlistRecord(1);
  },

  //选择模块
  selectRecord(e) {
    var id = e.currentTarget.dataset.id;

    this.setData({
      isParttime: id == 1 ? false : true
    })
    console.log(this.data.isParttime);
  },

  // 查看报名记录
  enlistRecord(id) {
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        wx.request({
          url: requestUrl.enlistRecord + "?trd_session=" + res.data + "&pageSize=10&pageNum=1",
          method:"POST",
          data: {
            "obj": {
              "methodId":id,// 1: 表示活动 2：表示兼职
            }
          },
          success:res=>{
            if(id==1){
              this.setData({
                showNone1: res.data.obj.length == 0 ? true : false,
                activityList: res.data.obj,
                
              })
            }else if(id==2){
              this.setData({
                showNone2: res.data.obj.length == 0 ? true : false,
                ptjList: res.data.obj,
              })
            }
           
          }
        })
      },
    })
  },

//跳转详情
goToDetail(e){
  wx.showLoading({
    title: '正在跳转...',
  })
  var id = e.currentTarget.dataset.id;
  if (!this.data.isParttime){
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/activity_detail/activity_detail?id=' + id,
    })
  }else{
    wx.hideLoading();
    
    wx.navigateTo({
      url: '/pages/job_detail/job_detail?id=' + id,
    })
  }
 
},


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})