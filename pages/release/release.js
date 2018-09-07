// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


//跳转发布兼职
  goToReleaseJob(){
    wx.navigateTo({
      url: '/pages/release_job/release_job',
    })
  },


  //跳转发布活动
  goToReleaseActivity() {
    wx.navigateTo({
      url: '/pages/release_activity/release_activity',
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})