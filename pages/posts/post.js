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
  onLoad: function (options) {
    this.setData({ posts_key: postsData.postList });
  },

  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postid;
    //postid是由post.wxml中data-postId="{{item.postId}}"获得，而item.postId的排序又是由wx:for="{{posts_key}}"决定
    console.log("on post id is " + postId);
    
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
      //url: "post-detail/post-detail"代表的是post-detail的页面框架
      //view标签里的 catchtap="onPostTap" 和 navigateTo决定了是鼠标点击放开后跳转的事件
    });
  }
})