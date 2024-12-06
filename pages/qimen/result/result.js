const DateUtil = require('../js/utils/dateUtil');
const TwelveStages = require('../js/utils/twelveStages');

Page({
  data: {
    ganzhi: null,
    ju: null,
    palaces: null,
    type: null,
    panType: null,  // 新增盘式类型
    methodType: null,  // 新增起课方法
    ganzhiInfo: [],
    palaceInfo: [],
    juInfo: {
      type: '',
      xun: ''
    },
    kongWang: {
      day: { kong: '', ma: '' },
      hour: { kong: '', ma: '' }
    },
    dateTimeStr: '' // 添加日期时间字符串
  },

  onLoad(options) {
    console.log('result onLoad');
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    // 获取上一页的数据
    const result = prevPage.data.result;
    console.log('完整的结果数据:', result);
    console.log('干支数据:', result?.ganzhi);
    console.log('盘面类型:', result?.type);
    console.log('盘式:', result?.panType);
    console.log('推演方式:', result?.methodType);

    console.log('盘面类型检查:', {
      type: result?.type,
      isRotating: result?.type === 'rotating'
    });

    console.log('干支计算��细结果:', {
      year: `${result.ganzhi.year.gan}${result.ganzhi.year.zhi}`,
      month: `${result.ganzhi.month.gan}${result.ganzhi.month.zhi}`,
      day: `${result.ganzhi.day.gan}${result.ganzhi.day.zhi}`,
      hour: `${result.ganzhi.hour.gan}${result.ganzhi.hour.zhi}`
    });

    if (result) {
      // 添加数据验证
      if (!result.selectedTime) {
        console.error('缺少时间数据');
        this.setData({
          dateTimeStr: '时间数据不完整'
        });
        return;
      }

      // 格式化日期时间字符串
      const dateTimeStr = DateUtil.formatDateTime(
        result.selectedTime.year,
        result.selectedTime.month,
        result.selectedTime.day,
        result.selectedTime.hour
      );

      // 2. 处理干支等计算数据
      if (result.ganzhi) {
        // 格式化干支信息为数组
        const ganzhiInfo = [
          { 
            gan: result.ganzhi.year.gan, 
            zhi: result.ganzhi.year.zhi,
            year: result.ganzhi.year.year 
          },
          { 
            gan: result.ganzhi.month.gan, 
            zhi: result.ganzhi.month.zhi,
            month: result.ganzhi.month.month 
          },
          { 
            gan: result.ganzhi.day.gan, 
            zhi: result.ganzhi.day.zhi,
            day: result.ganzhi.day.day 
          },
          { 
            gan: result.ganzhi.hour.gan, 
            zhi: result.ganzhi.hour.zhi,
            hour: result.ganzhi.hour.hour 
          }
        ];

        // 计算空亡和马星
        const kongWang = this.calculateKongWangMa(result.ganzhi);

        // 格式化宫位信息
        const palaceInfo = result.palaces.map(palace => {
          // 宫位名称映射 - 按照图片实际布局
          const palaceNameMap = {
            1: '巽木宫',  // 左上
            2: '离火宫',  // 左中
            3: '坤土宫',  // 左右
            4: '震木宫',  // 中左
            5: '中宫',  // 中中
            6: '兑金宫',  // 中右
            7: '艮土宫',  // 左底
            8: '坎水宫',  // 中底
            9: '乾金宫'   // 右底
          };

          // 八神类名映射
          const godClassMap = {
            '值符': 'god-zhifu',
            '腾蛇': 'god-tengshe',
            '太阴': 'god-taiyin',
            '六合': 'god-liuhe',
            '白虎': 'god-baihu',
            '玄武': 'god-xuanwu',
            '九地': 'god-jiudi',
            '九天': 'god-jiutian'
          };

          // 八门类名映射
          const doorClassMap = {
            '休门': 'door-xiu',
            '生门': 'door-sheng',
            '���门': 'door-shang',
            '杜门': 'door-du',
            '景门': 'door-jing',
            '死门': 'door-si',
            '惊门': 'door-jing',
            '开门': 'door-kai'
          };

          // 九星类映射
          const starClassMap = {
            '天蓬': 'star-tianpeng',
            '天任': 'star-tianren',
            '天冲': 'star-tianchong',
            '天辅': 'star-tianfu',
            '天英': 'star-tianying',
            '天芮': 'star-tianrui',
            '天柱': 'star-tianzhu',
            '天心': 'star-tianxin'
          };

          // 计算天盘地盘
          const diPanOrder = this.calculateDiPan(result.ju);
          const tianPanOrder = this.calculateTianPan(result.ganzhi.hour.gan, diPanOrder);

          return {
            position: palace.position,
            palaceName: palaceNameMap[palace.position],
            star: result.type === 'rotating' ? 
              (palace.star === '天禽' ? 
                (palace.position === 5 ? '' : '禽芮') : 
                palace.star
              ) : 
              palace.star,
            starClass: starClassMap[palace.star] || '',
            door: palace.door,
            doorClass: doorClassMap[palace.door] || '',
            god: palace.god,
            godClass: godClassMap[palace.god] || '',
            gan: palace.gan,
            zhi: palace.zhi,
            isZhiFu: palace.isZhiFu,
            isZhiShi: palace.isZhiShi,
            isKong: this.isKongWang(palace.zhi, kongWang),
            isMa: this.isMaStar(palace.zhi, kongWang),
            liuyi: palace.position === 5 && result.type === 'rotating' ? {
              values: ['戊', '己'],
              current: this.calculateLiuYi(result.ju)
            } : null,
            showFullContent: result.type === 'flying' && palace.position === 5,
            tianPan: tianPanOrder[palace.position - 1],  // 天盘天干
            diPan: diPanOrder[palace.position - 1],      // 地盘天干
            twelveStage: TwelveStages.calculate(palace.gan, palace.zhi)
          };
        });

        console.log('处理后的宫位信息:', palaceInfo);

        // 置所有数据
        this.setData({
          dateTimeStr,  // 顶部时间显示
          ganzhi: result.ganzhi,
          type: result.type,
          panType: result.panType,
          methodType: result.methodType,
          ganzhiInfo: ganzhiInfo,
          palaceInfo: palaceInfo,
          ju: result.ju,
          palaces: result.palaces,
          juInfo: {
            type: result.ju.type,
            xun: `${result.ju.number}局`
          },
          kongWang: kongWang
        });
      }
    }
  },

  // 计算空亡和马星
  calculateKongWangMa(ganzhi) {
    const DIZHI = ['子', '丑', '寅', '卯', '辰', '', '午', '未', '申', '酉', '戌', '亥'];
    
    // 添加日志输出
    console.log('干支信息:', {
      dayGan: ganzhi.day.gan,
      dayZhi: ganzhi.day.zhi,
      hourGan: ganzhi.hour.gan,
      hourZhi: ganzhi.hour.zhi
    });

    // 计算日马
    const dayMa = this.calculateMaStar(ganzhi.day.zhi);
    console.log('日马计算:', {
      dayZhi: ganzhi.day.zhi,
      dayMa: dayMa,
      maMap: this.calculateMaStar.toString()
    });

    // 计算空亡
    // 日空：根据日干支计算
    const dayGanIndex = '甲乙丙丁戊己庚辛壬癸'.indexOf(ganzhi.day.gan);
    const dayZhiIndex = DIZHI.indexOf(ganzhi.day.zhi);
    const dayKongStart = (dayGanIndex * 2 + 2) % 12;
    const dayKong = `${DIZHI[dayKongStart]}${DIZHI[(dayKongStart + 1) % 12]}`;
    
    // 时空：根据时干支计算
    const hourGanIndex = '甲乙丙丁戊己庚辛壬癸'.indexOf(ganzhi.hour.gan);
    const hourZhiIndex = DIZHI.indexOf(ganzhi.hour.zhi);
    const hourKongStart = (hourGanIndex * 2 + 2) % 12;
    const hourKong = `${DIZHI[hourKongStart]}${DIZHI[(hourKongStart + 1) % 12]}`;
    
    // 计算马星
    const hourMa = this.calculateMaStar(ganzhi.hour.zhi); // 时马：根据时支查表
    
    return {
      day: { kong: dayKong, ma: dayMa },
      hour: { kong: hourKong, ma: hourMa }
    };
  },

  // 马星对照表
  calculateMaStar(zhi) {
    if (!zhi) {
      console.error('地支为空:', zhi);
      return '';
    }

    const maMap = {
      '子': '午', '午': '子',  // 子午相对
      '丑': '未', '未': '丑',  // 丑未相对
      '寅': '申', '申': '寅',  // 寅申相对
      '卯': '酉', '酉': '卯',  // 卯酉相对
      '辰': '戌', '戌': '辰',  // 辰戌相对
      '巳': '亥', '亥': '巳'   // 巳亥相对
    };

    const result = maMap[zhi];
    if (!result) {
      console.error('未找到对应的马星:', zhi);
    }
    return result || '';
  },

  // 判断是否空亡
  isKongWang(zhi, kongWang) {
    return kongWang.day.kong.includes(zhi) || kongWang.hour.kong.includes(zhi);
  },

  // 判断是否马星
  isMaStar(zhi, kongWang) {
    return kongWang.day.ma === zhi || kongWang.hour.ma === zhi;
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  },

  // 重新计算
  onRecalculate() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      prevPage.calculate();
    }
  },

  // 计算六仪
  calculateLiuYi(ju) {
    // 阳遁局和阴遁局的六仪不同
    return ju.type === '阳' ? '戊' : '己';
  },

  // 添加日期时间式化方法
  formatDateTime(year, month, day, hour) {
    try {
      if (!DateUtil) {
        console.error('DateUtil 未定义');
        return `${year}年${month}月${day}日 ${hour}时`;
      }
      return DateUtil.formatDateTime(year, month, day, hour);
    } catch (error) {
      console.error('格式化日期时间失败:', error);
      return `${year}年${month}月${day}日 ${hour}时`;
    }
  },

  // 计算地盘三奇六仪
  calculateDiPan(ju) {
    // 根据阴阳遁局返回地盘排列
    const yangOrder = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
    const yinOrder = ['戊', '乙', '丙', '丁', '癸', '壬', '辛', '庚', '己'];
    return ju.type === '阳' ? yangOrder : yinOrder;
  },

  // 计算天盘三奇六仪
  calculateTianPan(shiGan, diPan) {
    // 根据时干和地盘计算天盘排列
    const index = diPan.indexOf(shiGan);
    if (index === -1) return diPan;
    return [...diPan.slice(index), ...diPan.slice(0, index)];
  }
}); 