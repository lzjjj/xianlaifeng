// pages/enlist_manger/enlist_manger.js
import requestUrl from "../../common/api.js"
import util from "../../utils/util.js"
Page({
  data: {
    showNone: false,
    ActivityList: [],
    pageNum:1,
    id:"",
    option:"",
    canRequest:false
  },

  onLoad: function (options) {
    if (options.id) {
      var list = options.id.split(",");
      var id = list[0];
      var option = list[1];
      this.setData({
        id: id,
        option: option
      })
      this.getJoinUser(id, option);
    }
  },


  //获取报名列表
  getJoinUser(id, option) {
    var pageNum = this.data.pageNum;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: requestUrl.getJoinUser + "?pageSize=10&pageNum=" + pageNum,
      method: "POST",
      data: {
        "obj": {
          "actId": id, //活动或者兼职id
          "methodId": option //1:表示兼职   2：表示活动
        }
      }, success: res => {
        if (res.data.success) {
          let ActivityList = res.data.obj;
          if (ActivityList.length!=0){
            for (let key in ActivityList) {
              ActivityList[key].joinTime = util.pastTime(ActivityList[key].joinTime);
              ActivityList[key].isShow = false;
              ActivityList[key].user_age = util.getAge(ActivityList[key].user_birth+" 00:00:00");
            }
            ActivityList = this.data.ActivityList.concat(ActivityList);
          }
         
          this.setData({
            ActivityList: ActivityList,
            showNone: ActivityList.length == 0 ? true : false,
            canRequest: ActivityList.length < res.total?true:false,
            pageNum: ActivityList.length < res.total ? pageNum + 1 : pageNum
          })
          wx.hideLoading();

        }

      }
    })
  },


  //通过报名
  updateJoinStatus(e) {
    wx.showModal({
      title: '提示',
      content: '您将通过该报名申请',
      success: (res) => {
        if (res.confirm) {
          var id = e.currentTarget.dataset.id;
          var index = e.currentTarget.dataset.index;
          
          wx.request({
            url: requestUrl.updateJoinStatus,
            method: "POST",
            data: {
              "obj": {
                "id": id,//报名记录id
                "joinStatus": 1//1表示通过报名
              }
            },
            success: res => {
              if (res.data.success) {
                this.setData({
                  ["ActivityList[" + index + "].joinStatus"]: 1
                })
              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
   
  },

  //展示和隐藏的下拉框
  handleDiv(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      ['ActivityList[' + index + '].isShow']: !this.data.ActivityList[index].isShow
    })

  },

  onReachBottom() {
    if (this.data.canRequest){
      this.getJoinUser(this.data.id, this.data.option);
    }
  },
  onShareAppMessage: function () {

  }
})