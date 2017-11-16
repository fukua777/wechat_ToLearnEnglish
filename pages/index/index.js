//index.js
//获取应用实例
var app = getApp();

var md5 = require('../../src/js/md5.js');

Page({
  data: {
    inputValue: '',
    userInfo: {},
    button_is_disabled: true,
    button_type: 'default',
    url: 'http://openapi.youdao.com/api',
    appKey: '756f2b3ab40cf4be',
    key: 'F6UbvQw8DN2d3tXnLvjg8hCQXkFBXynA',
    salt: Math.floor(Math.random() * 10),
    content: {
      query: '',
      explains: '',
      translation: '',
      web: ''
    },
    errorTips: ''
  },
  requesFunc: function(){
    if (!this.data.inputValue) {
      return;
    }
    var req = this.data.inputValue;
    var that = this;
    wx.request({
      url: this.data.url,
      data: {
        'q': req,
        'from': 'EN',
        'to': 'zh_CHS',
        'appKey': this.data.appKey,
        'salt': this.data.salt,
        'sign': md5(this.data.appKey + req + this.data.salt + this.data.key)
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        if(res.data.errorCode == 0){
          that.setData({
            content:{
              query: res.data.query,
              translation: res.data.translation,
              explains: res.data.basic ? res.data.basic.explains || '' : '',
              web: res.data.web || []
            }
          });
        }else{
          that.setData({
            errorTips: '查询失败，错误代码'+res.data.errorCode
          });
        }
      },
      fail: function(err) {
        that.setData({
          errorTips: '查询失败，' + err.errMsg
        });
      },
    });
  },
  //事件处理函数
  input: function(e){
    this.setData({
      inputValue: e.detail.value
    });
    if(this.data.inputValue){
      this.setData({
        button_is_disabled: false,
        button_type: 'primary'
      });
    }else{
      this.setData({
        button_is_disabled: true,
        button_type: 'default',
        content: {
          query: '',
          explains: '',
          translation: '',
          web: ''
        },
        errorTips: ''
      });
    }
  },
  search: function(e){
    this.requesFunc(this.data.inputValue);
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
