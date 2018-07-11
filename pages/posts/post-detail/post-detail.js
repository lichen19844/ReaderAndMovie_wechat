var postsData = require('../../../data/posts-data.js');
var app = getApp();
console.log("app is ", app);
console.log("getApp().globalData is ", getApp().globalData);
console.log("postsData's length is ", postsData.postList.length);
Page({

  /**
   * 页面的初始数据
   */
  //页面关闭再进来，data状态里的数据会被初始化成默认状态，onLoad会重新执行一遍，音乐图标恢复是因为html标签里的isPlayingMusic被初始化了，而音乐不暂停是因为没有产生点击事件来触发
  data: {
    //isPlayingMusic可以不写，空属性的值就默认为false
    // isPlayingMusic: false
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  //onLoad是页面全局监听事件
  onLoad: function(options) {
    console.log("page onLoad");
    console.log("options is ", options);
    console.log("options.id is ", options.id);
    // var globalData = app.globalData;
    //此处的options.id 来源于post.js里的url: "post-detail/post-detail?id=" + postId里的id，  通过options参数由鼠标点击后获取的postId，然后传递到了post-detail.js
    var postId = options.id;
    // console.log("options is ", options);
    //将postId 赋予this.data.currentPostId，等同于同时将新造变量currentPostId放置在了本页面的data{}数据层面，便于其它函数调用
    this.data.currentPostId = postId;
    console.log("postId is ", this.data.currentPostId);
    var postData = postsData.postList[postId];
    console.log("postData is ", postData);
    this.setData({
      //setData里的变量可以直接拿到html标签里用，俗称数据绑定
      postData: postData
    });

    //模拟所有的缓存状态
    // var postsCollectde = {
    //   1: "ture",
    //   2: "false",
    //   3: "true",
    //   ...
    // };

    var postsCollected = wx.getStorageSync('posts_collected');
    //注意postsCollected 不是 postsData 或 postList 或 local_database
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      //把postId读取到定义的postsCollected缓存池中，并将postId的键值赋予变量postCollected
      if (postCollected) {
        this.setData({
          //加载时的判断
          collected: postCollected
        });
      }
    } else {
      var postsCollected = {};
      //为wx.setStorageSync定义一个data属性，这里是一个空的对象，方便放入任何内容，也可以放入一个空数组[]
      postsCollected[postId] = false;
      //意味着在空对象中先放入一个postId: false的对象，以它为起点
      //亦能写成 postCollected = false; 但是注意这里的postCollected不可随意变更，需和其它postCollected名字一致
      // postCollected = false;
      // this.setData({
      //   collected: postCollected
      // });
      //把空对象更新到缓存里
      wx.setStorageSync('posts_collected', postsCollected);
    };
    //设计音乐播放对应图标的状态，由2个条件同时满足才行，其中判断全局变量的值和当前页面的id值是否一致
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      // 错误写法 this.data.isPlayingMusic = true;
      this.setData({
        isPlayingMusic: true,
      })
    };
    this.setMusicMonitor();
  },

  setMusicMonitor: function() {
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    //页面栈实际不存在这个页面： var nextPage = pages[pages.length];
    console.log("pages is ", pages);
    console.log("currentPage is ", currentPage);
    console.log("currentPage__Route__ is ", currentPage.__route__);
    console.log("currentPageRoute is ", currentPage.route);
    console.log("currentPageData is ", currentPage.data);
    console.log("currentPage.data.currentPostId is ", currentPage.data.currentPostId);
    //监听事件的变化，注意不是页面的变化，中间操作数据达到传递数据的目的
    wx.onBackgroundAudioPlay(function() {
      // "==" 要求值相等即可; "===" 要求值和类型都必须相等
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isPlayingMusic: true,
          });
          console.log("listen play");
        }
      }
      //触发变量变化用监听或点击 二选一 
      app.globalData.g_isPlayingMusic = true;
      //如果当前监听页面是播放的状态，将当前页面的id赋值给全局变量
      // app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });

    wx.onBackgroundAudioPause(function() {
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
      that.setData({
        isPlayingMusic: false,
      });
      console.log("listen pause");
        }
        }
      //触发变量变化用监听或点击 二选一 
      app.globalData.g_isPlayingMusic = false;
      //如果当前监听页面是暂停的状态，清空id值
      // app.globalData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false,
      });
      console.log("listen stop");
      //触发变量变化用监听或点击 二选一 
      app.globalData.g_isPlayingMusic = false;
      //如果当前监听页面是暂停的状态，清空id值
      // app.globalData.g_currentMusicPostId = null;
    });
  },

  //onMusicTap是音乐全局监听事件
  onMusicTap: function(event) {
    var postData = postsData.postList[this.data.currentPostId];
    //this.data.isPlayingMusic里的isPlayingMusic可以在data{}中写入不存在（即不写）或false，可以理解成在data{}中放置了一个变量isPlayingMusic
    var isPlayingMusic_one = this.data.isPlayingMusic;
    //错误写法，这不是在绑定变量的值 this.setData({
    //   isPlayingMusic_one: isPlayingMusic
    // })

    if (isPlayingMusic_one) {
      //状态如果为真，音乐则是播放状态，点击之后暂停音乐，并且改变状态为false，给下一次点击做准备
      wx.pauseBackgroundAudio();
      //停止播放
      //wx.stopBackgroundAudio();
      this.setData({
        isPlayingMusic: false,
      });
      //触发变量变化用监听或点击 二选一 app.globalData.g_isPlayingMusic = false;
      console.log("do pause");
      // app.globalData.g_currentMusicPostId = null;
      app.globalData.g_isPlayingMusic = false;
      // 错误写法，绑定变量不能这样写： this.data.isPlayingMusic = false;
      //只有在onLoad函数才可以直接用this.data.val=yyy等操作；如果是在别的除了onLoad以外的函数里（包括onLoad里面嵌套定义的函数），需要涉及到数据绑定的，必须使用this.setData()的形式进行更新变量数据；其它函数中this.data.xxx的写法只适用于通过引用onLoad函数里的this.data.xxx；凡是非第一层函数的，this可一律设置var that = this;进而使用that来做引用that.data.xxx或that.setData({})绑定数据
    }
    //状态如果为false，音乐则是暂停状态，点击之后触发音乐播放，并改变状态为真，给下一次点击做准备
    else {
      wx.playBackgroundAudio({
          //小程序中不能存放本地音乐，只能使用网络流媒体，这个播放地址暂时有效
          dataUrl: postData.music.url,
          title: postData.music.title,
          //小程序同样不能存放大尺寸封面，只能使用网络云存储图片
          coverImgUrl: postData.music.coverImg
        }),
        this.setData({
          isPlayingMusic: true
        });
      //触发变量变化用监听或点击 二选一 app.globalData.g_isPlayingMusic = true;
      console.log("do play");
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true;
    }
  },

  onCollectionTap: function(event) {
    // var postsCollected = wx.getStorageSync('posts_collected');
    // //post键值赋予变量postCollected
    // var postCollected = postsCollected[this.data.currentPostId];
    // //收藏变成未收藏，未收藏变成收藏，第一次点击后，会从默认的false变成true
    // postCollected = !postCollected;
    // console.log(postsCollected);
    // //在这里不需要写入判断 if (postsCollected) {...}了，因为缓存中已经有了
    // //更新最新状态的data数据
    // postsCollected[this.data.currentPostId] = postCollected;
    // //更新最新状态的文章数据的所有缓存值
    // // wx.setStorageSync('posts_collected', postsCollected);
    // // //更新数据绑定变量，从而实现切换图片
    // // this.setData({
    // //   collected: postCollected
    // // });

    // wx.showToast({
    //   title: postCollected? "已收藏":"取消收藏",
    //   //用变量postCollected来做三元表达式的判断，因为postCollected的键值不是ture就是false
    //   duration: 1000,
    //   // icon: "success",
    // image: postCollected ? "../../../images/avatar/3.png":"../../../images/avatar/1.png"
    //   //三元表达式的用法
    // })

    // wx.showModal({
    //   title: "收藏",
    //   content: "是否收藏该文章",
    //   showCancel: "true",
    //   cancelText: "不收藏",
    //   cancelColor: "#333",
    //   confirmText: "收藏",
    //   confirmColor: "#405f80",
    // })
    // this.showModal(postsCollected, postCollected);
    //这里不能在this.showModal()之后连着写this.showToast(),不然postCollected = !postCollected;的状态会在点击收藏图标后马上传入showToast方法，进而同步显示，这样在视觉上不好。应该在放入this.showModal()的if判断里，由if为真的执行来触发
    // this.showToast(postsCollected, postCollected);
    this.getPostsCollectedSyc();
    // this.getPostsCollectedAsy();
  },

  //异步的方法
  getPostsCollectedAsy: function(event) {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function(res) {
        //res这个参数理解为一个Object对象,res = {data: key对应的内容}。 res.data指服务器返回的内容
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        console.log(postsCollected);
        that.showModal(postsCollected, postCollected);
      }
    })
  },

  //同步的方法
  getPostsCollectedSyc: function(event) {
    //wx.getStorageSync的key: value关系公式：var value = wx.getStorageSync('key')
    //postsCollected就是这个value，相当于异步方法里的data，注意和这里的data不是一回事
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    console.log(postsCollected);
    this.showModal(postsCollected, postCollected);
  },

  showModal: function(postsCollected, postCollected) {
    var that = this;
    //先让用户确定是否收藏
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章?" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) {
        //点击确定键后，判断if(res.confirm)为真，再执行里面的动作
        if (res.confirm) {
          //成功选择了收藏之后，才设置更新文章数据的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量，从而实现切换图片
          that.setData({
            //点击时的判断
            collected: postCollected
          });
          that.showToast(postsCollected, postCollected);
        }
      },
    });
  },

  showToast: function(postsCollected, postCollected) {
    // //先对缓存进行设置
    // wx.setStorageSync('posts_collected', postsCollected);
    // //更新数据绑定变量，实现切换图片（意味是否显示收藏状态）
    // this.setData({
    //   collected: postCollected
    // });
    //再显示showToast提示状态
    wx.showToast({
      title: postCollected ? "已收藏" : "取消收藏",
      //用变量postCollected来做三元表达式的判断，因为postCollected的键值不是ture就是false
      duration: 1000,
      // icon: "success",
      image: postCollected ? "../../../images/avatar/3.png" : "../../../images/avatar/1.png"
      //三元表达式的用法
    })
  },

  onShareTap: function(event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        //res.cancel 用户是不是点击了取消按钮
        //res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      },
      fail: function(res) {
        console.log(res.errMsg);
        wx.showModal({
          title: "确定取消？ ",
          content: "用户是否取消？" + "现在无法实现分享功能，什么时候能支持呢",
          cancelText: "再想想",
          cancelColor: "#333",
          confirmText: "确认取消",
          confirmColor: "#405f80",
        })
      }

    })
  },

  onPreviousTap: function(event) {
    var postId = this.data.currentPostId;
    var m = postId;
    var n = postsData.postList.length;
    m--;
    // postId--;
    //postid是由post.wxml中data-postId="{{item.postId}}"获得，而item.postId的排序又是由wx:for="{{posts_key}}"决定
    var postUrl = "post-detail?id=";

    if (m >= 0) {
      wx.redirectTo({
        url: postUrl + m,
        //url: "post-detail/post-detail"代表的是post-detail的页面框架
        //view标签里的 catchtap="onPostTap" 和 navigateTo决定了是鼠标点击放开后跳转的事件
      });
      console.log("next post id is " + m);
    } else {
      wx.navigateTo({
        url: postUrl + postId
      });
      console.log("next post id is " + postId);
    };
  },

  onNextTap: function(event) {
    var postId = this.data.currentPostId;
    var m = postId;
    var n = postsData.postList.length;
    m++;
    // postId++;
    //postid是由post.wxml中data-postId="{{item.postId}}"获得，而item.postId的排序又是由wx:for="{{posts_key}}"决定
    var postUrl = "post-detail?id=";
    if (m <= (n - 1)) {
      wx.redirectTo({
        url: postUrl + m
        //url: "post-detail/post-detail"代表的是post-detail的页面框架
        //view标签里的 catchtap="onPostTap" 和 navigateTo决定了是鼠标点击放开后跳转的事件
      });
      console.log("next post id is " + m);
    } else {
      wx.navigateTo({
        url: postUrl + postId
      });
      console.log("next post id is " + postId);
    };

  },

  onShow: function() {
    console.log("page onShow");
  },
  onHide: function() {
    console.log("page onHide")
  },
  onUnload: function() {
    // Do something when page close.
    console.log("page onUnload");
    //卸载页面同时关闭音乐
    // wx.stopBackgroundAudio();

  },

})

