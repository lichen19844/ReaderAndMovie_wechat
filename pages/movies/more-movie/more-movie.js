var util = require('../../../utils/util.js');

var app = getApp();

// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //在data中设置一个中间变量，让几个函数共享这个中间变量，设置空字符串""是因为另外一个函数中接收的是字符串（如movies.js中的'正在热映'等）的变量，如title
    //实际上像navigateTitle: ""和movies: {}在data中不写也不会报错，但写了代码有易读性，这些中间变量都要初始化
    navigateTitle: "",
    movies: {},
    requestUrl: "",
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //category的来源方式可以参考post-detail.js中postId的来源
    var category = options.category;
    //函数使用中间变量navigateTitle
    this.data.navigateTitle = category;
    console.log(category);
    //在函数内初始化dataUrl
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        // "/v2/movie/in_theaters"的写法，小程序默认只加载前20条数据，即"?start=0&count=20"
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "电影Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    };
    //利用data里能够传递中间变量的特性，把dataUrl从这个函数传递到scrolltolower函数里
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  scrolltolower: function (event) {
    // 用console验证函数是否生效
    // 使用竖向滚动时，需要给 < scroll - view />一个固定高度，通过 WXSS 设置 height。
    console.log("加载更多");
    //小实验：在下拉函数里也可以写入网址动态变化的方法
    // this.data.totalCount += 20;
    var nextUrl = this.data.requestUrl + 
    "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
  },

  processDoubanData: function (moviesDouban) {
    console.log(moviesDouban)
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      console.log("subjects", idx, "is a subject data ", moviesDouban.subjects[idx]);
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      };
      var temp = {
        stars: util.converToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
      console.log("movies", idx, "is a movie data ", movies[idx]);
    };
    //写入网址动态变化的方法，每次加载页面，为下拉函数需要的数据做准备
    this.data.totalCount += 20;
    this.setData({
      movies: movies
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(event) {
    //动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function(res) {
        //success
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(event) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})