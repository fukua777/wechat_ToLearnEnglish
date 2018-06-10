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
    url: 'https://openapi.youdao.com/api',
    appKey: '756f2b3ab40cf4be',
    key: 'F6UbvQw8DN2d3tXnLvjg8hCQXkFBXynA',
    salt: Math.floor(Math.random() * 10),
    content: {
      query: '',
      explains: '',
      translation: '',
      web: '',
      audioUrl: ''
    },
    errorTips: ''
  },
  onReady: function(){
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
              web: res.data.web || [],
              audioUrl: res.data.tSpeakUrl || ''
            }
          });
          if (res.data && res.data.speakUrl && res.data.tSpeakUrl){
            that.sourceAudio.setSrc(res.data.speakUrl);
            that.resultAudio.setSrc(res.data.tSpeakUrl);
          }
          if (res.data && res.data.basic && res.data.basic['uk-speech'] && res.data.basic['us-speech']) {
            that.audioResultUkSpeech.setSrc(res.data.basic['uk-speech']);
            that.audioResultUsSpeech.setSrc(res.data.basic['us-speech']);
          }
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
          web: '',
          audioUrl: ''
        },
        errorTips: ''
      });
    }
  },
  search: function(e){
    this.requesFunc(this.data.inputValue);
  },
  audioSourceStart: function () {
    this.sourceAudio.play();
  },
  audioResultStart: function () {
    this.resultAudio.play();
  },
  audioResultUkSpeechFunc: function() {
    this.audioResultUkSpeech.play();
  },
  audioResultUsSpeechFunc: function() {
    this.audioResultUsSpeech.play();
  },
  onLoad: function () {
    this.sourceAudio = wx.createAudioContext('sourceAudio');
    this.resultAudio = wx.createAudioContext('resultAudio');
    this.audioResultUkSpeech = wx.createAudioContext('audioResultUkSpeech');
    this.audioResultUsSpeech = wx.createAudioContext('audioResultUsSpeech');

    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onUnload: function(){
    this.myAudio.destroy();
  },
  onShow: function(){
    
  }
})
