var util = require('../../../../utils/util.js');
// class里的函数不需要写function
class Movie {
  // 接收一个url参数，把豆瓣地址作为参数传进来
  constructor(url) {
    // this是Movie的实例，将url绑定到实例上
    this.url = url;
  };

  // function(movie) {
  //   this.setData({
  //     movie: movie
  //   })
  // }  function(movie)就是cb
  getMovieData(cb) {
    // 将cb绑定到实例上
    this.cb = cb;
    // bind(this)指向了class
    util.http(this.url, this.processDoubanData.bind(this));
  };

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
    this.cb(movie);
  }
};
export {Movie};