/**
 * 农历、干支历转换工具
 */
const calendar = {
  /**
   * 天干地支年
   * @param {Number} year 公历年份
   */
  toGanZhiYear(year) {
    const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return gan[year % 10] + zhi[year % 12];
  },

  /**
   * 传入公历(!)y年获得该年第n个节气的公历日期
   * @param {Number} y 公历年(1900-2100)
   * @param {Number} n 第几个节气(1~24)，从小寒算起
   * @return {Number}
   */
  getTerm(y, n) {
    // 这里可以添加节气计算代码
    return 1;  // 暂时返回1
  },

  /**
   * 传入offset偏移量返回干支
   * @param {Number} offset 相对甲子的偏移量
   */
  toGanZhi(offset) {
    const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return gan[offset % 10] + zhi[offset % 12];
  },

  /**
   * 公历转农历
   * @param {Number} year 公历年
   * @param {Number} month 公历月
   * @param {Number} day 公历日
   */
  solar2lunar(year, month, day) {
    // 这里可以添加具体的转换代码
    return {
      gzYear: this.toGanZhiYear(year),
      gzMonth: this.toGanZhi((year - 1900) * 12 + month + 11),
      gzDay: this.toGanZhi(Math.floor((new Date(year, month-1, day) - new Date(1900, 0, 31)) / (24 * 60 * 60 * 1000)))
    };
  }
};

module.exports = {
  calendar: calendar
}; 