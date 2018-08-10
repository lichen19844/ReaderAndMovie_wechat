var util = require('../../../../utils/util.js');
// class里的函数不需要写function
class Movie {
  // 接收一个url参数，把豆瓣地址作为参数传进来
  constructor(url) {
    // this是Movie的实例，将url绑定到实例上
    this.url = url;
  };

  //movie-detail.js里的function(movie){...}就是 cb
  //这个函数是对外的，会被外部的文件所调用，如movie-detail.js里的movie.getMovieData(...)
  getMovieData(cb) {
    // 将cb绑定到实例上待用，有点像this.data的作用
    this.cb = cb;
    // bind(this)的作用是把函数体内的this绑定到processDoubanData所在环境的上下文，使得processDoubanData中this.cb(movie)的this成为了Movie实例对象的this环境
    util.http(this.url, this.processDoubanData.bind(this));
  };
  //processDoubanData函数紧跟在调用http函数后面，这个函数的作用就是冲着movie去的，得到一个新的movie对象
  processDoubanData(data) {
    if (!data) {
      return;
    };
    console.log(data);
    var director = {
      avatar: "",
      name: "",
      id: "",
    };
    if (data.directors[0] != null) {
      if (data.directors[0].avatar != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    };
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: util.converToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    //通过回调函数将movie数据返回给movie-detail.js里作为cb的参数并加工成需要的方式
    //异步+函数+回调 是一种方法，用来传递对象
    this.cb(movie);
  }
};
export {Movie};