class SolarTerms {
  // 更新节气数据到2024年
  SOLAR_TERMS_BASE = {
    '小寒': 5.4055, '大寒': 20.12,
    '立春': 3.87, '雨水': 18.73,
    '惊蛰': 5.63, '春分': 20.646,
    '清明': 4.81, '谷雨': 20.1,
    '立夏': 5.52, '小满': 21.04,
    '芒种': 5.678, '夏至': 21.37,
    '小暑': 7.108, '大暑': 22.83,
    '立秋': 7.5, '处暑': 23.13,
    '白露': 7.646, '秋分': 23.042,
    '寒露': 8.318, '霜降': 23.438,
    '立冬': 7.438, '小雪': 22.36,
    '大雪': 7.18, '冬至': 21.94
  };

  // 节气月份对照表
  TERM_MONTH = {
    '小寒': 1, '大寒': 1,
    '立春': 2, '雨水': 2,
    '惊蛰': 3, '春分': 3,
    '清明': 4, '谷雨': 4,
    '立夏': 5, '小满': 5,
    '芒种': 6, '夏至': 6,
    '小暑': 7, '大暑': 7,
    '立秋': 8, '处暑': 8,
    '白露': 9, '秋分': 9,
    '寒露': 10, '霜降': 10,
    '立冬': 11, '小雪': 11,
    '大雪': 12, '冬至': 12
  };

  // 节气对应的月支索引
  TERM_ZHI_INDEX = {
    '立春': 2,  '雨水': 2,   // 寅月
    '惊蛰': 3,  '春分': 3,   // 卯月
    '清明': 4,  '谷雨': 4,   // 辰月
    '立夏': 5,  '小满': 5,   // 巳月
    '芒种': 6,  '夏至': 6,   // 午月
    '小暑': 7,  '大暑': 7,   // 未月
    '立秋': 8,  '处暑': 8,   // 申月
    '白露': 9,  '秋分': 9,   // 酉月
    '寒露': 10, '霜降': 10,  // 戌月
    '立冬': 11, '小雪': 11,  // 亥月
    '大雪': 12, '冬至': 12,  // 子月
    '小寒': 1,  '大寒': 1    // 丑月
  };

  getTerm(year, term) {
    const base = this.SOLAR_TERMS_BASE[term];
    const y = (year - 2000) / 4;
    // 添加更精确的误差修正
    const correction = this.getCorrection(year, term);
    const day = base + y * 0.2422 + correction;
    const month = this.TERM_MONTH[term];
    
    return new Date(year, month - 1, Math.floor(day));
  }

  getCurrentTerm(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 获取当月的两个节气
    const terms = Object.keys(this.TERM_MONTH).filter(
      term => this.TERM_MONTH[term] === month
    );

    // 处理节气边界情况
    for (let term of terms) {
      const termDate = this.getTerm(year, term);
      const prevTermDate = this.getPreviousTerm(year, term);
      
      if (date >= prevTermDate && date < termDate) {
        return term;
      }
    }

    // 如果在月初，可能属于上个月的后一个节气
    return this.getLastTermOfPreviousMonth(date);
  }

  // 添加辅助方法
  getCorrection(year, term) {
    // 根据年份和节气计算误差修正值
    const corrections = {
      '2024': {
        '小寒': 0.0045,
        '大寒': -0.0012,
        // ... 其他节气的修正值
      }
    };
    return corrections[year]?.[term] || 0;
  }

  getPreviousTerm(year, term) {
    const terms = Object.keys(this.TERM_MONTH);
    const index = terms.indexOf(term);
    const prevTerm = terms[(index - 1 + 24) % 24];
    const prevYear = index === 0 ? year - 1 : year;
    return this.getTerm(prevYear, prevTerm);
  }

  getLastTermOfPreviousMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const terms = Object.keys(this.TERM_MONTH).filter(
      term => this.TERM_MONTH[term] === (month === 1 ? 12 : month - 1)
    );
    return terms[1];
  }

  getMonthZhiIndex(term) {
    return this.TERM_ZHI_INDEX[term] - 1; // 转为0-based索引
  }

  getEffectiveMonth(date) {
    const term = this.getCurrentTerm(date);
    return this.TERM_MONTH[term];
  }
}

module.exports = SolarTerms; 