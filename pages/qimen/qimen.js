// pages/qimen/qimen.js
const QimenCalc = require('./js/core/qimenCalc');
const GanzhiUtil = require('./js/utils/ganzhi');
const DateUtil = require('./js/utils/dateUtil');

Page({
  data: {
    dateTimeArray: [], // 日期时间数组
    dateTimeIndex: [], // 选中的索引
    type: 'rotating',  // 默认为转盘
    typeOptions: [
      { value: 'rotating', label: '转盘' },
      { value: 'flying', label: '飞盘' }
    ],
    panType: '寄宫置闰',  // 默认盘式类型
    panTypeOptions: [
      { value: '寄宫置闰', label: '寄宫置闰' },
      { value: '拆补', label: '拆补' }
    ],
    methodType: '值符门起',  // 默认推演方式
    methodTypeOptions: [
      { value: '值符门起', label: '值符门起' },
      { value: '昼夜时起', label: '昼夜时起' }
    ],
    result: null,  // 添加 result 字段存储计算结果
    ganzhiText: '',  // 添加 ganzhiText 字段存储干支显示文本
    isLoading: false, // 添加加载状态
    lastCalculation: null // 缓存上次计算结果
  },

  onLoad: function() {
    // 清除所有缓存
    wx.clearStorageSync();
    
    // 初期时间选择器数据
    const now = new Date();
    const years = this.getYears();
    const months = this.getMonths();
    const days = this.getDays(now.getFullYear(), now.getMonth() + 1);
    const hours = this.getHours();
    const minutes = this.getMinutes();

    this.setData({
      dateTimeArray: [years, months, days, hours, minutes],
      dateTimeIndex: [
        years.indexOf(now.getFullYear()),
        now.getMonth(),
        now.getDate() - 1,
        now.getHours(),
        Math.floor(now.getMinutes() / 5)
      ]
    }, () => {
      // 在 setData 的回调中调用 previewCalculate
      this.previewCalculate();
    });
  },

  // 获取年份数组
  getYears: function() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear + 100; i++) {
      years.push(i);
    }
    return years;
  },

  // 获取月份数组
  getMonths: function() {
    return Array.from({length: 12}, (_, i) => i + 1);
  },

  // 获取天数数组
  getDays: function(year, month) {
    const days = new Date(year, month, 0).getDate();
    return Array.from({length: days}, (_, i) => i + 1);
  },

  // 获取小时数组
  getHours: function() {
    return Array.from({length: 24}, (_, i) => i);
  },

  // 获取分钟数组（每5分钟个项
  getMinutes: function() {
    return Array.from({length: 12}, (_, i) => i * 5);
  },

  // 日期时间选择器变化
  bindDateTimeChange: function(e) {
    const val = e.detail.value;
    console.log('时间选择器变化:', {
      oldValue: this.data.dateTimeIndex,
      newValue: val
    });
    
    this.setData({
      dateTimeIndex: val
    });

    // 年月变化时，需要重新计算天数
    if (val[0] !== this.data.dateTimeIndex[0] || 
        val[1] !== this.data.dateTimeIndex[1]) {
      const year = this.data.dateTimeArray[0][val[0]];
      const month = this.data.dateTimeArray[1][val[1]];
      const days = this.getDays(year, month);
      
      this.setData({
        'dateTimeArray[2]': days,
        'dateTimeIndex[2]': Math.min(this.data.dateTimeIndex[2], days.length - 1)
      });
    }

    // 清除上次的计算结果并自动重新计算
    wx.removeStorageSync('lastQimenCalc');
    this.previewCalculate();
  },

  // 日期时间选择器列变化
  bindDateTimeColumnChange: function(e) {
    const column = e.detail.column;
    const value = e.detail.value;
    const dateTimeIndex = [...this.data.dateTimeIndex];
    dateTimeIndex[column] = value;

    // 更新选中的索引
    this.setData({
      dateTimeIndex
    });

    // 如果是年份或月变化，需要更新天数
    if (column === 0 || column === 1) {
      const year = this.data.dateTimeArray[0][dateTimeIndex[0]];
      const month = this.data.dateTimeArray[1][dateTimeIndex[1]];
      const days = this.getDays(year, month);
      
      this.setData({
        'dateTimeArray[2]': days,
        'dateTimeIndex[2]': Math.min(dateTimeIndex[2], days.length - 1)
      });
    }

    // 清除缓存并预览计算
    wx.removeStorageSync('lastQimenCalc');
    this.previewCalculate();
  },

  // 盘面类型选择
  bindTypeChange: function(e) {
    console.log('盘面类型变化:', {
      oldValue: this.data.type,
      newValue: e.detail.value
    });
    
    this.setData({
      type: e.detail.value
    });

    // 清除缓存并预览计算
    wx.removeStorageSync('lastQimenCalc');
    this.previewCalculate();
  },

  // 盘式选择
  bindPanTypeChange: function(e) {
    this.setData({
      panType: this.data.panTypeOptions[e.detail.value].value
    });
    this.previewCalculate();
  },

  // 推演方式选择
  bindMethodTypeChange: function(e) {
    this.setData({
      methodType: this.data.methodTypeOptions[e.detail.value].value
    });
    this.previewCalculate();
  },

  // 重置数据
  reset: function() {
    const now = new Date();
    this.setData({
      dateTimeIndex: [
        this.data.dateTimeArray[0].indexOf(now.getFullYear()),
        now.getMonth(),
        now.getDate() - 1,
        now.getHours(),
        Math.floor(now.getMinutes() / 5)
      ],
      type: 'rotating',
      panType: '寄宫置闰',
      methodType: '值符门起',
      result: null,
      ganzhiText: '',
      lastCalculation: null,
      isLoading: false
    });
    this.previewCalculate();
  },

  // 验证输入数据
  validateInput: function() {
    const { dateTimeArray, dateTimeIndex } = this.data;
    
    const year = dateTimeArray[0][dateTimeIndex[0]];
    const month = dateTimeArray[1][dateTimeIndex[1]];
    const day = dateTimeArray[2][dateTimeIndex[2]];
    const hour = dateTimeArray[3][dateTimeIndex[3]];
    const minute = dateTimeArray[4][dateTimeIndex[4]];

    if (!DateUtil.validateDate(year, month, day, hour, minute)) {
      wx.showToast({
        title: '请选择有效的日期时间',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  // 预览计算，不跳转页面
  previewCalculate: function() {
    if (!this.validateInput()) {
      return;
    }

    try {
      const params = {
        year: this.data.dateTimeArray[0][this.data.dateTimeIndex[0]],
        month: this.data.dateTimeArray[1][this.data.dateTimeIndex[1]],
        day: this.data.dateTimeArray[2][this.data.dateTimeIndex[2]],
        hour: this.data.dateTimeArray[3][this.data.dateTimeIndex[3]],
        type: this.data.type,
        panType: this.data.panType,
        methodType: this.data.methodType
      };

      console.log('预览计算参数:', params);
      
      const qimenCalc = new QimenCalc();
      const result = qimenCalc.calculate(params);
      
      // 更新预览结果 - 使用相同的数据结构
      const previewResult = {
        ganzhi: result.ganzhi,
        ju: result.ju,
        palaces: result.palaces,
        type: params.type,
        panType: params.panType,
        methodType: params.methodType,
        selectedTime: {  // 添加选择器的时间
          year: params.year,
          month: params.month,
          day: params.day,
          hour: params.hour
        }
      };

      this.setData({
        result: previewResult,
        ganzhiText: GanzhiUtil.formatGanzhi(result.ganzhi)
      });
    } catch (error) {
      console.error('预览计算错误:', error);
      wx.showToast({
        title: error.message || '计算失败',
        icon: 'none'
      });
    }
  },

  // 开始推演按钮点击
  calculate: function() {
    if (!this.validateInput()) {
      return;
    }

    try {
      this.setData({
        isLoading: true
      });

      const params = {
        year: this.data.dateTimeArray[0][this.data.dateTimeIndex[0]],
        month: this.data.dateTimeArray[1][this.data.dateTimeIndex[1]],
        day: this.data.dateTimeArray[2][this.data.dateTimeIndex[2]],
        hour: this.data.dateTimeArray[3][this.data.dateTimeIndex[3]],
        type: this.data.type || 'rotating',
        panType: this.data.panType || '寄宫置闰',
        methodType: this.data.methodType || '值符门起'
      };

      console.log('正式计算参数:', params);
      
      const qimenCalc = new QimenCalc();
      const result = qimenCalc.calculate(params);
      
      // 确保结果中包含所有必要的字段
      if (!result.ganzhi || !result.ganzhi.year || !result.ganzhi.month || 
          !result.ganzhi.day || !result.ganzhi.hour) {
        throw new Error('计算结果不完整');
      }

      // 保存计算结果 - 修改结构
      const calculation = {
        result: {
          ganzhi: result.ganzhi,
          ju: result.ju,
          palaces: result.palaces,
          type: params.type,
          panType: params.panType,
          methodType: params.methodType,
          selectedTime: {  // 添加选择器的时间
            year: params.year,
            month: params.month,
            day: params.day,
            hour: params.hour
          }
        },
        ganzhiText: GanzhiUtil.formatGanzhi(result.ganzhi),
        timestamp: new Date().getTime()
      };

      // 设置到页面数据中
      this.setData({
        result: calculation.result  // 注意这里
      });

      wx.setStorageSync('lastQimenCalc', calculation);

      // 跳转到结果页面
      wx.navigateTo({
        url: './result/result',
        success: () => {
          this.setData({
            isLoading: false
          });
        },
        fail: (error) => {
          console.error('页面跳转失败:', error);
          this.setData({
            isLoading: false
          });
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });
    } catch (error) {
      console.error('计算错误:', error);
      this.setData({
        isLoading: false
      });
      wx.showToast({
        title: error.message || '计算失败',
        icon: 'none'
      });
    }
  }
});