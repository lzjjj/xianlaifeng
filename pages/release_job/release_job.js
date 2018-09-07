// pages/release_job/release_job.js
import {  sexList, calculateTypeList, payUnitList } from "../../common/const.js"
import requestUrl from "../../common/api.js"
let re = /^[0-9]+.?[0-9]*$/;
var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canRequest: true,
    jobTypeListAll:[],
    jobTypeList: [],//兼职类型
    sexList: sexList,//性别
    calculateTypeList: calculateTypeList,//结算方式
    payUnitList: payUnitList,//结算方式单位
    startTime:"",
    endTime:"",
    jobData: {
      "jobName": "",//兼职标题
      "jobType": "请选择",//兼职类型
      "limitNumber": "",//招聘人数 
      "sexDemand": "请选择",//性别
      "calculateMoneyType": "请选择",//结算方式
      "wage": "",//工资
      "wageType": "元/时",//工资单位
      "startWorkDate": "请选择",//开始工作日期
      "endWorkDate": "请选择",//结束工作日期
      "workTime": "请选择",//工作时间段
      "workProvince": "",
      "workCity": "",
      "workDistrict": "",
      "workStreet": "",//工作地点
      "jobContent": "",//工作描述
      "timeType": "1",//工作所属时间类型
      "longitude": "",
      "latitude":""
    },
    resume:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'V2KBZ-X55K3-VY73G-YTBQI-7O5AS-SABLU'
    });
    this.getPTJType();
    this.getResume();
  },

  //获取个人简历
  getResume() {
    wx.getStorage({
      key: 'trd_session',
      success: res => {
        wx.request({
          url: requestUrl.getResume + "?trd_session=" + res.data,
          success: res => {
            this.setData({
              resume: res.data.obj
            })
          }
        })
      },
    })
  },

  //绑定开始时间
  bindStartTime(e) {
    this.setData({
      startTime: e.detail.value 
    })
  },
  //绑定结束日期
  bindEndime(e) {
    this.setData({
      endTime: e.detail.value,
      ["jobData.workTime"]: this.data.startTime + "~" + e.detail.value
    })
  },
//获取兼职类型
getPTJType(){
  wx.request({
    url: requestUrl.getJobType,
    success: res => {
      var jobTypeList = res.data.obj;
     var  jobTypeListAll =[]
      for (var i in jobTypeList){
        jobTypeListAll.push(jobTypeList[i].job_type);
      }
      this.setData({
        jobTypeList: jobTypeList,
        jobTypeListAll: jobTypeListAll
      })
    }
  })
},
  //填写兼职名称
  changeJobName(e) {
    this.setData({
      ["jobData.jobName"]: e.detail.value
    })


  },

  //填写兼招聘人数
  changeLimitNumber(e) {
    if (re.test(e.detail.value)) {
      this.setData({
        ["jobData.limitNumber"]: e.detail.value
      })

    } else {
      wx.showToast({
        title: '输入的不合法',
        image: "/imgs/warn.png",

      })
    }
  },

  //选择兼职类型
  changeJobType(e) {
    let index = e.detail.value;
    let value = this.data.jobTypeList[index].job_type;
    let id = this.data.jobTypeList[index].id
    this.setData({
      ['jobData.jobType']: value,
      ['jobData.jobTypeId']: id
    })

  },
  //选择性别
  changeSexDemand(e) {
    var index = e.detail.value;
    var value = this.data.sexList[index];
    this.setData({
      ['jobData.sexDemand']: value
    })

  },
  //选择结算方式
  changeCalculateMoneyType(e) {
    var index = e.detail.value;
    var value = this.data.calculateTypeList[index];
    this.setData({
      ['jobData.calculateMoneyType']: value
    })

  },

  //填写工资
  changeWage(e) {

    if (re.test(e.detail.value)) {
      this.setData({
        ["jobData.wage"]: e.detail.value
      })
    } else {
      wx.showToast({
        title: '输入的不合法',
        image: "/imgs/warn.png",

      })

    }

  },

  //选择工资单位
  changeWageType(e) {
    var index = e.detail.value;
    var value = this.data.payUnitList[index];
    this.setData({
      ['jobData.wageType']: value
    })
  },


  //选择开始工作日期
  bindStartWorkDate(e) {
    this.setData({
      ["jobData.startWorkDate"]: e.detail.value
    })
  },

  //选择结束工作日期
  bindEndWorkDate(e) {
    this.setData({
      ["jobData.endWorkDate"]: e.detail.value
    })
  },

  // //选择工作时间段
  // changeWorkTime(e) {
  //   this.setData({
     
  //   })
  //   // console.log(this.data.jobData.workTime);
  // },

  //选择地理位置
  getLocation() {
    var that = this;
    wx.chooseLocation({
      success:(res)=> {
        // that.setData({
        //   ['jobData.workStreet']: res.address
        // })
        var street = res.address;
        var name = res.name;
        if (street.indexOf("省") >= 0 && street.indexOf("市") >= 0 && street.indexOf("区") >= 0) {
          this.setData({
            ['jobData.workProvince']: street.slice(0, 3),
            ['jobData.workCity']: street.slice(3, 6),
            ['jobData.workDistrict']: street.slice(6, 9),
            ['jobData.workStreet']: name,
            ['jobData.latitude']: res.latitude,
            ['jobData.longitude']: res.longitude,
          })
        } else {
          qqmapsdk.geocoder({
            address: street,
            success: res => {
              console.log(res);
              let address = res.result.address_components;
              this.setData({
                ['jobData.workProvince']: address.province,
                ['jobData.workCity']: address.city,
                ['jobData.workDistrict']: address.district,
                ['jobData.workStreet']: name,
                ['jobData.latitude']: res.result.location.lat,
                ['jobData.longitude']: res.result.location.lng,
              })
            }
          })

        }
      }
    }

    )
  },

  //输入兼职描述
  changeJobContent(e) {

    this.setData({
      ["jobData.jobContent"]: e.detail.value
    })

  },

  //接口请求
  releaseJob() {
    var data = this.data.jobData;
    
   
    data.sexDemand = data.sexDemand == "男" ? "1" : (data.sexDemand == "女" ? "2" : "3");
    data.calculateMoneyType = data.calculateMoneyType == "日结" ? "1" : (data.calculateMoneyType == "月结" ? "2" : "3");
    data.startWorkDate = data.startWorkDate + " " + "00:00:00";
    data.endWorkDate = data.endWorkDate + " " + "00:00:00";
    console.log(data);
    for (var key in data) {
      if (data[key] == "") {
        this.setData({
          canRequest: false
        })
        wx.showToast({
          title: '发布信息不完整！',
          image: "/imgs/warn.png",

        })

      }
    }
    if (this.data.canRequest) {
      wx.getStorage({
        key: 'trd_session',
        success: (res) => {
          wx.request({
            url: requestUrl.releaseJob + "?trd_session=" + res.data,
            method: "POST",
            data: { "obj": data },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (res) => {

              if (res.data.success == true) {
                wx.showToast({
                  title: '添加成功',
                  success() {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                })
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                  image: "/imgs/warn.png",

                })
              }
            }
          })
        },
      })
    }
  }

})