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
  const randomBtn = document.getElementById('random-btn');
  const stackSizeEl = document.getElementById('stack-size');
  const lastOperationEl = document.getElementById('last-operation');
  const operationResultEl = document.getElementById('operation-result');
  const stackWrapper = document.querySelector('.stack-wrapper');

  // 創建堆疊實例
  const stack = new Stack();
  
  // 控制變量
  let isAnimating = false; // 防止動畫期間進行操作
  
  // 更新堆疊大小顯示
  const updateStackSize = () => {
    stackSizeEl.textContent = stack.getSize();
    
    // 根據堆疊是否為空來設置按鈕狀態
    const isEmpty = stack.isEmpty();
    popBtn.disabled = isEmpty;
    peekBtn.disabled = isEmpty;
    clearBtn.disabled = isEmpty;
    
    if (isEmpty) {
      popBtn.classList.add('disabled');
      peekBtn.classList.add('disabled');
      clearBtn.classList.add('disabled');
    } else {
      popBtn.classList.remove('disabled');
      peekBtn.classList.remove('disabled');
      clearBtn.classList.remove('disabled');
    }
  };
  
  // 更新操作信息和提供視覺反饋
  const updateOperationInfo = (operation, result) => {
    lastOperationEl.textContent = operation;
    operationResultEl.textContent = result !== null ? result : 'None';
    
    // 視覺反饋 - 使結果閃爍顯示
    operationResultEl.classList.add('highlight-pulse');
    setTimeout(() => {
      operationResultEl.classList.remove('highlight-pulse');
    }, 1000);
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
    // 生成漸變顏色 - 使用更加和諧的顏色方案
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 70; // 70-90%
    const lightness = Math.floor(Math.random() * 20) + 50;  // 50-70%
    
    const hue2 = (hue + 40) % 360;
    item.style.background = `linear-gradient(135deg, 
      hsla(${hue}, ${saturation}%, ${lightness}%, 0.8), 
      hsla(${hue2}, ${saturation}%, ${lightness-10}%, 0.8))`;
    
    // 添加打字機效果
    if (value.length > 0) {
      item.innerHTML = '<span class="typing"></span>';
      const typingElement = item.querySelector('.typing');
      
      let i = 0;
      const typeEffect = setInterval(() => {
        if (i < value.length) {
          typingElement.textContent += value.charAt(i);
          i++;
        } else {
          clearInterval(typeEffect);
          item.textContent = value;
        }
      }, 50);
    }
    
    item.style.backgroundImage = getRandomMyGO();
    item.style.backgroundSize = 'contain'; // 或用 'cover' 看你想怎麼填滿
    item.style.backgroundPosition = 'right';
    item.style.backgroundRepeat = 'no-repeat';
    return item;
  };
  
  // 推入元素到堆疊
  const pushElement = (value) => {
    if (!value || isAnimating) return;
    
    isAnimating = true;
    
    // 更新堆疊數據
    stack.push(value);
    updateStackSize();
    updateOperationInfo('Push', value);
    
    // 創建視覺元素
    const item = createStackItem(value);
    stackVisualizer.appendChild(item);
    
    // 滾動到頂部以顯示新元素
    stackWrapper.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 添加動畫
    setTimeout(() => {
      item.classList.remove('stack-item-enter');
      isAnimating = false;
    }, 50);
    
    // 清空輸入並聚焦
    elementInput.value = '';
    elementInput.focus();
  };

  // 取得stack.pop時要刪除的DOM
  function getLastStackItem() {
    const items = stackVisualizer.children;
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].classList.contains('stack-item-exit')) {
        return items[i];
      }
    }
    return null;
  }
  
  // 從堆疊彈出元素
  const popElement = () => {
    if (stack.isEmpty() || isAnimating) return;
    
    isAnimating = true;
    
    // 滾動到頂部
    stackWrapper.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      // 獲取準備彈出的元素
      const lastItem = getLastStackItem();
      if (!lastItem) {
        isAnimating = false;
        return;
      }
      
      // 更新堆疊數據
      const value = stack.pop();
      updateStackSize();
      updateOperationInfo('Pop', value);
      
      // 添加退出動畫
      lastItem.classList.add('stack-item-exit');
      lastItem.classList.add('pop-effect');
      
      // 短暫突顯彈出的項目
      lastItem.style.zIndex = '10';
      lastItem.style.transform = 'scale(1.1) translateX(0)';
      
      setTimeout(() => {
        lastItem.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
          if (stackVisualizer.contains(lastItem)) {
            stackVisualizer.removeChild(lastItem);
          }
          isAnimating = false;
        }, 300);
      }, 300);
    }, 300);
  };
  
  // 查看堆疊頂部元素
  const peekElement = () => {
    if (stack.isEmpty() || isAnimating) return;
    
    // 滾動到頂部
    stackWrapper.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const value = stack.peek();
    updateOperationInfo('Peek', value);
    
    // 視覺效果
    const lastItem = getLastStackItem();
    if (lastItem) {
      lastItem.classList.add('stack-item-peek');
      
      // 添加浮動效果
      lastItem.style.transform = 'translateY(-10px)';
      lastItem.style.boxShadow = '0 15px 25px rgba(0, 0, 0, 0.3)';
      
      setTimeout(() => {
        lastItem.style.transform = '';
        lastItem.style.boxShadow = '';
        
        setTimeout(() => {
          lastItem.classList.remove('stack-item-peek');
        }, 300);
      }, 700);
    }
  };
  
  // 清空堆疊
  const clearStack = () => {
    if (stack.isEmpty() || isAnimating) return;
    
    isAnimating = true;
    
    stack.clear();
    updateStackSize();
    updateOperationInfo('Clear', 'Stack is empty');
    
    // 清空視覺元素 - 使用階梯式動畫
    const items = Array.from(stackVisualizer.children);
    
    if (items.length === 0) {
      isAnimating = false;
      return;
    }
    
    // 先震動效果
    stackVisualizer.classList.add('shake-effect');
    
    setTimeout(() => {
      stackVisualizer.classList.remove('shake-effect');
      
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('stack-item-exit');
          
          setTimeout(() => {
            if (stackVisualizer.contains(item)) {
              stackVisualizer.removeChild(item);
            }
            
            // 在最後一個元素移除後解除動畫鎖
            if (index === items.length - 1) {
              isAnimating = false;
            }
          }, 300);
        }, index * 100);
      });
    }, 400);
  };
  
  // 初始化動畫與UI
  const initializeUI = () => {
    // 初始禁用按鈕
    updateStackSize();
    
    // 為按鈕添加波紋效果
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // 創建波紋元素
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // 設置波紋位置
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        // 移除波紋
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  };
  
  // 事件監聽器
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
  initializeUI();

  // 為演示添加一些初始元素
  setTimeout(() => {
    const demoItems = ['Stack Demo', 'Try operating', 'Start experiencing'];
    demoItems.forEach((item, index) => {
      setTimeout(() => {
        elementInput.value = item;
        pushElement(item);
      }, index * 800);
    });
  }, 1000);
  
  const updateHeaderGradient = () => {
    const headerElements = document.querySelectorAll('h1, h2');
    headerElements.forEach(element => {
      const hue = (Date.now() / 50) % 360;
      element.style.background = `linear-gradient(to right, 
        hsl(${hue}, 80%, 50%), 
        hsl(${(hue + 60) % 360}, 80%, 60%), 
        hsl(${(hue + 180) % 360}, 80%, 50%))`;
      element.style.webkitBackgroundClip = 'text';
      element.style.backgroundClip = 'text';
    });
    
    requestAnimationFrame(updateHeaderGradient);
  };
  
  // 啟動漸變動畫
  requestAnimationFrame(updateHeaderGradient);
}); 