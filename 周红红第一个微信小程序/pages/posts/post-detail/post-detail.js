var postDatas = require('../../../data/posts-data.js');
var app=getApp();
Page({

  data: {
    // isPlayingMusic:false
  },

  onLoad: function (options) {
    var globalData=app.globalData;
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postDatas.dataList[postId];//根据id拿数据
    this.setData({
      postData1: postData
    });



    // var postsCollected={
    //   1:"true",
    //   2:"false",
    //   3:"true"
    // }


    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);

    }

    //实现播放音乐退出后再进入还是音乐播放的状态图片
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId===postId){
      this.setData({
        isPlayingMusic:true
      })
     
    }
    //实现同步
    this.setMusicMonitor();

  },
  setMusicMonitor:function(){
    //实现同步
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId ;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId =null;
    })

  },

  // onCollectionTap: function (event) {
  //   var postsCollected = wx.getStorageSync('posts_collected');
  //   //拿到这个值
  //   var postCollected = postsCollected[this.data.currentPostId];
  //   //取反操作 收藏的变成未收藏
  //   postCollected = !postCollected;
  //   postsCollected[this.data.currentPostId] = postCollected;
  //   //更新文章是否的缓存值
  //   wx.setStorageSync('posts_collected', postsCollected);
  //   //更新数据绑定变量，从而实现切换图片
  //   this.setData({
  //     collected: postCollected
  //   })
  //   wx.showToast({
  //     title: postCollected ? '收藏成功' : '取消成功',
  //     duration: 800,
  //     icon: 'success'
  //   })
  // }


  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    //拿到这个值
    var postCollected = postsCollected[this.data.currentPostId];
    //取反操作 收藏的变成未收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postCollected, postsCollected);
    // this.showModal(postCollected, postsCollected);
    
  },
  
  showToast: function (postCollected, postsCollected){
    var that=this;
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    that.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 800,
      icon: 'success'
    });
    
},
  showModal: function (postCollected, postsCollected){
  var that=this;
  wx.showModal({
    title: '收藏',
    content: postCollected?"收藏该文章？":"取消收藏该文章？",
    showCancel:"true",
    cancelText:"取消",
    confirmText:"确认",
    confirmColor:"#405f80",
    cancelColor:"#333",
    success:function(res){
      if(res.confirm){
        //更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        that.setData({
          collected: postCollected
        })
      }
    }
  });
  

},

  onShareTap:function(event){
    var itemList = ["分享到qq空间", "分享给qq好友", "分享到微博", "分享到朋友圈", "分享给微信朋友"];
    
    wx.showActionSheet({
      itemList:itemList, //why
      // itemList: ["分享到qq空间","分享给qq好友","分享到微博","分享到朋友圈","分享给微信朋友"],
      itemColor:"#405f80",
      success:function(res){
        wx.showModal({
          title: '用户'+itemList[res.tapIndex],
          content: "用户是否取消分享"+res.cancel+'现在无法实现分享功能！',
        })
      }
    })
  },
  onMusicTap:function(event){
    var isPlayingMusic=this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.stopBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      
    }else{
      wx.playBackgroundAudio({
        dataUrl: postDatas.dataList[this.data.currentPostId].music.url,
        title: postDatas.dataList[this.data.currentPostId].music.title,
        coverImgUrl: postDatas.dataList[this.data.currentPostId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })

    }
    
  }







})