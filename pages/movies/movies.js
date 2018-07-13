// pages/movies/movies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250',
      data: {},
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      // wx.request请求中header一定要填写，但是“content-type”后面不能写“application/json”和空字符串。建议写成“content-type”：“json”
      success: function(res){
        console.log("success data is ", res)
        // console里虽然报的错误信息但实际是请求行为成功了
        //success返回参数在console里体现，有data数据,header,statusCode
        //这里的res是个参数，可以写成其它名字
      },
      fail: function(error){
        console.log("failed");
        console.log(error)
      },
      complete: function(){
        //complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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