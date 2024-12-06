const BASE_DATA = require('../constants/baseData');
const SolarTerms = require('./solarTerms');

class DateUtil {
  // 创建自定义的日期对象，完全使用1-12月
  static createCustomDate(year, month, day, hour = 0, minute = 0) {
    // 验证月份范围
    if (month < 1 || month > 12) {
      throw new Error('月份必须在1-12之间');
    }
    
    // 验证日期范围
    const daysInMonth = this.getDaysInMonth(year, month);
    if (day < 1 || day > daysInMonth) {
      throw new Error(`日期必须在1-${daysInMonth}之间`);
    }

    // 验证小时范围
    if (hour < 0 || hour > 23) {
      throw new Error('小时必须在0-23之间');
    }

    // 验证分钟范围
    if (minute < 0 || minute > 59) {
      throw new Error('分钟必须在0-59之间');
    }

    return {
      year,
      month,  // 直接使用1-12月
      day,
      hour,
      minute,
      // 提供转换为JS Date对象的方法
      toJsDate() {
        return new Date(year, month - 1, day, hour, minute);
      }
    };
  }

  // 获取月份天数
  static getDaysInMonth(year, month) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 处理闰年2月
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      return 29;
    }
    return monthDays[month - 1];
  }

  // 格式化日期时间显示
  static formatDateTime(year, month, day, hour, minute = 0) {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    return `${year}年${formattedMonth}月${formattedDay}日 ${formattedHour}时${formattedMinute}分`;
  }

  // 验证日期
  static validateDate(year, month, day, hour, minute = 0) {
    try {
      this.createCustomDate(year, month, day, hour, minute);
      return true;
    } catch (error) {
      console.error('日期验证失败:', error.message);
      return false;
    }
  }

  // 干支计算相关功能
  static getFullGanzhi(date) {
    const solarTerms = new SolarTerms();
    const customDate = this.createCustomDate(
      date.getFullYear(),
      date.getMonth() + 1,  // 转换为1-12月
      date.getDate(),
      date.getHours()
    );

    // 计算年干支
    const yearGanzhi = this.getYearGanzhi(customDate.year);

    // 计算月干支
    const term = solarTerms.getCurrentTerm(customDate);
    const monthGanzhi = this.getMonthGanzhi(yearGanzhi.gan, term);

    // 计算日干支
    const dayGanzhi = this.getDayGanzhi(customDate);

    // 计算时干支
    const hourGanzhi = this.getHourGanzhi(dayGanzhi.gan, customDate.hour);

    return {
      year: yearGanzhi,
      month: monthGanzhi,
      day: dayGanzhi,
      hour: hourGanzhi
    };
  }

  static getYearGanzhi(year) {
    // 以1984年甲子年为基准
    const offset = year - 1984;
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;

    return {
      gan: BASE_DATA.TIANGAN[ganIndex],
      zhi: BASE_DATA.DIZHI[zhiIndex]
    };
  }

  static getMonthGanzhi(yearGan, term) {
    const monthZhiIndex = this.solarTerms.getMonthZhiIndex(term);
    const yearGanIndex = BASE_DATA.TIANGAN.indexOf(yearGan);
    const monthGanIndex = (yearGanIndex * 2 + monthZhiIndex) % 10;

    return {
      gan: BASE_DATA.TIANGAN[monthGanIndex],
      zhi: BASE_DATA.DIZHI[monthZhiIndex]
    };
  }

  static getDayGanzhi(customDate) {
    const baseDate = this.createCustomDate(1900, 1, 31); // 使用1月而不是0
    const days = Math.floor(
      (customDate.toJsDate() - baseDate.toJsDate()) / (24 * 60 * 60 * 1000)
    );
    
    return {
      gan: BASE_DATA.TIANGAN[(days + 6) % 10],
      zhi: BASE_DATA.DIZHI[(days + 0) % 12]
    };
  }

  static getHourGanzhi(dayGan, hour) {
    // 精确的时辰划分
    const timeTable = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    const timeZhiIndex = timeTable[hour] - 1;
    const dayGanIndex = BASE_DATA.TIANGAN.indexOf(dayGan);
    const timeGanIndex = ((dayGanIndex % 5) * 2 + timeZhiIndex) % 10;

    return {
      gan: BASE_DATA.TIANGAN[timeGanIndex],
      zhi: BASE_DATA.DIZHI[timeZhiIndex]
    };
  }
}

module.exports = DateUtil; 