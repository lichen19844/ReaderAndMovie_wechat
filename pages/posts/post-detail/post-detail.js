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
        //isPlayingMusic可以不写，空属性的值就默认为false，但最好写一下
        // isPlayingMusic: false
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    //onLoad是页面全局监听事件
    onLoad: function(options) {
        console.log("page onLoad");
        console.log("options is ", options);
        //想要打印id，必须写成带有形参的形式options.id
        console.log("options.id is ", options.id);
        // var globalData = app.globalData;
        //此处的options.id 来源于post.js里的url: "post-detail/post-detail?id=" + postId里的id，通过options参数由鼠标点击后获取onPostTap事件里的postId，然后传递到了post-detail.js
        // post.js里"post-detail/post-detail?id="里的名字id,是自定义的，而且它决定了post-detail.js引用的时候也要写成id
        //这里的postId实际拿到的是post.js中onPostTap函数下url:"post-detail/post-detail?id=" + postId 中的id=postId,回溯自post.js中var postId = event.currentTarget.dataset.postid;再回溯，postid来源于post.wxml中的data-postId="{{item.postId}}"，再回溯，{{item.postId}}来源于post.wxml页面中wx:for="{{posts_key}}" wx:for-item="item"所关联的post.js中的posts_key所对应到post-data.js中的postId
        //post.js中传过来的完整url: "post-detail/detail?id=" + postId,  即 id = 某一个postId，然后传入post-detail.js
        var postId = options.id;
        // console.log("options is ", options);
        //将获取到的 postId 赋予this.data.currentPostId，也意味着将新造变量currentPostId放置在了本页面的data{}数据层面，变成了中间变量，能便于其它函数调用
        this.data.currentPostId = postId;
        console.log("postId is ", this.data.currentPostId);
        //postList是一个有很多对象的数组，数组里的元素排序从0开始，这里的[postId]恰巧在假数据中是按0开始往后排的，这样postData就是其中某一个为对象的元素，并按postId来指定顺序
        //在onLoad中定义了postData这样的变量，只是为拿到某一个详情单页的数据做好准备，什么时候使用怎么使用要看具体情况
        var postData = postsData.postList[postId];
        console.log("postData is ", postData);
        this.setData({
            //setData里的变量可以直接拿到html标签里用，俗称数据绑定
            postData: postData
        });

        //模拟所有的缓存状态
        // var postsCollected = {
        //   1: "ture",
        //   2: "false",
        //   3: "true",
        //   ...
        // };
        // var postsCollected = wx.getStorageSync('posts_collected');

        //利用缓存技术，处理页面显示收藏按钮的状态
        //同步获取指定key（本例为'posts_collected'） 到本地缓存Storage中，并赋予变量postsCollected为缓存池
        //注意在onLoad下的var postsCollected可以被if else判断里else的局部变量var postsCollected = {}所更新，但仅限于if else内使用，反过来操作则不行
        var postsCollected = wx.getStorageSync('posts_collected');
        //注意postsCollected是缓存池 不是指代数据的 postsData 或 postList 或 local_database
        //如果缓存池postsCollected存在
        if (postsCollected) {
            //把postId读取到定义的postsCollected缓存池中，postsCollected是一个对象，将postId的键值赋予变量postCollected，方法参考movies.js中的readyData[settedKey]用法，等同于postsCollected = {postId: postCollected}, 这里的[postId]恰巧在假数据中是按0开始往后排的；这里的情况和var postData = postsData.postList[postId]利用数组的方法不一样
            var postCollected = postsCollected[postId]
                //如果postCollected是false的话是不会执行这个if的，也没有相应的else执行，所以是什么也不做，collected也不会被赋值，会变成undefined
            if (postCollected) {
                this.setData({
                    //加载时的判断
                    collected: postCollected
                });
            }
            console.log('实验 postCollected 是什么值 ', postCollected);
            console.log('实验 collected 是什么值 ', this.data.collected);
            // 这里不写对应 if(postCollected) 的 else 是默认如果postCollected不存在的话，就不需要对collected赋值，无论是false还是undefined 它都对应了post-detail.wxml的<image wx:else ...>
        } else {
            //为wx.setStorageSync定义一个data属性，这里是一个空的对象，方便放入任何内容，也可以放入一个空数组[]
            //如果缓存池不存在，先给postsCollected一个空对象
            var postsCollected = {};
            //空对象意味着当前文文章不可能被收藏，此时应认人为让当前的文章收藏状态为false
            // 将false赋值给postsCollected[postId]，刷新缓存池中的postsCollected，这里的false和postCollected没有直接关系
            postsCollected[postId] = false;
            //也可以写成如下，正因为它会使得postsCollected = {postId: false}
            // postsCollected.postId = false;
            //意味着在空对象中先放入一个postId: false的对象，以它为起点
            //亦能写成 postCollected = false; 但是注意这里的postCollected不可随意变更，需和其它postCollected名字一致
            // postCollected = false;
            // this.setData({
            //   collected: postCollected
            // });
            //接着把更新过的空对象{postId: false}设置到缓存里
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
        // 页面栈
        var pages = getCurrentPages();
        // 当前页
        var currentPage = pages[pages.length - 1];
        // 上一页
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
            //触发变量变化 用监听或点击 二选一 
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
            //触发变量变化 用监听或点击 二选一 
            app.globalData.g_isPlayingMusic = false;
            //如果当前监听页面是暂停的状态，清空id值
            // app.globalData.g_currentMusicPostId = null;
        });

        wx.onBackgroundAudioStop(function() {
            that.setData({
                isPlayingMusic: false,
            });
            console.log("listen stop");
            //触发变量变化 用监听或点击 二选一 
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
            //点击后，如果判断内部boolean值的isPlayingMusic_one的状态如果为true真，说明音乐则是播放状态，点击之后触发音乐暂停，并且改变状态为false，给下一次点击做准备
            wx.pauseBackgroundAudio();
            //停止播放
            //wx.stopBackgroundAudio();
            this.setData({
                isPlayingMusic: false,
            });
            //触发变量变化 用监听或点击 二选一 app.globalData.g_isPlayingMusic = false;
            console.log("do pause");
            // app.globalData.g_currentMusicPostId = null;
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = false;
            // 错误写法，绑定变量不能这样写： this.data.isPlayingMusic = false;
            //只有在onLoad函数才可以直接用this.data.val=yyy等操作，一般用来传参；如果是在别的除了onLoad以外的函数里（包括onLoad里面嵌套定义的函数），需要涉及到从js逻辑层绑定数据到wxml视图层的，必须使用this.setData()的形式进行更新变量数据；其它函数中this.data.xxx的写法只适用于传参，比如通过引用onLoad函数里的this.data.xxx；凡是非第一层函数的，this可一律设置var that = this;进而使用that来做引用that.data.xxx或that.setData({})绑定数据
        }
        //点击后，如果判断内部boolean值的isPlayingMusic_one的状态为false，说明音乐则是暂停状态，点击之后触发音乐播放，并改变状态为真，给下一次点击做准备
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
            //触发变量变化 用监听或点击 二选一 app.globalData.g_isPlayingMusic = true;
            console.log("do play");
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    },

    //收藏按钮的动作
    onCollectionTap: function(event) {
        // var postsCollected = wx.getStorageSync('posts_collected');
        // //post键值赋予变量postCollected 使得postsCollected = {this.data.currentPostId: postCollected}
        // var postCollected = postsCollected[this.data.currentPostId];
        // //收藏变成未收藏，未收藏变成收藏，第一次点击后，会从默认的false变成true
        // postCollected = !postCollected;
        // console.log(postsCollected);
        // //并把postCollected的最新状态更新到postsCollected内对应id具体的缓存值（针对某一篇文章）
        // postsCollected[this.data.currentPostId] = postCollected;
        // //在这里不需要对空判断 if (postsCollected) {...}了，因为缓存中已经有了
        // //更新最新状态的文章数据的所有缓存值，为下一次被调用做准备
        // // wx.setStorageSync('posts_collected', postsCollected);
        // //更新数据绑定变量，从而实现切换图片
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

    //异步的方法，此例不用
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
        //到缓存池里去捞
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //每经过一次onCollectionTap函数动作，将原来的postCollected状态取反更新
        // 收藏变成未收藏，未收藏变成收藏，第一次点击后，会从默认的false变成true
        postCollected = !postCollected;
        //再把postCollected的最新状态更新到postsCollected内对应id具体的缓存值（针对某一篇文章），使得postsCollected为最新的缓存值，然后作为参数被showModal调用
        //衍生话题：var a = b 代表定义了一个变量a 也同时是初始化a的值为1， 之后 a = 2 代表了变量a的值更新为2
        postsCollected[this.data.currentPostId] = postCollected;
        //在这里不需要再写入判断 if (postsCollected) {...}了，因为缓存中已经有了postsCollected
        //如果有写wx.setStorageSync('posts_collected', postsCollected);则为更新最新状态的文章数据到缓存值，为下一次被调用做准备
        console.log(postsCollected);
        this.showModal(postsCollected, postCollected);
    },

    showModal: function(postsCollected, postCollected) {
        var that = this;
        //先让用户确定是否收藏
        wx.showModal({
            title: "收藏",
            //三元表达式，  "收藏该文章?" : "取消收藏该文章？" 代表了 true: false，是对postCollected真假的判断
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

// var pages = getCurrentPages(); getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。getCurrentPages()方法：利用此方法可获取所有打开页面数组，再根据其获取到相应的页面，然后执行页面里的方法。

//五层的限制只是针对 navigateTo，redirectTo 则无此限制。因为 redirectTo 的行为是：关闭当前页面，跳转到应用内的某个页面。
// var Page = pages[pages.length - 1];//当前页
// var prevPage = pages[pages.length - 2];  //上一个页面
// var info = prevPage.data //取上页data里的数据也可以修改
// prevPage.setData({ 键: 值 })//设置数据

//setData（）函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致。
//this.data一般用来传参，不用于绑定数据
//setData（）参数格式:接受一个对象，以键（key）值（value）的方式改变值。