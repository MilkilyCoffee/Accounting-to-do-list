Page({
  data: {
    todos: [],
    filteredTodos: [],
    inputValue: '',
    inputDate: '',
    inputDays: '',
    inputStartTime: '',
    inputEndTime: '',
    searchText: ''
  },

  onShow() {
    this.loadTodos()
  },

  onSearchInput(e) {
    this.setData({ searchText: e.detail.value })
    this.filterTodos(e.detail.value)
  },

  loadTodos() {
    const todos = wx.getStorageSync('todoList') || []
    this.setData({ todos })
    this.filterTodos(this.data.searchText)
  },

  filterTodos(searchText = '') {
    let filtered = this.data.todos
    if (searchText) {
      const s = searchText.toLowerCase()
      filtered = filtered.filter(item => item.text.toLowerCase().includes(s))
    }
    this.setData({ filteredTodos: filtered })
  },

  dateChange(e) {
    this.setData({ inputDate: e.detail.value })
  },

  startTimeChange(e) {
    this.setData({ inputStartTime: e.detail.value })
  },

  endTimeChange(e) {
    this.setData({ inputEndTime: e.detail.value })
  },

  addTodo(e) {
    const text = e.detail.value.todoText.trim()
    const date = this.data.inputDate
    const days = e.detail.value.todoDays.trim()
    const startTime = this.data.inputStartTime
    const endTime = this.data.inputEndTime
    if (!text) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (!startTime || !endTime) {
      wx.showToast({ title: '请选择时间段', icon: 'none' })
      return
    }
    const todos = this.data.todos
    todos.unshift({ id: Date.now(), text, date, days, startTime, endTime, done: false })
    wx.setStorageSync('todoList', todos)
    this.setData({ inputValue: '', inputDate: '', inputDays: '', inputStartTime: '', inputEndTime: '' })
    this.loadTodos()
  },

  toggleDone(e) {
    const id = e.currentTarget.dataset.id
    const todos = this.data.todos.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    wx.setStorageSync('todoList', todos)
    this.loadTodos()
  },

  deleteTodo(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条待办吗？',
      success: (res) => {
        if (res.confirm) {
          const todos = this.data.todos.filter(item => item.id !== id)
          wx.setStorageSync('todoList', todos)
          this.loadTodos()
        }
      }
    })
  },

  editTodo(e) {
    const id = e.currentTarget.dataset.id
    const todo = this.data.todos.find(item => item.id === id)
    wx.showModal({
      title: '编辑待办',
      content: '请输入新的内容',
      editable: true,
      placeholderText: todo.text,
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const todos = this.data.todos.map(item =>
            item.id === id ? { ...item, text: res.content.trim() } : item
          )
          wx.setStorageSync('todoList', todos)
          this.loadTodos()
        }
      }
    })
  },

  // 添加分享功能
  onShareAppMessage() {
    return {
      title: '我的待办事项',
      path: '/pages/todo/todo',
      imageUrl: '/images/share.png'  // 分享图片，需要您提供
    }
  },

  // 添加分享到朋友圈功能
  onShareTimeline() {
    return {
      title: '我的待办事项',
      query: '',
      imageUrl: '/images/share.png'  // 分享图片，需要您提供
    }
  }
}) 