// pages/myrelease/myrelease.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isParttime: false,
    trd_session: "",
    PTJList: [],
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        this.setData({
          trd_session: res.data
        })
        this.getMyreleaseList(1);
        this.getMyreleaseList(2);

      },
    })
  },

  //获取我的发布列表
  getMyreleaseList(id) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: requestUrl.getMyPublish + "?trd_session=" + this.data.trd_session + "&methodId=" + id,
      success: res => {
        if (res.data.success) {
          if (id == 2) {
            this.setData({
              PTJList: res.data.obj,
            })
          } else {
            this.setData({
              activityList: res.data.obj,
            })
          }

        }
        wx.hideLoading();
      }
    })
  },

  //选择模块
  selectRecord(e) {
    var id = e.currentTarget.dataset.id;

    this.setData({
      isParttime: id == 1 ? false : true
    })
    console.log(this.data.isParttime);


  },
  //跳转兼职详情
  goToJobDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/job_detail/job_detail?id=' + id,
    })
  },


  //下架兼职
  offShelve(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if (this.data.PTJList[index].audit_status != 2) {
      wx.showModal({
        title: '提示',
        content: '该兼职将被下架！',
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: requestUrl.updatePtjWechat + "?trd_session=" + this.data.trd_session,
              method: "POST",
              data: {
                "obj": {
                  "jobId": id,//活动id
                  "auditStatus": 2//表示下架活动状态
                }
              },
              success: res => {
                this.setData({
                  ["PTJList[" + index + "].audit_status"]: 2
                })
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },
  //下架活动
  offActShelve(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if (this.data.activityList[index].activityStatus!=2){
    wx.showModal({
      title: '提示',
      content: '该活动将被下架！',
      success: (res) => {
        if (res.confirm) {
          
          wx.request({
            url: requestUrl.updateActWechat + "?trd_session=" + this.data.trd_session,
            method: "POST",
            data: {
              "obj": {
                "id": id,//活动id
                "activityStatus": 2//表示下架活动状态
              }
            },
            success:res=>{
              this.setData({
                ["activityList[" + index +"].activityStatus"]:2
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
  },

  //查看报名
  goToEnlist(e) {

    var option = e.currentTarget.dataset.option;
    var id = e.currentTarget.dataset.id + "," + option;
    wx.navigateTo({
      url: '/pages/enlist_manger/enlist_manger?id=' + id,
    })
  },
  //跳转活动详情
  goToActivityDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/activity_detail/activity_detail?id=' + id,
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})