// pages/movies/more-movie/more-movie.js
var util = require('../../../util/util.js');
var app = getApp();
Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    console.log(category);
    this.setData({
      category: category
    });
    // 根据不同的category获取不同的数据
    var dataUrl = '';
    switch (category) {
      case "正在上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "Top250":
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData);
  },
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl +
      "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);

    }
    // this.setData({
    //   movies: movies
    // })

    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    // this.data.totalCount = this.data.totalCount+20;
    console.log(this.data);
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount = this.data.totalCount + 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },



  //动态设定导航栏标题
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.category,
    })
  },
  //下拉加载更多
  onScrollLower: function (event) {
    // console.log("加载更多！");
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);

    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  }


})