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

// 表单数据（原有数据保持不变）
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
    education: 1.0,
    // 新增24个维度，默认值为1.0（中性值）
    jobMarket: 1.0,          // 就业市场环境
    careerGrowth: 1.0,       // 职业发展空间
    skillGrowth: 1.0,        // 技能增长性
    salaryGrowth: 1.0,       // 薪资调整预期
    workPressure: 1.0,       // 工作压力/强度
    jobSatisfaction: 1.0,    // 工作内容满意度
    overtimeCulture: 1.0,    // 加班文化
    achievement: 1.0,        // 工作成就感
    companyFuture: 1.0,      // 公司前景/稳定性
    officePolitics: 1.0,     // 内部政治复杂度
    teamAtmosphere: 1.0,     // 团队氛围
    officeEquipment: 1.0,    // 硬件设备/办公条件
    leaveEase: 1.0,          // 请假难易程度
    reimbursement: 1.0,      // 报销便利性
    locationConvenience: 1.0, // 工作地点便利性
    locationStability: 1.0,   // 工作地点稳定性
    workAutonomy: 1.0,       // 工作自主性
    learningSupport: 1.0,    // 学习时间支持
    sideJobTolerance: 1.0,   // 副业/兼职容忍度
    learningAtmosphere: 1.0, // 职场学习氛围
    welfareComplete: 1.0,    // 福利保障完善度
    diversityFriendly: 1.0,  // 性别/年龄友好度
    resignationEase: 1.0,    // 离职难易程度
    industryProspect: 1.0    // 行业景气度
};

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 添加延迟确保DOM完全加载
    setTimeout(() => {
        // 确保年薪输入框为空
        const salaryInput = document.getElementById('salary');
        console.log('查找年薪输入框:', salaryInput);
        
        if (salaryInput) {
            salaryInput.value = '';
            formData.salary = '';
            console.log('年薪输入框已清零');
        } else {
            console.error('未找到年薪输入框元素');
        }
        
        initializeEventListeners();
        setupRadioButtons();
        setupEnhancedToggle();
        updateEducationFactor();
        updateBachelorBackground();
        
        // 初始化完成后立即计算一次
        console.log('初始化完成，执行初始计算...');
        console.log('当前formData:', formData);
        calculate();
    }, 100);
});

// 设置增强版切换功能
function setupEnhancedToggle() {
    const toggleButton = document.getElementById('toggleEnhanced');
    const enhancedContent = document.getElementById('enhancedContent');
    const enhancedSection = document.getElementById('enhancedSection');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (toggleButton && enhancedContent) {
        toggleButton.addEventListener('click', function() {
            const isExpanded = enhancedContent.style.display !== 'none';
            
            if (isExpanded) {
                enhancedContent.style.display = 'none';
                enhancedSection.classList.remove('expanded');
                toggleButton.classList.remove('active');
                toggleText.textContent = '展开选填项';
                toggleIcon.style.transform = 'rotate(0deg)';
            } else {
                enhancedContent.style.display = 'block';
                enhancedSection.classList.add('expanded');
                toggleButton.classList.add('active');
                toggleText.textContent = '收起选填项';
                toggleIcon.style.transform = 'rotate(180deg)';
            }
        });
    }
}

