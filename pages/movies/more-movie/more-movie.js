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
    totalCount: 0,
    //isEmpty用来判断movies数据是不是第一次加载
    isEmpty: true,
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
    //在调用http之前data里的数据都是初始值，如movies:{} isEmpty:true
    util.http(dataUrl, this.processDoubanData);
  },

  //onReachBottom函数方法不要重复写，因小程序会自动生成一个空的函数，不然会以最后一次的生效。
  onReachBottom: function (event) {
    // 用console验证函数是否生效
    // 使用竖向滚动时，需要给 < scroll - view />一个固定高度，通过 WXSS 设置 height。
    console.log("加载更多");
    //小实验：在下拉函数里也可以写入网址动态变化的方法
    // this.data.totalCount += 20;
    var nextUrl = this.data.requestUrl + 
    "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    //在发起数据请求是loading，在绑定数据完后loading结束
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: "Loading..."
    })
  },

  processDoubanData: function (moviesDouban) {
    console.log(moviesDouban);
    var movies = [];
    for (var idx in moviesDouban.subjects) {
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
      //for循环后，根据idx的排序往movies数组中数据添加完毕
      movies.push(temp);
    };//for循环结束

    //将新旧数据进行整合
    var totalMovies = {};
    //不可以这么写，否则每次上滑都会初始化isEmpty
    // this.setData({
    //   isEmpty: true
    // });
    //不为空，如果要绑定新加载的数据，那么需要同旧有的数据合并在一起，并且因为判断里先有的这句，data{}里必须初始化isEmpty
    if (!this.data.isEmpty) {
      //this.data.movies是老数据，(movies)是新数据
      totalMovies = this.data.movies.concat(movies);
    }
    //第一次请求则需要不需要整合，并且需要改变isEmpty的状态
    else {
      //第一次的话就把刚加载的数据赋值给totalMovies，然后并把isEmpty变成false
      totalMovies = movies;
      //最好不这样写了 this.data.isEmpty = false;
      //初始加载之后的状态，有了首次的数据，需要同时将动态变量isEmpty设置false，便于第二次回到if else判断（不是之前，之前代表了还未初始加载，此时数据为空，isEmpty需设置true）
      this.setData({
        isEmpty: false
      });
    };
    this.setData({
      // movies: movies,
      movies: totalMovies      
    });
    // 计数器，数据绑定成功后才进行累加，每一次上滑会触发onReachBottom，再触发processDoubanData，每次totalCount累加20
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    wx.stopPullDownRefresh();
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
  //在scroll-view组件中，使用onPullDownRefresh目前有bug，真机没有效果
  onPullDownRefresh: function (event) {
    //重新加载页面，但是好像有bug
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    //在调用http之前将movies数据置空，否则会受totalMovies的concat方法影响
    this.data.movies = {};
    //同时将动态变量isEmpty变成true(数据置空，说明回到了初始加载之前)
    this.data.isEmpty = true;
    //注意也要讲totalCount置0，否则会叠加
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: 'Loading............'
    });
    //好像有bug一直会处于刷新状态
    // wx.startPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})