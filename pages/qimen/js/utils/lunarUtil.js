const { LUNAR_INFO, TERM_INFO } = require('../constants/lunarData');

const LunarUtil = {
  // 获取某年的农历数据
  getLunarYearInfo(year) {
    return LUNAR_INFO[year - 1900];
  },

  // 获取农历月份天数
  getLunarMonthDays(year, month, leap = false) {
    const yearInfo = this.getLunarYearInfo(year);
    if (leap) {
      // 闰月
      const leapMonth = this.getLeapMonth(year);
      if (leapMonth !== month) return 0;
      return (yearInfo & (0x10000 >> month)) ? 30 : 29;
    }
    return (yearInfo & (0x10000 >> month)) ? 30 : 29;
  },

  // 获取闰月月份，0表示没有闰月
  getLeapMonth(year) {
    return LUNAR_INFO[year - 1900] & 0xf;
  },

  // 获取某年农历总天数
  getLunarYearDays(year) {
    if (year < 1900 || year > 2100) {
      console.error('年份超出范围(1900-2100):', year);
      return 365;
    }
    
    let sum = 348;
    const yearInfo = this.getLunarYearInfo(year);
    
    // 限制循环次数
    let count = 0;
    for (let i = 0x8000; i > 0x8 && count < 12; i >>= 1, count++) {
      sum += (yearInfo & i) ? 1 : 0;
    }
    
    return sum;
  },

  // 获取某年某月的第一天距离1900年1月31日的天数
  getLunarMonthOffset(year, month) {
    let offset = 0;
    
    // 计算从1900年到目标年份的天数
    for (let y = 1900; y < year; y++) {
      offset += this.getLunarYearDays(y);
    }
    
    // 计算目标年份从正月到目标月份的天数
    for (let m = 1; m < month; m++) {
      offset += this.getLunarMonthDays(year, m);
      if (m === this.getLeapMonth(year)) {
        offset += this.getLunarMonthDays(year, m, true);
      }
    }
    
    return offset;
  },

  // 公历转农历
  solarToLunar(date) {
    try {
      const year = date.getFullYear();
      if (year < 1900 || year > 2100) {
        throw new Error('年份超出范围(1900-2100)');
      }
      
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // 计算距离1900年1月31日的天数
      const baseDate = new Date(1900, 0, 31);
      const offset = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
      
      // 限制循环次数
      let maxIterations = 200; // 设置最大迭代次数
      let iterations = 0;
      
      // 计算农历年份
      let lunarYear = 1900;
      let yearDays = this.getLunarYearDays(lunarYear);
      while (offset >= yearDays && iterations < maxIterations) {
        offset -= yearDays;
        lunarYear++;
        yearDays = this.getLunarYearDays(lunarYear);
        iterations++;
      }

      if (iterations >= maxIterations) {
        throw new Error('计算超时');
      }
      
      // 计算农历月份
      let lunarMonth = 1;
      let monthOffset = 0;
      const leapMonth = this.getLeapMonth(lunarYear);
      let isLeap = false;
      
      while (offset >= monthOffset + this.getLunarMonthDays(lunarYear, lunarMonth)) {
        monthOffset += this.getLunarMonthDays(lunarYear, lunarMonth);
        if (leapMonth === lunarMonth) {
          monthOffset += this.getLunarMonthDays(lunarYear, lunarMonth, true);
          isLeap = true;
        }
        lunarMonth++;
      }
      
      // 计算农历日期
      const lunarDay = offset - monthOffset + 1;
      
      // 获取节气
      const term = this.getSolarTerm(year, month, day);
      
      return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay,
        leap: isLeap,
        term: term
      };
    } catch (error) {
      console.error('农历转换错误:', error);
      return {
        year: 1900,
        month: 1,
        day: 1,
        leap: false,
        term: ''
      };
    }
  },

  // 获取节气
  getSolarTerm(year, month, day) {
    const baseDate = new Date(1900, 0, 6, 2, 5);
    const solar = TERM_INFO[month * 2 - 2];
    const days = Math.floor((new Date(year, month - 1, 1) - baseDate) / (24 * 60 * 60 * 1000));
    const termDay = Math.floor((days + solar) / 10000);
    
    return termDay === day ? ['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨',
                             '立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑',
                             '白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'][month * 2 - 2] : '';
  }
};

module.exports = LunarUtil; 