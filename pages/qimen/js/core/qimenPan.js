const QimenBase = require('./qimenBase');
const BASE_DATA = require('../constants/baseData');

class QimenPan extends QimenBase {
  constructor(type = 'rotating') {
    super();
    try {
      this.validatePanType(type);
      this.type = type; // 'rotating' 或 'flying'
      this.initializePan();
    } catch (error) {
      this.handleError('盘面初始化失败', error);
    }
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

  // 验证盘面类型
  validatePanType(type) {
    if (!['rotating', 'flying'].includes(type)) {
      this.handleError(`无效的盘面类型: ${type}`);
    }
  }

  // 布局计算
  calculateLayout(params) {
    try {
      this.validateCalculation(params);
      return this.type === 'rotating' ? 
        this.calculateRotatingPlate(params) : 
        this.calculateFlyingPlate(params);
    } catch (error) {
      this.handleError('布局计算失败', error);
    }
  }

  // 转盘布局
  calculateRotatingPlate(params) {
    const { isYang, startPosition } = this.getBaseInfo(params);
    const direction = isYang ? 1 : -1;  // 阳遁顺时针(1)，阴遁逆时针(-1)

    // 九宫位置数组（不包括中宫5）
    const positions = [1, 2, 3, 4, 6, 7, 8, 9];

    // 获取天干地支序列
    const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 遍历八个宫位（跳过中宫）
    positions.forEach((pos, index) => {
      if (pos === 5) return; // 跳过中宫

      // 计算偏移量
      const offset = ((pos - startPosition) * direction + 8) % 8;
      
      this.palaces[pos - 1] = {
        position: pos,
        star: this.JIUXING[offset],
        door: this.BAMEN[offset],
        god: this.BASHEN[offset],
        gan: TIANGAN[pos % 10],  // 天干按位置分配
        zhi: DIZHI[pos % 12],    // 地支按位置分配
        isZhiFu: false,
        isZhiShi: false
      };
    });

    // 特殊处理中宫
    this.palaces[4] = {
      position: 5,
      star: '天禽',  // 中宫固定天禽星
      door: '',      // 中宫无门
      god: '',       // 中宫无神
      gan: '戊',  // 中宫天干固定为戊
      zhi: '辰',  // 中宫地支固定为辰
      isZhiFu: false,
      isZhiShi: false
    };

    return this.palaces;
  }

  // 飞盘布局
  calculateFlyingPlate(params) {
    const { isYang } = this.getBaseInfo(params);
    
    // 飞盘布局规则
    const flyingMap = {
      '阳': [8, 3, 4, 9, 2, 7, 6, 5],  // 阳遁飞布顺序
      '阴': [2, 7, 6, 5, 8, 3, 4, 9]   // 阴遁飞布顺序
    };

    const sequence = flyingMap[isYang ? '阳' : '阴'];

    // 获取天干地支序列
    const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 遍历八个宫位（跳过中宫）
    sequence.forEach((targetPos, index) => {
      if (targetPos === 5) return; // 跳过中宫

      this.palaces[targetPos - 1] = {
        position: targetPos,
        star: this.JIUXING[index],
        door: this.BAMEN[index],
        god: this.BASHEN[index],
        gan: TIANGAN[targetPos % 10],
        zhi: DIZHI[targetPos % 12],
        isZhiFu: false,
        isZhiShi: false
      };
    });

    // 特殊处理中宫
    this.palaces[4] = {
      position: 5,
      star: '天禽',  // 中宫固定天禽星
      door: '',      // 中宫无门
      god: '',       // 中宫无神
      gan: '戊',     // 中宫天干固定为戊
      zhi: '辰',     // 中宫地支固定为辰
      isZhiFu: false,
      isZhiShi: false
    };

    return this.palaces;
  }

  // 获取基础信息
  getBaseInfo(params) {
    const { month, ganzhi } = params;
    
    // 判断阴阳遁
    const isYang = BASE_DATA.YANG_MONTHS.includes(this.getMonthNumber(month));
    const type = isYang ? '阳' : '阴';
    
    // 获取局数
    const startPosition = BASE_DATA.JU_MAP[type][ganzhi.hour.zhi];

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

  // 获取结果
  getResult() {
    try {
      const result = {
        type: this.type,
        palaces: this.palaces
      };
      this.validateResult(result);
      return result;
    } catch (error) {
      this.handleError('结果获取失败', error);
    }
  }
}

module.exports = QimenPan; 