const BASE_DATA = require('../constants/baseData');

class QimenUtil {
  // 格式化方法
  static formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hour}时${minute}分`;
  }

  // 新增方法：获取干支组合
  static getGanZhiPair(gan, zhi) {
    return `${gan}${zhi}`;
  }

  // 新增方法：获取时辰
  static getShichen(hour) {
    const shichenMap = {
      23: '子', 0: '子', 1: '丑', 2: '丑',
      3: '寅', 4: '寅', 5: '卯', 6: '卯',
      7: '辰', 8: '辰', 9: '巳', 10: '巳',
      11: '午', 12: '午', 13: '未', 14: '未',
      15: '申', 16: '申', 17: '酉', 18: '酉',
      19: '戌', 20: '戌', 21: '亥', 22: '亥'
    };
    return shichenMap[hour] || '';
  }

  // 新增方法：获取节气名称
  static getSolarTermName(month, day) {
    // 简化的节气判断
    const terms = {
      '1': { '6': '小寒', '20': '大寒' },
      '2': { '4': '立春', '19': '雨水' },
      '3': { '6': '惊蛰', '21': '春分' },
      '4': { '5': '清明', '20': '谷雨' },
      '5': { '6': '立夏', '21': '小满' },
      '6': { '6': '芒种', '21': '夏至' },
      '7': { '7': '小暑', '23': '大暑' },
      '8': { '8': '立秋', '23': '处暑' },
      '9': { '8': '白露', '23': '秋分' },
      '10': { '8': '寒露', '24': '霜降' },
      '11': { '7': '立冬', '22': '小雪' },
      '12': { '7': '大雪', '22': '冬至' }
    };
    return terms[month]?.[day] || '';
  }

  // 新增方法：获取五行生克关系
  static getWuxingRelation(w1, w2) {
    const relations = {
      '木': { '木': '比和', '火': '生', '土': '克', '金': '被克', '水': '被生' },
      '火': { '木': '被生', '火': '比和', '土': '生', '金': '克', '水': '被克' },
      '土': { '木': '被克', '火': '被生', '土': '比和', '金': '生', '水': '克' },
      '金': { '木': '克', '火': '被克', '土': '被生', '金': '比和', '水': '生' },
      '水': { '木': '生', '火': '克', '土': '被克', '金': '被生', '水': '比和' }
    };
    return relations[w1]?.[w2] || '无关';
  }

  // 新增方法：获取宫位关系
  static getPalaceRelation(p1, p2) {
    if (p1 === p2) return '本宫';
    if (Math.abs(p1 - p2) === 1 || Math.abs(p1 - p2) === 3) return '生';
    if (Math.abs(p1 - p2) === 2 || Math.abs(p1 - p2) === 6) return '克';
    if (Math.abs(p1 - p2) === 4) return '冲';
    return '无关';
  }

  // 新增方法：判断吉凶
  static getAuspicious(element, type) {
    const auspiciousMap = {
      'bamen': {
        '开门': '吉', '休门': '吉', '生门': '吉',
        '伤门': '凶', '杜门': '凶', '景门': '凶',
        '死门': '凶', '惊门': '凶'
      },
      'jiuxing': {
        '天蓬': '吉', '天任': '吉', '天冲': '吉',
        '天辅': '吉', '天英': '吉', '天芮': '凶',
        '天柱': '凶', '天心': '凶'
      }
    };
    return auspiciousMap[type]?.[element] || '中性';
  }

  // 新增方法：获取纳音五行
  static getNayin(ganZhi) {
    const nayinMap = {
      '甲子甲午': '海中金', '乙丑乙未': '海中金',
      '丙寅丙申': '炉中火', '丁卯丁酉': '炉中火',
      '戊辰戊戌': '大林木', '己巳己亥': '大林木',
      '庚午庚子': '路旁土', '辛未辛丑': '路旁土',
      '壬申壬寅': '剑锋金', '癸酉癸卯': '剑锋金',
      '甲戌甲辰': '山头火', '乙亥乙巳': '山头火'
    };
    return nayinMap[ganZhi] || '';
  }

  // 获取元素的五行属性
  static getWuxing(element, type) {
    switch(type) {
      case 'tiangan':
        return BASE_DATA.TIANGAN_WUXING[element];
      case 'dizhi':
        return BASE_DATA.DIZHI_WUXING[element];
      case 'jiuxing':
        return BASE_DATA.JIUXING_WUXING[element];
      case 'bamen':
        return BASE_DATA.BAMEN_WUXING[element];
      case 'bashen':
        return BASE_DATA.BASHEN_WUXING[element];
      default:
        return null;
    }
  }

  // 获取元素的阴阳属性
  static getYinYang(element, type) {
    switch(type) {
      case 'tiangan':
        return BASE_DATA.TIANGAN_YINYANG[element];
      case 'dizhi':
        return BASE_DATA.DIZHI_YINYANG[element];
      case 'jiuxing':
        return BASE_DATA.JIUXING_YINYANG[element];
      case 'bamen':
        return BASE_DATA.BAMEN_YINYANG[element];
      case 'bashen':
        return BASE_DATA.BASHEN_YINYANG[element];
      default:
        return null;
    }
  }

  // 旬空判断
  static isKong(ganZhi) {
    const xunKongMap = {
      '甲子': '戌亥', '甲戌': '申酉', '甲申': '午未',
      '甲午': '辰巳', '甲辰': '寅卯', '甲寅': '子丑'
    };
    return Object.entries(xunKongMap).some(([xun, kong]) => {
      return ganZhi.startsWith(xun) && kong.includes(ganZhi.slice(-1));
    });
  }
}

module.exports = QimenUtil; 