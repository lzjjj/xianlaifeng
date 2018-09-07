//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
var qqmapsdk;
import requestUrl from "../../common/api.js"
const util = require("../../utils/util.js");

Page({
  data: {
    windowHeight:"",
    showNone:false,//无数据时显示无数据图片
    pageNum: 1,
    canRequest: true,//是否可以继续下拉刷新
    locatedCity: "",//定位城市
    showFilter: false,//是否显示筛选区域
    isArea: false,//是否选择区域
    isType: false,//是否选择类型
    isTime: false,//是否选择时间
    filterItemName: "",//筛选名称
    userInfo: {},//用户信息
    timeTypeList: [//筛选内容列表
      { "timeTypes_String": "", "name": "全部", "isSelect": true },
      { "timeTypes_String": "1,2", "name": "短期兼职", "isSelect": false },
      { "timeTypes_String": "3", "name": "长期兼职", "isSelect": false },
      { "timeTypes_String": "2,3", "name": "周末兼职", "isSelect": false },
    ],
    postData: {
      "jobTypeIds_String": "",
      "workDistrict": "",
      "timeTypes_String": "",
      "latitude": "",
      "longitude": "",
      "auditStatus": 1,   //表示通过审核的兼职
      "workCity":"",
    },//请求发送参数
    joblist: [//兼职信息列表

    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        if (res.windowHeight) {
          
          this.setData({
            windowHeight: res.windowHeight+"px"
          })
          console.log("------------------");
          console.log(this.data.windowHeight);
        }
      },
    })
   
    
    qqmapsdk = new QQMapWX({
      key: 'V2KBZ-X55K3-VY73G-YTBQI-7O5AS-SABLU'
    });
    wx.getStorage({
      key: 'location',
      success: (res) => {
        this.setData({
          pageNum:1,
          locatedCity: res.data.city,
          ['postData.latitude']: res.data.lat,
          ['postData.longitude']: res.data.lng,
          ['postData.workCity']: res.data.city+"市"
        })

        this.getAreaList(res.data.city + "市");
        this.getJobTypeList();
        this.getjobList(1);

       
      },
      fail:(res)=> {

        qqmapsdk.search({
          keyword: '城市',
          success:(res)=> {
            var location = {};
            var locatedCity = res.data[0].ad_info.city.replace("市","");
            location.lat = res.data[0].location.lat;
            location.lng = res.data[0].location.lng;
            location.city = locatedCity;
            this.setData({
              locatedCity: locatedCity,
              ["postData.latitude"]: location.lat,
              ["postData.longitude"]: location.lng,
              ['postData.workCity']: res.data[0].ad_info.city
              
            })
            wx.setStorage({
              key: 'location',
              data: location,
            })
            this.getAreaList(res.data[0].ad_info.city);
            this.getJobTypeList();
            this.getjobList(1);
           
            
          },

        });

      }

    })


    if (app.globalData.userInfo) {
     

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        var userInfo = res.userInfo;
        var that = this;
        this.setData({
          userInfo: res.userInfo,
        })

      }
    } else {

      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {

          var userInfo = res.userInfo;
          var that = this;
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,

          })
        }
      })
    }
  },




  //获取兼职列表接口
  getjobList(request_way) {
    // request_way 0代表拉下加载，1代表正常加载
    wx.showLoading({
      title: '加载中...',
    })

    var pageNum = this.data.pageNum;
    var data = this.data.postData;
    wx.request({
      url: requestUrl.getJobList + "?pageSize=10&pageNum=" + pageNum,
      method: "POST",
      data: {
        "obj": data
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
          joblist: request_way == 0 ? this.data.joblist.concat(joblist) : joblist,
        })
       
        this.setData({
          showNone: this.data.joblist.length == 0 ? true : false,
          canRequest: res.data.total > this.data.joblist.length ? true : false
        })
        wx.hideLoading({
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
      }
    })
  },

  //跳转兼职详情
  goToJobDetail(e) {
    var jobId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '/pages/job_detail/job_detail?id=' + jobId,
    })
  },

  //筛选请求
  filterJobList() {
    this.setData({
      showFilter: false,
      isArea: false,
      isType: false,
      isTime: false,
      pageNum: 1
    })
    this.getjobList(1);

  },


  //筛选点击选择
  selectFilter(e) {
    var id = e.currentTarget.dataset.id;
    var diffType = e.currentTarget.dataset.difftype;
    var index = e.currentTarget.dataset.index;
    switch (diffType) {

      case "area":
        var isSelect = this.data.areaList[index].isSelect
        if (index != 0) {
          if (isSelect) {
            var list = this.data.postData.workDistrict.split(",");
            for (var i in list) {
              if (list[i] == id) {
                list.splice(i, 1);
              }
            }
          } else {
            var list = this.data.postData.workDistrict != "" ? this.data.postData.workDistrict.split(",") : [];
            list.push(id);
          }
          this.setData({
            ["areaList[0].isSelect"]: false,
            ["postData.workDistrict"]: list.join(","),
            ["areaList[" + index + "].isSelect"]: !isSelect
          })
        } else {
          var areaList = this.data.areaList;
          for (var item in areaList) {
            areaList[0].isSelect = true;
            if (item != 0) {

              areaList[item].isSelect = false;
            }

          }
          this.setData({
            ["postData.workDistrict"]: "",
            areaList: areaList
          })
        }
        break;
      case "jobType":
        var isSelect = this.data.jobTypeList[index].isSelect
        if (index != 0) {
          if (isSelect) {
            var list = this.data.postData.jobTypeIds_String.split(",");
            for (var i in list) {
              if (list[i] == id) {
                list.splice(i, 1);
              }
            }
          } else {
            var list = this.data.postData.jobTypeIds_String != "" ? this.data.postData.jobTypeIds_String.split(",") : [];
            list.push(id);
          }


          this.setData({
            ["jobTypeList[0].isSelect"]: false,
            ["postData.jobTypeIds_String"]: list.join(","),
            ["jobTypeList[" + index + "].isSelect"]: !isSelect
          })
        } else {
          var jobTypeList = this.data.jobTypeList;
          for (var item in jobTypeList) {
            jobTypeList[0].isSelect = true;
            if (item != 0) {
              jobTypeList[item].isSelect = false;
            }

          }
          this.setData({
            ["postData.jobTypeIds_String"]: "",
            jobTypeList: jobTypeList
          })
        }
        break;
      case "timeType":
        var isSelect = this.data.timeTypeList[index].isSelect
        if (index != 0) {
          if (isSelect) {
            var list = this.data.postData.timeTypes_String.split(",");
            for (var i in list) {
              if (list[i] == id.split(",")[0]) {
                list.splice(i, 2);
              }
            }
          } else {
            var list = this.data.postData.timeTypes_String != "" ? this.data.postData.timeTypes_String.split(",") : [];
            list.push(id);
          }



          this.setData({
            ["timeTypeList[0].isSelect"]: false,
            ["postData.timeTypes_String"]: list.join(","),
            ["timeTypeList[" + index + "].isSelect"]: !isSelect
          })
        } else {
          var timeTypeList = this.data.timeTypeList;
          for (var item in timeTypeList) {
            timeTypeList[0].isSelect = true;
            if (item != 0) {
              timeTypeList[item].isSelect = false;
            }
          }
          this.setData({
            ["postData.timeTypes_String"]: "",
            timeTypeList: timeTypeList
          })
        }
        break;
    }

  },

  //请求区域数据列表
  getAreaList(city) {

    wx.request({
      url: requestUrl.getArea,
      method: "POST",
      data: { "city": city },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' // 默认值
      },
      success: res => {
        var areaList = res.data.obj;
        var all = {
          "district": "全部",
          "isSelect": true
        }
        areaList.unshift(all);

        for (var item in areaList) {
          if (item != 0) {
            areaList[item].isSelect = false;
          }

        }
        this.setData({
          areaList: areaList
        })
      }
    })
  },

  //请求兼职类型列表
  getJobTypeList() {
    wx.request({
      url: requestUrl.getJobType,
      success: res => {
        var jobTypeList = res.data.obj
        var all = {
          "job_type": "全部",
          "isSelect": true
        }
        jobTypeList.unshift(all);
        for (var item in jobTypeList) {
          if (item != 0) {
            jobTypeList[item].isSelect = false;

          }
        }
        this.setData({
          jobTypeList: jobTypeList
        })
      }
    })
  },


  //显示筛选区域
  showFilterArea(e) {
    var value = e.currentTarget.dataset.value;
    if (value == "区域") {
      this.setData({
        isArea: !this.data.isArea,
        isType: false,
        isTime: false,
        showFilter: this.data.isArea?false:true,
        filterItemName: value
      })
     
    }
    if (value == "类型") {
      this.setData({
        isArea: false,
        isType: !this.data.isType,
        isTime: false,
        showFilter: this.data.isType ? false : true,
        filterItemName: value
      })
    }
    if (value == "时间") {
      this.setData({
        isArea: false,
        isType: false,
        isTime: !this.data.isTime,
        showFilter: this.data.isTime ? false : true,
        filterItemName: value
      })
    }
    
  },


  //隐藏筛选区域
  hideFilter() {
    this.setData({
      showFilter: false,
      isArea: false,
      isType: false,
      isTime: false,
    })
  },

  //跳转搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/searchjob/searchjob?id=1',
    })
  },

  //跳转选择城市
  selectCity() {
    wx.navigateTo({
      url: '/pages/selectcity/selectcity',
    })
  },

  //滚动条到达底部触发函数
  onReachBottom: function () {
    console.log("11111111");
    if (this.data.showNone){
      return;
    }
      
    if (this.data.canRequest) {


      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getjobList(0);
    } else {
      wx.showToast({
        title: '已到底部',
      })
    }
  },
  pullDown(e){
    console.log(e);
  },
  onPullDownRefresh(){
    wx.showNavigationBarLoading() 
    this.setData({
      pageNum: 1
    })
    this.getjobList(1); 
    
   }
})
