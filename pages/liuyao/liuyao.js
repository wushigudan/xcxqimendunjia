// pages/liuyao/liuyao.js

// 先导入所有工具类
const ganzhiUtils = require('../../utils/calendar/ganzhi');
const lunarUtils = require('../../utils/calendar/lunar');
const { baguaUtils } = require('../../utils/liuyao/bagua');
const yaoUtils = require('../../utils/liuyao/yao');
const predictUtils = require('../../utils/liuyao/predict');
const shenshaUtils = require('../../utils/liuyao/shensha');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 起卦方式选项
    methods: [
      '系统计算',
      '数数计算'
    ],
    methodIndex: 0,

    selectedDate: '',
    selectedTime: '',
    question: '',
    showResult: false,
    lunarDate: '', // 农历日期
    ganzhi: '', // 干支信息
    guaName: '', // 卦名
    guaProperty: '', // 卦性质
    yaoList: [], // 爻列表
    inputNumber: '', // 添加数字输入值
    inputChar: '', // 添加汉字输入值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听��面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 事件处理函数
  onMethodChange(e) {
    const methodIndex = e.detail.value;
    this.setData({
      methodIndex,
      showDateTime: methodIndex == 2
    });
  },

  onQuestionInput(e) {
    this.setData({
      question: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    });
  },

  onTimeChange(e) {
    this.setData({
      selectedTime: e.detail.value
    });
  },

  // 添加数字输入处理方法
  onNumberInput(e) {
    this.setData({
      inputNumber: e.detail.value,
      numberTips: '请保持平静心态，输入当前想到的数字'
    });
  },

  // 添加汉字输入处理方法
  onCharInput(e) {
    this.setData({
      inputChar: e.detail.value
    });
  },

  // 添加表单验证
  validateForm() {
    const { question, methodIndex, inputNumber } = this.data;
    
    if (!question.trim()) {
      wx.showToast({
        title: '请输入分析主题',
        icon: 'none'
      });
      return false;
    }

    if (methodIndex === 1 && !inputNumber) {
      wx.showToast({
        title: '请输入演算数字',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  // 优化提交流程
  async onSubmit() {
    if (!this.validateForm()) return;
    
    wx.showLoading({
      title: '正在演算',
      mask: true
    });
    
    try {
      // 获取起卦方式和数字
      const method = this.data.methods[this.data.methodIndex];
      const number = method === '数值演算' ? parseInt(this.data.inputNumber) : null;
      const char = method === '汉字起卦' ? this.data.inputChar : null;
      
      const result = await this.calculateResult(number, char);
      
      if (!result) {
        throw new Error('演算结果为空');
      }

      wx.navigateTo({
        url: '/pages/liuyao/result/result',
        events: {
          someEvent: function(data) {
            console.log('someEvent', data);
          }
        },
        success: function(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', result);
        }
      });

    } catch (error) {
      console.error('演算失败:', error);
      wx.showToast({
        title: error.message || '演算失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  savePaiPan() {
    wx.showToast({
      title: '分析已保存',
      icon: 'success'
    });
  },

  getInterpretation() {
    wx.showToast({
      title: '正在分析',
      icon: 'loading'
    });
  },

  async calculateResult(number, char) {
    try {
      const { 
        question, 
        methodIndex,
        methods 
      } = this.data;
      
      // 获取当前时间
      const now = new Date();
      
      // 获取干支信息
      const ganzhi = ganzhiUtils.getFullGanzhi(now);
      console.log('日干信息:', ganzhi.day[0]);

      // 生成卦象信息
      const guaInfo = yaoUtils.generateFullGua(methods[methodIndex], number, char);
      if (!guaInfo) {
        throw new Error('生成卦象失败');
      }

      // 获取卦象解释
      const interpretation = predictUtils.interpretGua({
        ...guaInfo,
        dayGan: ganzhi.day[0]
      });
      if (!interpretation) {
        throw new Error('解卦失败');
      }

      console.log('卦象解释结果:', interpretation);

      // 算神煞信息
      const shensha = shenshaUtils.calculateShensha(ganzhi, guaInfo.yaoList);
      if (!shensha) {
        throw new Error('神煞计算失败');
      }

      return {
        question,
        dateTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        lunarDate: lunarUtils.getLunarDate(now),
        ganzhi: ganzhi.full,
        guaName: interpretation.original.name,
        guaCi: interpretation.original.guaCi,
        yaoList: interpretation.original.yaoList,
        changedGuaName: interpretation.changed?.name,
        changedGuaCi: interpretation.changed?.guaCi,
        shiYao: interpretation.shiying.shi,
        yingYao: interpretation.shiying.ying,
        conclusion: interpretation.conclusion,
        shensha
      };
    } catch (error) {
      console.error('起卦计算错误:', error);
      throw error;
    }
  }
})

// 添加六爻计算相关的工具函数
const liuyaoUtils = {
  // 生成卦象
  generateGua() {
    // 实现卦象生成算法
  },
  
  // 计算变爻
  calculateChangingYao() {
    // 实现变爻计算
  },
  
  // 解析卦象
  interpretGua() {
    // 实现卦象解析
  }
};

// 添加数据存储相关功能
const storageManager = {
  // 保存卦象记录
  saveRecord(record) {
    const records = wx.getStorageSync('liuyao_records') || [];
    records.unshift(record);
    wx.setStorageSync('liuyao_records', records);
  },
  
  // 获取历史记录
  getRecords() {
    return wx.getStorageSync('liuyao_records') || [];
  }
};