const app = getApp()
import requestUrl from "../../common/api.js"

Page({
  data: {
    sexList:["保密","男","女"],
    index: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: true,
    resume: {
    },
  },

  onLoad: function (options) {
    this.getResume();


    // if (options.id){
    //   this.setData({
    //     ['resume.id']: options.id
    //   })
    // }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else if (this.data.canIUse) {
      console.log(11);
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
            this.setData({
              resume: resume 
            })
          }
        })
      },
    })

  },

  //选择学校
  selectSchool() {
    wx.navigateTo({
      url: '/pages/select_school/select_school',
    })
  },
  //重设学校名称
  reSetSchoolName() {
    wx.getStorage({
      key: 'school',
      success: res => {
        this.setData({
          ['resume.school_name']: res.data.school_name,
          ['resume.user_school_id']: res.data.id
        })
      },
      fail: res => {

      }
    })
  },

  //保存按钮，重设简历
  resetResume() {
    var data={
      "obj":this.data.resume
    }
    wx.getStorage({
      key: 'trd_session',
      success: res=> {
        wx.request({
          url: requestUrl.updateWeChatUserInfo +"?trd_session="+res.data,
          data: data,
          method: "POST",
          success: res => {
            if(res.data.success==true){
            wx.showToast({
              title: '保存成功',
              
              success:res=>{
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

                    page.onLoad();
                  }
                })
              }
            })
            }
            else{
              wx.showToast({
                title: '保存失败',
                image: "/imgs/warn.png",
                success: res => {
                  wx.navigateBack({
                    
                   
                  })
                }
              })
            }
          }
        })
      },
    })
   
  },

//设置姓名
  setUserName(e){
    this.setData({
      ["resume.user_name"]:e.detail.value
    })
  },
  //设置体重
  setUserWeigh(e){
    this.setData({                                                                                                                                                                                                                                                                                                                                         
      ["resume.user_weigh"]: e.detail.value
    })
  },

//设置性别
  setUserSex(e){
    this.setData({
      ["resume.user_sex"]: e.detail.value
    })
  },

  //设置出生年月
  setUserBirthAge(e) {
    this.setData({
      ["resume.user_birth"]: e.detail.value
    })
  },

  //设置身高
  setUserHight(e) {
    this.setData({
      ["resume.user_high"]: e.detail.value
    })
  },

  //设置手机号码
  setUserPhone(e) {
    this.setData({
      ["resume.user_phone"]: e.detail.value
    })
  },

  //设置身高
  setUserHight(e) {
    this.setData({
      ["resume.user_high"]: e.detail.value
    })
  },


  //选择上传的简历头像
  changeHeadImg() {
   
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res=> {

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
             ["resume.user_img"]: data.obj,
            
           })
          }
        })
      }
    })
  },
})