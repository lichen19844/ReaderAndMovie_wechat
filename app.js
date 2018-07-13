App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    console.log("app onLaunch");
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    console.log("app onShow");
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {
    console.log("app onHide");
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {
    console.log("app onError");
  },

  //globalData可以是自定义的对象参数
  globalData: {
    //初始变量为false，可以用来指代后台总控的音乐（无论是否为当前音乐）是否在播放（另外一个不是很准确的理解：也可以理解成上一页面的音乐）
    g_isPlayingMusic: false,
    //指代哪一个音乐正在被播放
    g_currentMusicPostId: null

  }
})