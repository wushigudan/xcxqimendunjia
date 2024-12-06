const lunarUtils = {
  // 农历月份名称
  LUNAR_MONTH: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
  
  // 农历日期名称
  LUNAR_DAY: [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ],

  /**
   * 获取农历日期
   * @param {Date} date 公历日期
   * @returns {string} 农历日期字符串
   */
  getLunarDate(date) {
    // 简单处理，只返回月日
    const month = date.getMonth();
    const day = date.getDate() - 1;

    return `（${this.LUNAR_MONTH[month]}月${this.LUNAR_DAY[day]}）`;
  }
};

module.exports = lunarUtils; 