// 初始化所有事件监听器
function initializeEventListeners() {
    console.log('初始化事件监听器...');
    
    // 输入框事件
    const inputs = ['salary', 'workDaysPerWeek', 'wfhDaysPerWeek', 'annualLeave', 'publicHolidays', 'paidSickLeave', 'workHours', 'commuteHours', 'restTime'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // 初始化时读取当前值
            const currentValue = parseFloat(element.value) || 0;
            if (id === 'salary') {
                formData[id] = element.value; // 薪资保持字符串格式
            } else {
                formData[id] = currentValue;
            }
            
            element.addEventListener('input', function(e) {
                console.log(`输入更新: ${id} = ${e.target.value}`);
                if (id === 'salary') {
                    formData[id] = e.target.value; // 薪资保持字符串格式
                } else {
                    formData[id] = parseFloat(e.target.value) || 0;
                }
                calculate();
            });
        }
    });

    // 下拉框事件
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        // 初始化时读取当前值
        formData.country = countrySelect.value;
        
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
            // 初始化时读取当前值
            formData[id] = element.value;
            
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
        // 初始化时读取当前状态
        formData.hasShuttle = shuttleCheckbox.checked;
        const shuttleOptions = document.getElementById('shuttleOptions');
        if (shuttleOptions) {
            shuttleOptions.style.display = shuttleCheckbox.checked ? 'grid' : 'none';
        }
        
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
        // 初始化时读取当前状态
        formData.hasCanteen = canteenCheckbox.checked;
        const canteenOptions = document.getElementById('canteenOptions');
        if (canteenOptions) {
            canteenOptions.style.display = canteenCheckbox.checked ? 'grid' : 'none';
        }
        
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
     
    // 按钮事件
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', viewDetailedReport);
    }
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
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
        
        // 初始化时读取active状态并更新formData
        if (button.classList.contains('active')) {
            const group = button.dataset.group;
            const value = button.dataset.value;
            
            if (group === 'jobStability' || group === 'homeTown') {
                formData[group] = value;
            } else {
                formData[group] = parseFloat(value);
            }
            console.log(`初始化单选按钮: formData.${group} = ${formData[group]}`);
        }
        
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

// 计算增强维度系数
function calculateEnhancedFactor() {
    // 按重要程度分组计算
    
    // 高影响维度（权重较大）
    const highImpactFactors = [
        formData.careerGrowth,    // 职业发展空间
        formData.workPressure,    // 工作压力/强度  
        formData.salaryGrowth,    // 薪资调整预期
        formData.companyFuture,   // 公司前景稳定
        formData.jobMarket        // 就业市场环境
    ];
    
    // 中影响维度
    const mediumImpactFactors = [
        formData.skillGrowth,     // 技能增长性
        formData.jobSatisfaction, // 工作内容满意
        formData.overtimeCulture, // 加班文化
        formData.achievement,     // 工作成就感
        formData.leaveEase        // 请假难易程度
    ];
    
    // 低影响维度
    const lowImpactFactors = [
        formData.welfareComplete,     // 福利保障完善
        formData.locationConvenience, // 工作地点便利性
        formData.learningSupport,     // 学习时间支持
        formData.officePolitics,      // 内部政治复杂度
        formData.teamAtmosphere,      // 团队氛围
        formData.officeEquipment,     // 硬件设备/办公条件
        formData.reimbursement,       // 报销便利性
        formData.locationStability,   // 工作地点稳定性
        formData.workAutonomy,        // 工作自主性
        formData.sideJobTolerance,    // 副业/兼职容忍度
        formData.learningAtmosphere,  // 职场学习氛围
        formData.diversityFriendly,   // 性别/年龄友好度
        formData.resignationEase,     // 离职难易程度
        formData.industryProspect     // 行业景气度
    ];
    
    // 分别计算各组平均值
    const highImpactAvg = highImpactFactors.reduce((sum, factor) => sum + factor, 0) / highImpactFactors.length;
    const mediumImpactAvg = mediumImpactFactors.reduce((sum, factor) => sum + factor, 0) / mediumImpactFactors.length;
    const lowImpactAvg = lowImpactFactors.reduce((sum, factor) => sum + factor, 0) / lowImpactFactors.length;
    
    // 加权平均，高影响维度权重更大
    const enhancedFactor = (highImpactAvg * 0.5 + mediumImpactAvg * 0.3 + lowImpactAvg * 0.2);
    
    console.log(`增强维度系数计算: 高影响=${highImpactAvg.toFixed(3)}, 中影响=${mediumImpactAvg.toFixed(3)}, 低影响=${lowImpactAvg.toFixed(3)}, 综合=${enhancedFactor.toFixed(3)}`);
    
    return enhancedFactor;
}

