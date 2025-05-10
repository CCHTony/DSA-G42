/**
 * Stack 資料結構的實作
 */
class Stack {
  constructor() {
    this.items = [];
    this.size = 0;
  }

  /**
   * 將元素推入堆疊頂部
   * @param {*} element - 要推入的元素
   */
  push(element) {
    this.items.push(element);
    this.size++;
    return this;
  }

  /**
   * 從堆疊頂部移除元素並返回
   * @returns {*} 堆疊頂部的元素
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    this.size--;
    return this.items.pop();
  }

  /**
   * 查看堆疊頂部元素但不移除
   * @returns {*} 堆疊頂部的元素
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.size - 1];
  }

  /**
   * 檢查堆疊是否為空
   * @returns {boolean} 如果堆疊為空則返回 true，否則返回 false
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * 返回堆疊的大小
   * @returns {number} 堆疊中的元素數量
   */
  getSize() {
    return this.size;
  }

  /**
   * 清空堆疊
   */
  clear() {
    this.items = [];
    this.size = 0;
    return this;
  }

  /**
   * 將堆疊轉換為陣列
   * @returns {Array} 包含堆疊所有元素的陣列
   */
  toArray() {
    return [...this.items];
  }
}

// 使用範例
function testStack() {
  const stack = new Stack();
  
  console.log("推入元素 10, 20, 30");
  stack.push(10).push(20).push(30);
  
  console.log("堆疊大小:", stack.getSize());
  console.log("堆疊頂部元素:", stack.peek());
  
  console.log("彈出元素:", stack.pop());
  console.log("彈出後堆疊大小:", stack.getSize());
  
  console.log("堆疊是否為空:", stack.isEmpty());
  console.log("堆疊內容:", stack.toArray());
  
  console.log("清空堆疊");
  stack.clear();
  console.log("清空後堆疊大小:", stack.getSize());
  console.log("堆疊是否為空:", stack.isEmpty());
}

// 導出 Stack 類
// module.exports = Stack; 
export default Stack;