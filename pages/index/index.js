// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    records: [],
    filteredRecords: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    startDate: '',
    endDate: '',
    sortOptions: ['默认排序', '按时间从新到旧', '按时间从旧到新', '先显示收入', '先显示支出'],
    sortIndex: 0,
    searchText: ''
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onShow() {
    this.loadRecords()
  },
  onSearchInput(e) {
    this.setData({ searchText: e.detail.value })
    this.filterAndSum(this.data.records, this.data.startDate, this.data.endDate, this.data.sortIndex, e.detail.value)
  },
  loadRecords() {
    const records = wx.getStorageSync('accountRecords') || []
    this.setData({ records })
    this.filterAndSum(records, this.data.startDate, this.data.endDate, this.data.sortIndex, this.data.searchText)
  },
  startDateChange(e) {
    const startDate = e.detail.value
    this.setData({ startDate })
    this.filterAndSum(this.data.records, startDate, this.data.endDate, this.data.sortIndex, this.data.searchText)
  },
  endDateChange(e) {
    const endDate = e.detail.value
    this.setData({ endDate })
    this.filterAndSum(this.data.records, this.data.startDate, endDate, this.data.sortIndex, this.data.searchText)
  },
  showSortAction() {
    wx.showActionSheet({
      itemList: this.data.sortOptions,
      success: (res) => {
        if (typeof res.tapIndex !== 'undefined') {
          this.setData({ sortIndex: res.tapIndex })
          this.filterAndSum(this.data.records, this.data.startDate, this.data.endDate, res.tapIndex, this.data.searchText)
        }
      }
    })
  },
  filterAndSum(records, startDate, endDate, sortIndex, searchText = '') {
    let filtered = records
    if (startDate) {
      filtered = filtered.filter(r => r.dateOnly >= startDate)
    }
    if (endDate) {
      filtered = filtered.filter(r => r.dateOnly <= endDate)
    }
    if (searchText) {
      const s = searchText.toLowerCase()
      filtered = filtered.filter(r =>
        (r.type === 'income' ? '收入' : '支出').includes(s) ||
        (r.note && r.note.toLowerCase().includes(s)) ||
        (r.amount + '').includes(s)
      )
    }
    // 排序
    if (sortIndex == 1) {
      filtered = filtered.slice().sort((a, b) => (b.dateOnly + b.date).localeCompare(a.dateOnly + a.date))
    } else if (sortIndex == 2) {
      filtered = filtered.slice().sort((a, b) => (a.dateOnly + a.date).localeCompare(b.dateOnly + b.date))
    } else if (sortIndex == 3) {
      filtered = filtered.slice().sort((a, b) => {
        if (a.type === b.type) return 0
        return a.type === 'income' ? -1 : 1
      })
    } else if (sortIndex == 4) {
      filtered = filtered.slice().sort((a, b) => {
        if (a.type === b.type) return 0
        return a.type === 'expense' ? -1 : 1
      })
    }
    let totalIncome = 0
    let totalExpense = 0
    filtered.forEach(record => {
      if (record.type === 'income') {
        totalIncome += record.amount
      } else {
        totalExpense += record.amount
      }
    })
    this.setData({
      filteredRecords: filtered,
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      balance: (totalIncome - totalExpense).toFixed(2)
    })
  },
  deleteRecord(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = this.data.records.filter(record => record.id !== id)
          wx.setStorageSync('accountRecords', records)
          this.loadRecords()
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },
  editRecord(e) {
    const id = e.currentTarget.dataset.id
    const record = this.data.records.find(r => r.id === id)
    wx.navigateTo({
      url: `/pages/add/add?id=${id}&type=${record.type}&amount=${record.amount}&note=${record.note}`
    })
  },
  navigateToAdd() {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  },
  onShareAppMessage() {
    return {
      title: '我的记账本',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'  // 分享图片，需要您提供
    }
  },
  onShareTimeline() {
    return {
      title: '我的记账本',
      query: '',
      imageUrl: '/images/share.png'  // 分享图片，需要您提供
    }
  }
})
