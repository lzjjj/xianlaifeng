// pages/searchjob/searchjob.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishowShoolList: false,
    showRecord: true,
    inputValue: "",
    showClear: false,
    shoolList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //监听input框 
  bindKeyInput: function (e) {

    this.setData({
      inputValue: e.detail.value,
      ishowShoolList: true,
    })
    this.getSchoolList(e.detail.value);
    if (e.detail.value != "") {
      this.setData({
        showClear: true,
      })

    }
    else {
      this.setData({
        showClear: false,
      })
    }

  },



  //获取数据列表
  getSchoolList(value) {

    wx.request({
      url: requestUrl.getSchoolList+ "",
      data: { "obj": {
        "school_name": value
      }},
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res=> {
        this.setData({
          shoolList:res.data.obj
        })
      }
    })
  },


  //清除搜索框内容
  clearInput() {
    this.setData({
      inputValue: "",
      showClear: false,
      ishowShoolList: false,
      showRecord: true,
    })
  },

  //搜索兼职信息
  searchGoods() {
    this.getList();
    this.setData({
      ishowShoolList: true,
      showRecord: false,

    })
  },

//选择学校
  chooseSchool(e){
    var data= e.currentTarget.dataset.item
    wx.setStorage({
      key: 'school',
      data: data,
    })
    wx.navigateBack({
      success() {
        let page ;
        wx.getSystemInfo({
          success: res => {

            if (res.model.indexOf('iPhone') > -1) {//苹果手机

              
              page = getCurrentPages()[getCurrentPages().length-2];
            }else{
               page = getCurrentPages().pop();
            }

          }
        })
        if (page == undefined || page == null) return;

        page.reSetSchoolName();

      }
    })
  },

  //点击取消记录
  tapCancel(e) {

   wx.navigateBack({
     
   })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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