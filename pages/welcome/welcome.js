Page({
  onTap: function(event){
    //navigateTo, redirectTo 只能打开非 tabBar 页面,即wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面
    // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数,并关闭其他所有非 tabBar 页面
    wx.switchTab({
      url:"../posts/post"
    });
    // wx.redirectTo({
    //   url:"../posts/post"
    // });

  }

})