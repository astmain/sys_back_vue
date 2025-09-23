
// eventBus.js
class EventBus {
  private events: { [key: string]: Function[] }

  constructor() {
    this.events = {}
  }

  // 订阅消息
  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // 发布消息
  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data))
    }
  }

  // 取消订阅
  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }
  }
}

// 创建全局事件总线实例
export const eventBus = new EventBus()
