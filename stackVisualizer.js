/**
 * 堆疊視覺化器
 */
import Stack from "./Stack.js";
document.addEventListener('DOMContentLoaded', () => {
  // 獲取 DOM 元素
  const stackVisualizer = document.getElementById('stack-visualizer');
  const elementInput = document.getElementById('element-input');
  const pushBtn = document.getElementById('push-btn');
  const popBtn = document.getElementById('pop-btn');
  const peekBtn = document.getElementById('peek-btn');
  const clearBtn = document.getElementById('clear-btn');
  const stackSizeEl = document.getElementById('stack-size');
  const lastOperationEl = document.getElementById('last-operation');
  const operationResultEl = document.getElementById('operation-result');

  // 創建堆疊實例
  const stack = new Stack();
  
  // 更新堆疊大小顯示
  const updateStackSize = () => {
    stackSizeEl.textContent = stack.getSize();
  };
  
  // 更新操作信息
  const updateOperationInfo = (operation, result) => {
    lastOperationEl.textContent = operation;
    operationResultEl.textContent = result !== null ? result : '無';
  };
  
  // 創建堆疊項目元素
  const createStackItem = (value) => {
    const item = document.createElement('div');
    item.className = 'stack-item stack-item-enter';
    item.textContent = value;
    
    // 隨機生成漸變顏色
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 40) % 360;
    item.style.background = `linear-gradient(135deg, hsla(${hue1}, 80%, 60%, 0.8), hsla(${hue2}, 80%, 50%, 0.8))`;
    
    return item;
  };
  
  // 推入元素到堆疊
  const pushElement = (value) => {
    if (!value) return;
    
    // 更新堆疊數據
    stack.push(value);
    updateStackSize();
    updateOperationInfo('Push', value);
    
    // 創建視覺元素
    const item = createStackItem(value);
    stackVisualizer.appendChild(item);
    
    // 添加動畫
    setTimeout(() => {
      item.classList.remove('stack-item-enter');
    }, 10);
    
    // 清空輸入
    elementInput.value = '';
    elementInput.focus();
  };

  // 取得stack.pop時要刪除的DOM
  function getLastItem(items) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].classList.contains('stack-item-exit')) {
        return items[i];
      }
    }
    return null;
  }
  
  // 從堆疊彈出元素
  const popElement = () => {
    if (stack.isEmpty()) {
      updateOperationInfo('Pop', 'Stack is empty');
      return;
    }
    
    // 更新堆疊數據
    const value = stack.pop();
    updateStackSize();
    updateOperationInfo('Pop', value);
    
    // 更新視覺效果
    const items = stackVisualizer.children;
    if (items.length > 0) {
      const lastItem = getLastItem(items);
      if (lastItem === null) {
        updateOperationInfo('Pop', 'Stack is empty');
        return;
      }
      lastItem.classList.add('stack-item-exit');
      
      setTimeout(() => {
        stackVisualizer.removeChild(lastItem);
      }, 500);
    }
  };
  
  // 查看堆疊頂部元素
  const peekElement = () => {
    const value = stack.peek();
    
    if (value === null) {
      updateOperationInfo('Peek', 'Stack is empty');
      return;
    }
    
    updateOperationInfo('Peek', value);
    
    // 視覺效果
    const items = stackVisualizer.children;
    if (items.length > 0) {
      const lastItem = getLastItem(items);
      if (lastItem === null) {
        updateOperationInfo('Peek', 'Stack is empty');
        return;
      }
      lastItem.classList.add('stack-item-peek');
      
      setTimeout(() => {
        lastItem.classList.remove('stack-item-peek');
      }, 1000);
    }
  };
  
  // 清空堆疊
  const clearStack = () => {
    stack.clear();
    updateStackSize();
    updateOperationInfo('Clear', 'Stack is empty');
    
    // 清空視覺元素
    const items = Array.from(stackVisualizer.children);
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('stack-item-exit');
        
        setTimeout(() => {
          if (stackVisualizer.contains(item)) {
            stackVisualizer.removeChild(item);
          }
        }, 500);
      }, index * 100);
    });
  };
  

  pushBtn.addEventListener('click', () => {
    pushElement(elementInput.value);
  });
  
  elementInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      pushElement(elementInput.value);
    }
  });
  
  popBtn.addEventListener('click', popElement);
  peekBtn.addEventListener('click', peekElement);
  clearBtn.addEventListener('click', clearStack);
  
  // 初始化
  updateStackSize();

  // 為演示添加一些初始元素
  setTimeout(() => {
    const demoItems = ['Stack Demo', 'Try it out', 'Start experiencing'];
    demoItems.forEach((item, index) => {
      setTimeout(() => {
        elementInput.value = item;
        pushElement(item);
      }, index * 800);
    });
  }, 500);
  
  // 添加一個隨機彩虹效果到標題
  const title = document.querySelector('h1');
  let hue = Math.floor(Math.random() * 360);
  setInterval(() => {
    hue = (hue + Math.floor(Math.random() * 5) + 1) % 360;
    title.style.background = `linear-gradient(to right, 
      hsl(${hue}, 80%, 50%), 
      hsl(${(hue + 60) % 360}, 80%, 60%), 
      hsl(${(hue + 180) % 360}, 80%, 50%))`;
    title.style.webkitBackgroundClip = 'text';
    title.style.backgroundClip = 'text';
  }, 100);
}); 