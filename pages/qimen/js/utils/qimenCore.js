// 这个文件的功能将被整合到 core 文件夹中
// 1. 基础功能整合到 qimenBase.js
// 2. 盘面功能整合到 qimenPan.js
// 3. 计算功能整合到新的 qimenCalc.js

// 创建新的计算类文件
class QimenCalc extends QimenBase {
  constructor() {
    super();
  }

  // 计算奇门遁甲
  calculate(params) {
    try {
      // 验证参数
      this.validateCalculation(params);

      // 创建盘面
      const pan = new QimenPan(params.type || 'rotating');

      // 计算干支
      const ganzhi = this.calculateGanzhi(params);

      // 计算局
      const ju = this.calculateJu(ganzhi);

      // 计算布局
      const layout = pan.calculateLayout({
        ...params,
        ganzhi,
        ju
      });

      // 设置值符值使
      pan.setZhiFuZhiShi(ju.number);

      // 返回结果
      return {
        ganzhi,
        ju,
        palaces: layout,
        type: params.type || 'rotating'
      };
    } catch (error) {
      this.handleError('奇门遁甲计算失败', error);
    }
  }

  // 计算干支
  calculateGanzhi(params) {
    const { year, month, day, hour } = params;
    return {
      year: this.getYearGanzhi(year),
      month: this.getMonthGanzhi(month),
      day: this.getDayGanzhi(day),
      hour: this.getHourGanzhi(hour)
    };
  }

  // 计算局
  calculateJu(ganzhi) {
    const month = ganzhi.month.zhi;
    const hourZhi = ganzhi.hour.zhi;

    // 判断阴阳遁
    const isYang = BASE_DATA.YANG_MONTHS.includes(this.getMonthNumber(month));
    const type = isYang ? '阳' : '阴';

    // 获取局数
    const number = BASE_DATA.JU_MAP[type][hourZhi];

    return { type, number };
  }

  // 辅助方法：获取月份数字
  getMonthNumber(monthZhi) {
    const monthMap = {
      '寅': 1, '卯': 2, '辰': 3,
      '巳': 4, '午': 5, '未': 6,
      '申': 7, '酉': 8, '戌': 9,
      '亥': 10, '子': 11, '丑': 12
    };
    return monthMap[monthZhi];
  }
}

// 导出新的计算类
module.exports = QimenCalc; 