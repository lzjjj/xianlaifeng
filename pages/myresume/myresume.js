const app = getApp()
import requestUrl from "../../common/api.js"
import util from "../../utils/util.js"
Page({
  data: {

    userInfo: {},
    hasUserInfo: false,
    canIUse: true,
    resume: {}
  },

  onLoad: function () {
    this.getResume();
   
  },


  //获取简历信息
  getResume() {
    wx.getStorage({
      key: 'trd_session',
      success: res => {
        wx.request({
          url: requestUrl.getResume + "?trd_session=" + res.data,
          success: res => {
            let resume = res.data.obj
            resume.user_age = util.getAge(resume.user_birth + " " + "00:00:00");
            this.setData({
              resume: resume
            })
          }
        })
      },
    })

  },


  //跳转编辑简历
  goToEdit() {
    var id = this.data.resume.id;
    wx.navigateTo({
      url: '/pages/editresume/editresume?id='+id,
    })
  },

})