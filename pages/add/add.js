Page({
  data: {
    type: 'income',
    amount: '',
    note: '',
    id: null,
    isEdit: false,
    dateOnly: ''
  },

  onLoad(options) {
    // 默认日期为今天
    if (!options.id) {
      const now = new Date()
      const dateOnly = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`
      this.setData({ dateOnly })
    }
    if (options.id) {
      // 编辑模式
      const records = wx.getStorageSync('accountRecords') || []
      const record = records.find(r => r.id === parseInt(options.id))
      if (record) {
        this.setData({
          id: record.id,
          type: record.type,
          amount: record.amount.toString(),
          note: record.note || '',
          isEdit: true,
          dateOnly: record.dateOnly || ''
        })
      }
    }
  },

  typeChange(e) {
    this.setData({
      type: e.detail.value
    })
  },

  dateChange(e) {
    this.setData({
      dateOnly: e.detail.value
    })
  },

  formSubmit(e) {
    const { type, amount, note } = e.detail.value
    const { dateOnly, isEdit, id } = this.data
    
    if (!amount) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    }
    if (!dateOnly) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }

    // 获取现有记录
    const records = wx.getStorageSync('accountRecords') || []
    const now = new Date()
    const dateStr = `${dateOnly} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
    
    if (isEdit) {
      // 编辑模式：更新记录
      const index = records.findIndex(r => r.id === id)
      if (index !== -1) {
        records[index] = {
          ...records[index],
          type,
          amount: parseFloat(amount),
          note,
          dateOnly,
          date: dateStr
        }
      }
    } else {
      // 新增模式：添加记录
      records.unshift({
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        note,
        date: dateStr,
        dateOnly
      })
    }

    // 保存到本地存储
    wx.setStorageSync('accountRecords', records)

    wx.showToast({
      title: isEdit ? '更新成功' : '保存成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  }
})