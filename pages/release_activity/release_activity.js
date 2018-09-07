// pages/release_activity/release_activity.js
import requestUrl from "../../common/api.js"
var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicModal: false,
    actPic: [],
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    activityData: {
      "activityName": "",
      "activityDetails": "填写活动详情介绍，最多5000字",
      "activityPic": "",
      "activityProvince": "",
      "activityCity": "",
      "activityDistrict": "",
      "activityLocation": "",
      "activityPerson": "",
      "activityStartTime": "",
      "activityEndTime": "",
      "activityLatitude": "",
      "activityLongitude": ""
    },
    canRequest: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'V2KBZ-X55K3-VY73G-YTBQI-7O5AS-SABLU'
    });
    qqmapsdk.search({
      keyword: '城市',
      success: res => {
        console.log(res);
        var data = res.data[0];
        this.setData({
          ['activityData.activityProvince']: data.ad_info.province,
          ['activityData.activityCity']: data.ad_info.city,
          ['activityData.activityDistrict']: data.ad_info.district,
          ['activityData.activityLocation']: data.address.slice(9),
          ['activityData.activityLatitude']: data.location.lat,
          ['activityData.activityLongitude']: data.location.lng,
        })

      },

    });
    this.getModaImg();
  },

  //获取模板图片接口
  getModaImg() {
    wx.request({
      url: requestUrl.getActPic,
      success: res => {
        var actPic = res.data.obj;
        for (let i in actPic) {
          
          actPic[i].isShow = true;
        }
        this.setData({
          actPic: actPic
        })
      }
    })
  },

  //预览图片
  previewImg(e){
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },


  //局部隐藏和展示
  handlePartPic(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      ["actPic[" + index + "].isShow"]: !this.data.actPic[index].isShow
    })
  },
  //展开模板图片
  showModalPic(e) {
    this.setData({
      showPicModal: true
    })
  },
  //隐藏模板图片
  hideModalPic(e) {
    this.setData({
      showPicModal: false
    })
  },

//上传图片
upLoadImg(){

  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: res => {

      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths);
      wx.uploadFile({
        url: requestUrl.setUSerImage,
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
        },
        success: res => {
          var data = JSON.parse(res.data)
          this.setData({
            showPicModal: false,
            ["activityData.activityPic"]: data.obj,

          })
        }
      })
    }
  })
},

  //选择模板图片
  selectActPic(e) {
    var src = e.currentTarget.dataset.src;
    this.setData({
      showPicModal: false,
      ["activityData.activityPic"]: src,
    })
  },

  //绑定开始日期
  bindStartDate(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  //绑定开始时间
  bindStartTime(e) {
    this.setData({
      startTime: e.detail.value + ":00"
    })
  },
  //绑定结束日期
  bindEndDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  //绑定结束时间
  bindEndTime(e) {
    this.setData({
      endTime: e.detail.value + ":00"
    })
  },
  //补充地点
  setExtraLocation(e) {
    this.setData({
      ["activityData.activityDoor"]: e.detail.value
    })

  },



  //活动详细地点
  setActivityLocation(e) {
    this.setData({
      ["activityData.activityLocation"]: e.detail.value
    })
  },

  //绑定活动人数
  changeActivityNum(e) {
    let re = /^[0-9]+.?[0-9]*$/;
    if (re.test(e.detail.value)) {
      this.setData({
        ["activityData.activityPerson"]: e.detail.value
      })
    } else {
      wx.showToast({
        title: '输入的不合法',
        image: "/imgs/warn.png",

      })

    }

  },
  //绑定活动标题
  changeActivityTitle(e) {
    this.setData({
      ["activityData.activityName"]: e.detail.value
    })
  },

  //发布活动接口
  releaseActivity() {

    this.setData({
      ["activityData.activityStartTime"]: this.data.startDate + " " + this.data.startTime,
      ["activityData.activityEndTime"]: this.data.endDate + " " + this.data.endTime,
    })
    var activityData = this.data.activityData
    for (var key in activityData) {
      if (activityData[key] == "") {
        wx.showToast({
          title: '发布信息不完整',
          image: "/imgs/warn.png",
        })
        this.setData({
          canRequest: false
        })
        break;

      }
    }
    if (this.data.canRequest) {
      wx.getStorage({
        key: 'trd_session',
        success: res => {
          wx.request({
            url: requestUrl.releaseActivity + "?trd_session=" + res.data,
            method: "POST",
            data: {
              "obj": activityData
            },
            success: res => {
              if (res.data.success) {
                wx.showToast({
                  title: '活动信息已提交',
                  success: res => {
                    wx.switchTab({
                      url: '/pages/release/release',
                    })
                  }
                })
              }
            }
          })
        },
      })
    }
  },
 
 //跳转详情页面
 goToDetail(){
   wx.setStorage({
     key: 'details',
     data: this.data.activityData.activityDetails == "填写活动详情介绍，最多5000字" ? "" : this.data.activityData.activityDetails,
   })
   wx.navigateTo({
     url: '/pages/edit_descrition/edit_descrition',
   })
 },
 
  //输入活动描述
  changeActivityContent() {
    console.log("1213131313")
    wx.getStorage({
      key: 'details',
      success: (res)=> {
        this.setData({
          ["activityData.activityDetails"]: res.data
        })
      },
    })
   

  },

  //选择地理位置
  getLocation() {

    wx.chooseLocation({
      success: res => {
        console.log(res);
        var street = res.address;
        var name = res.name;
        if (street.indexOf("省") >= 0 && street.indexOf("市") >= 0 && street.indexOf("区") >= 0) {
          this.setData({
            ['activityData.activityProvince']: street.slice(0, 3),
            ['activityData.activityCity']: street.slice(3, 6),
            ['activityData.activityDistrict']: street.slice(6, 9),
            ['activityData.activityLocation']: name,
            ['activityData.activityLatitude']: res.latitude,
            ['activityData.activityLongitude']: res.longitude,
          })
        } else {
          qqmapsdk.geocoder({
            address: street,
            success: res => {
              console.log(res);
              let address = res.result.address_components;
              this.setData({
                ['activityData.activityProvince']: address.province,
                ['activityData.activityCity']: address.city,
                ['activityData.activityDistrict']: address.district,
                ['activityData.activityLocation']: name,
                ['activityData.activityLatitude']: res.result.location.lat,
                ['activityData.activityLongitude']: res.result.location.lng,
              })
            }
          })

        }
      }
    }

    )
  },
  onShareAppMessage: function () {

  }
})