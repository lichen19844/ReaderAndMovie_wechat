// pages/movies/movies.js

var app = getApp();

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
    // 拿到三组api的URL,放入onLoad函数里
    //注意api网址的格式：https://api.douban.com/v2/movie/top250?start=245&count=3
    //对应正常网页的格式：https://movie.douban.com/top250?start=245&count=3  其中start=245是有效的，而count=3以及total等Properties无效
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    // 下列异步函数虽然按顺序排列，但因为每个函数实际在每次调用所花费的时间会有不同，导致实际展现到页面的顺序会有变化
    this.getMovieListData(inTheatersUrl);
    this.getMovieListData(comingSoonUrl);
    this.getMovieListData(top250Url);

    // wx.request({
    //   url: 'https://api.douban.com/v2/movie/top250',
    //   data: {},
    //   method: 'GET',
    //   header: {
    //     "Content-Type": "json"
    //   },
    //   // wx.request请求中header一定要填写，但是“content-type”后面不能写“application/json”和空字符串。建议写成“content-type”：“json”
    //   success: function(res){
    //     console.log("success data is ", res)
    //     // console里虽然报的错误信息但实际是请求行为成功了
    //     //success返回参数在console里体现，有data数据,header,statusCode
    //     //这里的res是个参数，可以写成其它名字
    //   },
    //   fail: function(error){
    //     console.log("failed");
    //     console.log(error)
    //   },
    //   complete: function(){
    //     //complete
    //   },
    // })
  },

  getMovieListData: function(url){
    wx.request({
      url: url,
      //用不到 data: {},
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      //success函数拿到数据
      success: function(res){
        console.log("success data is ", res)
      },
      fail: function(error){
        console.log("failed");
        console.log(error)
      },
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