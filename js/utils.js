// 工具函数库

class Utils {
    // 数字格式化
    static formatNumber(num, decimals = 0) {
        if (num === null || num === undefined || isNaN(num)) return '--';
        return new Intl.NumberFormat('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    // 货币格式化
    static formatCurrency(amount, currency = 'CNY') {
        if (amount === null || amount === undefined || isNaN(amount)) return '--';
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // 百分比格式化
    static formatPercent(value, decimals = 1) {
        if (value === null || value === undefined || isNaN(value)) return '--';
        return new Intl.NumberFormat('zh-CN', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    }

    // 日期格式化
    static formatDate(date, options = {}) {
        if (!date) return '--';
        const defaultOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat('zh-CN', { ...defaultOptions, ...options }).format(new Date(date));
    }

    // 深拷贝
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    // 防抖函数
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 获取URL参数
    static getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 设置URL参数
    static setUrlParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    }

    // 移除URL参数
    static removeUrlParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.replaceState({}, '', url);
    }

    // 本地存储封装
    static storage = {
        set(key, value, expires = null) {
            const item = {
                value: value,
                expires: expires ? Date.now() + expires : null
            };
            try {
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (e) {
                console.warn('无法保存到本地存储:', e);
                return false;
            }
        },

        get(key) {
            try {
                const itemStr = localStorage.getItem(key);
                if (!itemStr) return null;

                const item = JSON.parse(itemStr);
                
                // 检查是否过期
                if (item.expires && Date.now() > item.expires) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return item.value;
            } catch (e) {
                console.warn('无法从本地存储读取:', e);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('无法从本地存储删除:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('无法清空本地存储:', e);
                return false;
            }
        }
    };

    // 设备检测
    static device = {
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        isTablet() {
            return /iPad|Android|Tablet/i.test(navigator.userAgent) && window.innerWidth >= 768;
        },

        isDesktop() {
            return !this.isMobile() && !this.isTablet();
        },

        getType() {
            if (this.isMobile()) return 'mobile';
            if (this.isTablet()) return 'tablet';
            return 'desktop';
        }
    };

    // 浏览器检测
    static browser = {
        isChrome() {
            return /Chrome/i.test(navigator.userAgent) && /Google Inc/i.test(navigator.vendor);
        },

        isFirefox() {
            return /Firefox/i.test(navigator.userAgent);
        },

        isSafari() {
            return /Safari/i.test(navigator.userAgent) && /Apple Computer/i.test(navigator.vendor);
        },

        isEdge() {
            return /Edge/i.test(navigator.userAgent);
        },

        isIE() {
            return /MSIE|Trident/i.test(navigator.userAgent);
        },

        getVersion() {
            const agent = navigator.userAgent;
            let version = 'unknown';
            
            if (this.isChrome()) {
                version = agent.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
            } else if (this.isFirefox()) {
                version = agent.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
            } else if (this.isSafari()) {
                version = agent.match(/Version\/(\d+)/)?.[1] || 'unknown';
            }
            
            return version;
        }
    };

    // 网络状态检测
    static network = {
        isOnline() {
            return navigator.onLine;
        },

        getConnectionType() {
            return navigator.connection?.effectiveType || 'unknown';
        },

        getDownlinkSpeed() {
            return navigator.connection?.downlink || 0;
        },

        isSlowConnection() {
            const connection = navigator.connection;
            if (!connection) return false;
            
            return connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' ||
                   connection.downlink < 1;
        }
    };

    // 数学工具
    static math = {
        // 精确加法
        add(a, b) {
            const decimalA = (a.toString().split('.')[1] || '').length;
            const decimalB = (b.toString().split('.')[1] || '').length;
            const maxDecimal = Math.max(decimalA, decimalB);
            const factor = Math.pow(10, maxDecimal);
            return (Math.round(a * factor) + Math.round(b * factor)) / factor;
        },

        // 精确减法
        subtract(a, b) {
            return this.add(a, -b);
        },

        // 精确乘法
        multiply(a, b) {
            const strA = a.toString();
            const strB = b.toString();
            const decimalA = (strA.split('.')[1] || '').length;
            const decimalB = (strB.split('.')[1] || '').length;
            const factor = Math.pow(10, decimalA + decimalB);
            return (Number(strA.replace('.', '')) * Number(strB.replace('.', ''))) / factor;
        },

        // 精确除法
        divide(a, b) {
            if (b === 0) throw new Error('除数不能为零');
            const strA = a.toString();
            const strB = b.toString();
            const decimalA = (strA.split('.')[1] || '').length;
            const decimalB = (strB.split('.')[1] || '').length;
            const factor = Math.pow(10, decimalB - decimalA);
            return (Number(strA.replace('.', '')) / Number(strB.replace('.', ''))) * factor;
        },

        // 保留小数位
        toFixed(num, decimals) {
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },

        // 范围限制
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        // 线性插值
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        }
    };

    // 字符串工具
    static string = {
        // 首字母大写
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // 驼峰命名转换
        camelCase(str) {
            return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
        },

        // 短横线命名转换
        kebabCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },

        // 下划线命名转换
        snakeCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        },

        // 截断字符串
        truncate(str, length, suffix = '...') {
            if (!str || str.length <= length) return str;
            return str.substring(0, length) + suffix;
        },

        // 移除HTML标签
        stripHtml(str) {
            return str.replace(/<[^>]*>/g, '');
        },

        // 转义HTML
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // 数组工具
    static array = {
        // 数组去重
        unique(arr) {
            return [...new Set(arr)];
        },

        // 数组分组
        groupBy(arr, key) {
            return arr.reduce((groups, item) => {
                const group = typeof key === 'function' ? key(item) : item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },

        // 数组排序
        sortBy(arr, key, order = 'asc') {
            return arr.sort((a, b) => {
                const aVal = typeof key === 'function' ? key(a) : a[key];
                const bVal = typeof key === 'function' ? key(b) : b[key];
                
                if (aVal < bVal) return order === 'asc' ? -1 : 1;
                if (aVal > bVal) return order === 'asc' ? 1 : -1;
                return 0;
            });
        },

        // 数组分页
        paginate(arr, page, size) {
            const start = (page - 1) * size;
            const end = start + size;
            return {
                data: arr.slice(start, end),
                total: arr.length,
                page: page,
                size: size,
                pages: Math.ceil(arr.length / size)
            };
        },

        // 打乱数组
        shuffle(arr) {
            const shuffled = [...arr];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
    };

    // 颜色工具
    static color = {
        // 十六进制转RGB
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // RGB转十六进制
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        // 生成随机颜色
        random() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        },

        // 颜色亮度计算
        brightness(hex) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return 0;
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },

        // 判断颜色是否为深色
        isDark(hex) {
            return this.brightness(hex) < 128;
        }
    };

    // 动画工具
    static animation = {
        // 缓动函数
        easing: {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInBounce: t => 1 - this.easeOutBounce(1 - t),
            easeOutBounce: t => {
                if (t < 1 / 2.75) return 7.5625 * t * t;
                if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
                if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        },

        // 数值动画
        animate(from, to, duration, easingFn = 'easeOutQuad', callback) {
            const startTime = Date.now();
            const easing = typeof easingFn === 'string' ? this.easing[easingFn] : easingFn;
            
            const step = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);
                const current = from + (to - from) * easedProgress;
                
                callback(current, progress);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            
            requestAnimationFrame(step);
        },

        // 滚动到指定位置
        scrollTo(element, to, duration = 500) {
            const start = element.scrollTop;
            const change = to - start;
            const startTime = Date.now();
            
            const animateScroll = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easing.easeOutQuad(progress);
                
                element.scrollTop = start + change * easedProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        }
    };

    // 表单验证工具
    static validation = {
        // 邮箱验证
        isEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // 手机号验证（中国）
        isPhone(phone) {
            const re = /^1[3-9]\d{9}$/;
            return re.test(phone);
        },

        // 身份证号验证（中国）
        isIdCard(idCard) {
            const re = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            return re.test(idCard);
        },

        // URL验证
        isUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        // 密码强度检测
        passwordStrength(password) {
            let strength = 0;
            const checks = [
                /.{8,}/, // 至少8位
                /[a-z]/, // 小写字母
                /[A-Z]/, // 大写字母
                /[0-9]/, // 数字
                /[^A-Za-z0-9]/ // 特殊字符
            ];
            
            checks.forEach(check => {
                if (check.test(password)) strength++;
            });
            
            const levels = ['very-weak', 'weak', 'fair', 'good', 'strong'];
            return {
                score: strength,
                level: levels[Math.min(strength, 4)]
            };
        },

        // 通用验证规则
        rules: {
            required: (value) => value !== null && value !== undefined && value !== '',
            minLength: (min) => (value) => value && value.length >= min,
            maxLength: (max) => (value) => value && value.length <= max,
            min: (min) => (value) => Number(value) >= min,
            max: (max) => (value) => Number(value) <= max,
            pattern: (regex) => (value) => regex.test(value)
        }
    };

    // 错误处理工具
    static error = {
        // 全局错误处理
        setup() {
            window.addEventListener('error', (event) => {
                console.error('全局错误:', event.error);
                this.report(event.error);
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error('未处理的Promise错误:', event.reason);
                this.report(event.reason);
            });
        },

        // 错误上报
        report(error) {
            // 这里可以集成错误上报服务
            const errorInfo = {
                message: error.message,
                stack: error.stack,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            // 发送到错误监控服务
            console.log('错误信息:', errorInfo);
        },

        // 安全执行函数
        safely(fn, fallback = null) {
            try {
                return fn();
            } catch (error) {
                console.error('安全执行失败:', error);
                this.report(error);
                return fallback;
            }
        },

        // Promise安全包装
        safePromise(promise, fallback = null) {
            return promise.catch(error => {
                console.error('Promise执行失败:', error);
                this.report(error);
                return fallback;
            });
        }
    };

    // 性能监控工具
    static performance = {
        // 性能标记
        mark(name) {
            if (window.performance && window.performance.mark) {
                window.performance.mark(name);
            }
        },

        // 性能测量
        measure(name, startMark, endMark) {
            if (window.performance && window.performance.measure) {
                window.performance.measure(name, startMark, endMark);
                const measures = window.performance.getEntriesByName(name);
                return measures[measures.length - 1]?.duration || 0;
            }
            return 0;
        },

        // 执行时间测量
        time(fn, label = 'execution') {
            const start = Date.now();
            const result = fn();
            const duration = Date.now() - start;
            console.log(`${label} 耗时: ${duration}ms`);
            return { result, duration };
        },

        // 异步执行时间测量
        async timeAsync(fn, label = 'async-execution') {
            const start = Date.now();
            const result = await fn();
            const duration = Date.now() - start;
            console.log(`${label} 耗时: ${duration}ms`);
            return { result, duration };
        },

        // FPS监控
        monitorFPS(callback) {
            let lastTime = Date.now();
            let frames = 0;
            
            const tick = () => {
                frames++;
                const now = Date.now();
                
                if (now >= lastTime + 1000) {
                    const fps = Math.round(frames * 1000 / (now - lastTime));
                    callback(fps);
                    frames = 0;
                    lastTime = now;
                }
                
                requestAnimationFrame(tick);
            };
            
            requestAnimationFrame(tick);
        }
    };

    // 事件总线
    static eventBus = {
        events: {},

        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },

        off(event, callback) {
            if (!this.events[event]) return;
            
            if (callback) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            } else {
                delete this.events[event];
            }
        },

        emit(event, ...args) {
            if (!this.events[event]) return;
            
            this.events[event].forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`事件 ${event} 处理错误:`, error);
                }
            });
        },

        once(event, callback) {
            const onceCallback = (...args) => {
                callback(...args);
                this.off(event, onceCallback);
            };
            this.on(event, onceCallback);
        }
    };

    // Cookie工具
    static cookie = {
        set(name, value, days = 7) {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        get(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let c of ca) {
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        remove(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        }
    };

    // 文件处理工具
    static file = {
        // 读取文件为文本
        readAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        },

        // 读取文件为DataURL
        readAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        // 下载文件
        download(content, filename, type = 'text/plain') {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        // 格式化文件大小
        formatSize(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    };
}

// 全局暴露Utils
window.Utils = Utils;

// 初始化错误处理
Utils.error.setup();