//index.js
//获取应用实例
var app = getApp();

var md5 = require('../../src/js/md5.js');

Page({
  data: {
    inputValue: '',
    userInfo: {},
    url: 'http://openapi.youdao.com/api',
    appKey: '756f2b3ab40cf4be',
    key: 'F6UbvQw8DN2d3tXnLvjg8hCQXkFBXynA',
    salt: Math.floor(Math.random() * 10),
    explains: ''
  },
  requesFunc: function(req){
    if(!req){
      return;
    }
    console.log(this);
    var that = this;
    var explains = this.data.explains;
    wx.request({
      url: this.data.url,
      data: {
        'q': req,
        'from': 'EN',
        'to': 'zh_CHS',
        'appKey': this.data.appKey,
        'salt': this.data.salt,
        'sign': md5(this.data.appKey + req + this.data.salt + this.data.key).toUpperCase()
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        that.setData({
          explains: res.data.basic.explains || ''
        });
      },
      fail: function(err) {
        console.log(err);
      },
    });
  },
  //事件处理函数
  search: function(e){
    if(e.type == "input"){
      this.setData({
        inputValue: e.detail.value
      });
    } else if(e.type == "tap"){
      this.requesFunc(this.data.inputValue);
    }
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
