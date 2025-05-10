/**
 * 堆疊視覺化器
 */
document.addEventListener('DOMContentLoaded', () => {
  // 獲取 DOM 元素
  const stackVisualizer = document.getElementById('stack-visualizer');
  const elementInput = document.getElementById('element-input');
  const pushBtn = document.getElementById('push-btn');
  const popBtn = document.getElementById('pop-btn');
  const peekBtn = document.getElementById('peek-btn');
  const clearBtn = document.getElementById('clear-btn');
  const randomBtn = document.getElementById('random-btn');
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
    operationResultEl.textContent = result !== null ? result : 'NIL';
  };


  function getRandomMyGO(){
    i = Math.floor(Math.random() * (5)) + 1;
    if (i === 1){
      return "url('./images/Anon.png')";
    }
    else if (i === 2){
      return "url('./images/Tomorin.png')"
    }
    else if (i === 3){
      return "url('./images/Rana.png')"
    }
    else if (i === 4){
      return "url('./images/Soyo.png')"
    }
    else if (i === 5){
      return "url('./images/Rikki.png')"
    }
  }
  
  // 創建堆疊項目元素
  const createStackItem = (value) => {
    const item = document.createElement('div');
    item.className = 'stack-item stack-item-enter';
    item.textContent = value;
    // 隨機生成漸變顏色
    // const hue1 = Math.floor(Math.random() * 360);
    // const hue2 = (hue1 + 40) % 360;
    // item.style.background = `linear-gradient(135deg, hsla(${hue1}, 80%, 60%, 0.8), hsla(${hue2}, 80%, 50%, 0.8))`;
    
    item.style.backgroundImage = getRandomMyGO();
    item.style.backgroundSize = 'contain'; // 或用 'cover' 看你想怎麼填滿
    item.style.backgroundPosition = 'right';
    item.style.backgroundRepeat = 'no-repeat';
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
      const lastItem = items[items.length - 1];
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
      const lastItem = items[items.length - 1];
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
  
  function random_stuff(){
    i = Math.floor(Math.random() * (7)) + 1;
    if (i === 1){
      return "Distribute Snacks Appropriately";
    }
    else if (i === 2){
      return "Daily Study Auditorium"
    }
    else if (i === 3){
      return "Diamond Set Arrangement"
    }
    else if (i === 4){
      return "Despair Sans Absolution"
    }
    else if (i === 5){
      return "Dock Spot Arboretum"
    }
    else if (i === 6){
      return "Dusty Scholar’s Abyss"
    }
    else{
      return "Device Symptom Aggregation"
    }
  }

  randomBtn.addEventListener('click', () => {
    pushElement(random_stuff());
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
  hue = Math.floor(Math.random() * 360);
  setInterval(() => {
    title.style.background = `linear-gradient(to right, 
      hsl(${hue}, 80%, 50%), 
      hsl(${(hue + 60) % 360}, 80%, 60%), 
      hsl(${(hue + 180) % 360}, 80%, 50%))`;
    title.style.webkitBackgroundClip = 'text';
    title.style.backgroundClip = 'text';
    hue = (hue + 1) %360;
  }, 60);
}); 