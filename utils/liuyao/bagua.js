// 八卦基础数据
const BAGUA_DATA = {
  // 八卦数据
  base: {
    qian: { symbol: '☰', name: '乾', nature: '金', attribute: '天' },
    dui: { symbol: '☱', name: '兑', nature: '金', attribute: '泽' },
    li: { symbol: '☲', name: '离', nature: '火', attribute: '火' },
    zhen: { symbol: '☳', name: '震', nature: '木', attribute: '雷' },
    xun: { symbol: '☴', name: '巽', nature: '木', attribute: '风' },
    kan: { symbol: '☵', name: '坎', nature: '水', attribute: '水' },
    gen: { symbol: '☶', name: '艮', nature: '土', attribute: '山' },
    kun: { symbol: '☷', name: '坤', nature: '土', attribute: '地' }
  },

  // 六十四卦数据
  sixtyFour: {
    // 例如：乾为天
    '111111': {
      name: '乾为天',
      guaCi: '元亨利贞',
      yaoCi: [
        '潜龙勿用',
        '见龙在田，利见大人',
        '君子终日乾乾，夕惕若厉，无咎',
        '或跃在渊，无咎',
        '飞龙在天，利见大人',
        '亢龙有悔'
      ]
    },
    // ... 其他卦象数据
  },

  // 五行生克关系
  wuxing: {
    relations: {
      '木': { generates: '火', restrains: '土' },
      '火': { generates: '土', restrains: '金' },
      '土': { generates: '金', restrains: '水' },
      '金': { generates: '水', restrains: '木' },
      '水': { generates: '木', restrains: '火' }
    }
  }
};

// 添加五行生克关系映射
const WUXING_RELATIONS = {
  '金': { '生我': '土', '我生': '水', '克我': '火', '我克': '木' },
  '木': { '生我': '水', '我生': '火', '克我': '金', '我克': '土' },
  '水': { '生我': '金', '我生': '木', '克我': '土', '我克': '火' },
  '火': { '生我': '木', '我生': '土', '克我': '水', '我克': '金' },
  '土': { '生我': '火', '我生': '金', '克我': '木', '我克': '水' }
};

// 添加八卦五行对应关系
const BAGUA_WUXING = {
  '乾': '金',
  '兑': '金',
  '离': '火',
  '震': '木',
  '巽': '木',
  '坎': '水',
  '艮': '土',
  '坤': '土'
};

