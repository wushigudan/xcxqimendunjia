const SIXTY_FOUR_GUA = require('../data/sixtyFourGua');
const { baguaUtils } = require('./bagua');

const predictUtils = {
  /**
   * 解释卦象
   * @param {object} guaInfo 卦象信息
   * @returns {object} 解释结果
   */
  interpretGua(data) {
    try {
      if (!data || !data.dayGan) {
        console.error('缺少必要的卦象信息或日干信息:', data);
        throw new Error('卦象数据不完整');
      }

      // 获取本卦数据
      const originalGua = SIXTY_FOUR_GUA[data.originalGua];
      if (!originalGua) {
        throw new Error(`找不到卦象数据: ${data.originalGua}`);
      }

      // 获取变卦数据
      const changedGua = data.changedGua ? SIXTY_FOUR_GUA[data.changedGua] : null;

      // 获取世应位置
      const shiYao = baguaUtils.findShiYao(data.originalGua);
      const yingYao = baguaUtils.findYingYao(shiYao);

      console.log('解释卦象:', {
        dayGan: data.dayGan,
        originalGua,
        changedGua,
        shiYao,
        yingYao
      });

      // 获取纳甲信息
      const najiaInfo = baguaUtils.getFullNajiaInfo(data.originalGua);

      // 保留原始爻的属性
      const yaoList = data.yaoList.map((yao, index) => {
        return this.calculateYaoInfo(yao, index, data);
      });

      // 解释结果
      return {
        // 本卦信息
        original: {
          name: originalGua.name,
          guaCi: originalGua.guaCi,
          yaoList,
          overall: originalGua.fullExplain
        },
        // 变卦信息
        changed: changedGua ? {
          name: changedGua.name,
          guaCi: changedGua.guaCi,
          overall: changedGua.fullExplain
        } : null,
        // 世应信息
        shiying: {
          shi: shiYao,
          ying: yingYao
        },
        // 总体断语
        conclusion: this.getDetailedConclusion(originalGua, changedGua, data.changingYaoIndexes, shiYao, yingYao)
      };
    } catch (error) {
      console.error('卦象解释错误:', error);
      wx.showToast({
        title: error.message || '解卦失败',
        icon: 'none'
      });
      return null;
    }
  },

  /**
   * 获取详细的爻辞解释
   */
  getYaoExplanation(gua, changingYaos, shiYao, yingYao, najiaInfo, dayGan) {
    if (!gua || !gua.yaoCi) {
      console.error('卦象数据不完整');
      return [];
    }

    return gua.yaoCi.map((yaoCi, index) => {
      try {
        const importance = this.getYaoImportance(index, changingYaos, shiYao, yingYao);
        const najia = najiaInfo?.[index] || { gan: '', zhi: '' };
        
        // 计算六亲关系时传入日干
        const liuQin = baguaUtils.calculateLiuQin(dayGan, najia.gan);

        console.log('爻信息计算:', {
          position: index,
          dayGan,
          yaoGan: najia.gan,
          liuQin
        });

        return {
          position: index,
          yaoCi: yaoCi || '',
          explain: gua.yaoExplain ? gua.yaoExplain[index] : '',
          isChanging: changingYaos?.includes(index) || false,
          isShi: index === shiYao,
          isYing: index === yingYao,
          najia,
          liuQin,
          importance
        };
      } catch (error) {
        console.error('爻解释错误:', error);
        return {
          position: index,
          yaoCi: '',
          explain: '',
          isChanging: false,
          isShi: false,
          isYing: false,
          najia: { gan: '', zhi: '' },
          liuQin: '未知',
          importance: '一般参考'
        };
      }
    });
  },

  /**
   * 获取详细的断语
   */
  getDetailedConclusion(originalGua, changedGua, changingYaos, shiYao, yingYao) {
    let conclusion = `此卦为${originalGua.name}。\n`;
    conclusion += `${originalGua.fullExplain}\n\n`;
    
    // 修改世应分析文案
    conclusion += `主要位置在${['初', '二', '三', '四', '五', '上'][shiYao]}爻，`;
    conclusion += `对应位置在${['初', '二', '三', '四', '五', '上'][yingYao]}爻。`;
    
    if (changingYaos.length > 0) {
      conclusion += `\n有${changingYaos.length}处变化，`;
      conclusion += `分别在${changingYaos.map(i => ['初', '二', '三', '四', '五', '上'][i]).join('、')}爻。\n`;
      
      if (changedGua) {
        conclusion += `\n变化后为${changedGua.name}，表示发展趋向：\n`;
        conclusion += changedGua.fullExplain;
      }
    } else {
      conclusion += '\n本卦稳定，以当前状态为主。';
    }

    return conclusion;
  },

  /**
   * 分析世应关系
   */
  analyzeShiYingRelation(shiYao, yingYao) {
    const positions = ['初', '二', '三', '四', '五', '上'];
    let analysis = '';

    // 世爻位置分析
    if (shiYao === 4) {
      analysis += '世爻居五，为最有利位置，';
    } else if (shiYao === 1) {
      analysis += '世爻居二，为次吉位置，';
    } else if (shiYao === 0) {
      analysis += '世爻居初，处下位，';
    }

    // 世应关系分析
    const distance = Math.abs(shiYao - yingYao);
    if (distance === 3) {
      analysis += '世应正对，表示事情发展顺利；';
    } else if (distance === 2 || distance === 4) {
      analysis += '世应生克，表示事情有波折；';
    } else {
      analysis += '世应关系不明显，事情发展较为平淡；';
    }

    return analysis;
  },

  /**
   * 分析变爻
   */
  getChangingYaoAnalysis(changingYaos, gua) {
    let analysis = `有${changingYaos.length}个变爻，`;
    analysis += `分别在${changingYaos.map(i => ['初', '二', '三', '四', '五', '上'][i]).join('、')}爻。\n`;

    changingYaos.forEach(index => {
      analysis += `\n${['初', '二', '三', '四', '五', '上'][index]}爻变动：`;
      analysis += gua.yaoExplain[index];
    });

    return analysis;
  },

  /**
   * 获取爻的重要性
   * @param {number} index 爻位
   * @param {Array} changingYaos 变爻位置
   * @param {number} shiYao 世爻位置
   * @param {number} yingYao 应爻位置
   * @returns {string} 重要性描述
   */
  getYaoImportance(index, changingYaos, shiYao, yingYao) {
    if (changingYaos.includes(index)) {
      return '变爻，重点参考';
    }
    if (index === shiYao) {
      return '世爻，主要参考';
    }
    if (index === yingYao) {
      return '应爻，次要参考';
    }
    return '一般参考';
  },

  calculateYaoInfo(yao, index, data) {
    try {
      // 基础信息
      const baseInfo = {
        position: ['初', '二', '三', '四', '五', '上'][index],
        isChanging: yao.isChanging,
        value: yao.value,
        display: yao.display
      };

      // 计算六亲
      const liuQinInfo = baguaUtils.calculateLiuQin(data.dayGan, index, data.originalGua);
      
      // 获取纳甲信息
      const najiaInfo = baguaUtils.getFullNajiaInfo(data.originalGua)[index];
      
      // 获取五行属性
      const wuxing = baguaUtils.getYaoWuxing(data.originalGua, index);
      
      // 获取生克关系
      const guaWuxing = baguaUtils.getGuaWuxing(data.originalGua);
      const relation = baguaUtils.getWuxingRelation(guaWuxing, wuxing);
      
      // 获取方位(从地支推导)
      const direction = this.getDirectionFromZhi(najiaInfo.zhi);
      
      // 获取爻辞
      const originalGua = SIXTY_FOUR_GUA[data.originalGua];
      const yaoCi = originalGua.yaoCi[index];
      
      return {
        ...baseInfo,
        liuQin: liuQinInfo.liuqin,
        najia: {
          gan: najiaInfo.gan,
          zhi: najiaInfo.zhi
        },
        wuxing,  // 五行
        relation,  // 生克关系
        direction,  // 方位
        yaoCi: yaoCi,
        isShi: (index === data.shiYao),
        isYing: (index === data.yingYao)
      };
    } catch (error) {
      console.error('计算爻信息错误:', error);
      return {
        ...baseInfo,
        liuQin: '未知',
        najia: { gan: '未知', zhi: '未知' },
        wuxing: '未知',
        relation: '未知',
        direction: '未知',
        yaoCi: ''
      };
    }
  },

  // 添加从地支获取方位的方法
  getDirectionFromZhi(zhi) {
    const ZHI_DIRECTION = {
      '子': '北',
      '丑': '东北',
      '寅': '东',
      '卯': '东',
      '辰': '东南',
      '巳': '南',
      '午': '南',
      '未': '西南',
      '申': '西',
      '酉': '西',
      '戌': '西北',
      '亥': '北'
    };
    return ZHI_DIRECTION[zhi] || '未知';
  }
};

module.exports = predictUtils; 