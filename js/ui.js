// UI交互和界面管理

class UIManager {
    constructor() {
        this.isLoading = false;
        this.isDarkMode = false;
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.bindUIEvents();
        this.setupTheme();
        this.setupScrollAnimations();
        this.setupAccessibility();
    }

    setupLoadingScreen() {
        // 页面加载完成后隐藏加载屏幕
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                const mainContent = document.getElementById('main-content');
                
                if (loadingScreen && mainContent) {
                    loadingScreen.style.opacity = '0';
                    mainContent.style.opacity = '1';
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1000); // 最少显示1秒加载屏幕
        });
    }

    bindUIEvents() {
        // 帮助按钮
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeHelp = document.getElementById('close-help');

        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                this.showModal(helpModal);
            });
        }

        if (closeHelp && helpModal) {
            closeHelp.addEventListener('click', () => {
                this.hideModal(helpModal);
            });
        }

        // 点击模态框背景关闭
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    this.hideModal(helpModal);
                }
            });
        }

        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // 分享按钮
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareResult();
            });
        }

        // 下载报告按钮
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadReport();
            });
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });

        // 表单验证
        this.setupFormValidation();
    }

    setupFormValidation() {
        const salaryInput = document.getElementById('salary');
        const workDaysInput = document.getElementById('workDays');
        const wfhDaysInput = document.getElementById('wfhDays');

        if (salaryInput) {
            salaryInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (value < 0) {
                    e.target.value = 0;
                    this.showNotification('薪资不能为负数', 'warning');
                } else if (value > 10000000) {
                    e.target.value = 10000000;
                    this.showNotification('薪资超出合理范围', 'warning');
                }
            });
        }

        if (workDaysInput && wfhDaysInput) {
            const validateWorkDays = () => {
                const workDays = parseInt(workDaysInput.value) || 0;
                const wfhDays = parseInt(wfhDaysInput.value) || 0;
                
                if (wfhDays > workDays) {
                    wfhDaysInput.value = workDays;
                    this.showNotification('居家办公天数不能超过工作天数', 'warning');
                }
            };

            workDaysInput.addEventListener('change', validateWorkDays);
            wfhDaysInput.addEventListener('change', validateWorkDays);
        }
    }

    setupTheme() {
        // 检查系统主题偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        } else {
            this.isDarkMode = prefersDark.matches;
        }
        
        this.applyTheme();
        
        // 监听系统主题变化
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.isDarkMode = e.matches;
                this.applyTheme();
            }
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        
        // 主题切换动画
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    applyTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                `;
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                `;
            }
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // 观察所有需要滚动动画的元素
        document.querySelectorAll('.scroll-animation').forEach(el => {
            observer.observe(el);
        });
    }

    setupAccessibility() {
        // 键盘导航支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // 高对比度模式检测
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // 减少动画检测
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    showModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.querySelector('.bg-white').classList.add('modal-content');
        
        // 聚焦到模态框
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        if (!modal) return;
        
        modal.classList.add('modal-exit');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'modal-exit');
            document.body.style.overflow = '';
        }, 300);
    }

    hideAllModals() {
        document.querySelectorAll('.fixed.inset-0').forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                this.hideModal(modal);
            }
        });
    }

    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (!notification || !notificationText) return;

        // 设置消息和类型
        notificationText.textContent = message;
        
        // 更新图标和颜色
        const iconMap = {
            success: `<svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>`,
            warning: `<svg class="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>`,
            error: `<svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`
        };

        const iconElement = notification.querySelector('svg');
        if (iconElement && iconMap[type]) {
            iconElement.outerHTML = iconMap[type];
        }

        // 显示通知
        notification.classList.remove('translate-x-full');
        notification.classList.add('notification-enter');
        
        // 自动隐藏
        setTimeout(() => {
            this.hideNotification();
        }, duration);
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.classList.add('notification-exit');
        notification.classList.remove('notification-enter');
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            notification.classList.remove('notification-exit');
        }, 300);
    }

    shareResult() {
        if (!calculator || !calculator.result) {
            this.showNotification('请先完成计算', 'warning');
            return;
        }

        const shareText = calculator.getShareText();
        
        if (navigator.share) {
            navigator.share({
                title: '工作性价比评估结果',
                text: shareText,
                url: window.location.href
            }).then(() => {
                this.showNotification('分享成功！', 'success');
            }).catch((error) => {
                console.log('分享失败:', error);
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('结果已复制到剪贴板！', 'success');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification('结果已复制到剪贴板！', 'success');
            } else {
                this.showNotification('复制失败，请手动复制', 'error');
            }
        } catch (err) {
            this.showNotification('复制失败，请手动复制', 'error');
        }

        document.body.removeChild(textArea);
    }

    downloadReport() {
        if (!calculator || !calculator.result) {
            this.showNotification('请先完成计算', 'warning');
            return;
        }

        try {
            const reportContent = calculator.generateReport();
            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `工作性价比报告_${new Date().toISOString().split('T')[0]}.txt`;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            this.showNotification('报告下载成功！', 'success');
            
        } catch (error) {
            console.error('下载失败:', error);
            this.showNotification('下载失败，请检查浏览器设置', 'error');
        }
    }

    showLoadingState(element, originalText) {
        if (!element) return;
        
        element.disabled = true;
        element.classList.add('loading');
        element.innerHTML = `
            <div class="loading-spinner w-4 h-4 mr-2"></div>
            处理中...
        `;
        
        return () => {
            element.disabled = false;
            element.classList.remove('loading');
            element.innerHTML = originalText;
        };
    }

    highlightElement(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, duration);
    }

    shakeElement(element) {
        if (!element) return;
        
        element.classList.add('error-animation');
        setTimeout(() => {
            element.classList.remove('error-animation');
        }, 500);
    }

    // 工具方法：防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具方法：节流
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 响应式处理
    handleResize() {
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-view', isMobile);
        
        // 移动端特殊处理
        if (isMobile) {
            // 调整动画时长
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.6s');
        }
    }

    // 性能优化：虚拟滚动（如果有大量数据时使用）
    setupVirtualScroll(container, items, itemHeight) {
        if (!container || !items.length) return;
        
        const containerHeight = container.clientHeight;
        const totalHeight = items.length * itemHeight;
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        
        let scrollTop = 0;
        
        const updateView = () => {
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
            
            // 更新可见项目
            container.style.height = `${totalHeight}px`;
            container.style.paddingTop = `${startIndex * itemHeight}px`;
            
            // 渲染可见项目
            container.innerHTML = '';
            for (let i = startIndex; i < endIndex; i++) {
                const item = document.createElement('div');
                item.style.height = `${itemHeight}px`;
                item.textContent = items[i];
                container.appendChild(item);
            }
        };
        
        container.addEventListener('scroll', () => {
            scrollTop = container.scrollTop;
            requestAnimationFrame(updateView);
        });
        
        updateView();
    }
}

// 初始化UI管理器
let uiManager;

document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
    
    // 响应式处理
    window.addEventListener('resize', uiManager.throttle(() => {
        uiManager.handleResize();
    }, 250));
    
    // 初始调用
    uiManager.handleResize();
});