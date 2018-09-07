//app.js
import requestUrl from "./common/api.js"
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
   
    // 登录
    wx.login({
      success: res => {
        var that = this;
        var code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getStorage({
          key: 'trd_session',
          success:res1=>{

            if (res1.data != undefined) {
              wx.request({

                url: requestUrl.login + "?trd_session=" + res1.data,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2=>{

                  if (res2.data.msg == 'noLogin') {
                    wx.request({

                      url: requestUrl.login + "?code=" + code,
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success:res3=> {
                      
                        wx.setStorage({
                          key: "trd_session",
                          data: res3.data.obj.trd_session
                        })

                      }
                    })
                  }


                }
              })
            }
            else {
            
              wx.request({

                url: requestUrl.login + "?code=" + code,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res4=>{
                 
                  wx.setStorage({
                    key: "trd_session",
                    data: res4.data.obj.trd_session
                  })

                }
              })
            }

          },
          fail: function () {
            wx.request({
              url: requestUrl.login + "?code=" + code,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success:res5=> {
              
                wx.setStorage({
                  key: "trd_session",
                  data: res5.data.obj.trd_session
                })

              }
            })
          }

        })
        this.getUserInfo();
      },
    })

  },

  //存储用户信息数据库
  setUserInfo(trd_session, userInfo) {

    wx.request({
      url: requestUrl.setUserInfo + "?trd_session=" + trd_session,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { "obj": userInfo },
      success: (res) => {

      }
    })
  },

  // 获取用户信息
  getUserInfo() {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.getStorage({
                key: 'trd_session',
                success: res => {
                  this.setUserInfo(res.data, this.globalData.userInfo)
                },
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
  },
  globalData: {
    userInfo: null
  }
})