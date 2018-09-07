// pages/searchjob/searchjob.js
import requestUrl from "../../common/api.js"
import util from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,//请求页码
    showJobList: false,//展示列表数据
    showRecord: true,//展示搜索记录
    canRequest: true,//是否可以继续请求
    joblist: [//搜索列表

    ],
    listId: 1,//1表示兼职，2表示活动
    inputValue: "",//搜索框内容
    showClear: false,//展示清除按钮
    showNone: false,
    location: "",//定位信息
    searchRecord: [],//搜索记录
    trd_session: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
    this.setData({
      listId: options.id,//1表示兼职搜索，2表示活动搜索
    })
    }
    wx.getStorage({
      key: 'location',
      success: (res) => {
        this.setData({
          location: res.data
        })
      },
    })
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        console.log(res.data);
        this.setData({
          trd_session: res.data
        })
          this.getSearchHistory();
      },
    })
  },

  //监听input框 
  bindKeyInput: function (e) {

    this.setData({
      inputValue: e.detail.value,

    })
    if (e.detail.value != "") {
      this.setData({
        showClear: true,
      })
    }
    else {
      this.setData({
        showRecord: true,
        showClear: false,
        showJobList: false,
        joblist:[],
      })
    }

  },

  //获取用户活动搜索历史
  getSearchHistory() {
    wx.request({
      url: this.data.listId == 1 ? requestUrl.getSearchHistory + "?trd_session=" + this.data.trd_session + "&method=job" : requestUrl.getSearchHistory + "?trd_session=" + this.data.trd_session + "&method=activity" ,
      success: res => {
        if (res.data.obj!=""){
          console.log(res.data.obj);
          this.setData({
            searchRecord: res.data.obj.split(",")
          })
        }
      }
    })


  },
  
  
  //清除搜索记录
  clearSearchHistory(){
      wx.request({
        url: this.data.listId == 1 ? requestUrl.clearSearchHistory + "?trd_session=" + this.data.trd_session + "&method=job" : requestUrl.clearSearchHistory + "?trd_session=" + this.data.trd_session + "&method=activity",
        success:res=>{
          if(res.data.success){
            this.setData({
              searchRecord:[],
              showRecord:false
            })
          }
        }
      })
  },

 

  //获取活动数据列表
  getActivityList() {

    let pageNum = this.data.pageNum;

    wx.request({
      url: requestUrl.activityList + "?pageSize=10&pageNum=" + pageNum + "&method=activity&trd_session=" + this.data.trd_session,
      method: "POST",
      data: {
        "obj": {
          "activityCity": this.data.location.city + "市",
          "activityName": this.data.inputValue,
          "activityStatus": 1,
          "activityLongitude": this.data.location.lng,
          "activityLatitude": this.data.location.lat
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        var joblist = res.data.obj;

        this.setData({
          joblist: this.data.joblist.concat(joblist),
          canRequest: res.data.total > this.data.joblist.length ? true : false
        })
        this.setData({
          showNone: this.data.joblist.length == 0 ? true : false
        })
        this.getSearchHistory();//点击搜索后，搜索记录刷新

        wx.hideLoading({
        })
      }
    })
  },

  //获取兼职列表接口
  getjobList() {
    // request_way 0代表拉下加载，1代表正常加载
    wx.showLoading({
      title: '加载中...',
    })
    var pageNum = this.data.pageNum;
    wx.request({
      url: requestUrl.getJobList + "?pageSize=10&pageNum=" + pageNum + "&method=job&trd_session=" + this.data.trd_session,
      method: "POST",
      data: {
        "obj": {
          "workCity": this.data.location.city + "市",
          "jobName": this.data.inputValue,
          "jobTypeIds_String": "",
          "workDistrict": "",
          "timeTypes_String": "",
          "latitude": this.data.location.lng,
          "longitude": this.data.location.lat,
          "auditStatus": 1,   //表示通过审核的兼职
        }
      },
      success: res => {

        var joblist = res.data.obj;
        for (var item in joblist) {
          var startTime = joblist[item].releaseTime;
          var startWorkDate = joblist[item].startWorkDate;
          joblist[item].startWorkDate = util.formatTime(startWorkDate);
          joblist[item].intervalTime = util.pastTime(startTime);
        }

        this.setData({

          joblist: this.data.joblist.concat(joblist),
          canRequest: res.data.total > this.data.joblist.length ? true : false
        })
        this.setData({
          showNone: this.data.joblist.length == 0 ? true : false
        })
        this.getSearchHistory();//点击搜索后，搜索记录刷新
        
        wx.hideLoading({
        })
      }
    })
  },

  //清除搜索框内容
  clearInput() {
    this.setData({
      inputValue: "",
      showClear: false,
      showJobList: false,
      showRecord: true,
      showNone: false,
    })
  },

  //搜索兼职信息
  searchGoods() {
    if (this.data.inputValue!=""){
    this.setData({
      joblist: [],
      pageNum:1,
    })
    if (this.data.listId == 1) {
      this.getjobList();
    } else {
      this.getActivityList();
    }

    this.setData({
      showJobList: true,
      showRecord: false,

    })
  }else{
    wx.showToast({
      title: '搜索内容为空',
      image: "/imgs/warn.png"
    })
  }
  },


  //点击搜索记录
  tapRecord(e) {
    var inputValue = e.target.dataset.value;
    this.setData({
      joblist: [],
      inputValue: inputValue,
      showJobList: true,
      showRecord: false,
      showClear: true,
    })
    if (this.data.listId == 1) {
      this.getjobList();
    } else if (this.data.listId == 2) {
      this.getActivityList();
    }

  },

  //跳转活动详情
  goToActivityDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity_detail/activity_detail?id=' + id,
    })
  },
  //跳转兼职详情
  goToJobDetail(e) {
    var jobId = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '/pages/job_detail/job_detail?id=' + jobId,
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
    if (this.data.showNone) {
      return;
    }
    if (this.data.canRequest) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      if (this.data.listId == 1) {
        this.getjobList();
      } else if (this.data.listId == 2) {
        this.getActivityList();
      }

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

  }
})