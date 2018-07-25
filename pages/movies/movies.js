// pages/movies/movies.js
var util = require('../../utils/util.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  // 我们所期望的数据结构变量，有三个不同的数据对象，这样就可以绑定到三个不同的movieListTemplate模板上
  data: {
    //初始化，如果是对象，给一个空值，养成好习惯，这里可以对照post-detail.js的isPlayingMusic用法
    inTheaters: {},
    comingSoon: {},
    top250: {},
    test1: {},
    test2: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    // 拿到三组api的URL,放入onLoad函数里，起到原始数据源的作用
    //注意api网址的格式：https://api.douban.com/v2/movie/top250?start=245&count=3
    //对应正常网页的格式：https://movie.douban.com/top250?start=245&count=3  其中例如start=245是有效的，而count=3以及total等Properties无效
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    // 下列异步函数虽然按顺序排列，但因为每个函数实际在每次调用所花费的时间会有不同，导致实际展现到页面的顺序会有变化
    // 如果有三个相同的getMovieListData函数一起执行，加载不一定按顺序来
    //把data中的key传进来当参数,要带引号，除非命名是key的变量可以不用带
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '电影Top250');

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

  //函数调用的方式：1、被其它函数调用；2、在视图文件中被类似<view catchtap="onMoreTap">
  onMoreTap: function(event) {
    //category实际指代了movie-list-template.wxml中的{{categoryTitle}}
    //category通过url传递到了more-movie
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      // movie.js里"more-movie/more-movie?category="里的名字category,是自定义的，而且它决定了xxxx.js引用的时候也要写成category，这里的category等同于getMovieListData函数中的categoryTitle
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  //所调用的getMovieListData函数，函数里面可以安插微信提供的api接口，这个api接口（设置一个形参）可以直接使用这个函数的实参，并返回使用这个实参的结果给调用者。这里的结果是获取了相应api的数据
  // 接受data里的key，这里设置一个形参settedKey，注意，形参是有顺序的，不然会出错
  getMovieListData: function(url, settedKey, categoryTitle, processDoubanData) {
    //that应对success函数而生
    var that = this;
    wx.request({
      url: url,
      //用不到 data: {},
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      //wx.request方法执行后，如果相应的页面是正常状态，则会成功拿到页面json数据，并把数据作为参数传入success函数并执行 ，success函数里的形参res指代的就是通过wx.request的url、method、header所拿到的数据，类型是个对象
      success: function(res) {
        //res拿到的是一个api里完整的数据
        console.log("one api success's whole res data is ", res);
        //用一个callback回调函数processDoubanData来处理接收的数据，这里是使用res数据的data属性，settedKey不可以可以放入success函数
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function(error) {
        console.log("failed");
        console.log(error)
      },
    })
  },

  onBindFocus: function(event){
    console.log("show search");
  },

  //这个函数的作用--简而言之为【数据绑定】：将getMovieListData函数获得的数据，通过setData的方式，绑定到template的数据组件里，这里会对应绑到movies.wxml上，也可以说是movies.wxml接收了这个movies数据
  // processDoubanData无法知道setData中处理的电影类型到底是哪一种，但我们可以通过getMovieListData函数来想办法
  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    // 处理 API 数据的主要逻辑： 
    // 1. 定义一个空数组
    // 2. 用 for in 来遍历数据数组
    // 3. 在循环中，把每一条数据的属性值赋值给一个临时对象temp
    // 4. 在循环中，用 push 方法，把临时对象加到空数组中
    var movies = [];
    //js中数组push对象，一个对象对应一个地址，定义对象的变量temp放在for循环里面，这样每次都是新的对象，这样每个地址都不一样，movies.push(temp)之后得到不同的值；如果放在for循环外部，对象的地址是不变的，movies数组里最后的数据会覆盖之前的数据，导致需要的数据不对。可参考https://blog.csdn.net/xiaoye319/article/details/78416762
    for (var idx in moviesDouban.subjects) {
      console.log("subjects", idx, "is a subject data ", moviesDouban.subjects[idx]);
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      //名字太长了显示是个问题，故做个名字长度的if判断
      if (title.length >= 6) {
        //substring
        // public String substring(int beginIndex, int endIndex)
        // Returns a new string that is a substring of this string. The substring begins at the specified beginIndex and extends to the character at index endIndex - 1. Thus the length of the substring is endIndex- beginIndex. 
        title = title.substring(0, 6) + "...";
      };
      // 把星星的分值35或50这样的数字转化成有5个数字的数组，用[1, 1, 1, 1, 1]和[1, 1, 1, 0, 0]等形式给到stars来做星星
      var temp = {
        //stars调用的是公共的util.js方法，得到的一个[1, 1, 1, 0, 0]形式的数组
        stars: util.converToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };

      movies.push(temp);
      // 因为还在for循环之中，idx可以直接拿来用
      console.log("movies", idx, "is a movie data ", movies[idx]);
    };
    //运用settedKey的方法很重要，它是3个空对象“键”（或叫属性）的共同形参，通过回调函数一路传到这里，然后被做成又一个readyData空对象的“键”（或叫属性），然后再通过用其它方法造好数据的数组和一个早有赋值的参数，再做成一个对象，赋值给readyData对象的属性settedKey，这个编程思路要牢记！！！！！
    var readyData = {};
    // 动态语言赋值,给对象readyData添加一个属性，这个属性的名字由实际使用的变量settedKey决定。对对象的属性进行赋值，将movies数组赋值给这个对象的属性，给对象新增键值对readyData = {settedKey: movies}  等同于readyData.settedKey = movies;
    // readyData[settedKey] = movies;
    //对每一个对象属性下面都再人工设置一个叫movies的属性和movies值（数组），可以很清晰的通过AppData来查看数据的结构，和html页面无关，相应html页面全删都没关系，html页面上所置放的数据要和AppData的一致！！！
    readyData[settedKey] = {
      //这样categoryTitle和movies所代表的数据才能通过readyData传入公共数据data：{}中，这样wxml页面就能引用了
      categoryTitle: categoryTitle,
      //把上面获得的movie[]数组引入这里的键值对
      movies: movies
    };
    //最新的movies数组里会有遍历后的多组数据，这时将数据绑定到了data中
    this.setData(
      // {movies: movies}
      readyData
      //readyData指代{ settedKey: {movies: movies} }，readyData进入data:{}变成了字符串，但它原来的关系没有变化，settedeKey任然是个变量
    );

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