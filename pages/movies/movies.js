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
        searchResult: {},
        text: "",
        test1: {},
        test2: {},
        // 定义电影页面的隐藏与否
        containerShow: true,
        // 定义搜索页面的隐藏与否
        searchPanelShow: false,
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
        //把data中的key传进来当参数,要带引号，除非命名是key的变量可以不用带，这里指'inTheaters'、'comingSoon'、'top250'
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

    //函数调用的方式：1、被文件内外的其它函数调用；2、在视图文件中被类似<view catchtap="onMoreTap">
    onMoreTap: function(event) {
        //category实际指代了movie-list-template.wxml中的{{categoryTitle}}
        //category通过url传递到了more-movie
        var category = event.currentTarget.dataset.category;
        console.log('test category is ', category);
        wx.navigateTo({
            // movie.js里"more-movie/more-movie?category="里的名字category,是自定义的，而且它决定了more-movie.js引用的时候也要写成category，这里的category等同于getMovieListData函数中的categoryTitle
            url: 'more-movie/more-movie?category=' + category,
        })
    },

    onMovieTap: function(event) {
        var movieId = event.currentTarget.dataset.movieid;
        console.log('test list tap movieId is ', movieId);
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        })
    },

    //所调用的getMovieListData函数，函数里面可以安插微信提供的api接口如wx.request，这个api接口可以直接使用这个函数的实参如url，并返回使用这个实参的结果给调用者。这里的结果是获取了相应api的数据
    //函数实参可以使用data里的key属性，为函数体对应设置一个形参settedKey，注意，形参是有顺序的，不然会出错
    //categoryTitle的传递路径，例如getMovieListData函数的实参'电影Top250'通过形参categoryTitle，传递给同为形参的callback回调函数processDoubanData，再通过函数体processDoubanData中readyData[settedKey]的属性赋值将categoryTitle以值的形式做了一个{键1：{键2：值}}的绑定关系，
    //再以setData方式，将readyData（从而使得键categoryTitle）传入公共data，然后被movie-list-template.wxml内的<view catchtap="onMoreTap" class="more" data-category="{{categoryTitle}}">所捕获，然后通过onMoreTap方法将转变成的变量category再通过navigateTo方法将category传入more-movie.js，
    //然后将category赋值给中间变量navigateTitle，最后在onReady方法下转化为title，被setNavigationBarTitle方法动态设置为页面标题
    //注意三次调用getMovieListData函数时，settedKey的实参对应了不同的url
    getMovieListData: function(url, settedKey, categoryTitle, processDoubanData) {
        //that应对success函数而生
        var that = this;
        //request专门处理传进来的url
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
                //用一个callback回调函数processDoubanData来处理接收的数据，这里是使用res数据的data属性，记住参数settedKey不可以作为success函数的直接参数
                // 很重要的一点，函数体A内可以设置调用一个回调函数B，并接收函数体A的形参为实参，然后通过回调函数体B进一步计算，可以是对实参的处理变成数据，也可以是继续对拿到的参数做其它安排，比如再设置一个回调函数
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function(error) {
                console.log("failed");
                console.log(error)
            },
        })
    },

    onCancelImgTap: function(event) {
        console.log("Cancel infomation");
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            // 清空搜索结果和input框
            searchResult: {},
            text: "",
        })
    },

    onBindFocus: function(event) {
        console.log(event.detail);
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        })
    },

    onBindBlur: function(event) {
        var text = event.detail.value;
        this.setData({
                containerShow: false,
                searchPanelShow: true,
                text: "",
            })
            // var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
            // this.getMovieListData(searchUrl, "searchResult", "");
    },

    onBindConfirm: function(event) {
        // detail  自定义事件所携带的数据，如表单组件的提交事件会携带用户的输入（一般有value, cursor, keyCode），value为输入的字符
        var text = event.detail.value;
        console.log(event);
        console.log(event.detail);
        console.log(text);
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        //豆瓣API提供的写法，{text}本质是指text是个对象，而在javascript中，变量也是对象
        // var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q={text}";
        // 直接选用现成的方法getMovieListData，""不会使得标题为空白，不写也可以，等同于不起作用，即仍旧是电影主题的标题“光与影”
        this.getMovieListData(searchUrl, "searchResult", "");
        //input框提交完即清空的方法
        this.setData({
            text: "",
        });
    },

    //这个函数的作用--简而言之为【数据绑定】：将getMovieListData函数获得的数据，通过setData的方式，绑定到template的数据组件里，这里会对应绑到movies.wxml上，也可以说是movies.wxml接收了这个movies数据
    // processDoubanData每次只能用同一个形参来接收getMovieListData传入对应的参数，如果getMovieListData函数执行了好几次，只用settedKey传入data的话，对应html里只能使用{{settedKey}}来表达数据，那processDoubanData就无法确切知道setData中处理的电影类型到底是哪一种，
    // 因为进入this.setData后的变量都会变成字符串，指代关系变成了唯一（一对一的关系，不能一对多），从而不能像原来的变量具有灵活性（这是重点），但我们可以通过操作对象的方法来想办法
    processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
        // 处理 API 数据的主要逻辑： 
        // 1. 定义一个空数组
        // 2. 用 for in 来遍历数据数组
        // 3. 在循环中，把每一条数据的属性值赋值给一个临时对象temp
        // 4. 在循环中，用 push 方法，把临时对象加到空数组中
        var movies = [];
        // moviesDouban是从getMovieListData拿到对url处理后的res.data数据，其中包含了数组subjects
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
            //for循环后，根据idx的排序往movies数组中数据添加完毕
            movies.push(temp);
            // 因为还在for循环之中，idx可以直接拿来用
            console.log("movies", idx, "is a movie data ", movies[idx]);
        };
        console.log('Array movie is ', movies)
            //settedKey的传递路径，例如getMovieListData函数的实参空对象'top250'通过形参settedKey，被同为形参的callback回调函数processDoubanData人为接收（传递），再通过函数体processDoubanData中readyData[settedKey]的属性赋值形式将settedKey以键1的形式做了一个{键1：{键2：值}}的绑定关系
            //运用settedKey的方法很重要，settedKey是data中3个空对象的“键”（或叫属性）的共同形参，通过回调函数processDoubanData一路传到这里，然后被做成又一个readyData空对象的“键”（或叫属性），通过人工方式造好数据的movies[]数组，并把数组当做一个参数的赋值，再做成一个对象（如 {movies: movies} ），然后再将这个对象赋值给readyData对象的属性settedKey，从而实现在不同API中使用共同形参，这个参数传递的编程思路要牢记！！！！！
        var readyData = {};
        // 动态语言赋值,给对象readyData添加一个属性，这个属性的名字可以取传进来的变量settedKey。对对象的属性进行赋值，将movies数组赋值给这个对象的属性，相当于给对象新增键值对readyData = {settedKey: movies}  也等同于readyData.settedKey = movies;
        // readyData[settedKey] = movies;
        //对每一个对象属性下面都再人工设置一个叫movies键和movies值，可以很清晰的通过AppData来查看数据的结构，和html页面无关，相应html页面全删都没关系，html页面上所置放的数据要和AppData的一致！！！
        readyData[settedKey] = {
            //这样categoryTitle和movies所代表的数据才能通过readyData传入公共数据data：{}中，这样wxml页面就能引用了
            categoryTitle: categoryTitle,
            //把上面获得的movie[]数组引入这里的键值对
            movies: movies
        };
        //最新的movies数组里会有遍历后的多组数据，并在这时会将数据绑定到data中
        this.setData(
            // {movies: movies}
            readyData
            //readyData指代{ settedKey: {movies: movies} }，readyData进入data:{}会变成字符串，此处参考this.getMovieListData(top250Url, 'top250', '电影Top250')里从data中导出的空对象'top250'，但它原来的关系没有变化，settedKey任然是个变量。
            //这就是为什么设置settedKey需要这么繁琐的原因，如果把settedKey直接放入了this.setData，就会使它从变量变成了字符串'settedKey'，指代关系变成了唯一（一对一的关系，不能一对多），从而使得不同的getMovieListData函数只能根据系统响应随机执行其中一个，失去了灵活性
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