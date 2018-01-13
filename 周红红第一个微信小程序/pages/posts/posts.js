var postDatas=require('../../data/posts-data.js');
var app = getApp();
Page({
  onPostTap:function(event){
    var postid=event.currentTarget.dataset.postid;
    // console.log(postid);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postid,
    })
    
  },
  onSwiperItemTap:function(event){
    var postid = event.currentTarget.dataset.postid;
    // console.log(postid);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid,
    })
  },
  data: {
  },
  onLoad: function (options) {
    this.setData({
       post_key: postDatas.dataList
        });
    
  },
});