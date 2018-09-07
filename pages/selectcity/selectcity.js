// pages/selectcity/selectcity.js
var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
var qqmapsdk;
import requestUrl from "../../common/api.js"
// let location = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    characterList: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
    ],
  
    locatedCity: "定位中...",
  allCityList:[],//所有城市
  hotCity:[],//热门城市
  toView:"G"//锚点位置
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllCity(1);// 请求所有城市
    this.getAllCity(2);//请求热门城市
    
    qqmapsdk = new QQMapWX({
      key: 'V2KBZ-X55K3-VY73G-YTBQI-7O5AS-SABLU'
    });
    qqmapsdk.search({//根据当前城市
      keyword: '城市',
      success: (res) => {

        var location = {};
        var locatedCity = res.data[0].ad_info.city.split("").slice(0, 2).join("");
        location.lat = res.data[0].location.lat;
        location.lng = res.data[0].location.lng;
        location.city = locatedCity;
        this.setData({
          locatedCity: location.city
        })
        wx.setStorage({
          key: 'location',
          data: location,
        })
      },
    });



  },



  //选择城市
  selectCity(e) {
    var city = e.currentTarget.dataset.city;
    wx.showToast({
      title: '跳转到' + city,
      success: res => {
        var page;
        wx.getSystemInfo({
          success: res => {
              page = getCurrentPages()[getCurrentPages().length - 2];
          }
        })
        if (city != this.data.locatedCity) {
          //根据城市逆向解析获取经纬度
          qqmapsdk.geocoder({
            address: city,
            success: res => {
              var location = {};
              location.lng = res.result.location.lng;
              location.lat = res.result.location.lat;
              location.city = city;
              wx.setStorage({
                key: 'location',
                data: location,
                success() {
                  wx.navigateBack({
                    success() {
                      
                      if (page == undefined || page == null) return;
                      page.onLoad();

                    }
                  })
                }
              })
            }
          })

        } else {
          wx.navigateBack({
            success() {
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }

      }
    })
  },

//锚点滑动
  jumpTo (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    console.log(e.currentTarget.dataset.opt);
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },


  //所有城市数据渲染获取
  getAllCity(id) {
    wx.showLoading({
      title: '加载中...',
    })
wx.request({
  url: requestUrl.getCityList+"?type="+id,
  success:res=>{
    if(res.data.success){
      if (id == 1){
      let allCityList = res.data.obj
      for (let key in allCityList ){
        let item = allCityList[key].city_list
        for (let i in item){
          item[i].city_name = item[i].city_name.replace("市","");
        }
      }
      this.setData({
        allCityList: allCityList
      })
    }else{
        let hotCity = res.data.obj;
        for (let i in hotCity) {
          hotCity[i].city = hotCity[i].city.replace("市", "");
        }
        this.setData({
          hotCity: hotCity
        })
    }
    }
    wx.hideLoading();
  }
})
  },
 
 
  //热门城市数据
  getHotCity() {
    wx.request({
      url: requestUrl.getCityList + "?type=2",
      success: res => {

      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})