//在真机环境，我们不能直接触及后台，只能通过页面来操作。执行退出页面，页面会被卸载销毁，因页面变量isPlayingMusic不是全局变量会跟着被丢失，但音乐播放却还在进行，这是因为音乐总控开关属于后台。
//我们现在的目的是进入其它页面时，播放图标需要正常显示，可以保持上一首音乐播放的状态
//正常实现图标的思路是设置一个全局变量，然后利用提取到全局变量的每个页面唯一的id和当前页面来做比较。解决这个问题的思路变成了需要找到一个全局变量来记录音乐播放的状态。这个全局变量和页面无关，不会因为页面的销毁而丢失。这样，变量的生命周期就可以和音乐播放的生命周期在同一个级别上。
//小程序的全局变量应该如何使用。首先对比一个页面中的共享变量是如何设置的。页面的共享变量被设置在页面Page方法的object对象上，比如data就是object对象的一个属性。所以，我们在其他方法中才能够多次使用this.data的方式引用这个data对象。页面的共享变量应该在页面中设置，所以全局共享变量自然应该在应用程序级别设置。我们可以在app.js中添加以下代码，设置小程序的全局变量。
// var pages = getCurrentPages(); //getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。getCurrentPages()方法：利用此方法可获取所有打开页面数组，再根据其获取到相应的页面，然后执行页面里的方法。
//五层的限制只是针对 navigateTo，redirectTo 则无此限制。因为 redirectTo 的行为是：关闭当前页面，跳转到应用内的某个页面。
// var Page = pages[pages.length - 1];//当前页
// var prevPage = pages[pages.length - 2];  //上一个页面
// var info = prevPage.data //取上页data里的数据也可以修改
// prevPage.setData({ 键: 值 })//设置数据