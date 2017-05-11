
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "untitled1",
  /**
   * 页面的初始数据
   */

  data: {
    
  
  //canvas数据
    
    wx_canvas_circle16ffd1a4:{
      part_data: {"width":300,"height":"150","max":100,"progress":70,"borderWidth":5,"borderColor":"#fa00b4","backgroundColor":"#e0e0e0","showProgress":true,"fontSize":50,"fontWeight":"normal","fontColor":"#fa00b4","duration":1000}
    },
    
    wx_canvas_circle_13134778:{
      part_data: {"width":300,"height":"150","max":100,"progress":70,"borderWidth":5,"borderColor":"#fa00b4","backgroundColor":"#e0e0e0","showProgress":true,"fontSize":50,"fontWeight":"normal","fontColor":"#fa00b4","duration":1000}
    },
    
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // 注册coolsite360交互模块
    app.coolsite360.register(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // 执行coolsite360交互组件展示
    app.coolsite360.onShow(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    
  },


  //以下为自定义点击事件
  
})