// 工具方法
const baguaUtils = {
  /**
   * 根据爻值获取卦象
   * @param {string} yaoValues 爻值字符串(如: '111111')
   * @returns {object} 卦象信息
   */
  getGuaInfo(yaoValues) {
    return BAGUA_DATA.sixtyFour[yaoValues] || null;
  },

  /**
   * 获取上下卦
   * @param {string} yaoValues 爻值字符串
   * @returns {object} 上下卦信息
   */
  getUpperLowerGua(yaoValues) {
    const upper = yaoValues.slice(0, 3);
    const lower = yaoValues.slice(3);
    return {
      upper: this.getTrigramInfo(upper),
      lower: this.getTrigramInfo(lower)
    };
  },

  /**
   * 获取单卦信息
   * @param {string} trigram 三爻值
   * @returns {object} 卦信息
   */
  getTrigramInfo(trigram) {
    const mapping = {
      '111': 'qian',
      '110': 'dui',
      '101': 'li',
      '100': 'zhen',
      '011': 'xun',
      '010': 'kan',
      '001': 'gen',
      '000': 'kun'
    };
    const key = mapping[trigram];
    return BAGUA_DATA.base[key];
  },

  /**
   * 判断五行生克关系
   * @param {string} element1 五行1
   * @param {string} element2 五行2
   * @returns {string} 关系描述
   */
  getWuxingRelation(element1, element2) {
    if (element1 === element2) {
      return '同我';
    }
    
    // 使用五行生克关系映射
    const WUXING_RELATIONS = {
      '金': { '生我': '土', '我生': '水', '克我': '火', '我克': '木' },
      '木': { '生我': '水', '我生': '火', '克我': '金', '我克': '土' },
      '水': { '生我': '金', '我生': '木', '克我': '土', '我克': '火' },
      '火': { '生我': '木', '我生': '土', '克我': '水', '我克': '金' },
      '土': { '生我': '火', '我生': '金', '克我': '木', '我克': '水' }
    };

    // 获取当前五行的关系表
    const relations = WUXING_RELATIONS[element1];
    if (!relations) {
      console.error('无法找到五行关系:', element1);
      return '未知';
    }

    // 查找对应关系
    for (let [relation, target] of Object.entries(relations)) {
      if (target === element2) {
        return relation;
      }
    }

    return '未知';
  },

  /**
   * 找世爻位置
   * @param {string} guaString 卦象字符串（6位二进制）
   * @returns {number} 世爻位置（0-5）
   */
  findShiYao(guaString) {
    // 获取上下卦
    const upperGua = guaString.slice(0, 3);
    const lowerGua = guaString.slice(3);
    
    // 判断是否内卦动
    const isInnerMoving = this.isInnerMoving(upperGua, lowerGua);
    
    // 根据内外动静定位世爻
    if (isInnerMoving) {
      // 内卦动，世在内
      return this.findInnerShiYao(lowerGua);
    } else {
      // 外卦动，世在外
      return this.findOuterShiYao(upperGua) + 3;
    }
  },

  /**
   * 找应爻位置
   * @param {number} shiYao 世爻位置
   * @returns {number} 应爻位置（0-5）
   */
  findYingYao(shiYao) {
    // 世应对冲关系
    const OPPOSITE_YAO = {
      0: 3,  // 初爻对四爻
      1: 4,  // 二爻对五爻
      2: 5,  // 三爻对上爻
      3: 0,  // 四爻对初爻
      4: 1,  // 五爻对二爻
      5: 2   // 上爻对三爻
    };

    return OPPOSITE_YAO[shiYao];
  },

  /**
   * 判断内卦是否动
   * @param {string} upperGua 上卦
   * @param {string} lowerGua 下卦
   * @returns {boolean} 内卦是否动
   */
  isInnerMoving(upperGua, lowerGua) {
    // 计算上下卦的阴阳数
    const upperYang = (upperGua.match(/1/g) || []).length;
    const lowerYang = (lowerGua.match(/1/g) || []).length;
    
    // 阳数多的一卦为动
    return lowerYang >= upperYang;
  },

  /**
   * 找内卦世爻
   * @param {string} lowerGua 下卦
   * @returns {number} 世爻位置（0-2）
   */
  findInnerShiYao(lowerGua) {
    // 根据下卦阴阳爻确定世爻位置
    const yangCount = (lowerGua.match(/1/g) || []).length;
    switch(yangCount) {
      case 0: return 0;  // 全阴，世在初
      case 1: return 1;  // 一阳，世在二
      case 2: return 2;  // 二阳，世在三
      default: return 0; // 其他情况世在初
    }
  },

  /**
   * 找外卦世爻
   * @param {string} upperGua 上卦
   * @returns {number} 位置（0-2）
   */
  findOuterShiYao(upperGua) {
    // 根据上卦阴阳爻确定世爻位置
    const yangCount = (upperGua.match(/1/g) || []).length;
    switch(yangCount) {
      case 0: return 0;  // 全阴，世在四
      case 1: return 1;  // 一阳，世在五
      case 2: return 2;  // 二阳，世在上
      default: return 0; // 其他情况世在四
    }
  },

  /**
   * 计算六亲关系
   * @param {string} dayGan 日干
   * @param {string} yaoGan 爻干
   * @returns {string} 六亲关系
   */
  calculateLiuQin(dayGan, yaoPosition, guaCode) {
    try {
      // 1. 获取整个卦的五行属性（用上卦五行作为主卦五行）
      const upperGua = guaCode.slice(0, 3);
      const guaInfo = this.getTrigramInfo(upperGua);
      const guaWuxing = guaInfo.nature;  // 使用八卦本身的五行属性
      
      // 2. 获取爻所在卦的五行属性
      const isUpper = yaoPosition >= 3;
      const targetGua = isUpper ? upperGua : guaCode.slice(3);
      const targetInfo = this.getTrigramInfo(targetGua);
      const yaoWuxing = targetInfo.nature;
      
      // 3. 计算五行关系
      const relation = this.getWuxingRelation(guaWuxing, yaoWuxing);
      
      // 4. 转换为六亲关系
      const LIUQIN_MAP = {
        '同我': '兄弟',
        '生我': '父母',
        '我生': '子孙',
        '克我': '官鬼',
        '我克': '妻财'
      };

      return {
        liuqin: LIUQIN_MAP[relation] || '未知',
        guaWuxing,
        yaoWuxing,
        relation
      };
    } catch (error) {
      console.error('计算六亲错误:', error);
      return { liuqin: '未知' };
    }
  },

  /**
   * 获取爻的六亲信息
   * @param {string} dayGan 日干
   * @param {Array} yaoList 爻列表
   * @returns {Array} 六亲信息列表
   */
  getLiuQinInfo(dayGan, yaoList) {
    return yaoList.map((yao, index) => {
      const yaoGan = this.getYaoGan(yao.value, index);
      const liuQin = this.calculateLiuQin(dayGan, yaoGan);
      return {
        ...yao,
        liuQin,
        position: ['初', '二', '三', '四', '五', '上'][index]
      };
    });
  },

  /**
   * 获取爻的天干
   * @param {number} yaoValue 爻值（0阴1阳）
   * @param {number} position 爻位（0-5）
   * @returns {string} 爻的天干
   */
  getYaoGan(yaoValue, position) {
    // 纳甲规则
    const NAJIA = {
      0: { 0: '丙', 1: '戊', 2: '庚', 3: '壬', 4: '甲', 5: '戊' },  // 阴爻
      1: { 0: '乙', 1: '己', 2: '辛', 3: '癸', 4: '乙', 5: '己' }   // 阳爻
    };

    return NAJIA[yaoValue][position] || '甲';  // 默认返回甲
  },

  /**
   * 计算纳甲
   * @param {string} guaString 卦象字符串
   * @returns {Array} 纳甲信息
   */
  calculateNajia(guaString) {
    // 获取上下卦
    const upperGua = guaString.slice(0, 3);
    const lowerGua = guaString.slice(3);

    // 纳甲规则
    const NAJIA_RULES = {
      // 乾卦纳甲
      '111': {
        upper: ['戊', '己', '庚'],
        lower: ['壬', '癸', '甲']
      },
      // 坤卦纳甲
      '000': {
        upper: ['乙', '丙', '丁'],
        lower: ['未', '申', '酉']
      },
      // 震卦纳甲
      '001': {
        upper: ['庚', '辛', '壬'],
        lower: ['寅', '卯', '辰']
      },
      // 巽卦纳甲
      '110': {
        upper: ['辛', '壬', '癸'],
        lower: ['巳', '午', '未']
      },
      // 坎卦纳甲
      '010': {
        upper: ['戊', '己', '庚'],
        lower: ['子', '丑', '寅']
      },
      // 离卦纳甲
      '101': {
        upper: ['己', '庚', '辛'],
        lower: ['巳', '午', '未']
      },
      // 艮卦纳甲
      '100': {
        upper: ['丙', '丁', '戊'],
        lower: ['寅', '卯', '辰']
      },
      // 兑卦纳甲
      '011': {
        upper: ['丁', '戊', '己'],
        lower: ['酉', '戌', '亥']
      }
    };

    // 获取上下卦的纳甲
    const upperNajia = NAJIA_RULES[upperGua] || { upper: ['甲', '甲', '甲'] };
    const lowerNajia = NAJIA_RULES[lowerGua] || { lower: ['子', '子', '子'] };

    // 组合纳甲结果
    return {
      upperGan: upperNajia.upper,
      lowerGan: lowerNajia.lower,
      upperZhi: this.getZhiByGua(upperGua),
      lowerZhi: this.getZhiByGua(lowerGua)
    };
  },

  /**
   * 根据卦象获取地支
   * @param {string} gua 三爻卦象
   * @returns {Array} 地支数组
   */
  getZhiByGua(gua) {
    const ZHI_MAP = {
      '111': ['戌', '亥', '子'],
      '000': ['未', '申', '酉'],
      '001': ['寅', '卯', '辰'],
      '110': ['巳', '午', '未'],
      '010': ['子', '丑', '寅'],
      '101': ['巳', '午', '未'],
      '100': ['寅', '卯', '辰'],
      '011': ['酉', '戌', '亥']
    };

    return ZHI_MAP[gua] || ['子', '子', '子'];
  },

  /**
   * 获取完整的纳甲信息
   * @param {string} guaString 卦象字符串
   * @returns {Array} 完整的纳甲信息
   */
  getFullNajiaInfo(guaString) {
    const najia = this.calculateNajia(guaString);
    return [
      ...najia.upperGan.map((gan, i) => ({
        position: 5 - i,
        gan,
        zhi: najia.upperZhi[i]
      })),
      ...najia.lowerGan.map((gan, i) => ({
        position: 2 - i,
        gan,
        zhi: najia.lowerZhi[i]
      }))
    ];
  },

  getNajia(guaCode, position) {
    try {
      // 完整的纳甲规则
      const NAJIA_RULES = {
        '111': { // 乾卦
          gan: ['甲', '丙', '戊'],
          zhi: ['子', '寅', '辰']
        },
        '000': { // 坤卦
          gan: ['乙', '丁', '己'],
          zhi: ['丑', '卯', '巳']
        },
        '001': { // 震卦
          gan: ['庚', '壬', '甲'],
          zhi: ['申', '戌', '子']
        },
        '010': { // 坎卦
          gan: ['戊', '庚', '壬'],
          zhi: ['辰', '午', '申']
        },
        '011': { // 兑卦
          gan: ['丁', '己', '辛'],
          zhi: ['巳', '未', '酉']
        },
        '100': { // 艮卦
          gan: ['丙', '戊', '庚'],
          zhi: ['寅', '辰', '午']
        },
        '101': { // 离卦
          gan: ['己', '辛', '癸'],
          zhi: ['未', '酉', '亥']
        },
        '110': { // 巽卦
          gan: ['辛', '癸', '乙'],
          zhi: ['酉', '亥', '丑']
        }
      };

      // 确定是上卦还是下卦
      const isUpper = position >= 3;
      const guaPart = isUpper ? guaCode.slice(0, 3) : guaCode.slice(3);
      const localPosition = isUpper ? position - 3 : position;

      // 获取对应卦的纳甲规则
      const rule = NAJIA_RULES[guaPart];
      if (!rule) {
        throw new Error('找不到对应的纳甲规则');
      }

      return {
        gan: rule.gan[localPosition],
        zhi: rule.zhi[localPosition]
      };
    } catch (error) {
      console.error('计算纳甲错误:', error);
      return { gan: '未知', zhi: '未知' };
    }
  },

  // 获取卦的五行属性
  getGuaWuxing(guaCode) {
    const GUA_WUXING = {
      '111': '金', // 乾
      '000': '土', // 坤
      '010': '水', // 坎
      '101': '火', // 离
      '001': '木', // 震
      '110': '木', // 巽
      '100': '土', // 艮
      '011': '金'  // 兑
    };
    
    // 获取上卦
    const upperGua = guaCode.slice(0, 3);
    return GUA_WUXING[upperGua] || '未知';
  },

  // 获取爻的五行属性
  getYaoWuxing(guaCode, position) {
    const isUpper = position >= 3;
    const guaPart = isUpper ? guaCode.slice(0, 3) : guaCode.slice(3);
    return this.getGuaWuxing(guaPart);
  },

  // 根据五行关系转换为六亲
  relationToLiuqin(relation) {
    const RELATION_TO_LIUQIN = {
      '生我': '父母',
      '我生': '子孙',
      '克我': '官鬼',
      '我克': '妻财',
      '同我': '兄弟'
    };
    
    return RELATION_TO_LIUQIN[relation] || '未知';
  }
};

module.exports = {
  BAGUA_DATA,
  baguaUtils
}; 