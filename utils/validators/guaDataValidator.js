// 卦象数据验证工具
const guaDataValidator = {
  // 检查卦象编码格式
  checkGuaCode(code) {
    return /^[01]{6}$/.test(code);
  },

  // 检查卦象数据完整性
  checkGuaData(gua) {
    const requiredFields = ['name', 'guaCi', 'yaoName', 'yaoCi', 'yaoExplain', 'fullExplain'];
    return requiredFields.every(field => gua[field] !== undefined);
  },

  // 检查爻数据长度
  checkYaoLength(gua) {
    return gua.yaoName.length === 6 && 
           gua.yaoCi.length === 6 && 
           gua.yaoExplain.length === 6;
  },

  // 检查字符串是否完整（未终止）
  checkStringComplete(str) {
    try {
      JSON.parse(`"${str}"`);
      return true;
    } catch(e) {
      return false;
    }
  },

  // 添加字符串验证函数
  validateYaoCi(yaoCi, guaName, index) {
    try {
      // 检查字符串是否完整
      if (typeof yaoCi !== 'string') {
        throw new Error(`爻辞必须是字符串类型`);
      }
      
      // 检查字符串是否为空
      if (!yaoCi.trim()) {
        throw new Error(`爻辞不能为空`);
      }
      
      // 检查字符串是否正确终止
      JSON.parse(`"${yaoCi}"`);
      
      return true;
    } catch(e) {
      console.error(`卦象 ${guaName} 第${index + 1}爻爻辞错误:`, e.message);
      return false;
    }
  },

  // 检查所有卦象数据
  validateAllGua(guaData) {
    const errors = [];
    
    Object.entries(guaData).forEach(([code, gua]) => {
      // 检查编码格式
      if(!this.checkGuaCode(code)) {
        errors.push(`卦象 ${gua.name} 编码格式错误: ${code}`);
      }

      // 检查数据完整性
      if(!this.checkGuaData(gua)) {
        errors.push(`卦象 ${gua.name} 数据不完整`);
      }

      // 检查爻数据长度
      if(!this.checkYaoLength(gua)) {
        errors.push(`卦象 ${gua.name} 爻数据长度错误`);
      }

      // 检查字符串完整性
      gua.yaoCi.forEach((yaoCi, index) => {
        if(!this.checkStringComplete(yaoCi)) {
          errors.push(`卦象 ${gua.name} 第${index + 1}爻爻辞未终止`);
        }
      });
    });

    return errors;
  }
};

module.exports = guaDataValidator; 