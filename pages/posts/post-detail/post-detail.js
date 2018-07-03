var postsData = require('../../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    //此处的options.id 来源于post.js里的url: "post-detail/post-detail?id=" + postId里的id，  通过options参数由鼠标点击后获取的postId，然后传递到了post-detail.js
    this.data.currentPostId = postId;
    // console.log(postId);
    var postData = postsData.postList[postId];
    // console.log(postData);
    this.setData({ postData: postData });

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
          collected: postCollected
        }); 
      }
    }

    else {
      var postsCollected = {};
      //定义一个空的对象，方便放入任何内容，也可以放入一个空数组[]
      postsCollected[postId] = false;
      //意味着在空对象中先放入一个postId: false的对象，以它为起点
      //亦能写成 postCollected = false; 但是注意这里的postCollected不可随意变更，需和其它postCollected名字一致
      // postCollected = false;
      // this.setData({
      //   collected: postCollected
      // });
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },

  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏变成未收藏，未收藏变成收藏，第一次点击后，会从默认的false变成true
    postCollected = !postCollected;
    console.log(postsCollected);
    //更新data数据
    //在这里不需要写入判断 if (postsCollected) {...}了，因为缓存中已经有了
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章数据的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected? "已收藏":"取消收藏",
      //用变量postCollected来做三元表达式的判断，因为postCollected的键值不是ture就是false
      duration: 1000,
      // icon: "success",
      image: postCollected ? "../../../images/avatar/3.png" :"../../../images/avatar/1.png"
      //三元表达式的用法
    })

    // wx.showModal({
    //   title: "收藏",
    //   content: "是否收藏该文章",
    //   showCancel: "true",
    //   cancelText: "不收藏",
    //   cancelColor: "#333",
    //   confirmText: "收藏",
    //   confirmColor: "#405f80",
    // })

  },



})