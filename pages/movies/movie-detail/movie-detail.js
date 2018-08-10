// 引入Movie class
import {
  Movie
} from 'class/Movie.js';
var app = getApp();
// var util = require('../../../utils/util.js');

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
  onLoad: function(options) {
    var movieId = options.id;
    console.log(movieId);
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    //把豆瓣地址作为参数传给Movie class
    var movie = new Movie(url);
    // class方法
    // var that = this;
    // var movieData = movie.getMovieData(...);  //不能用同步方法，会拿不到movieData，因为getMovieData里面有异步的setData，所在的类因此也不能直接返回值，需要通过回调的形式
    // //(movie)为接收Movie.js里的movie数据，此处的function不是在这个Page里被调用的，如果写成this.setData，它的this会指向Movie.js里的this.cb(movie)的this
    // movie.getMovieData(function(movie){
    // setData将数据从逻辑层发送到视图层是异步,也就是说改变值是同步的,改变值之后渲染页面是异步的
    //   that.setData({
    //     movie: movie
    //   })
    // });
    //箭头函数方法
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    });
    // util.http(url, this.processDoubanData);
  },

  // //data拿到的是http里callback所拿到的res.data数据
  // processDoubanData: function(data){
  //   //如果是空值，就直接返回，什么也不做，这时的setData中的movie就不会被设置更新，data中的movie数据就是初始化的空值
  //   if(!data){
  //     return;
  //   };
  //   console.log(data);
  //   //处理director数据，对绑定的movie变量填充，更新绑定变量
  //   //先定义一个属性值为空的director变量对象，用来做判空处理
  //   //判空的目的是怕API数据中的新老数据完整度不一致，只能根据经验观察来优先判断概率较大的空值数据，如director，重点观察数据的二级以下数据
  //   var director = {
  //     avatar: "",
  //     name: "",
  //     id: "",
  //   };
  //   // directors[0]取自console测试得到的数据，if不写else的隐含意思是不满足条件就不做任何事
  //   if(data.directors[0] != null) {
  //     if(data.directors[0].avatar != null) {
  //       director.avatar = data.directors[0].avatars.large
  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id;
  //   };
  //   var movie = {
  //     movieImg: data.images ? data.images.large: "",
  //     country: data.countries[0],
  //     title: data.title,
  //     originalTitle: data.original_title,
  //     wishCount: data.wish_count,
  //     commentCount: data.comments_count,
  //     year: data.year,
  //     //join()函数的功能为：把数组的所有元素放入一个字符串，元素通过指定的分隔符分隔。join()连接数组，但是并不会改变数组本身
  //     genres: data.genres.join("、"),
  //     stars: util.converToStarsArray(data.rating.stars),
  //     score: data.rating.average,
  //     //把经过判空处理过对象director放入movies对象中
  //     director: director,
  //     casts: util.convertToCastString(data.casts),   
  //     castsInfo: util.convertToCastInfos(data.casts),
  //     summary: data.summary

  //   };
  //   this.setData({
  //     movie: movie
  //   });
  //   console.log("更新后的movie是 ", movie)
  // },

  viewMoviePostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, //当前显示图片的http链接
      urls: [src] //需要预览的图片http链接列表，可以放很多张图片
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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