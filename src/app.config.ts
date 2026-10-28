export default defineAppConfig({
  pages: [
    'pages/checkin/index',
    'pages/records/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f4f1ea',
    navigationBarTitleText: '入睡打卡',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f4f1ea'
  },
  tabBar: {
    color: '#5f5954',
    selectedColor: '#243056',
    backgroundColor: '#f7f4ee',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/checkin/index',
        text: '打卡',
        iconPath: 'assets/checkin.png',
        selectedIconPath: 'assets/checkin-on.png'
      },
      {
        pagePath: 'pages/records/index',
        text: '记录',
        iconPath: 'assets/records.png',
        selectedIconPath: 'assets/records-on.png'
      }
    ]
  }
})
