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
  onLoad: function(options) {
    //此处的options.id 来源于post.js里的url: "post-detail/post-detail?id=" + postId里的id，  通过options参数由鼠标点击后获取的postId，然后传递到了post-detail.js
    var postId = options.id;
    //将postId 赋予this.data.currentPostId，并且是在data{}数据层面，便于其它函数调用
    this.data.currentPostId = postId;
    // console.log(postId);
    var postData = postsData.postList[postId];
    // console.log(postData);
    this.setData({
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
          collected: postCollected
        });
      }
    } else {
      var postsCollected = {};
      //定义一个空的对象，方便放入任何内容，也可以放入一个空数组[]
      postsCollected[postId] = false;
      //意味着在空对象中先放入一个postId: false的对象，以它为起点
      //亦能写成 postCollected = false; 但是注意这里的postCollected不可随意变更，需和其它postCollected名字一致
      // postCollected = false;
      // this.setData({
      //   collected: postCollected
      // });
      //把空对象更新到缓存里
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    //post键值赋予变量postCollected
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏变成未收藏，未收藏变成收藏，第一次点击后，会从默认的false变成true
    postCollected = !postCollected;
    console.log(postsCollected);
    //在这里不需要写入判断 if (postsCollected) {...}了，因为缓存中已经有了
    //更新最新状态的data数据
    postsCollected[this.data.currentPostId] = postCollected;
    //更新最新状态的文章数据的所有缓存值
    // wx.setStorageSync('posts_collected', postsCollected);
    // //更新数据绑定变量，从而实现切换图片
    // this.setData({
    //   collected: postCollected
    // });

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
    this.showModal(postsCollected, postCollected);
    //这里不能在this.showModal()之后连着写this.showToast(),不然postCollected = !postCollected;的状态会在点击收藏图标后马上传入showToast方法，进而同步显示，这样在视觉上不好。应该在放入this.showModal()的if判断里，由if为真的执行来触发
    // this.showToast(postsCollected, postCollected);
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
            collected: postCollected
          });
          that.showToast(postsCollected, postCollected);
        }
      },
    });
  },

  showToast: function (postsCollected, postCollected) {
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

  onShareTap: function(event){
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
      ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res){
        //res.cancel 用户是不是点击了取消按钮
        //res.tapIndex 数组元素的序号，从0开始
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
  }

})