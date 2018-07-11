var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  //data是onLoad和onPostTap的公共数据池，比如posts_key
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      posts_key: postsData.postList
    });
  },

  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;
    //postid是由post.wxml中data-postId="{{item.postId}}"获得，而item.postId的排序又是由wx:for="{{posts_key}}"决定
    //因需要将具体的id绑定到具体的点击事件上，为此产生某一个具体的id的传递（一层层变量的推演）：首先在外部有一个js的数据库文件post-data.js文件，然后爱本页引用这个post.js文件，设置变量postsData来指代，然后又在加载页面时设置变量posts_key: postsData.postList，使得变量posts_key指代了外部文件内的数据，然后在view组件上使用 wx:for 控制属性绑定这个数组数据的变量posts_key，实际这时view组件已经捕获到了原本在js文件中的id数据，这时再通过dataset在组件中定义这个数据，然后数据同时通过绑定组件的事件来传递回post.js内，通过var postId = event.currentTarget.dataset.postid;锁定住了这个id为我们需要的post.js内的postId变量。在这个过程中，其实在设置变量posts_key: postsData.postList时我已经拿到了所有数据，但此时无法做到锚定具体的数据，有了id这个标识符，我们就可以方便的运用它了。
    //dataset在组件中可以定义数据，这些数据将会通过事件传递给 SERVICE。 书写方式： 以data - 开头，多个单词由连字符 - 链接，不能有大写(大写会自动转成小写)如data- element - type，最终在 event.currentTarget.dataset 中会将连字符转成驼峰elementType
    var postsUrl = "post-detail/post-detail?id=";
    console.log("on post id is " + postId);

    wx.navigateTo({
      url: postsUrl + postId
      //url: "post-detail/post-detail"代表的是post-detail的页面框架
      //view标签里的 catchtap="onPostTap" 和 navigateTo决定了是鼠标点击放开后跳转的事件
    });
  },

  onSwiperItemTap: function(event) {
    var postId = event.target.dataset.postid;
    var postsUrl = "post-detail/post-detail?id=";
    console.log("on post id is " + postId);
    // wx.navigateTo({
    //   url: postsUrl + postId
    // });
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    var postsUrl = "post-detail/post-detail?id=";
    console.log("on post id is " + postId);
    wx.navigateTo({
      url: postsUrl + postId
    });
  }
  //target 和 currentTarget 区别
  //target指的是触发事件的源组件，currentTarget指的是事件绑定（捕获）的当前组件
  //在post.wxml中，onSwiperItemTap收到的事件对象target和currentTarget都是image组件，而onSwiperTap收到的事件对象target是当前点击的image组件，而currentTarget是onSwiperTap所绑定捕获的当前swiper组件，而恰好swiper组件中没有设id
})