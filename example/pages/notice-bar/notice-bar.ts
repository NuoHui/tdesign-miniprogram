Page({
  data: {
    marquee: {
      speed: 80,
      loop: -1,
      delay: 5000,
    },
  },
  clickDetail() {
    wx.showToast({ title: '点击了详情' });
  },
});
