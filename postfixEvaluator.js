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
  let evaluationStack = new Stack();
  let steps = [];
  let currentStepIndex = -1;

  // 初始化
  const initialize = () => {
    tokens = [];
    currentTokenIndex = -1;
    isEvaluating = false;
    evaluationStack.clear();
    steps = [];
    currentStepIndex = -1;
    
    // 清空視覺元素
    postfixExpressionEl.innerHTML = '';
    postfixStackEl.innerHTML = '';
    evaluationStepsEl.innerHTML = '';
    evaluationResultEl.textContent = 'None';
    evaluationStatusEl.textContent = 'ready';
  };

  // 檢查是否為運算符
  const isOperator = (token) => {
    return ['+', '-', '*', '/', '^', '%'].includes(token);
  };

  // 檢查是否為數字
  const isNumber = (token) => {
    return !isNaN(parseFloat(token)) && isFinite(token);
  };

  // 執行計算
  const performOperation = (operator, operand1, operand2) => {
    switch (operator) {
      case '+': return operand1 + operand2;
      case '-': return operand1 - operand2;
      case '*': return operand1 * operand2;
      case '/': return operand1 / operand2;
      case '^': return Math.pow(operand1, operand2);
      case '%': return operand1 % operand2;
      default: return 0;
    }
  };

  // 解析表達式
  const parseExpression = (expression) => {
    if (!expression.trim()) {
      return [];
    }
    
    // 將表達式分割為標記
    return expression.trim().split(/\s+/);
  };
  
  // 創建標記元素
  const createTokenElement = (token) => {
    const tokenEl = document.createElement('span');
    tokenEl.textContent = token;
    tokenEl.className = `token ${isOperator(token) ? 'token-operator' : 'token-number'}`;
    return tokenEl;
  };
  
  // 顯示表達式
  const displayExpression = (tokens) => {
    postfixExpressionEl.innerHTML = '';
    tokens.forEach(token => {
      const tokenEl = createTokenElement(token);
      postfixExpressionEl.appendChild(tokenEl);
    });
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
  
  // 更新堆疊視覺化
  const updateStackVisualization = () => {
    // 清空當前視覺化
    postfixStackEl.innerHTML = '';
    
    // 為每個堆疊元素創建可視元素
    const stackItems = evaluationStack.toArray();
    stackItems.forEach(item => {
      const stackItemEl = createStackItem(item);
      postfixStackEl.appendChild(stackItemEl);
      
      // 移除進入動畫效果
      setTimeout(() => {
        if (stackItemEl.parentNode === postfixStackEl) {
          stackItemEl.classList.remove('stack-item-enter');
        }
      }, 50);
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
    }
  };
  
  // 計算後綴表達式
  const evaluatePostfix = (expression) => {
    initialize();
    
    tokens = parseExpression(expression);
    if (tokens.length === 0) {
      evaluationStatusEl.textContent = 'invalid expression';
      return;
    }
    
    // 顯示表達式
    displayExpression(tokens);
    evaluationStatusEl.textContent = 'ready to calculate';
    
    // 為每個標記生成步驟描述
    tokens.forEach((token, index) => {
      const stepDesc = {
        token: token,
        index: index,
        description: '',
        action: null
      };
      
      if (isNumber(token)) {
        stepDesc.description = `read number ${token}, push to stack`;
        stepDesc.action = () => {
          evaluationStack.push(parseFloat(token));
        };
      } else if (isOperator(token)) {
        stepDesc.description = `read operator ${token}, pop two operands from stack`;
        stepDesc.action = () => {
          if (evaluationStack.getSize() < 2) {
            throw new Error('expression error: stack has insufficient operands');
          }
          
          const operand2 = evaluationStack.pop();
          const operand1 = evaluationStack.pop();
          const result = performOperation(token, operand1, operand2);
          
          evaluationStack.push(result);
          return { operand1, operand2, result };
        };
      } else {
        stepDesc.description = `unknown token ${token}, ignore`;
        stepDesc.action = () => {};
      }
      
      steps.push(stepDesc);
    });
    
    // 添加最終步驟
    steps.push({
      token: null,
      index: tokens.length,
      description: 'calculation completed, the value at the top of the stack is the final result',
      action: () => {
        if (evaluationStack.getSize() !== 1) {
          throw new Error('expression error: stack should have only one value as the result');
        }
        return { result: evaluationStack.peek() };
      }
    });
    
    isEvaluating = true;
  };
  
  // 執行整個計算過程
  const runFullEvaluation = () => {
    try {
      // 重置並初始化
      evaluatePostfix(postfixInput.value);
      
      // 執行所有步驟
      for (let step of steps) {
        let stepDescription = step.description;
        
        // 執行步驟操作
        if (step.action) {
          const result = step.action();
          
          // 更新描述以包含結果
          if (result) {
            if (step.token && isOperator(step.token)) {
              stepDescription += `：calculate ${result.operand1} ${step.token} ${result.operand2} = ${result.result}, push to stack`;
            } else if (result.result !== undefined) {
              stepDescription += `：${result.result}`;
            }
          }
        }
        
        // 添加步驟描述
        addEvaluationStep(stepDescription);
      }
      
      // 更新最終結果
      const finalResult = evaluationStack.peek();
      evaluationResultEl.textContent = finalResult !== null ? finalResult : 'error';
      evaluationStatusEl.textContent = 'calculation completed';
      
      // 更新堆疊視覺化
      updateStackVisualization();
      
    } catch (error) {
      evaluationStatusEl.textContent = `error: ${error.message}`;
      evaluationResultEl.textContent = 'error';
    }
  };
  
  // 執行單一步驟
  const runSingleStep = () => {
    if (!isEvaluating) {
      evaluatePostfix(postfixInput.value);
      currentStepIndex = -1;
    }
    
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
              stepDescription += `：calculate ${result.operand1} ${step.token} ${result.operand2} = ${result.result}, push to stack`;
            } else if (result.result !== undefined) {
              stepDescription += `：${result.result}`;
              // 最終結果
              evaluationResultEl.textContent = result.result;
            }
          }
        }
        
        // 添加步驟描述並高亮
        const stepEl = addEvaluationStep(stepDescription, true);
        
        // 更新堆疊視覺化
        updateStackVisualization();
        
        // 更新狀態
        if (currentStepIndex === steps.length - 1) {
          evaluationStatusEl.textContent = 'calculation completed';
        } else {
          evaluationStatusEl.textContent = `step ${currentStepIndex + 1}/${steps.length}`;
        }
      } catch (error) {
        evaluationStatusEl.textContent = `error: ${error.message}`;
        evaluationResultEl.textContent = 'error';
        isEvaluating = false;
      }
    }
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
      runFullEvaluation();
    } else {
      evaluationStatusEl.textContent = 'please enter a valid postfix expression';
    }
  });
  
  // 逐步執行按鈕事件
  stepBtn.addEventListener('click', () => {
    if (postfixInput.value.trim()) {
      runSingleStep();
    } else {
      evaluationStatusEl.textContent = 'please enter a valid postfix expression';
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
  
  // 添加示例表達式
  setTimeout(() => {
    postfixInput.value = '3 4 + 5 *';
    evaluationStatusEl.textContent = 'ready - try to calculate "3 4 + 5 *" = (3+4)*5 = 35';
  }, 500);
}); 