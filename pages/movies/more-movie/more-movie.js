// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //在data中设置一个中间变量，让几个函数共享这个中间变量，设置空字符串""是因为另外一个函数中有需要字符串的变量，如title
    navigateTitle: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    //函数使用中间变量navigateTitle
    this.data.navigateTitle = category;
    console.log(category);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {
        //success
      }
    })  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (event) {
  
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