// 主计算函数（增强版）
function calculate() {
    console.log('开始计算...');
    console.log('当前formData:', formData);
    
    // 更新基础数据显示（右侧边栏）
    const workDays = calculateWorkingDays();
    const dailySalary = getDisplaySalary();
    const currency = currencySymbols[formData.country] || '¥';
    
    // 计算增强维度系数
    const enhancedFactor = calculateEnhancedFactor();
    
    // 更新增强系数显示
    const enhancedFactorElement = document.getElementById('enhancedFactorDisplay');
    if (enhancedFactorElement) {
        const factorText = Math.abs(enhancedFactor - 1.0) < 0.01 ? '默认' : 
                          enhancedFactor > 1.05 ? '积极' : 
                          enhancedFactor < 0.95 ? '消极' : '中性';
        enhancedFactorElement.textContent = factorText;
        
        // 根据系数值设置颜色
        if (enhancedFactor > 1.05) {
            enhancedFactorElement.className = 'font-semibold text-green-700';
        } else if (enhancedFactor < 0.95) {
            enhancedFactorElement.className = 'font-semibold text-red-600';
        } else {
            enhancedFactorElement.className = 'font-semibold text-gray-600';
        }
    }
    
    const workDaysElement = document.getElementById('workDaysDisplay');
    const dailySalaryElement = document.getElementById('dailySalaryDisplay');
    
    if (workDaysElement) workDaysElement.textContent = `${Math.round(workDays)}天`;
    if (dailySalaryElement) dailySalaryElement.textContent = `${currency}${dailySalary}`;

    // 如果没有薪资输入，显示空状态
    if (!formData.salary) {
        showEmptyState();
        return;
    }

    const dailySalaryCNY = calculateDailySalary();
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
    
    // 基础环境因素（保持原有计算方式）
    const baseEnvironmentFactor = formData.workEnvironment * 
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
    
    // 最终计算（增强版算法）
    // 在原有算法基础上乘以增强维度系数
    const value = (dailySalaryCNY * baseEnvironmentFactor * enhancedFactor * homeTownFactor) / 
                 (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * formData.education * experienceSalaryMultiplier);
    
    console.log(`计算结果: ${value.toFixed(2)}`);
    console.log(`基础环境系数: ${baseEnvironmentFactor.toFixed(3)}, 增强维度系数: ${enhancedFactor.toFixed(3)}`);
    updateDisplay(value);
}

// 显示空状态
function showEmptyState() {
    // 更新底部结果区域为空状态
    const workDaysResult = document.getElementById('workDaysResult');
    const dailySalaryResult = document.getElementById('dailySalaryResult');
    const finalScoreElement = document.getElementById('finalScoreDisplay');
    
    if (workDaysResult) workDaysResult.textContent = '--天';
    if (dailySalaryResult) dailySalaryResult.textContent = '--';
    if (finalScoreElement) finalScoreElement.textContent = '--';
    
    // 更新分数显示为空状态
    const scoreDisplayElement = document.getElementById('scoreDisplay');
    const scoreLevelElement = document.getElementById('scoreLevel');
    
    if (scoreDisplayElement) {
        scoreDisplayElement.textContent = '--';
        scoreDisplayElement.className = 'score-number text-gray-400';
    }
    if (scoreLevelElement) {
        scoreLevelElement.textContent = '等待计算';
        scoreLevelElement.className = 'score-text text-gray-500';
    }
}

