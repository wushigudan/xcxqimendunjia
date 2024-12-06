// 十二长生计算工具类
const TwelveStages = {
  // 添加十二长生的吉凶属性
  stageProperties: {
    '长生': 'auspicious',
    '帝旺': 'auspicious',
    '冠带': 'auspicious',
    '临官': 'auspicious',
    '沐浴': 'auspicious',
    '胎': 'neutral',
    '养': 'neutral',
    '衰': 'neutral',
    '病': 'inauspicious',
    '死': 'inauspicious',
    '墓': 'inauspicious',
    '绝': 'inauspicious'
  },

  // 阳干的十二长生顺序
  yangOrder: {
    '亥': '长生',
    '子': '沐浴',
    '丑': '冠带',
    '寅': '临官',
    '卯': '帝旺',
    '辰': '衰',
    '巳': '病',
    '午': '死',
    '未': '墓',
    '申': '绝',
    '酉': '胎',
    '戌': '养'
  },

  // 阴干的十二长生顺序
  yinOrder: {
    '午': '长生',
    '巳': '沐浴',
    '辰': '冠带',
    '卯': '临官',
    '寅': '帝旺',
    '丑': '衰',
    '子': '病',
    '亥': '死',
    '戌': '墓',
    '酉': '绝',
    '申': '胎',
    '未': '养'
  },

  // 计算十二长生
  calculate(gan, zhi) {
    // 判断天干阴阳
    const isYang = '甲丙戊庚壬'.indexOf(gan) !== -1;
    // 根据阴阳选择对应顺序
    const order = isYang ? this.yangOrder : this.yinOrder;
    const stage = order[zhi] || '';
    // 返回带有吉凶属性的对象
    return {
      name: stage,
      property: this.stageProperties[stage] || 'neutral'
    };
  }
};

module.exports = TwelveStages; 