const { BAGUA_DATA, baguaUtils } = require('./bagua');

const yaoUtils = {
  /**
   * 生成单爻
   * @param {string} method 起卦方式
   * @param {number} [number] 数字起卦时的数字
   * @returns {object} 爻的信息
   */
  generateSingleYao(method, number) {
    try {
      let yaoValue;
      let yaoChange = false;
      let yaoType = '';

      switch(method) {
        case '电脑起卦':
          const coins = Array(3).fill(0).map(() => Math.random() < 0.5 ? 2 : 3);
          const sum = coins.reduce((a, b) => a + b, 0);
          yaoValue = sum % 2 === 1 ? 1 : 0;
          yaoChange = (sum === 6 || sum === 9);
          
          if(sum === 6) {
            yaoType = 'oldYin';       // 老阴(6)
            yaoValue = 0;             // 阴爻
          } else if(sum === 7) {
            yaoType = 'youngYang';    // 少阳(7)
            yaoValue = 1;             // 阳爻
          } else if(sum === 8) {
            yaoType = 'youngYin';     // 少阴(8)
            yaoValue = 0;             // 阴爻
          } else if(sum === 9) {
            yaoType = 'oldYang';      // 老阳(9)
            yaoValue = 1;             // 阳爻
          }
          break;
          
        case '数字起卦':
          if (number) {
            // 根据数字计算爻的类型
            const remainder = number % 6;  // 用6来取余
            switch(remainder) {
              case 0:  // 6
                yaoType = 'oldYin';    // 老阴
                yaoValue = 0;
                yaoChange = true;
                break;
              case 1:  // 7
                yaoType = 'youngYang'; // 少阳
                yaoValue = 1;
                yaoChange = false;
                break;
              case 2:  // 8
                yaoType = 'youngYin';  // 少阴
                yaoValue = 0;
                yaoChange = false;
                break;
              case 3:  // 9
                yaoType = 'oldYang';   // 老阳
                yaoValue = 1;
                yaoChange = true;
                break;
              case 4:  // 余4当7
                yaoType = 'youngYang';
                yaoValue = 1;
                yaoChange = false;
                break;
              case 5:  // 余5当8
                yaoType = 'youngYin';
                yaoValue = 0;
                yaoChange = false;
                break;
            }
          }
          break;

        default:
          // 默认使用电脑起卦
          const defaultCoins = Array(3).fill(0).map(() => Math.random() < 0.5 ? 2 : 3);
          const defaultSum = defaultCoins.reduce((a, b) => a + b, 0);
          yaoValue = defaultSum % 2 === 1 ? 1 : 0;
          yaoChange = (defaultSum === 6 || defaultSum === 9);
      }

      return {
        value: yaoValue,
        isChanging: yaoChange,
        yaoType: yaoType,
        display: yaoValue === 1 ? '/images/yang.gif' : '/images/yin.gif',
        position: 0
      };
    } catch (error) {
      console.error('生成单爻错误:', error);
      return null;
    }
  },

  /**
   * 生成完整卦象
   * @param {string} method 起卦方式
   * @param {number} [number] 数字
   * @returns {object} 完整卦象信息
   */
  generateFullGua(method, number) {
    try {
      console.log('起卦方法:', method, '数字:', number);
      // 确保生成6个爻
      const yaoList = [];
      for(let i = 0; i < 6; i++) {
        const yao = this.generateSingleYao(method, number);
        if(!yao) throw new Error('生成爻失败');
        yao.position = i;
        yaoList.push(yao);
      }
      
      const yaoString = yaoList.map(yao => yao.value).join('');
      if(yaoString.length !== 6) {
        console.error('卦象长度错误:', yaoString);
        throw new Error('卦象长度错误');
      }
      
      const changingYaoIndexes = yaoList
        .map((yao, index) => yao.isChanging ? index : -1)
        .filter(index => index !== -1);
        
      return {
        yaoList,
        originalGua: yaoString,
        changingYaoIndexes,
        changedGua: this.calculateChangedGua(yaoString, changingYaoIndexes)
      };
    } catch (error) {
      console.error('生成卦象错误:', error);
      return null;
    }
  },

  /**
   * 计算变卦
   * @param {string} originalGua 原卦爻值字符串
   * @param {Array} changingIndexes 变爻位置
   * @returns {string} 变卦爻值字符串
   */
  calculateChangedGua(originalGua, changingIndexes) {
    const guaArray = originalGua.split('');
    changingIndexes.forEach(index => {
      guaArray[index] = guaArray[index] === '1' ? '0' : '1';
    });
    return guaArray.join('');
  }
};

module.exports = yaoUtils; 