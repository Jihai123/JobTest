
        // PPP转换因子数据
        const pppFactors = {
            'CN': 4.19, 'US': 1.00, 'JP': 102.84, 'DE': 0.75, 'GB': 0.70,
            'SG': 0.84, 'AU': 1.47, 'CA': 1.21, 'FR': 0.73, 'KR': 861.82
        };

        // 货币符号映射
        const currencySymbols = {
          CN: '¥',
          US: '$',
          JP: '¥',
          DE: '€',
          GB: '£',
          SG: 'S$',
          AU: 'A$',
          CA: 'C$',
          FR: '€',
          KR: '₩'
        };

        // 表单数据
        let formData = {
            salary: '',
            country: 'CN',
            workDaysPerWeek: 5,
            wfhDaysPerWeek: 0,
            annualLeave: 5,
            publicHolidays: 13,
            paidSickLeave: 3,
            workHours: 10,
            commuteHours: 2,
            restTime: 2,
            degreeType: 'bachelor',
            schoolType: 'firstTier',
            bachelorType: 'firstTier',
            workYears: 0,
            jobStability: 'private',
            workEnvironment: 1.0,
            cityFactor: 0.70,
            homeTown: 'no',
            leadership: 1.0,
            teamwork: 1.0,
            hasShuttle: false,
            shuttle: 1.0,
            hasCanteen: false,
            canteen: 1.0,
            education: 1.0
        };

        // 等待DOM加载完成后初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成，开始初始化...');
            initializeEventListeners();
            setupRadioButtons();
            updateEducationFactor();
            calculate();
            viewDetailedReport();
        });

        // 初始化所有事件监听器
        function initializeEventListeners() {
            console.log('初始化事件监听器...');
            
            // 输入框事件
            const inputs = ['salary', 'workDaysPerWeek', 'wfhDaysPerWeek', 'annualLeave', 'publicHolidays', 'paidSickLeave', 'workHours', 'commuteHours', 'restTime'];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', function(e) {
                        console.log(`输入更新: ${id} = ${e.target.value}`);
                        formData[id] = parseFloat(e.target.value) || 0;
                        calculate();
                    });
                }
            });

            // 下拉框事件
            const countrySelect = document.getElementById('country');
            if (countrySelect) {
                countrySelect.addEventListener('change', function(e) {
                    console.log(`国家更新: ${e.target.value}`);
                    formData.country = e.target.value;
                    calculate();
                });
            }

            const selects = ['degreeType', 'schoolType', 'bachelorType', 'workYears'];
            selects.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', function(e) {
                        console.log(`选择更新: ${id} = ${e.target.value}`);
                        formData[id] = e.target.value;
                        updateEducationFactor();
                        updateBachelorBackground();
                        calculate();
                    });
                }
            });

            // 复选框事件
            const shuttleCheckbox = document.getElementById('hasShuttle');
            if (shuttleCheckbox) {
                shuttleCheckbox.addEventListener('change', function(e) {
                    console.log(`班车复选框: ${e.target.checked}`);
                    formData.hasShuttle = e.target.checked;
                    const shuttleOptions = document.getElementById('shuttleOptions');
                    if (shuttleOptions) {
                        shuttleOptions.style.display = e.target.checked ? 'grid' : 'none';
                    }
                    if (!e.target.checked) {
                        formData.shuttle = 1.0;
                    }
                    calculate();
                });
            }

            const canteenCheckbox = document.getElementById('hasCanteen');
            if (canteenCheckbox) {
                canteenCheckbox.addEventListener('change', function(e) {
                    console.log(`食堂复选框: ${e.target.checked}`);
                    formData.hasCanteen = e.target.checked;
                    const canteenOptions = document.getElementById('canteenOptions');
                    if (canteenOptions) {
                        canteenOptions.style.display = e.target.checked ? 'grid' : 'none';
                    }
                    if (!e.target.checked) {
                        formData.canteen = 1.0;
                    }
                    calculate();
                });
            }
             const reportBtn = document.getElementById('reportBtn');
                  if (reportBtn) {
                    reportBtn.addEventListener('click', viewDetailedReport);
                  }
                
                  const shareBtn = document.getElementById('shareBtn');
                  if (shareBtn) {
                    shareBtn.addEventListener('click', shareResult);
                  }
                
                  const downloadBtn = document.getElementById('downloadBtn');
                  if (downloadBtn) {
                    downloadBtn.addEventListener('click', downloadReport);
                  }
        }

        // 设置单选按钮事件
        function setupRadioButtons() {
            console.log('设置单选按钮事件...');
            
            // 获取所有单选按钮
            const radioButtons = document.querySelectorAll('.radio-button');
            console.log(`找到 ${radioButtons.length} 个单选按钮`);
            
            radioButtons.forEach((button, index) => {
                console.log(`设置按钮 ${index}: group=${button.dataset.group}, value=${button.dataset.value}`);
                
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const group = this.dataset.group;
                    const value = this.dataset.value;
                    
                    console.log(`按钮被点击: ${group} = ${value}`);
                    
                    // 找到同组的所有按钮并移除active类
                    const groupButtons = document.querySelectorAll(`[data-group="${group}"]`);
                    groupButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // 给当前按钮添加active类
                    this.classList.add('active');
                    
                    // 更新数据
                    if (group === 'jobStability' || group === 'homeTown') {
                        formData[group] = value;
                    } else {
                        formData[group] = parseFloat(value);
                    }
                    
                    console.log(`数据已更新: formData.${group} = ${formData[group]}`);
                    
                    // 重新计算
                    calculate();
                });
                
                // 添加鼠标悬停效果
                button.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('active')) {
                        this.style.backgroundColor = '#e5e7eb';
                    }
                });
                
                button.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.backgroundColor = '#f9fafb';
                    }
                });
            });
        }

        // 更新本科背景显示
        function updateBachelorBackground() {
            const bachelorDiv = document.getElementById('bachelorBackground');
            if (bachelorDiv) {
                bachelorDiv.style.display = formData.degreeType === 'masters' ? 'block' : 'none';
            }
        }

        // 计算教育系数
        function updateEducationFactor() {
            let factor = 1.0;
            
            if (formData.degreeType === 'belowBachelor') {
                factor = 0.8;
            } else if (formData.degreeType === 'bachelor') {
                if (formData.schoolType === 'secondTier') factor = 0.9;
                else if (formData.schoolType === 'firstTier') factor = 1.0;
                else if (formData.schoolType === 'elite') factor = 1.2;
            } else if (formData.degreeType === 'masters') {
                let bachelorBase = 0;
                if (formData.bachelorType === 'secondTier') bachelorBase = 0.9;
                else if (formData.bachelorType === 'firstTier') bachelorBase = 1.0;
                else if (formData.bachelorType === 'elite') bachelorBase = 1.2;
                
                let mastersBonus = 0;
                if (formData.schoolType === 'secondTier') mastersBonus = 0.4;
                else if (formData.schoolType === 'firstTier') mastersBonus = 0.5;
                else if (formData.schoolType === 'elite') mastersBonus = 0.6;
                
                factor = bachelorBase + mastersBonus;
            } else if (formData.degreeType === 'phd') {
                if (formData.schoolType === 'secondTier') factor = 1.6;
                else if (formData.schoolType === 'firstTier') factor = 1.8;
                else if (formData.schoolType === 'elite') factor = 2.0;
            }
            
            formData.education = factor;
            console.log(`教育系数更新: ${factor}`);
        }

        // 计算工作天数
        function calculateWorkingDays() {
            const weeksPerYear = 52;
            const totalWorkDays = weeksPerYear * formData.workDaysPerWeek;
            const totalLeaves = formData.annualLeave + formData.publicHolidays + formData.paidSickLeave * 0.6;
            return Math.max(totalWorkDays - totalLeaves, 0);
        }

        // 计算日薪
        function calculateDailySalary() {
            if (!formData.salary) return 0;
            const workingDays = calculateWorkingDays();
            
            // PPP调整
            const pppFactor = pppFactors[formData.country] || 4.19;
            const standardizedSalary = formData.salary * (4.19 / pppFactor);
            
            return standardizedSalary / workingDays;
        }

        // 获取显示用日薪
        function getDisplaySalary() {
            const dailySalaryInCNY = calculateDailySalary();
            if (formData.country !== 'CN') {
                const pppFactor = pppFactors[formData.country] || 4.19;
                return (dailySalaryInCNY * pppFactor / 4.19).toFixed(2);
            }
            return dailySalaryInCNY.toFixed(2);
        }

        // 主计算函数
        function calculate() {
            console.log('开始计算...');
            console.log('当前formData:', formData);
            
            if (!formData.salary) {
                showEmptyState();
                return;
            }

            const dailySalary = calculateDailySalary();
            const workHours = formData.workHours;
            const commuteHours = formData.commuteHours;
            const restTime = formData.restTime;
            
            // WFH计算
            const workDaysPerWeek = formData.workDaysPerWeek;
            const wfhDaysPerWeek = Math.min(formData.wfhDaysPerWeek, workDaysPerWeek);
            const officeDaysRatio = workDaysPerWeek > 0 ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek : 0;
            
            // 班车和食堂系数
            const shuttleFactor = formData.hasShuttle ? formData.shuttle : 1.0;
            const canteenFactor = formData.hasCanteen ? formData.canteen : 1.0;
            
            const effectiveCommuteHours = commuteHours * officeDaysRatio * shuttleFactor;
            
            // 环境因素
            const environmentFactor = formData.workEnvironment * 
                                    formData.leadership * 
                                    formData.teamwork * 
                                    formData.cityFactor * 
                                    canteenFactor;
            
            // 家乡工作系数
            const homeTownFactor = formData.homeTown === 'yes' ? 1.1 : 1.0;
            
            // 经验薪资倍数
            let experienceSalaryMultiplier = 1.0;
            const workYears = parseInt(formData.workYears);
            
            if (workYears === 0) {
                // 应届生
                if (formData.jobStability === 'government') experienceSalaryMultiplier = 0.8;
                else if (formData.jobStability === 'state') experienceSalaryMultiplier = 0.9;
                else if (formData.jobStability === 'foreign') experienceSalaryMultiplier = 0.95;
                else if (formData.jobStability === 'private') experienceSalaryMultiplier = 1.0;
                else if (formData.jobStability === 'dispatch') experienceSalaryMultiplier = 1.1;
                else if (formData.jobStability === 'freelance') experienceSalaryMultiplier = 1.1;
            } else {
                // 非应届生
                let baseSalaryMultiplier = 1.0;
                if (workYears === 1) baseSalaryMultiplier = 1.5;
                else if (workYears <= 3) baseSalaryMultiplier = 2.2;
                else if (workYears <= 5) baseSalaryMultiplier = 2.7;
                else if (workYears <= 8) baseSalaryMultiplier = 3.2;
                else if (workYears <= 10) baseSalaryMultiplier = 3.6;
                else baseSalaryMultiplier = 3.9;
                
                let salaryGrowthFactor = 1.0;
                if (formData.jobStability === 'foreign') salaryGrowthFactor = 0.8;
                else if (formData.jobStability === 'state') salaryGrowthFactor = 0.4;
                else if (formData.jobStability === 'government') salaryGrowthFactor = 0.2;
                else if (formData.jobStability === 'dispatch') salaryGrowthFactor = 1.2;
                else if (formData.jobStability === 'freelance') salaryGrowthFactor = 1.2;
                
                experienceSalaryMultiplier = 1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
            }
            
            // 最终计算
            const value = (dailySalary * environmentFactor * homeTownFactor) / 
                         (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * formData.education * experienceSalaryMultiplier);
            
            console.log(`计算结果: ${value.toFixed(2)}`);
            updateDisplay(value);
        }

        // 更新显示
        function updateDisplay(value) {
            const workDays = calculateWorkingDays();
            const dailySalary = getDisplaySalary();
            const currency = currencySymbols[formData.country] || '¥';
            
            const workDaysElement = document.getElementById('workDaysDisplay');
            const dailySalaryElement = document.getElementById('dailySalaryDisplay');
            const finalScoreElement = document.getElementById('finalScoreDisplay');
            
            if (workDaysElement) workDaysElement.textContent = `${Math.round(workDays)}天`;
            if (dailySalaryElement) dailySalaryElement.textContent = `${currency}${dailySalary}`;
            if (finalScoreElement) finalScoreElement.textContent = value.toFixed(2);
            
            // 更新分数和评级
            const assessment = getValueAssessment(value);
            const scoreDisplayElement = document.getElementById('scoreDisplay');
            const scoreLevelElement = document.getElementById('scoreLevel');
            
            if (scoreDisplayElement) {
                scoreDisplayElement.textContent = value.toFixed(2);
                scoreDisplayElement.className = `text-5xl font-bold mb-2 ${assessment.color}`;
            }
            if (scoreLevelElement) {
                scoreLevelElement.textContent = assessment.text;
            }
        }

        // 显示空状态
        function showEmptyState() {
            const elements = {
                workDaysDisplay: '--天',
                dailySalaryDisplay: '--',
                finalScoreDisplay: '--',
                scoreDisplay: '--',
                scoreLevel: '请输入年薪开始计算'
            };
            
            Object.keys(elements).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = elements[id];
                    if (id === 'scoreDisplay') {
                        element.className = 'text-5xl font-bold mb-2 text-gray-400';
                    }
                }
            });
        }

        // 获取评级
        function getValueAssessment(value) {
            if (value < 0.6) return { text: '糟糕透了', color: 'score-terrible' };
            if (value < 1.0) return { text: '较差', color: 'score-poor' };
            if (value <= 1.8) return { text: '一般', color: 'score-average' };
            if (value <= 2.5) return { text: '良好', color: 'score-good' };
            if (value <= 3.2) return { text: '很好', color: 'score-great' };
            if (value <= 4.0) return { text: '优秀', color: 'score-excellent' };
            return { text: '完美', color: 'score-excellent' };
        }

        // 分享结果
        function shareResult() {
            if (!formData.salary) {
                alert('请先输入薪资进行计算');
                return;
            }
            
            const value = calculateFinalScore();
            const assessment = getValueAssessment(value);
            const currency = currencySymbols[formData.country] || '¥';
            
            const shareText = `我的工作性价比评估结果：${value.toFixed(2)}分 (${assessment.text})，年薪${currency}${formData.salary}，年工作${calculateWorkingDays()}天，平均日薪${currency}${getDisplaySalary()}。快来测试你的工作值得度吧！`;
            
            if (navigator.share) {
                navigator.share({
                    title: '工作性价比评估结果',
                    text: shareText,
                    url: window.location.href
                }).catch(console.error);
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
                    alert('结果已复制到剪贴板！');
                }).catch(() => {
                    alert('分享失败，请手动复制链接');
                });
            } else {
                alert('分享功能不支持，请手动复制链接分享');
            }
        }

        // 查看详细报告
