const QimenBase = require('./qimenBase');
const RotatingPan = require('./rotatingPan');
const FlyingPan = require('./flyingPan');
const GanzhiUtil = require('../utils/ganzhi');
const BASE_DATA = require('../constants/baseData');

class QimenCalc extends QimenBase {
  constructor() {
    super();
  }

  // 计算奇门遁甲
  calculate(params) {
    try {
      console.log('QimenCalc 接收参数:', params);

      // 设置日期时间
      this.datetime = new Date(params.year, params.month - 1, params.day, params.hour);
      
      // 验证参数
      this.validateCalculation(params);

      // 计算干支
      let ganzhi = this.calculateGanzhi(params);
      
      // 添加年月日时信息到干支对象
      ganzhi = {
        year: { ...ganzhi.year, year: params.year },
        month: { ...ganzhi.month, month: params.month },
        day: { ...ganzhi.day, day: params.day },
        hour: { ...ganzhi.hour, hour: params.hour }
      };
      
      console.log('干支计算结果:', ganzhi);

      // 根据类型创建对应的盘面
      const pan = params.type === 'rotating' ? 
        new RotatingPan() : 
        new FlyingPan();

      // 计算局
      const ju = this.calculateJu(ganzhi);
      console.log('局数计算结果:', ju);

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
        type: params.type
      };
    } catch (error) {
      this.handleError('奇门遁甲计算失败', error);
    }
  }

  // 计算干支
  calculateGanzhi(params) {
    const { year, month, day, hour } = params;
    
    // 计算年干支
    const yearGanzhi = GanzhiUtil.getYearGanzhi(year);
    
    // 计算月干支
    const monthGanzhi = GanzhiUtil.getMonthGanzhi(yearGanzhi.gan, month);
    
    // 计算日干支
    const dayGanzhi = GanzhiUtil.getDayGanzhi(new Date(year, month-1, day));
    
    // 计算时干支 - 需要传入日干
    const hourGanzhi = GanzhiUtil.getHourGanzhi(hour, dayGanzhi.gan);
    
    return { year: yearGanzhi, month: monthGanzhi, day: dayGanzhi, hour: hourGanzhi };
  }

  // 计算局
  calculateJu(ganzhi) {
    const month = ganzhi.month.zhi;
    const hourZhi = ganzhi.hour.zhi;

    // 判断阴阳遁
    const monthNumber = this.getMonthNumber(month);
    const isYang = BASE_DATA.YANG_MONTHS.includes(monthNumber);
    const type = isYang ? '阳' : '阴';

    // 获取局数
    const number = BASE_DATA.JU_MAP[type][hourZhi];

    if (!number) {
      this.handleError(`无法获取局数: ${type}遁 ${hourZhi}时`);
    }

    return { type, number };
  }
}

module.exports = QimenCalc; 