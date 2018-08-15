var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  //data是onLoad和onPostTap的公共数据池，比如posts_key
  data: {
    posts_key: [],
    isthumbed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 这里onLoad内代码少的大概原因是，是因为它所需数据全部来自posts-data.js这个公共文件，无需像movies.js那样要添加回调函数来接收外部的API数据。这里做了个实验，如果删除除onLoad函数以外的所有函数，post页面显示一切正常，但是去掉onLoad函数里面的代码，post页面的显示就不正常了
  onLoad: function(options) {
    this.setData({
      //post.js需要posts-data.js中所有的假数据，并赋值给posts_key，传到post.wxml中使用
      posts_key: postsData.postList
    });
    var posts_key = this.data.posts_key;
    console.log('posts_key is ', posts_key)
    var temmpp = [];
    for (var idx in posts_key){
      var thumbId = posts_key[idx].postId;
      temmpp.push(thumbId);
      // this.setData({
      //   thumbId: thumbId
      // });
      var thumbeds = wx.getStorageSync('thumbeds');
      if (thumbeds) {
        // var thumbed = thumbeds[thumbId];
        // if (thumbed) {
        //   this.setData({
        //     isthumbed: thumbed
        //   });
        // }
      } else {
        var thumbeds = {};
        // thumbeds[thumbId] = false;
        wx.setStorageSync('thumbeds', thumbeds)
      }
    }
    console.log(temmpp);
  },

  onThumbTap: function (event) {
    var thumbId = event.currentTarget.dataset.thumbid;
    this.data.currentThumbId = thumbId;
    console.log('thumbId is ', thumbId);
    var thumbeds = wx.getStorageSync('thumbeds');
    var thumbed = thumbeds[this.data.currentThumbId];
    thumbed = !thumbed;
    console.log('thumbed is ', thumbed)
    thumbeds[this.data.currentThumbId] = thumbed;
    wx.setStorageSync('thumbeds', thumbeds);
    this.setData({
      isthumbed: thumbed
    });
    console.log('isthumbed is ', this.data.isthumbed)
    console.log('thumbeds is ', thumbeds)
  },

  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;
    // this.data.currentPostId = postId;
    //postid是由post.wxml中data-postId="{{item.postId}}"获得，而item.postId的排序又是由wx:for="{{posts_key}}"决定
    //因需要将具体的id绑定到具体的点击事件上，为此产生某一个具体的id的传递（一层层变量的推演）：首先在外部有一个js的数据库文件post-data.js文件，然后在本页引用这个post.js文件，设置变量postsData来指代，然后又在加载页面时设置变量posts_key: postsData.postList，使得变量posts_key指代了外部文件内的数据，然后在view组件上使用 wx:for 控制属性绑定这个数组数据的变量posts_key，此时view组件已经捕获到了原本在js文件中的id数据，这时再通过dataset方法data-xxx在组件中记录这个数据，然后数据同时结合绑定这个组件的事件来传递回post.js内，通过var postId = event.currentTarget.dataset.postid;锁定住了这个id为我们需要的post.js内的postId变量。在这个过程中，其实在设置变量posts_key: postsData.postList时我已经拿到了所有数据，但此时无法做到锚定具体的数据，有了id这个标识符，我们就可以方便的运用它了。
    //dataset在组件中可以定义数据，这些数据将会通过事件传递给 SERVICE。 书写方式： 以data - 开头，多个单词由连字符 - 链接，不能有大写(大写会自动转成小写)如data- element - type，最终在 event.currentTarget.dataset 中会将连字符转成驼峰elementType
    // post.js里"post-detail/post-detail?id="用来做页面跳转，里面的名字id,是自定义的，而且它决定了post-detail.js引用的时候也要写成id
    var postsUrl = "post-detail/post-detail?id=";
    console.log("on post id is " + postId);
    //view标签里的 catchtap="onPostTap" 和 navigateTo决定了是鼠标点击放开后跳转的事件
    wx.navigateTo({
      //postId作为参数通过url传递到post-detail.js
      //完整的为url: "post-detail/detail?id=" + postId,  即 id = 某一个postId，然后传入post-detail.js
      url: postsUrl + postId,
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

  onSwiperTap: function(event) {
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



// 学习用
// var a = ['a', 'b', 'c']
// var obj = {}
// a.forEach((item, index) => { obj[index] = item })
// console.log(obj)

// var arr = ['啦啦', '呵呵', '哒哒', '嗯嗯']
// var obj = {}
// for (var key in arr) {
//   obj[key] = arr[key]
// }
// console.log(obj)//{0: "啦啦", 1: "呵呵", 2: "哒哒", 3: "嗯嗯"}