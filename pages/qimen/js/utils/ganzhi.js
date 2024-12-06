const calendar = require('../constants/calendar').calendar;  // 引入 calendar.js

// 基础数据
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

class GanzhiUtil {
  // 干支转换为显示文本
  static formatGanzhi(ganzhi) {
    if (!ganzhi) return { 
      riGan: '日干：', 
      riZhi: '日支：',
      shiGan: '时干：',
      shiZhi: '时支：'
    };
    
    return {
      riGan: `日干：${ganzhi.day.gan}`,
      riZhi: `日支：${ganzhi.day.zhi}`,
      shiGan: `时干：${ganzhi.hour.gan}`,
      shiZhi: `时支：${ganzhi.hour.zhi}`
    };
  }

  // 获取年干支
  static getYearGanzhi(year) {
    // 以1984年甲子年为基准
    const offset = year - 1984;
    const ganIndex = (offset % 10 + 10) % 10; // 确保为正数
    const zhiIndex = (offset % 12 + 12) % 12; // 确保为正数
    
    return {
        gan: TIANGAN[ganIndex],
        zhi: DIZHI[zhiIndex]
    };
  }

  // 获取月干支
  static getMonthGanzhi(yearGan, month) {
    // 使用 calendar 的月干支计算
    const gzMonth = calendar.toGanZhi((2024 - 1900) * 12 + month + 11);
    return {
      gan: gzMonth[0],
      zhi: gzMonth[1]
    };
  }

  // 获取日干支
  static getDayGanzhi(date) {
    // 以1900年1月31日为甲辰日为基准
    const baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
    
    // 确保偏移量为正数
    offset = (offset + 40000000) % 60;
    
    // 计算干支索引
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;
    
    return {
        gan: TIANGAN[ganIndex],
        zhi: DIZHI[zhiIndex]
    };
  }

  // 添加获取时辰地支的方法
  static getHourZhi(hour) {
    // 时辰对应表
    if (hour === 23 || hour === 0) return '子';
    if (hour === 1 || hour === 2) return '丑';
    if (hour === 3 || hour === 4) return '寅';
    if (hour === 5 || hour === 6) return '卯';
    if (hour === 7 || hour === 8) return '辰';
    if (hour === 9 || hour === 10) return '巳';
    if (hour === 11 || hour === 12) return '午';
    if (hour === 13 || hour === 14) return '未';
    if (hour === 15 || hour === 16) return '申';
    if (hour === 17 || hour === 18) return '酉';
    if (hour === 19 || hour === 20) return '戌';
    if (hour === 21 || hour === 22) return '亥';
    return '子'; // 默认返回子时
  }

  // 获取时干支
  static getHourGanzhi(hour, dayGan) {
    // 计算时支索引
    let zhiIndex;
    if (hour === 0) {
      zhiIndex = -1;  // 晨子时
    } else if (hour === 23) {
      zhiIndex = 11;  // 夜子时
    } else if (hour % 2 === 0) {
      zhiIndex = hour / 2 - 1;  // 偶数小时
    } else {
      zhiIndex = Math.floor((hour + 1) / 2) - 1;  // 奇数小时
    }

    // 获取时支
    let zhi;
    if (zhiIndex === -1 || zhiIndex === 11) {
      zhi = '子';  // 子时
    } else {
      // 地支顺序：子丑寅卯辰巳午未申酉戌亥
      const zhiList = ['丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      zhi = zhiList[zhiIndex];
    }

    // 计算日干索引
    const dayGanIndex = TIANGAN.indexOf(dayGan);

    // 计算时干索引：日干数×2 + 时支数，再取余10
    let timeGanIndex = (dayGanIndex * 2 + zhiIndex) % 10;
    if (timeGanIndex < 0) {
      timeGanIndex += 10;  // 处理负数情况
    }

    return {
      gan: TIANGAN[timeGanIndex],
      zhi: zhi
    };
  }
}

module.exports = GanzhiUtil; 