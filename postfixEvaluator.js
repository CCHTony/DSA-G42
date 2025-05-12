/**
 * 後綴表達式計算器
 */
import Stack from "./Stack.js";

document.addEventListener('DOMContentLoaded', () => {
  // 獲取DOM元素
  const postfixInput = document.getElementById('postfix-input');
  const evaluateBtn = document.getElementById('evaluate-btn');
  const stepBtn = document.getElementById('step-btn');
  const resetBtn = document.getElementById('reset-btn');
  const postfixExpressionEl = document.getElementById('postfix-expression');
  const postfixStackEl = document.getElementById('postfix-stack');
  const evaluationStepsEl = document.getElementById('evaluation-steps');
  const evaluationResultEl = document.getElementById('evaluation-result');
  const evaluationStatusEl = document.getElementById('evaluation-status');

  // 計算器狀態
  let tokens = [];
  let currentTokenIndex = -1;
  let isEvaluating = false;
  let isAnimating = false;
  let evaluationStack = new Stack();
  let steps = [];
  let currentStepIndex = -1;
  
  // 支持的運算符
  const operators = {
    '+': {
      precedence: 1,
      execute: (a, b) => a + b,
      description: 'Addition'
    },
    '-': {
      precedence: 1,
      execute: (a, b) => a - b,
      description: 'Subtraction'
    },
    '*': {
      precedence: 2,
      execute: (a, b) => a * b,
      description: 'Multiplication'
    },
    '/': {
      precedence: 2,
      execute: (a, b) => a / b,
      description: 'Division'
    },
    '^': {
      precedence: 3,
      execute: (a, b) => Math.pow(a, b),
      description: 'Exponentiation'
    },
    '%': {
      precedence: 2,
      execute: (a, b) => a % b,
      description: 'Modulus'
    }
  };

  // 初始化
  const initialize = () => {
    tokens = [];
    currentTokenIndex = -1;
    isEvaluating = false;
    isAnimating = false;
    evaluationStack.clear();
    steps = [];
    currentStepIndex = -1;
    
    // 清空視覺元素
    postfixExpressionEl.innerHTML = '';
    postfixStackEl.innerHTML = '';
    evaluationStepsEl.innerHTML = '';
    evaluationResultEl.textContent = 'None';
    evaluationStatusEl.textContent = 'Ready';
    
    // 禁用相關按鈕
    stepBtn.disabled = true;
    stepBtn.classList.add('disabled');
    
    // 啟用輸入和計算按鈕
    postfixInput.disabled = false;
    evaluateBtn.disabled = false;
    evaluateBtn.classList.remove('disabled');
  };

  // 檢查是否為運算符
  const isOperator = (token) => {
    return token in operators;
  };

  // 檢查是否為數字
  const isNumber = (token) => {
    // 檢查是否為介於0到100的整數
    const num = parseInt(token, 10);
    return !isNaN(num) && num.toString() === token && num >= 0 && num <= 100;
  };

  // 執行計算
  const performOperation = (operator, operand1, operand2) => {
    if (!operators[operator]) {
      throw new Error(`Unsupported operator: ${operator}`);
    }
    const result = operators[operator].execute(operand1, operand2);
    
    // 檢查計算結果
    if (!Number.isFinite(result)) {
      throw new Error(`Calculation error: Result is not a finite number`);
    }
    
    return result;
  };

  // 解析表達式
  const parseExpression = (expression) => {
    if (!expression.trim()) {
      return [];
    }
    
    // 驗證表達式
    const tokens = expression.trim().split(/\s+/);
    
    // 驗證每個標記是否為有效的運算符或數字
    for (const token of tokens) {
      if (!isOperator(token) && !isNumber(token)) {
        if (!isNaN(parseFloat(token)) && isFinite(token)) {
          // 數字格式正確但超出範圍
          const num = parseFloat(token);
          if (num < 0 || num > 100 || !Number.isInteger(num)) {
            throw new Error(`Invalid number: ${token}. Only integers between 0-100 are allowed.`);
          }
        }
        throw new Error(`Invalid token: ${token}`);
      }
    }
    
    // 驗證後綴表達式的合法性
    let stackSize = 0;
    for (const token of tokens) {
      if (isNumber(token)) {
        stackSize++;
      } else if (isOperator(token)) {
        if (stackSize < 2) {
          throw new Error('Expression error: Operator requires at least two operands');
        }
        stackSize--; // 消耗兩個操作數，產生一個結果
      }
    }
    
    // 最終堆疊應只有一個結果
    if (stackSize !== 1) {
      throw new Error('Expression error: Stack should have exactly one result after evaluation');
    }
    
    return tokens;
  };
  
  // 創建標記元素
  const createTokenElement = (token, index) => {
    const tokenEl = document.createElement('span');
    tokenEl.textContent = token;
    tokenEl.className = `token ${isOperator(token) ? 'token-operator' : 'token-number'}`;
    tokenEl.dataset.index = index;
    tokenEl.title = isOperator(token) ? `${operators[token].description} Operator` : `Number ${token}`;
    
    // 添加點擊效果
    tokenEl.addEventListener('click', () => {
      highlightToken(tokenEl);
      
      // 顯示說明
      const tooltipContent = isOperator(token) 
        ? `${operators[token].description} Operator (${token})` 
        : `Number ${token}`;
      
      showTooltip(tokenEl, tooltipContent);
    });
    
    return tokenEl;
  };
  
  // 顯示説明提示
  const showTooltip = (element, content) => {
    let tooltip = document.querySelector('.expression-tooltip');
    
    // 如果不存在則創建
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'expression-tooltip';
      document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = content;
    
    // 定位工具提示
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 30}px`;
    
    // 顯示
    tooltip.classList.add('visible');
    
    // 設置自動消失
    setTimeout(() => {
      tooltip.classList.remove('visible');
    }, 2000);
  };
  
  // 高亮標記
  const highlightToken = (tokenElement) => {
    // 移除所有已有的高亮
    const allTokens = document.querySelectorAll('.token');
    allTokens.forEach(t => t.classList.remove('token-highlight'));
    
    // 添加高亮
    tokenElement.classList.add('token-highlight');
    
    // 自動消失
    setTimeout(() => {
      tokenElement.classList.remove('token-highlight');
    }, 1500);
  };
  
  // 顯示表達式
  const displayExpression = (tokens) => {
    postfixExpressionEl.innerHTML = '';
    tokens.forEach((token, index) => {
      const tokenEl = createTokenElement(token, index);
      postfixExpressionEl.appendChild(tokenEl);
    });
  };

  function getRandomMujica(){
    i = Math.floor(Math.random() * (5)) + 1;
    if (i === 1){
      return "url('./images/Mutsumi.png')";
    }
    else if (i === 2){
      return "url('./images/Sakiko.png')"
    }
    else if (i === 3){
      return "url('./images/Nyamu.png')"
    }
    else if (i === 4){
      return "url('./images/Umiri.png')"
    }
    else if (i === 5){
      return "url('./images/Hatsune.png')"
    }
  }
  
  // 創建堆疊項目元素
  const createStackItem = (value) => {
    const item = document.createElement('div');
    item.className = 'stack-item stack-item-enter';
    item.textContent = value;
    
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 70; // 70-90%
    const lightness = Math.floor(Math.random() * 20) + 50;  // 50-70%
    
    const hue2 = (hue + 40) % 360;
    item.style.background = `linear-gradient(135deg, 
      hsla(${hue}, ${saturation}%, ${lightness}%, 0.8), 
      hsla(${hue2}, ${saturation}%, ${lightness-10}%, 0.8))`;
    
    // item.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    item.style.display = 'inline-block'
    item.style.backgroundImage = getRandomMujica();
    item.style.backgroundSize = 'contain'; // 或用 'contain' 看你想怎麼填滿
    item.style.backgroundPosition = 'left';
    item.style.backgroundRepeat = 'no-repeat';
    return item;
  };
  
  // 更新堆疊視覺化
  const updateStackVisualization = (animate = true) => {
    // 清空當前視覺化
    postfixStackEl.innerHTML = '';
    
    // 為每個堆疊元素創建可視元素
    const stackItems = evaluationStack.toArray();
    stackItems.forEach(item => {
      const stackItemEl = createStackItem(item);
      postfixStackEl.appendChild(stackItemEl);
      
      if (!animate) {
        stackItemEl.classList.remove('stack-item-enter');
      } else {
        // 移除進入動畫效果
        setTimeout(() => {
          if (stackItemEl.parentNode === postfixStackEl) {
            stackItemEl.classList.remove('stack-item-enter');
          }
        }, 50);
      }
    });
  };
  
  // 添加評估步驟
  const addEvaluationStep = (description, isCurrentStep = false) => {
    const stepEl = document.createElement('div');
    stepEl.className = `evaluation-step ${isCurrentStep ? 'current-step' : ''}`;
    stepEl.textContent = description;
    
    // 添加到步驟容器
    evaluationStepsEl.appendChild(stepEl);
    
    // 滾動到最新步驟
    evaluationStepsEl.scrollTop = evaluationStepsEl.scrollHeight;
    
    return stepEl;
  };
  
  // 更新步驟高亮
  const updateStepHighlight = (index) => {
    // 移除所有高亮
    const steps = evaluationStepsEl.querySelectorAll('.evaluation-step');
    steps.forEach(step => step.classList.remove('current-step'));
    
    // 添加高亮到當前步驟
    if (index >= 0 && index < steps.length) {
      steps[index].classList.add('current-step');
      steps[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  
  // 更新表達式中的標記高亮
  const updateTokenHighlight = (index) => {
    // 移除所有高亮
    const tokenElements = postfixExpressionEl.querySelectorAll('.token');
    tokenElements.forEach(token => token.classList.remove('token-highlight'));
    
    // 添加高亮到當前標記
    if (index >= 0 && index < tokenElements.length) {
      tokenElements[index].classList.add('token-highlight');
      
      // 顯示工具提示
      const token = tokens[index];
      const tooltipContent = isOperator(token) 
        ? `${operators[token].description} 運算符 (${token})` 
        : `數值 ${token}`;
        
      showTooltip(tokenElements[index], tooltipContent);
    }
  };
  
  // 設置UI狀態
  const setUIState = (state) => {
    switch (state) {
      case 'ready':
        // 重置鍵可用
        resetBtn.disabled = false;
        resetBtn.classList.remove('disabled');
        
        // 計算和逐步執行按鈕禁用
        evaluateBtn.disabled = false;
        evaluateBtn.classList.remove('disabled');
        stepBtn.disabled = true;
        stepBtn.classList.add('disabled');
        
        // 輸入框可用
        postfixInput.disabled = false;
        
        evaluationStatusEl.textContent = 'Ready';
        break;
        
      case 'evaluating':
        // 執行時禁用計算和輸入
        evaluateBtn.disabled = true;
        evaluateBtn.classList.add('disabled');
        postfixInput.disabled = true;
        
        // 逐步執行和重置可用
        stepBtn.disabled = false;
        stepBtn.classList.remove('disabled');
        resetBtn.disabled = false;
        resetBtn.classList.remove('disabled');
        
        // 不在這裡設置文字，讓各個函數自己設置
        break;
        
      case 'completed':
        // 計算完成後，計算按鈕禁用，逐步禁用
        evaluateBtn.disabled = true;
        evaluateBtn.classList.add('disabled');
        stepBtn.disabled = true;
        stepBtn.classList.add('disabled');
        
        // 輸入框和重置可用
        postfixInput.disabled = false;
        resetBtn.disabled = false;
        resetBtn.classList.remove('disabled');
        
        // 不在這裡設置文字，讓各個函數自己設置
        
        // 添加成功動畫效果
        evaluationResultEl.classList.add('highlight-pulse');
        setTimeout(() => {
          evaluationResultEl.classList.remove('highlight-pulse');
        }, 1500);
        break;
        
      case 'error':
        // 錯誤狀態下，重置鍵可用，其他禁用
        evaluateBtn.disabled = true;
        evaluateBtn.classList.add('disabled');
        stepBtn.disabled = true;
        stepBtn.classList.add('disabled');
        
        resetBtn.disabled = false;
        resetBtn.classList.remove('disabled');
        postfixInput.disabled = false;
        break;
    }
  };
  
  // 計算後綴表達式
  const evaluatePostfix = (expression) => {
    initialize();
    
    try {
      tokens = parseExpression(expression);
      if (tokens.length === 0) {
        evaluationStatusEl.textContent = 'Invalid expression';
        setUIState('error');
        return;
      }
      
      // 顯示表達式
      displayExpression(tokens);
      setUIState('ready');
      
      // 為每個標記生成步驟描述
      tokens.forEach((token, index) => {
        const stepDesc = {
          token: token,
          index: index,
          description: '',
          action: null
        };
        
        if (isNumber(token)) {
          stepDesc.description = `Read number ${token}, push to stack`;
          stepDesc.action = () => {
            evaluationStack.push(parseFloat(token));
          };
        } else if (isOperator(token)) {
          const opDescription = operators[token].description;
          stepDesc.description = `Read ${opDescription} operator ${token}, pop two operands from stack`;
          
          stepDesc.action = () => {
            if (evaluationStack.getSize() < 2) {
              throw new Error('Expression error: Stack has insufficient operands');
            }
            
            const operand2 = evaluationStack.pop();
            const operand1 = evaluationStack.pop();
            const result = performOperation(token, operand1, operand2);
            
            evaluationStack.push(result);
            return { operand1, operand2, result };
          };
        } else {
          stepDesc.description = `Unknown token ${token}, ignore`;
          stepDesc.action = () => {};
        }
        
        steps.push(stepDesc);
      });
      
      // 添加最終步驟
      steps.push({
        token: null,
        index: tokens.length,
        description: 'Calculation completed, the value at the top of the stack is the final result',
        action: () => {
          if (evaluationStack.getSize() !== 1) {
            throw new Error('Expression error: Stack should have exactly one value as result after calculation');
          }
          return { result: evaluationStack.peek() };
        }
      });
      
      isEvaluating = true;
    } catch (error) {
      evaluationStatusEl.textContent = `Error: ${error.message}`;
      evaluationResultEl.textContent = 'Error';
      setUIState('error');
    }
  };
  
  // 執行整個計算過程
  const runFullEvaluation = () => {
    if (isAnimating) return;
    isAnimating = true;
    
    try {
      // 重置並初始化
      if (!isEvaluating) {
        evaluatePostfix(postfixInput.value);
        
        if (!isEvaluating) {
          isAnimating = false;
          return;
        }
      }
      
      setUIState('evaluating');
      
      // 創建一個定時執行步驟的函數，以便添加動畫
      const executeStepsWithAnimation = (stepIndex) => {
        if (stepIndex >= steps.length) {
          // 所有步驟執行完成
          setUIState('completed');
          
          // 從堆疊中彈出結果
          if (evaluationStack.getSize() > 0) {
            const finalResult = evaluationStack.pop();
            evaluationResultEl.textContent = finalResult;
            
            // 更新堆疊視覺化
            updateStackVisualization();
            
            // 添加額外的步驟說明
            addEvaluationStep(`Final result ${finalResult} popped from stack`, true);
          }
          
          evaluationStatusEl.textContent = 'Calculation completed - Result removed from stack';
          isAnimating = false;
          return;
        }
        
        const step = steps[stepIndex];
        currentStepIndex = stepIndex;
        
        // 更新UI
        updateTokenHighlight(step.index);
        
        let stepDescription = step.description;
        
        // 執行步驟操作
        if (step.action) {
          try {
            const result = step.action();
            
            // 更新描述以包含結果
            if (result) {
              if (step.token && isOperator(step.token)) {
                const opDescription = operators[step.token].description;
                stepDescription += `：Calculate ${result.operand1} ${step.token} ${result.operand2} = ${result.result}, push to stack`;
              } else if (result.result !== undefined) {
                stepDescription += `：${result.result}`;
                // 更新最終結果
                evaluationResultEl.textContent = result.result;
              }
            }
            
            // 更新堆疊視覺化
            updateStackVisualization();
            
            // 添加步驟描述
            addEvaluationStep(stepDescription, true);
            
            // 更新狀態
            if (currentStepIndex === steps.length - 1) {
              setUIState('completed');
              evaluationStatusEl.textContent = 'Calculation completed - Result removed from stack';
              
              // 在計算完成時從堆疊中彈出結果
              if (evaluationStack.getSize() > 0) {
                const finalResult = evaluationStack.pop();
                evaluationResultEl.textContent = finalResult;
                
                // 更新堆疊視覺化
                updateStackVisualization();
                
                // 添加額外的步驟說明
                addEvaluationStep(`Final result ${finalResult} popped from stack`, true);
              }
            } else {
              evaluationStatusEl.textContent = `Executing (${currentStepIndex + 1}/${steps.length})`;
              setUIState('evaluating');
            }
            
          } catch (error) {
            evaluationStatusEl.textContent = `Error: ${error.message}`;
            evaluationResultEl.textContent = 'Error';
            setUIState('error');
            isAnimating = false;
          }
        } else {
          // 如果沒有操作，直接繼續下一步
          setTimeout(() => {
            executeStepsWithAnimation(stepIndex + 1);
          }, 300);
        }
      };
      
      // 開始執行步驟
      executeStepsWithAnimation(0);
      
    } catch (error) {
      evaluationStatusEl.textContent = `Error: ${error.message}`;
      evaluationResultEl.textContent = 'Error';
      setUIState('error');
      isAnimating = false;
    }
  };
  
  // 執行單一步驟
  const runSingleStep = () => {
    if (isAnimating) return;
    isAnimating = true;
    
    if (!isEvaluating) {
      evaluatePostfix(postfixInput.value);
      currentStepIndex = -1;
      
      if (!isEvaluating) {
        isAnimating = false;
        return;
      }
    }
    
    setUIState('evaluating');
    
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      const step = steps[currentStepIndex];
      
      try {
        // 更新標記高亮
        updateTokenHighlight(step.index);
        
        let stepDescription = step.description;
        
        // 執行步驟操作
        if (step.action) {
          const result = step.action();
          
          // 更新描述以包含結果
          if (result) {
            if (step.token && isOperator(step.token)) {
              const opDescription = operators[step.token].description;
              stepDescription += `：Calculate ${result.operand1} ${step.token} ${result.operand2} = ${result.result}, push to stack`;
            } else if (result.result !== undefined) {
              stepDescription += `：${result.result}`;
              // 最終結果
              evaluationResultEl.textContent = result.result;
            }
          }
        }
        
        // 添加步驟描述並高亮
        addEvaluationStep(stepDescription, true);
        
        // 更新堆疊視覺化
        updateStackVisualization();
        
        // 更新狀態
        if (currentStepIndex === steps.length - 1) {
          setUIState('completed');
          evaluationStatusEl.textContent = 'Calculation completed - Result removed from stack';
          
          // 在計算完成時從堆疊中彈出結果
          if (evaluationStack.getSize() > 0) {
            const finalResult = evaluationStack.pop();
            evaluationResultEl.textContent = finalResult;
            
            // 更新堆疊視覺化
            updateStackVisualization();
            
            // 添加額外的步驟說明
            addEvaluationStep(`Final result ${finalResult} popped from stack`, true);
          }
        } else {
          evaluationStatusEl.textContent = `Executing (${currentStepIndex + 1}/${steps.length})`;
          setUIState('evaluating');
        }
        
      } catch (error) {
        evaluationStatusEl.textContent = `Error: ${error.message}`;
        evaluationResultEl.textContent = 'Error';
        setUIState('error');
      }
    }
    
    isAnimating = false;
  };
  
  // 重置按鈕事件
  resetBtn.addEventListener('click', () => {
    initialize();
    postfixInput.value = '';
    postfixInput.focus();
  });
  
  // 計算按鈕事件
  evaluateBtn.addEventListener('click', () => {
    if (postfixInput.value.trim()) {
      // 只初始化計算，不自動執行
      evaluatePostfix(postfixInput.value);
      
      if (isEvaluating) {
        // 更新UI狀態，但不執行步驟
        setUIState('evaluating');
        evaluationStatusEl.textContent = `Ready to execute (${currentStepIndex+1}/${steps.length})`;
      }
    } else {
      evaluationStatusEl.textContent = 'Please enter a valid postfix expression';
      setUIState('error');
    }
  });
  
  // 逐步執行按鈕事件
  stepBtn.addEventListener('click', () => {
    if (postfixInput.value.trim()) {
      runSingleStep();
    } else {
      evaluationStatusEl.textContent = 'Please enter a valid postfix expression';
      setUIState('error');
    }
  });
  
  // 輸入框按鍵事件
  postfixInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      evaluateBtn.click();
    }
  });
  
  // 初始化
  initialize();
  
  // 為按鈕添加波紋效果
  const addRippleEffect = () => {
    const buttons = document.querySelectorAll('.postfix-container-wrapper button');
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
  
  // 添加波紋效果
  addRippleEffect();
  
  // 添加示例表達式
  setTimeout(() => {
    postfixInput.value = '3 4 + 5 *';
    evaluationStatusEl.textContent = 'Ready - Try calculating "3 4 + 5 *" = (3+4)*5 = 35. Only integers 0-100 allowed';
  }, 1000);
}); 