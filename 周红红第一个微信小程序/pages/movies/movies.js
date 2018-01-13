var util=require("../../util/util.js");
var app=getApp();
Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow:true,
    searchPanelShow:false,
  },
  onLoad:function(event){
    // url: 'https://api.douban.com/v2/movie/top250',
    //每个都获取到了20条数据，我们只需要每个获取三个数据
    // var inTheatersUrl = app.globalData.doubanBase+'/v2/movie/in_theaters'; //正在上映 
    // var comingSoonUrl = app.globalData.doubanBase +'/v2/movie/coming_soon'; //即将上映
    // var top250Url = app.globalData.doubanBase +'/v2/movie/top250';
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'+'?start=0&count=3'; 
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3'; 
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    this.getMovieList(inTheatersUrl, "inTheaters","正在上映"); 
    this.getMovieList(comingSoonUrl, "comingSoon","即将上映");
    this.getMovieList(top250Url,"top250","Top250");

  },
  getMovieList: function (url,settedKey,categoryTitle) {
    var that=this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"  //不可少
      },
      success: function (res) {
        console.log(res);
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function () {
        console.log("failed");
      }
    })
  },


onBindFocus:function(event){
  // console.log("11");
    // containerShow: true,
    // searchPanelShow:false,
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    })

},
  onCancelImgTap:function(){
    this.setData({
      containerShow: true,
      searchPanelShow: false,

    })
  },


  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies=[];
    for(var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[idx];
      var title=subject.title;
      if(title.length>=6){
        title=title.substring(0,6)+"...";
      }
      var temp={
        stars: util.convertToStarArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp);

    }

    var readyData={};
    readyData[settedKey]={
      categoryTitle:categoryTitle,
      movies:movies
    };
    this.setData(readyData);
    // this.setData({
    //   movies:movies
    // })
  },
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category;
    console.log(category);
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?category=' + category,
    })
  },
  onBindChange:function(event){
    var text=event.detail.value;  
    console.log(text);  //获得文本的输入值
    //豆瓣电影收索api地址
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q='+text; 
    this.getMovieList(searchUrl, "searchResult", "");
  },

  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  }

  
})