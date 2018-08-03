var app = getApp();
var util = require('../../../utils/util.js');

// pages/movies/movie-detail/movie-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id;
    console.log(movieId);
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData);
  },

  //data拿到的是http里callback所拿到的res.data数据
  processDoubanData: function(data){
    //如果是空值，就直接返回，什么也不做，这时的setData中的movie就不会被设置更新，data中的movie数据就是初始化的空值
    if(!data){
      return;
    };
    console.log(data);
    //处理director数据，对绑定的movie变量填充，更新绑定变量
    //先定义一个属性值为空的director变量对象，用来做判空处理
    //判空的目的是怕API数据中的新老数据完整度不一致，只能根据经验观察来优先判断概率较大的空值数据，如director，重点观察数据的二级以下数据
    var director = {
      avatar: "",
      name: "",
      id: "",
    };
    // directors[0]取自console测试得到的数据，if不写else的隐含意思是不满足条件就不做任何事
    if(data.directors[0] != null) {
      if(data.directors[0].avatar != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    };
    var movie = {
      movieImg: data.images ? data.images.large: "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      //join()函数的功能为：把数组的所有元素放入一个字符串，元素通过指定的分隔符分隔。join()连接数组，但是并不会改变数组本身
      generes: data.genres.join("、"),
      stars: util.converToStarsArray(data.rating.stars),
      score: data.rating.average,
      //把经过判空处理过对象director放入movies对象中
      director: director,
      casts: util.convertToCastString(data.casts),   
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary

    };
    this.setData({
      movie: movie
    });
    console.log("更新后的movie是 ", movie)
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