// 更新显示
function updateDisplay(value) {
    const workDays = calculateWorkingDays();
    const dailySalary = getDisplaySalary();
    const currency = currencySymbols[formData.country] || '¥';
    
    // 更新底部结果区域的数据显示
    const workDaysResult = document.getElementById('workDaysResult');
    const dailySalaryResult = document.getElementById('dailySalaryResult');
    const finalScoreElement = document.getElementById('finalScoreDisplay');
    
    if (workDaysResult) workDaysResult.textContent = `${Math.round(workDays)}天`;
    if (dailySalaryResult) dailySalaryResult.textContent = `${currency}${Math.round(parseFloat(dailySalary))}`;
    if (finalScoreElement) finalScoreElement.textContent = value.toFixed(2);
    
    // 更新分数和评级
    const assessment = getValueAssessment(value);
    const scoreDisplayElement = document.getElementById('scoreDisplay');
    const scoreLevelElement = document.getElementById('scoreLevel');
    
    if (scoreDisplayElement) {
        scoreDisplayElement.textContent = value.toFixed(2);
        scoreDisplayElement.className = `score-number ${assessment.color}`;
    }
    if (scoreLevelElement) {
        scoreLevelElement.textContent = assessment.text;
        scoreLevelElement.className = `score-text ${assessment.color}`;
    }
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
function viewDetailedReport() {
    if (!formData.salary) {
        alert('请先输入薪资进行计算');
        return;
    }

    const finalScore = calculateFinalScore();
    const assessObj = getValueAssessment(finalScore);
    const dailySalaryCNY = getDisplaySalary();
    const workDaysPerYear = calculateWorkingDays();

    const payload = {
        value: finalScore.toFixed(2),
        assessment: `rating_${assessObj.text.replace('糟糕透了', 'terrible').replace('较差', 'poor').replace('一般', 'average').replace('良好', 'good').replace('很好', 'great').replace('优秀', 'excellent').replace('完美', 'perfect')}`,
        dailySalary: dailySalaryCNY,
        workDaysPerYear: workDaysPerYear,
        currencySymbol: (currencySymbols[formData.country] || '¥'),
        workHours: formData.workHours,
        commuteHours: formData.commuteHours,
        restTime: formData.restTime,
        workDaysPerWeek: formData.workDaysPerWeek,
        wfhDaysPerWeek: formData.wfhDaysPerWeek,
        annualLeave: formData.annualLeave,
        paidSickLeave: formData.paidSickLeave,
        publicHolidays: formData.publicHolidays,
        workEnvironment: formData.workEnvironment,
        leadership: formData.leadership,
        teamwork: formData.teamwork,
        cityFactor: formData.cityFactor,
        homeTown: formData.homeTown,
        hasShuttle: String(formData.hasShuttle),
        shuttle: formData.shuttle,
        hasCanteen: String(formData.hasCanteen),
        canteen: formData.canteen,
        degreeType: formData.degreeType,
        schoolType: formData.schoolType,
        education: formData.education,
        workYears: formData.workYears,
        jobStability: formData.jobStability,
        countryCode: formData.country,
        countryName: document.getElementById('country')?.selectedOptions[0]?.text.replace(/\s*\(.*/, '') || formData.country,
        // 新增增强版维度数据
        enhancedFactor: calculateEnhancedFactor().toFixed(3),
        jobMarket: formData.jobMarket,
        careerGrowth: formData.careerGrowth,
        skillGrowth: formData.skillGrowth,
        salaryGrowth: formData.salaryGrowth,
        workPressure: formData.workPressure,
        jobSatisfaction: formData.jobSatisfaction,
        overtimeCulture: formData.overtimeCulture,
        achievement: formData.achievement,
        companyFuture: formData.companyFuture,
        officePolitics: formData.officePolitics,
        teamAtmosphere: formData.teamAtmosphere,
        officeEquipment: formData.officeEquipment,
        leaveEase: formData.leaveEase,
        reimbursement: formData.reimbursement,
        locationConvenience: formData.locationConvenience,
        locationStability: formData.locationStability,
        workAutonomy: formData.workAutonomy,
        learningSupport: formData.learningSupport,
        sideJobTolerance: formData.sideJobTolerance,
        learningAtmosphere: formData.learningAtmosphere,
        welfareComplete: formData.welfareComplete,
        diversityFriendly: formData.diversityFriendly,
        resignationEase: formData.resignationEase,
        industryProspect: formData.industryProspect
    };

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
    
    const enhancedFactor = calculateEnhancedFactor();
    
    const reportContent = `薪资值得度评估报告（增强版）
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
- 基础教育系数：${formData.education}
- 增强维度系数：${enhancedFactor.toFixed(3)}

增强维度详情：
- 就业市场环境：${formData.jobMarket}
- 职业发展空间：${formData.careerGrowth}
- 技能增长性：${formData.skillGrowth}
- 薪资调整预期：${formData.salaryGrowth}
- 工作压力强度：${formData.workPressure}
- 工作内容满意：${formData.jobSatisfaction}
- 公司前景稳定：${formData.companyFuture}

生成时间：${new Date().toLocaleString('zh-CN')}`;

    // 下载报告
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `工作性价比报告增强版_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 计算最终分数的辅助函数（增强版）
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
    
    // 基础环境系数
    const baseEnvironmentFactor = formData.workEnvironment * formData.leadership * formData.teamwork * formData.cityFactor * canteenFactor;
    
    // 增强维度系数
    const enhancedFactor = calculateEnhancedFactor();
    
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
    
    // 增强版最终计算公式
    return (dailySalary * baseEnvironmentFactor * enhancedFactor * homeTownFactor) / 
           (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * formData.education * experienceSalaryMultiplier);
}
