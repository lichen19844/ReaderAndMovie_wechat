Page({
  onTap: function(event){
    //navigateTo, redirectTo 只能打开非 tabBar 页面,即wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面
    wx.navigateTo({
      url:"../movies2/movies2"
    });
    // wx.redirectTo({
    //   url:"../posts/post"
    // });

  }

})