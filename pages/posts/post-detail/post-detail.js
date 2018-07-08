var postsData = require('../../../data/posts-data.js');
var app = getApp(); 

Page({

  data: {

  },

  onLoad: function(options) {

    var postId = options.id;

    this.data.currentPostId = postId;

    var postData = postsData.postList[postId];

    this.setData({

      postData: postData
    });

    var postsCollected = wx.getStorageSync('posts_collected');

    if (postsCollected) {
      var postCollected = postsCollected[postId]
      if (postCollected) {
        this.setData({

          collected: postCollected
        });
      }
    } else {
      var postsCollected = {};

      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    };
    // if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId)
    if (app.globalData.g_isPlayingMusic){
      this.setData({
        isPlayingMusic: true,
      })
    };
    this.setMusicMonitor();
  },

  setMusicMonitor: function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true,
      });
      app.globalData.g_isPlayingMusic = true;
      // app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false,
      });
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });  
  },

  onCollectionTap: function(event) {

    this.getPostsCollectedSyc();
  },

  getPostsCollectedAsy: function(event){
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function(res){

        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        console.log(postsCollected);
        that.showModal(postsCollected, postCollected);        
      }
    })
  },

  getPostsCollectedSyc: function(event){
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    console.log(postsCollected);
    this.showModal(postsCollected, postCollected);
  },

  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章?" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          });
          that.showToast(postsCollected, postCollected);
        }
      },
    });
  },

  showToast: function (postsCollected, postCollected) {

    wx.showToast({
      title: postCollected ? "已收藏" : "取消收藏",
      duration: 1000,
      image: postCollected ? "../../../images/avatar/3.png" : "../../../images/avatar/1.png"
    })
  },

  onShareTap: function(event){
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
      ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res){

        wx.showModal({
          title: "用户 "+ itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      },
      fail: function (res) {
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

  onMusicTap: function(event){
    var postData = postsData.postList[this.data.currentPostId];

    var isPlayingMusic_one = this.data.isPlayingMusic;

    if (isPlayingMusic_one){

      wx.pauseBackgroundAudio();

      this.setData({
        isPlayingMusic: false,
      });
    }

    else{
      wx.playBackgroundAudio({

        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      }),
        this.setData({
        isPlayingMusic: true
        });
    }
  },
  onUnload: function () {
    // Do something when page close.
    console.log("onUnload")
  },
})