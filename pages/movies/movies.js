// pages/movies/movies.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    // 拿到三组api的URL,放入onLoad函数里，起到原始数据源的作用
    //注意api网址的格式：https://api.douban.com/v2/movie/top250?start=245&count=3
    //对应正常网页的格式：https://movie.douban.com/top250?start=245&count=3  其中start=245是有效的，而count=3以及total等Properties无效
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    // 下列异步函数虽然按顺序排列，但因为每个函数实际在每次调用所花费的时间会有不同，导致实际展现到页面的顺序会有变化
    // 如果有三个相同的getMovieListData函数一起执行，结果会执行最后一次调用的top250Url参数
    this.getMovieListData(inTheatersUrl, inTheaters);
    this.getMovieListData(comingSoonUrl, comingSoon);
    this.getMovieListData(top250Url, top250);

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

  //所调用的getMovieListData函数，函数里面可以安插微信提供的api接口，这个api接口（设置一个形参）可以直接使用这个函数的实参，并返回使用这个实参的结果给调用者。这里的结果是获取了相应api的数据
  getMovieListData: function(url, processDoubanData, settedKey) {
    //that应对success函数而生
    var that = this;
    wx.request({
      url: url,
      //用不到 data: {},
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      //如果成功拿到数据，会执行success函数，它会把wx.request拿到的数据作为参数传入success函数，success函数里的形参res指代的就是通过wx.request的url、method、header所拿到的数据，类型是个对象
      success: function(res) {
        //res拿到的是完整的数据
        console.log("success's whole res data is ", res);
        //用一个函数来处理接收的数据，这里是使用res数据的data属性
        that.processDoubanData(res.data);
      },
      fail: function(error) {
        console.log("failed");
        console.log(error)
      },
    })
  },

  //这个函数的作用--简而言之为【数据绑定】：将getMovieListData函数获得的数据，通过setData的方式，绑定到template的数据组件里，这里会对应绑到movies.wxml上，也可以说是movies.wxml接收了这个movies数据
  processDoubanData: function (moviesDouban, settedKey) {
    // 处理 API 数据的主要逻辑： 
    // 1. 定义一个空数组
    // 2. 用 for in 来遍历数据数组
    // 3. 在循环中，把每一条数据的属性值赋值给一个临时对象temp
    // 4. 在循环中，用 push 方法，把临时对象加到空数组中
    var movies = [];
    //js中数组push对象，一个对象对应一个地址，定义对象的变量temp放在for循环里面，这样每次都是新的对象，这样每个地址都不一样，movies.push(temp)之后得到不同的值；如果放在for循环外部，对象的地址是不变的，movies数组里最后的数据会覆盖之前的数据，导致需要的数据不对。可参考https://blog.csdn.net/xiaoye319/article/details/78416762
    for (var idx in moviesDouban.subjects) {
      console.log("test idx data is ", idx, moviesDouban.subjects[idx]);
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      //名字太长了显示是个问题，故做个名字长度的if判断
      if (title.length >= 6) {
        //substring
        // public String substring(int beginIndex, int endIndex)
        // Returns a new string that is a substring of this string. The substring begins at the specified beginIndex and extends to the character at index endIndex - 1. Thus the length of the substring is endIndex- beginIndex. 
        title = title.substring(0, 6) + "...";
      };
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
      console.log("movies data is ", idx, movies);
    };
    //最新的movies数组里会有遍历后多组数据，这时将数据绑定到了data中
    this.setData({
      movies: movies
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