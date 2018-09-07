// pages/edit_descrition/edit_descrition.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: ""
  },
  onLoad: function (options) {
    this.getDetail();
  },

//获取详情内容
getDetail(){
  wx.getStorage({
    key: 'details',
    success: (res)=> {
      this.setData({
        details:res.data
      })
    },
  })
},

  //修改详情内容
  changeDetail(e) {

    this.setData({
      details: e.detail.value
    })
  },

  //跳转活动或者兼职
  handleNavigate() {
    wx.setStorage({
      key: 'details',
      data: this.data.details,
    })
      wx.navigateBack({
        success() {
          let page;
          wx.getSystemInfo({
            success: res => {

              if (res.model.indexOf('iPhone') > -1) {//苹果手机


                page = getCurrentPages()[getCurrentPages().length - 2];
              } else {
                page = getCurrentPages().pop();
              }

            }
          })
          if (page == undefined || page == null) return;
          page.changeActivityContent();
        }
      })
  }

})