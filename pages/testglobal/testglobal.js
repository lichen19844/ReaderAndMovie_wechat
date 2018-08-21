// pages/testglobal/testglobal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wx_id_testglobal: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (event) {
    console.log('app.globalData.wx_id is ', app.globalData.wx_id)
    //如果有页面通过导航传进来，会将刷新的全局变量传给testglobal.js
    var wx_id_testglobal = this.data.wx_id_testglobal;
    console.log('origin wx_id_testglobal is ', wx_id_testglobal)
    this.setData({
      wx_id_testglobal: app.globalData.wx_id
    });
    console.log('lasted wx_id_testglobal is ', this.data.wx_id_testglobal)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})