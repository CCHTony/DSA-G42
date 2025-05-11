/**
 * 主題管理器 - 處理亮暗主題切換
 */
document.addEventListener('DOMContentLoaded', () => {
  // 獲取相關DOM元素
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.querySelector('.theme-label i');
  const body = document.body;
  const loader = document.querySelector('.loader');
  
  // 檢查本地存儲中是否有主題設置
  const savedTheme = localStorage.getItem('theme');
  
  // 初始化主題
  const initTheme = () => {
    // 如果本地存儲中有主題設置，則使用該設置
    if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
      themeToggle.checked = true;
      themeLabel.classList.remove('fa-moon');
      themeLabel.classList.add('fa-sun');
    }
  };
  
  // 切換主題
  const toggleTheme = () => {
    if (themeToggle.checked) {
      // 切換到暗黑模式
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      themeLabel.classList.remove('fa-moon');
      themeLabel.classList.add('fa-sun');
    } else {
      // 切換到亮色模式
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      themeLabel.classList.remove('fa-sun');
      themeLabel.classList.add('fa-moon');
    }
  };
  
  // 註冊事件監聽器
  themeToggle.addEventListener('change', toggleTheme);
  
  // 初始化主題
  initTheme();
  
  // 初始化AOS動畫
  const initAOS = () => {
    // 獲取所有帶有data-aos屬性的元素
    const aosElements = document.querySelectorAll('[data-aos]');
    
    // 監聽滾動事件，以便在元素進入視口時添加動畫
    const checkScroll = () => {
      aosElements.forEach(element => {
        // 計算元素相對於視口的位置
        const elementPosition = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 如果元素進入視口，添加aos-animate類
        if (elementPosition.top < windowHeight * 0.85) {
          element.classList.add('aos-animate');
        }
      });
    };
    
    // 註冊滾動事件
    window.addEventListener('scroll', checkScroll);
    
    // 初始檢查，以便在頁面載入時顯示視口中的元素
    checkScroll();
  };
  
  // 顯示頁面，隱藏載入器
  window.addEventListener('load', () => {
    // 添加一個短暫延遲，以確保所有資源已載入
    setTimeout(() => {
      loader.classList.add('hidden');
      
      // 初始化AOS動畫
      initAOS();
    }, 500);
  });
}); 