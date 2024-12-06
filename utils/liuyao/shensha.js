// 神煞数据
const SHEN_SHA_DATA = {
  // 十二神将
  TWELVE_GODS: {
    '子': {
      '贵人': '丑未',
      '天德': '巳',
      '月德': '壬',
      '天喜': '酉',
      '天医': '亥',
      '三合': '申辰',
      '六合': '丑'
    },
    '丑': {
      '贵人': '子申',
      '天德': '申',
      '月德': '庚',
      '天喜': '申',
      '天医': '子',
      '三合': '巳酉',
      '六合': '午'
    },
    '寅': {
      '贵人': '亥酉',
      '天德': '亥',
      '月德': '甲',
      '天喜': '未',
      '天医': '丑',
      '三合': '午戌',
      '六合': '巳'
    }
  },

  // 吉神
  LUCKY_GODS: {
    '驿马': {
      '甲': '寅', '乙': '亥', '丙': '申', '丁': '巳',
      '戊': '寅', '己': '亥', '庚': '申', '辛': '巳',
      '壬': '寅', '癸': '亥'
    },
    '天德': {
      '子': '巳', '丑': '午', '寅': '未', '卯': '申',
      '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
      '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
    }
  },

  // 凶神
  UNLUCKY_GODS: {
    '白虎': {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
      '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
      '壬': '亥', '癸': '子'
    },
    '天刑': {
      '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
      '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
      '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
    },
    '五鬼': {
      '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
      '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
      '壬': '寅', '癸': '卯'
    }
  },

  // 补充完整的重要神煞数据
  IMPORTANT_GODS: {
    '天德贵人': {
      '甲': ['丁', '辛'],
      '乙': ['申', '癸'],
      '丙': ['壬', '丁'],
      '丁': ['己', '甲'],
      '戊': ['丙', '辛'],
      '己': ['戊', '癸'],
      '庚': ['丁', '壬'],
      '辛': ['己', '甲'],
      '壬': ['丙', '辛'],
      '癸': ['戊', '癸']
    },
    '月德': {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
      '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
      '壬': '亥', '癸': '子'
    },
    '天乙': {
      '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
      '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
      '庚': ['丑', '未'], '辛': ['子', '申'], '壬': ['卯', '巳'],
      '癸': ['卯', '巳']
    },
    '文昌': {
      '子': '巳', '丑': '午', '寅': '未', '卯': '申',
      '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
      '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
    },
    '金匮': {
      '甲': '未', '乙': '申', '丙': '酉', '丁': '戌',
      '戊': '亥', '己': '子', '庚': '丑', '辛': '寅',
      '壬': '卯', '癸': '辰'
    },
    '天喜': {
      '子': '酉', '丑': '申', '寅': '未', '卯': '午',
      '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
      '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    },
    '天马': {
      '寅': '午', '申': '子', '巳': '酉', '亥': '卯'
    },
    '天空': {
      '子': '未', '丑': '申', '寅': '酉', '卯': '戌',
      '辰': '亥', '巳': '子', '午': '丑', '未': '寅',
      '申': '卯', '酉': '辰', '戌': '巳', '亥': '午'
    },
    '解神': {
      '子': '午', '丑': '巳', '寅': '辰', '卯': '卯',
      '辰': '寅', '巳': '丑', '午': '子', '未': '亥',
      '申': '戌', '酉': '酉', '戌': '申', '亥': '未'
    },
    '天后': {
      '子': '酉', '丑': '申', '寅': '未', '卯': '午',
      '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
      '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    },
    '天官': {
      '子': '未', '丑': '申', '寅': '酉', '卯': '戌',
      '辰': '亥', '巳': '子', '午': '丑', '未': '寅',
      '申': '卯', '酉': '辰', '戌': '巳', '亥': '午'
    },
    '天福': {
      '子': '巳', '丑': '午', '寅': '未', '卯': '申',
      '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
      '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
    },
    '天厨': {
      '子': '巳', '丑': '午', '寅': '未', '卯': '申',
      '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
      '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
    },
    '天巫': {
      '子': '未', '丑': '午', '寅': '巳', '卯': '辰',
      '辰': '卯', '巳': '寅', '午': '丑', '未': '子',
      '申': '亥', '酉': '戌', '戌': '酉', '亥': '申'
    },
    '青龙': {
      '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
      '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
      '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
    },
    '朱雀': {
      '子': '酉', '丑': '申', '寅': '未', '卯': '午',
      '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
      '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    },
    '勾陈': {
      '子': '丑', '丑': '寅', '寅': '卯', '卯': '辰',
      '辰': '巳', '巳': '午', '午': '未', '未': '申',
      '申': '酉', '酉': '戌', '戌': '亥', '亥': '子'
    },
    '螣蛇': {
      '子': '巳', '丑': '午', '寅': '未', '卯': '申',
      '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
      '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
    },
    '太阴': {
      '子': '酉', '丑': '申', '寅': '未', '卯': '午',
      '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
      '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    },
    '太阳': {
      '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
      '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
      '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
    },
    '玄武': {
      '子': '未', '丑': '申', '寅': '酉', '卯': '戌',
      '辰': '亥', '巳': '子', '午': '丑', '未': '寅',
      '申': '卯', '酉': '辰', '戌': '巳', '亥': '午'
    },
    '六合': {
      '子': '丑', '丑': '子', '寅': '亥', '卯': '戌',
      '辰': '酉', '巳': '申', '午': '未', '未': '午',
      '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅'
    },
    '三台': {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
      '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
      '壬': '亥', '癸': '子'
    },
    '八座': {
      '甲': '申', '乙': '酉', '丙': '亥', '丁': '子',
      '戊': '亥', '己': '子', '庚': '寅', '辛': '卯',
      '壬': '巳', '癸': '午'
    },
    '恩光': {
      '甲': '午', '乙': '午', '丙': '寅', '丁': '寅',
      '戊': '寅', '己': '寅', '庚': '戌', '辛': '戌',
      '壬': '申', '癸': '申'
    },
    '天贵': {
      '甲': '丑', '乙': '子', '丙': '亥', '丁': '亥',
      '戊': '丑', '己': '子', '庚': '丑', '辛': '子',
      '壬': '卯', '癸': '卯'
    },
    '天德': {
      '春': '乙', '夏': '丙', '秋': '庚', '冬': '辛'
    },
    '月德': {
      '子': '壬', '丑': '辛', '寅': '巳', '卯': '庚',
      '辰': '丁', '巳': '丙', '午': '甲', '未': '癸',
      '申': '己', '酉': '戊', '戌': '乙', '亥': '丁'
    },
    '天医': {
      '子': '亥', '丑': '子', '寅': '丑', '卯': '寅',
      '辰': '卯', '巳': '辰', '午': '巳', '未': '午',
      '申': '未', '酉': '申', '戌': '酉', '亥': '戌'
    },
    '截路': {
      '子': '午', '丑': '巳', '寅': '辰', '卯': '卯',
      '辰': '寅', '巳': '丑', '午': '子', '未': '亥',
      '申': '戌', '酉': '酉', '戌': '申', '亥': '未'
    },
    '旬空': {
      '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
      '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
    },
    '长生': {
      '甲': '亥', '乙': '午', '丙': '寅', '丁': '酉',
      '戊': '寅', '己': '酉', '庚': '巳', '辛': '子',
      '壬': '申', '癸': '卯'
    },
    '帝旺': {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
      '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
      '壬': '亥', '癸': '子'
    },
    '墓库': {
      '甲': '未', '乙': '未', '丙': '戌', '丁': '戌',
      '戊': '戌', '己': '戌', '庚': '丑', '辛': '丑',
      '壬': '辰', '癸': '辰'
    },
    '华盖': {
      '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
      '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
      '壬': '丑', '癸': '寅'
    },
    '劫煞': {
      '子': '巳', '丑': '寅', '寅': '亥', '卯': '申',
      '辰': '巳', '巳': '寅', '午': '亥', '未': '申',
      '申': '巳', '酉': '寅', '戌': '亥', '亥': '申'
    },
    '灾煞': {
      '子': '未', '丑': '申', '寅': '酉', '卯': '戌',
      '辰': '亥', '巳': '子', '午': '丑', '未': '寅',
      '申': '卯', '酉': '辰', '戌': '巳', '亥': '午'
    },
    '天罗': {
      '寅': '午', '申': '子'
    },
    '地网': {
      '巳': '酉', '亥': '卯'
    }
  },

  // 补充特殊神煞数据
  SPECIAL_GODS: {
    '福德': {
      '甲': '乙', '乙': '甲', '丙': '己', '丁': '戊',
      '戊': '丁', '己': '丙', '庚': '辛', '辛': '庚',
      '壬': '癸', '癸': '壬'
    }
  }
};

const shenshaUtils = {
  /**
   * 计算神煞
   * @param {object} ganzhiInfo 干支信息
   * @param {Array} yaoList 爻列表
   * @returns {object} 神煞信息
   */
  calculateShensha(ganzhiInfo, yaoList) {
    try {
      // 确保有默认值
      const ganzhi = {
        year: ['甲', '子'],
        month: ['甲', '子'],
        day: ['甲', '子'],
        hour: ['甲', '子'],
        ...ganzhiInfo
      };

      // 添加空值检查
      if (!ganzhi || !ganzhi.day || !ganzhi.day[0] || !ganzhi.day[1]) {
        console.error('干支信息不完整:', ganzhi);
        return '神煞信息暂缺';
      }

      const dayGan = ganzhi.day[0];
      const dayZhi = ganzhi.day[1];

      // 计算所有神煞
      const result = {
        twelveGods: this.calculateTwelveGods(dayZhi) || {},
        luckyGods: this.calculateLuckyGods(dayGan, dayZhi) || {},
        unluckyGods: this.calculateUnluckyGods(dayGan, dayZhi) || {},
        specialGods: this.calculateSpecialGods(dayGan, dayZhi) || {},
        importantGods: this.calculateImportantGods(dayGan, dayZhi) || {}
      };

      // 检查结果是否为空
      const hasContent = Object.values(result).some(item => Object.keys(item).length > 0);
      return hasContent ? this.formatShensha(result) : '神煞信息暂缺';

    } catch (error) {
      console.error('神煞计算错误:', error);
      return '神煞信息暂缺';
    }
  },

  // 计算十二神将
  calculateTwelveGods(dayZhi) {
    return SHEN_SHA_DATA.TWELVE_GODS[dayZhi] || {};
  },

  // 计算吉神
  calculateLuckyGods(dayGan, dayZhi) {
    try {
      const result = {};
      
      // 先检查数据是否存在
      if (SHEN_SHA_DATA.LUCKY_GODS['驿马'] && 
          SHEN_SHA_DATA.LUCKY_GODS['驿马'][dayGan]) {
        result['驿马'] = SHEN_SHA_DATA.LUCKY_GODS['驿马'][dayGan];
      }
      
      if (SHEN_SHA_DATA.LUCKY_GODS['天德'] && 
          SHEN_SHA_DATA.LUCKY_GODS['天德'][dayZhi]) {
        result['天德'] = SHEN_SHA_DATA.LUCKY_GODS['天德'][dayZhi];
      }
      
      if (SHEN_SHA_DATA.LUCKY_GODS['月德'] && 
          SHEN_SHA_DATA.LUCKY_GODS['月德'][dayZhi]) {
        result['月德'] = SHEN_SHA_DATA.LUCKY_GODS['月德'][dayZhi];
      }
      
      return result;
    } catch (error) {
      console.error('吉神计算错误:', error);
      return {};
    }
  },

  // 计算凶神
  calculateUnluckyGods(dayGan, dayZhi) {
    try {
      const result = {};
      
      // 计算白虎
      if (SHEN_SHA_DATA.UNLUCKY_GODS['白虎'] && 
          SHEN_SHA_DATA.UNLUCKY_GODS['白虎'][dayGan]) {
        result['白虎'] = SHEN_SHA_DATA.UNLUCKY_GODS['白虎'][dayGan];
      }
      
      // 计算天刑
      if (SHEN_SHA_DATA.UNLUCKY_GODS['天刑'] && 
          SHEN_SHA_DATA.UNLUCKY_GODS['天刑'][dayZhi]) {
        result['天刑'] = SHEN_SHA_DATA.UNLUCKY_GODS['天刑'][dayZhi];
      }
      
      // 计算五鬼
      if (SHEN_SHA_DATA.UNLUCKY_GODS['五鬼'] && 
          SHEN_SHA_DATA.UNLUCKY_GODS['五鬼'][dayGan]) {
        result['五鬼'] = SHEN_SHA_DATA.UNLUCKY_GODS['五鬼'][dayGan];
      }
      
      return result;
    } catch (error) {
      console.error('凶神计算错误:', error);
      return {};
    }
  },

  /**
   * 格式化神煞信息
   * @param {object} shensha 神煞信息
   * @returns {string} 格式化后的神煞字符串
   */
  formatShensha(shensha) {
    try {
      const parts = [];
      
      // 格式化十二神将
      if (shensha.twelveGods) {
        Object.entries(shensha.twelveGods).forEach(([god, position]) => {
          parts.push(`${god}—${position}`);
        });
      }
      
      // 格式化吉神
      if (shensha.luckyGods) {
        Object.entries(shensha.luckyGods).forEach(([god, position]) => {
          parts.push(`${god}—${position}`);
        });
      }
      
      // 格式化凶神
      if (shensha.unluckyGods) {
        Object.entries(shensha.unluckyGods).forEach(([god, position]) => {
          parts.push(`${god}—${position}`);
        });
      }
      
      return parts.join(' ') || '神煞信息暂缺';
    } catch (error) {
      console.error('神煞格式化错误:', error);
      return '神煞信息暂缺';
    }
  },

  // 计算天乙贵人
  calculateTianyi(dayGan) {
    const TIANYI_MAP = {
      '甲': ['丑', '未'],
      '乙': ['子', '申'],
      '丙': ['亥', '酉'],
      '丁': ['亥', '酉'],
      '戊': ['丑', '未'],
      '己': ['子', '申'],
      '庚': ['丑', '未'],
      '辛': ['子', '申'],
      '壬': ['卯', '巳'],
      '癸': ['卯', '巳']
    };
    return TIANYI_MAP[dayGan] || [];
  },

  // 计算文昌
  calculateWenChang(dayZhi) {
    const WENCHANG_MAP = {
      '子': '巳', '丑': '午', '寅': '未',
      '卯': '申', '辰': '酉', '巳': '戌',
      '午': '亥', '未': '子', '申': '丑',
      '酉': '寅', '戌': '卯', '亥': '辰'
    };
    return WENCHANG_MAP[dayZhi];
  },

  // 计算金匮
  calculateJinKui(dayGan) {
    const JINKUI_MAP = {
      '甲': '未', '乙': '申', '丙': '酉',
      '丁': '戌', '戊': '亥', '己': '子',
      '庚': '丑', '辛': '寅', '壬': '卯',
      '癸': '辰'
    };
    return JINKUI_MAP[dayGan];
  },

  // 计算驿马
  calculateYiMa(dayZhi) {
    const YIMA_MAP = {
      '子': '寅', '丑': '亥', '寅': '申',
      '卯': '巳', '辰': '寅', '巳': '亥',
      '午': '申', '未': '巳', '申': '寅',
      '酉': '亥', '戌': '申', '亥': '巳'
    };
    return YIMA_MAP[dayZhi];
  },

  // 计算华盖
  calculateHuaGai(dayZhi) {
    const HUAGAI_MAP = {
      '子': '卯', '丑': '寅', '寅': '丑',
      '卯': '子', '辰': '亥', '巳': '戌',
      '午': '酉', '未': '申', '申': '未',
      '酉': '午', '戌': '巳', '亥': '辰'
    };
    return HUAGAI_MAP[dayZhi];
  },

  // 计算劫煞
  calculateJieSha(dayZhi) {
    const JIESHA_MAP = {
      '子': '巳', '丑': '寅', '寅': '亥',
      '卯': '申', '辰': '巳', '巳': '寅',
      '午': '亥', '未': '申', '申': '巳',
      '酉': '寅', '戌': '亥', '亥': '申'
    };
    return JIESHA_MAP[dayZhi];
  },

  // 计算灾煞
  calculateZaiSha(dayZhi) {
    const ZAISHA_MAP = {
      '子': '未', '丑': '申', '寅': '酉',
      '卯': '戌', '辰': '亥', '巳': '子',
      '午': '丑', '未': '寅', '申': '卯',
      '酉': '辰', '戌': '巳', '亥': '午'
    };
    return ZAISHA_MAP[dayZhi];
  },

  // 根据爻位计算特殊神煞
  calculateYaoSpecialGod(index, value) {
    const YAO_GODS = {
      0: { name: '伏神', position: '初爻' },
      1: { name: '飞神', position: '二爻' },
      2: { name: '遁神', position: '三爻' },
      3: { name: '内神', position: '四爻' },
      4: { name: '外神', position: '五爻' },
      5: { name: '仆神', position: '上爻' }
    };
    return YAO_GODS[index];
  },

  // 计算香闺神煞
  calculateXiangui(dayZhi) {
    try {
      return SHEN_SHA_DATA.XIANGUI_GODS[dayZhi] || '';
    } catch (error) {
      console.error('香闺神煞计算错误:', error);
      return '';
    }
  },

  // 计算床帏神煞
  calculateChuangwei(dayGan) {
    try {
      return SHEN_SHA_DATA.CHUANGWEI_GODS[dayGan] || '';
    } catch (error) {
      console.error('床帏神煞计算错误:', error);
      return '';
    }
  },

  // 计算胎神神煞
  calculateTaishen(dayZhi) {
    try {
      return SHEN_SHA_DATA.TAISHEN_GODS[dayZhi] || '';
    } catch (error) {
      console.error('胎神神煞计算错误:', error);
      return '';
    }
  },

  // 添加重要神煞计算方法
  calculateImportantGods(dayGan, dayZhi) {
    try {
      const result = {};
      
      // 添加空值检查
      if (!dayGan || !dayZhi) {
        console.error('日干支信息不完整:', { dayGan, dayZhi });
        return {};
      }

      // 定义需要计算的神煞列表
      const godsList = [
        '天德贵人',
        '月德',
        '天乙',
        '文昌',
        '金匮',
        '天喜',
        '天马',
        '天空',
        '解神',
        '天后',
        '天官',
        '天福',
        '天厨',
        '天巫',
        '青龙',
        '朱雀',
        '勾陈',
        '螣蛇',
        '太阴',
        '太阳',
        '玄武',
        '六合'
      ];

      // 遍历计算每个神煞
      godsList.forEach(godName => {
        // 检查神煞数据是否存在
        const godData = SHEN_SHA_DATA.IMPORTANT_GODS[godName];
        if (!godData) {
          console.log(`神煞 ${godName} 数据未定义`);
          return; // 跳过未定义的神煞
        }

        // 根据干支获取神煞值
        let value;
        if (godData[dayGan]) {
          value = godData[dayGan];
        } else if (godData[dayZhi]) {
          value = godData[dayZhi];
        }

        // 如果找到值则添加到结果中
        if (value) {
          result[godName] = Array.isArray(value) ? value.join('、') : value;
        }
      });

      return result;
    } catch (error) {
      console.error('重要神煞计算错误:', error);
      return {};
    }
  },

  // 添加特殊神煞计算方法
  calculateSpecialGods(dayGan, dayZhi) {
    try {
      const result = {};
      
      // 遍历所有特殊神煞
      Object.entries(SHEN_SHA_DATA.SPECIAL_GODS).forEach(([god, positions]) => {
        if (positions[dayZhi]) {
          result[god] = positions[dayZhi];
        }
      });
      
      return result;
    } catch (error) {
      console.error('特殊神煞计算错误:', error);
      return {};
    }
  }
};

module.exports = shenshaUtils; 