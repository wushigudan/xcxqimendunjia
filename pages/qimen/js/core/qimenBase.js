const BASE_DATA = require('../constants/baseData');

class QimenBase {
  constructor() {
    try {
      this.initializeData();
      this.initializePan();
    } catch (error) {
      this.handleError('初始化失败', error);
    }
  }

  initializeData() {
    if (!BASE_DATA) {
      throw new Error('基础数据加载失败');
    }

    this.TIANGAN = BASE_DATA.TIANGAN;
    this.DIZHI = BASE_DATA.DIZHI;
    this.JIUXING = BASE_DATA.JIUXING;
    this.BAMEN = BASE_DATA.BAMEN;
    this.BASHEN = BASE_DATA.BASHEN;
  }

  initializePan() {
    this.palaces = Array(9).fill().map(() => ({
      position: 0,
      star: '',
      door: '',
      god: '',
      gan: '',
      zhi: '',
      isZhiFu: false,
      isZhiShi: false
    }));
  }

  // 添加错误处理方法
  handleError(message, error) {
    console.error(`奇门遁甲错误: ${message}`, error);
    const errorInfo = {
      code: 'QIMEN_ERROR',
      message: message,
      details: error?.message || '未知错误',
      timestamp: new Date().toISOString()
    };

    // 记录错误日志
    this.logError(errorInfo);

    // 抛出统一格式的错误
    throw new QimenError(errorInfo);
  }

  // 错误日志记录
  logError(errorInfo) {
    console.error('奇门遁甲错误日志:', {
      ...errorInfo,
      stack: new Error().stack
    });
  }

  // 数据验证方法
  validateData(data, type) {
    if (!data) {
      this.handleError(`${type}数据无效`);
    }

    switch (type) {
      case 'tiangan':
        if (!this.TIANGAN.includes(data)) {
          this.handleError(`无效的天干: ${data}`);
        }
        break;
      case 'dizhi':
        if (!this.DIZHI.includes(data)) {
          this.handleError(`无效的地支: ${data}`);
        }
        break;
      case 'jiuxing':
        if (!this.JIUXING.includes(data)) {
          this.handleError(`无效的九星: ${data}`);
        }
        break;
      case 'bamen':
        if (!this.BAMEN.includes(data)) {
          this.handleError(`无效的八门: ${data}`);
        }
        break;
      case 'bashen':
        if (!this.BASHEN.includes(data)) {
          this.handleError(`无效的八神: ${data}`);
        }
        break;
      default:
        this.handleError(`未知的数据类型: ${type}`);
    }
  }

  // 添加计算验证方法
  validateCalculation(params) {
    const required = ['year', 'month', 'day', 'hour'];
    for (const field of required) {
      if (params[field] === undefined) {
        this.handleError(`缺少必要参数: ${field}`);
      }
    }

    // 验证日期范围
    const date = new Date(params.year, params.month - 1, params.day, params.hour);
    if (isNaN(date.getTime())) {
      this.handleError('无效的日期时间');
    }

    // 验证时辰范围
    if (params.hour < 0 || params.hour > 23) {
      this.handleError('无效的时辰');
    }
  }

  // 添加结果验证方法
  validateResult(result) {
    if (!result || typeof result !== 'object') {
      this.handleError('计算结果无效');
    }

    const required = ['ganzhi', 'ju', 'palaces'];
    for (const field of required) {
      if (!result[field]) {
        this.handleError(`计算结果缺少必要字段: ${field}`);
      }
    }
  }

  // 添加干支计算方法
  getYearGanzhi(year) {
    // 以1984年甲子年为基准
    const offset = year - 1984;
    return {
      gan: this.TIANGAN[offset % 10],
      zhi: this.DIZHI[offset % 12]
    };
  }

  getMonthGanzhi(month) {
    const yearGan = this.ganzhi?.year?.gan;
    if (!yearGan) {
      this.handleError('计算月干支需要先计算年干');
    }

    // 1. 确定月干起始位置
    const monthGanStart = {
      '甲': 2, '己': 2,  // 丙寅
      '乙': 4, '庚': 4,  // 戊寅
      '丙': 6, '辛': 6,  // 庚寅
      '丁': 8, '壬': 8,  // 壬寅
      '戊': 0, '癸': 0   // 甲寅
    }[yearGan];

    // 2. 计算月干（每月递增一位）
    const monthGanIndex = (monthGanStart + (month - 1)) % 10;

    // 3. 月支固定从寅开始
    const monthZhiIndex = (month + 1) % 12;  // +1是因为寅月是正月

    return {
      gan: this.TIANGAN[monthGanIndex],
      zhi: this.DIZHI[monthZhiIndex]
    };
  }

  getDayGanzhi(day) {
    // 使用1900年1月31日作为基准日
    const baseDate = new Date(1900, 0, 31);
    const days = Math.floor((day - baseDate) / (24 * 60 * 60 * 1000));
    return {
      gan: this.TIANGAN[(days + 6) % 10],
      zhi: this.DIZHI[(days + 0) % 12]
    };
  }

  getHourGanzhi(hour) {
    // 精确的时辰划分
    const timeTable = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    const timeZhiIndex = timeTable[hour] - 1;
    return {
      gan: this.TIANGAN[timeZhiIndex % 10],
      zhi: this.DIZHI[timeZhiIndex]
    };
  }

  getMonthNumber(month) {
    if (typeof month === 'string') {
      const monthNum = BASE_DATA.MONTH_MAP[month];
      if (!monthNum) {
        this.handleError(`无效的月份: ${month}`);
      }
      return monthNum;
    }
    return month;
  }

  // 获取基础信息
  getBaseInfo(params) {
+   console.log('QimenBase getBaseInfo 接收参数:', params);
    const { month, ganzhi } = params;
+   console.log('解构的值:', { month, ganzhi });
    
    // 判断阴阳遁
    const isYang = BASE_DATA.YANG_MONTHS.includes(this.getMonthNumber(month));
    const type = isYang ? '阳' : '阴';
+   console.log('阴阳遁判断:', { isYang, type, month });
    
    // 获取局数
    const startPosition = BASE_DATA.JU_MAP[type][ganzhi.hour.zhi];
+   console.log('局数映射:', { startPosition, type, hourZhi: ganzhi.hour.zhi });

    return { isYang, startPosition };
  }

  // 设置值符值使
  setZhiFuZhiShi(position) {
    try {
      if (position < 1 || position > 9) {
        this.handleError('无效的值符值使位置');
      }

      const palace = this.palaces[position - 1];
      if (!palace) {
        this.handleError('宫位不存在');
      }

      palace.isZhiFu = true;
      palace.isZhiShi = true;
    } catch (error) {
      this.handleError('值符值使设置失败', error);
    }
  }
}

// 自定义错误类
class QimenError extends Error {
  constructor(errorInfo) {
    super(errorInfo.message);
    this.name = 'QimenError';
    this.code = errorInfo.code;
    this.details = errorInfo.details;
    this.timestamp = errorInfo.timestamp;
  }
}

module.exports = QimenBase; 