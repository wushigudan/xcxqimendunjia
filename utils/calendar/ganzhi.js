// 天干地支基础数据
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 干支工具类
const ganzhiUtils = {
  /**
   * 计算年干支
   * @param {number} year 公历年
   * @returns {string} 干支纪年
   */
  getYearGanzhi(year) {
    const gan = (year - 4) % 10;
    const zhi = (year - 4) % 12;
    return TIAN_GAN[gan] + DI_ZHI[zhi];
  },

  /**
   * 计算月干支
   * @param {number} year 公历年
   * @param {number} month 公历月
   * @returns {string} 干支纪月
   */
  getMonthGanzhi(year, month) {
    // 计算年干的索引
    const yearGan = (year - 4) % 10;
    // 计算月干的起始偏移
    const offset = (yearGan % 5) * 2;
    
    // 计算月干支的索引
    const gan = (offset + month - 1) % 10;
    const zhi = (month + 1) % 12;
    
    return TIAN_GAN[gan] + DI_ZHI[zhi];
  },

  /**
   * 计算日干支
   * @param {Date} date 公历日期对象
   * @returns {string} 干支纪日
   */
  getDayGanzhi(date) {
    // 计算距离1900年1月1日的天数
    const base = new Date(1900, 0, 1);
    const diffDays = Math.floor((date - base) / (24 * 60 * 60 * 1000));
    
    // 计算日干支的索引
    const gan = (diffDays + 10) % 10;
    const zhi = (diffDays + 12) % 12;
    
    return TIAN_GAN[gan] + DI_ZHI[zhi];
  },

  /**
   * 计算时干支
   * @param {number} hour 小时(0-23)
   * @param {string} dayGan 日干
   * @returns {string} 干支纪时
   */
  getHourGanzhi(hour, dayGan) {
    // 计算时辰对应的地支
    const zhiIndex = Math.floor((hour + 1) / 2) % 12;
    
    // 根据日干确定时干的起始偏移
    const dayGanIndex = TIAN_GAN.indexOf(dayGan);
    const offset = (dayGanIndex % 5) * 2;
    
    // 计算时干
    const ganIndex = (offset + zhiIndex) % 10;
    
    return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
  },

  /**
   * 获取完整干支信息
   * @param {Date} datetime 日期时间对象
   * @returns {Object} 完整干支信息
   */
  getFullGanzhi(datetime) {
    // 如果计算出错，返回默认值
    try {
      const date = new Date(datetime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const hour = date.getHours();

      const yearGanzhi = this.getYearGanzhi(year);
      const monthGanzhi = this.getMonthGanzhi(year, month);
      const dayGanzhi = this.getDayGanzhi(date);
      const hourGanzhi = this.getHourGanzhi(hour, dayGanzhi[0]);

      return {
        year: yearGanzhi,
        month: monthGanzhi,
        day: dayGanzhi,
        hour: hourGanzhi,
        // 完整干支字符串
        full: `${yearGanzhi} ${monthGanzhi} ${dayGanzhi} ${hourGanzhi}`
      };
    } catch (error) {
      console.error('干支计算错误，使用默认值');
      // 返回默认干支值
      return {
        year: ['甲', '子'],
        month: ['甲', '子'],
        day: ['甲', '子'],
        hour: ['甲', '子'],
        full: '甲子 甲子 甲子 甲子'
      };
    }
  }
};

module.exports = ganzhiUtils; 