function viewDetailedReport () {
  /* ---------- 1. 基本校验 ---------- */
  if (!formData.salary) {
    alert('请先输入薪资进行计算');
    return;
  }

  /* ---------- 2. 计算实时指标 ---------- */
  const finalScore      = calculateFinalScore();   // 综合分
  const assessObj       = getValueAssessment(finalScore);
  const dailySalaryCNY  = getDisplaySalary();      // 已按 PPP 及货币符号转换
  const workDaysPerYear = calculateWorkingDays();  // 年工作天数

  /* ---------- 3. 打包所有需要的字段 ---------- */
  const payload = {
    /* 核心分数 */
    value          : finalScore.toFixed(2),
    assessment     : `rating_${assessObj.text || 'poor'}`, // rating_poor / rating_good …

    /* 薪资 & 时间相关 */
    dailySalary      : dailySalaryCNY,
    workDaysPerYear  : workDaysPerYear,
    currencySymbol   : (currencySymbols[formData.country] || '¥'),

    /* 时间配置 */
    workHours        : formData.workHours,
    commuteHours     : formData.commuteHours,
    restTime         : formData.restTime,
    workDaysPerWeek  : formData.workDaysPerWeek,
    wfhDaysPerWeek   : formData.wfhDaysPerWeek,
    annualLeave      : formData.annualLeave,
    paidSickLeave    : formData.paidSickLeave,
    publicHolidays   : formData.publicHolidays,

    /* 环境因素 */
    workEnvironment  : formData.workEnvironment,
    leadership       : formData.leadership,
    teamwork         : formData.teamwork,
    cityFactor       : formData.cityFactor,
    homeTown         : formData.homeTown,

    /* 交通 / 食堂 */
    hasShuttle       : String(formData.hasShuttle),
    shuttle          : formData.shuttle,
    hasCanteen       : String(formData.hasCanteen),
    canteen          : formData.canteen,

    /* 教育 & 资历 */
    degreeType       : formData.degreeType,
    schoolType       : formData.schoolType,
    education        : formData.education,
    workYears        : formData.workYears,

    /* 职业稳定度 */
    jobStability     : formData.jobStability,

    /* 区域信息 */
    countryCode      : formData.country,
    countryName      : document.getElementById('country')
                         ?.selectedOptions[0]
                         ?.text.replace(/\s*\(.*/, '') || formData.country
  };

  /* ---------- 4. 跳转到 share.html ---------- */
  const query = new URLSearchParams(payload).toString();
  window.location.href = `/share.html?${query}`;
}



        // 下载报告
        function downloadReport() {
            if (!formData.salary) {
                alert('请先输入薪资进行计算');
                return;
            }
            
            const value = calculateFinalScore();
            const assessment = getValueAssessment(value);
            const currency = currencySymbols[formData.country] || '¥';
            
            const countryElement = document.getElementById('country');
            const countryText = countryElement ? countryElement.selectedOptions[0].text : '未知';
            
            const reportContent = `薪资值得度评估报告
===================

基本信息：
- 年薪：${currency}${formData.salary}
- 工作地区：${countryText}

工作安排：
- 年工作天数：${calculateWorkingDays()}天
- 平均日薪：${currency}${getDisplaySalary()}
- 每周工作${formData.workDaysPerWeek}天，其中居家办公${formData.wfhDaysPerWeek}天
- 每日工作${formData.workHours}小时，通勤${formData.commuteHours}小时

综合评估：
- 工作性价比分数：${value.toFixed(2)}/10 (${assessment.text})
- 教育系数：${formData.education}

生成时间：${new Date().toLocaleString('zh-CN')}`;

            // 下载报告
            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `工作性价比报告_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // 计算最终分数的辅助函数
        function calculateFinalScore() {
            const dailySalary = calculateDailySalary();
            const workHours = formData.workHours;
            const commuteHours = formData.commuteHours;
            const restTime = formData.restTime;
            const workDaysPerWeek = formData.workDaysPerWeek;
            const wfhDaysPerWeek = Math.min(formData.wfhDaysPerWeek, workDaysPerWeek);
            const officeDaysRatio = workDaysPerWeek > 0 ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek : 0;
            const shuttleFactor = formData.hasShuttle ? formData.shuttle : 1.0;
            const canteenFactor = formData.hasCanteen ? formData.canteen : 1.0;
            const effectiveCommuteHours = commuteHours * officeDaysRatio * shuttleFactor;
            const environmentFactor = formData.workEnvironment * formData.leadership * formData.teamwork * formData.cityFactor * canteenFactor;
            const homeTownFactor = formData.homeTown === 'yes' ? 1.1 : 1.0;
            
            let experienceSalaryMultiplier = 1.0;
            const workYears = parseInt(formData.workYears);
            
            if (workYears === 0) {
                if (formData.jobStability === 'government') experienceSalaryMultiplier = 0.8;
                else if (formData.jobStability === 'state') experienceSalaryMultiplier = 0.9;
                else if (formData.jobStability === 'foreign') experienceSalaryMultiplier = 0.95;
                else if (formData.jobStability === 'private') experienceSalaryMultiplier = 1.0;
                else if (formData.jobStability === 'dispatch') experienceSalaryMultiplier = 1.1;
                else if (formData.jobStability === 'freelance') experienceSalaryMultiplier = 1.1;
            } else {
                let baseSalaryMultiplier = 1.0;
                if (workYears === 1) baseSalaryMultiplier = 1.5;
                else if (workYears <= 3) baseSalaryMultiplier = 2.2;
                else if (workYears <= 5) baseSalaryMultiplier = 2.7;
                else if (workYears <= 8) baseSalaryMultiplier = 3.2;
                else if (workYears <= 10) baseSalaryMultiplier = 3.6;
                else baseSalaryMultiplier = 3.9;
                
                let salaryGrowthFactor = 1.0;
                if (formData.jobStability === 'foreign') salaryGrowthFactor = 0.8;
                else if (formData.jobStability === 'state') salaryGrowthFactor = 0.4;
                else if (formData.jobStability === 'government') salaryGrowthFactor = 0.2;
                else if (formData.jobStability === 'dispatch') salaryGrowthFactor = 1.2;
                else if (formData.jobStability === 'freelance') salaryGrowthFactor = 1.2;
                
                experienceSalaryMultiplier = 1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
            }
            
            return (dailySalary * environmentFactor * homeTownFactor) / 
                   (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * formData.education * experienceSalaryMultiplier);
        }
