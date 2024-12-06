const predictUtils = require('../../../utils/liuyao/predict');
const shenshaUtils = require('../../../utils/liuyao/shensha');

Page({
  data: {
    question: '',
    dateTime: '',
    lunarDate: '',
    ganzhi: '',
    guaName: '',
    guaCi: '',
    yaoList: [],
    changedGuaName: '',
    changedGuaCi: '',
    shiYao: 0,
    yingYao: 0,
    liuqinList: [],
    najiaList: [],
    shensha: '',
    conclusion: '',
    guaExplain: '',
    changedGuaExplain: '',
    liuqinExplain: '',
    najiaExplain: '',
    shiyingExplain: '',
    showDetail: false,
    activeTab: 'gua'
  },

  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log('接收到的原始数据:', data);
      
      const yaoList = data.yaoList.map((yao, index) => ({
        ...yao,
        display: yao.display,
        value: yao.value,
        position: ['上', '五', '四', '三', '二', '初'][5-index],
        liuQin: yao.liuQin || '未知',
        isShi: (index === data.shiYao),
        isYing: (index === data.yingYao),
        isChanging: yao.isChanging
      }));

      this.setData({
        yaoList,
        question: data.question,
        dateTime: data.dateTime,
        lunarDate: data.lunarDate,
        ganzhi: data.ganzhi,
        guaName: data.guaName,
        guaCi: data.guaCi,
        changedGuaName: data.changedGuaName,
        changedGuaCi: data.changedGuaCi,
        shiYao: data.shiYao,
        yingYao: data.yingYao,
        shensha: data.shensha,
        conclusion: data.conclusion
      });
    });
  },

  handleError(error) {
    wx.showToast({
      title: error.message || '数据加载失败',
      icon: 'none',
      duration: 2000
    });
    
    // 延迟返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 2000);
  },

  formatGuaExplain(guaData) {
    if (!guaData) return '';
    return `${guaData.name}：${guaData.guaCi}\n${guaData.overall}`;
  },

  formatLiuqinExplain(yaoList) {
    if (!yaoList) return '';
    return yaoList.map(yao => {
      let text = `${yao.position}爻：${yao.liuQin}`;
      if (yao.isShi) text += '（主）';
      if (yao.isYing) text += '（应）';
      if (yao.isChanging) text += '（变）';
      return text;
    }).join('\n');
  },

  formatNajiaExplain(yaoList) {
    if (!yaoList) return '';
    return yaoList.map(yao => {
      return `${yao.position}爻：${yao.najia.gan}${yao.najia.zhi}`;
    }).join('\n');
  },

  formatShiyingExplain(shiying) {
    if (!shiying) return '';
    const positions = ['初', '二', '三', '四', '五', '上'];
    return `世爻在${positions[shiying.shi]}爻，应爻在${positions[shiying.ying]}爻`;
  },

  getLiuqinDesc(liuqin) {
    const DESC = {
      '比肩': '与日干同性，表示竞争或帮助',
      '食神': '我生者，表示权力或学识',
      '财星': '生我者，表示财富或利益',
      '官鬼': '克我者，表示权威或压力',
      '印绶': '我克者，表示助力或保护',
      '兄弟': '同我者，表示平辈或竞争',
      '子孙': '生我者，表示后辈或学问',
      '妻财': '我生者，表示财物或配偶'
    };
    return DESC[liuqin] || '未知关系';
  },

  getYaoImportance(yao) {
    if (yao.isChanging) return '变化位置，重点参考';
    if (yao.isShi) return '主位，核心参考';
    if (yao.isYing) return '应位，辅助参考';
    return '一般参考';
  },

  toggleDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  copyGuaInfo() {
    const info = `${this.data.guaName}\n`;
    const yaoInfo = this.data.yaoList.map(yao => 
      `${yao.position}爻：${yao.display} ${yao.yaoCi}`
    ).join('\n');
    
    wx.setClipboardData({
      data: info + yaoInfo,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: `六爻占卜：${this.data.question}`,
      path: '/pages/liuyao/result/result',
      imageUrl: '/images/share-image.png'
    };
  },

  getYaoDetail(yao) {
    let detail = `${yao.position}爻：${yao.display}\n`;
    detail += `爻辞：${yao.yaoCi}\n`;
    if (yao.isChanging) detail += '此爻为变爻\n';
    if (yao.isShi) detail += '此爻为世爻\n';
    if (yao.isYing) detail += '此爻为应爻\n';
    detail += `六亲：${yao.liuQin}\n`;
    detail += `纳甲：${yao.najia.gan}${yao.najia.zhi}`;
    return detail;
  },

  showYaoDetail(e) {
    const index = e.currentTarget.dataset.index;
    const yao = this.data.yaoList[index];
    const detail = this.getYaoDetail(yao);
    
    wx.showModal({
      title: `${yao.position}爻详解`,
      content: detail,
      showCancel: false
    });
  },

  saveAsImage() {
    // 使canvas绘制卦象信息
    // 实现保存为图片的功能
  }
}) 