// pages/activity/activity.js
var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
import requestUrl from "../../common/api.js"
import util from "../../utils/util.js"
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNone: false,//无数据时显示无数据图片
    locatedCity: "",//定位城市
    activityList: [],//活动列表
    pageNum: 1,
    canRequest: true,
    "postData": {
      "activityCity": "",
      "activityName": "",
      "activityStatus": "1",//1:表示显示审核通过的活动
      "activityLongitude": "",
      "activityLatitude": ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    qqmapsdk = new QQMapWX({
      key: 'V2KBZ-X55K3-VY73G-YTBQI-7O5AS-SABLU'
    });
    wx.getStorage({
      key: 'location',
      success: (res) => {
        this.setData({
          pageNum: 1,
          ['postData.activityLatitude']: res.data.lat,
          ['postData.activityLongitude']: res.data.lng,
          ['postData.activityCity']: res.data.city+"市",
          locatedCity: res.data.city
        })
        this.getActivityList(1);
      },
      fail: (res) => {
        qqmapsdk.search({
          keyword: '城市',
          success: (res) => {
            var location = {};
            var locatedCity = res.data[0].ad_info.city.replace("市", "");
            location.lat = res.data[0].location.lat;
            location.lng = res.data[0].location.lng;
            location.city = locatedCity;
            this.setData({
              locatedCity: locatedCity,
              pageNum: 1,
              ['postData.activityLatitude']: location.lat,
              ['postData.activityLongitude']: location.lng,
              ['postData.activityCity']: res.data[0].ad_info.city,
            })
            wx.setStorage({
              key: 'location',
              data: location,
            })
            this.getActivityList(1);
          },

        });

      }

    })

  },



  //获取定位城市的活动列表
  getActivityList(request_way) {
    wx.showLoading({
      title: "加载中...",
    })
    let pageNum = this.data.pageNum;
    let data = this.data.postData;
    wx.request({
      url: requestUrl.activityList + "?pageSize=10&pageNum=" + pageNum,
      data: { "obj": data },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {

        let activityList = res.data.obj;
        for (let i in activityList){
          activityList[i].activityStartTime = util.ridSecond(activityList[i].activityStartTime)
        }
        this.setData({
          activityList: request_way == 0 ? this.data.activityList.concat(activityList) : activityList,
        })
        this.setData({
          showNone: this.data.activityList.length == 0 ? true : false,
          canRequest: res.data.total > this.data.activityList.length ? true : false
        })
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
      }
    })


  },

  //跳转活动详情
  goToActivityDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity_detail/activity_detail?id=' + id,
    })
  },

  //跳转选择城市
  goToSelectCity() {
    wx.navigateTo({
      url: '/pages/selectcity/selectcity',
    })
  },

  //跳转搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/searchjob/searchjob?id=2',
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showNone) {
      return;
    }
    if (this.data.canRequest) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getActivityList(0);
    } else {
      wx.showToast({
        title: '已到底部',
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() 
    this.setData({
      pageNum: 1
    })
    this.getActivityList(1);
  }
})