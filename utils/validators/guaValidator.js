// 卦象映射表
const GUA_MAPPING = {
  // 乾卦系列（上卦为乾）
  '111111': '乾为天', 
  '111000': '天地否',
  '111001': '天雷无妄',
  '111010': '天泽履',
  '111110': '天风姤',
  '111101': '天火同人',
  '111011': '天水讼',
  '111100': '天山遁',

  // 坤卦系列（上卦为坤）
  '000000': '坤为地',
  '000111': '地天泰',
  '000100': '地雷复',
  '000010': '地泽临',
  '000110': '地风升',
  '000101': '地火明夷',
  '000011': '地水师',
  '000001': '地山谦',

  // 震卦系列（上卦为震）
  '100100': '震为雷',
  '100111': '雷天大壮',
  '100000': '雷地豫',
  '100010': '雷泽归妹',
  '100110': '雷风恒',
  '100101': '雷火丰',
  '100011': '雷水解',
  '100001': '雷山小过',

  // 兑卦系列（上卦为兑）
  '110110': '兑为泽',
  '110111': '泽天夬',
  '110000': '泽地萃',
  '110100': '泽雷随',
  '110011': '泽水节',
  '110101': '泽火革',
  '110010': '泽风大过',
  '110001': '泽山咸'
};

// 验证函数
const guaValidator = {
  /**
   * 验证卦象编码
   * @param {string} code 卦象编码
   * @param {string} name 卦名
   * @returns {boolean} 验证结果
   */
  validateGuaCode(code, name) {
    // 验证编码格式
    if(!/^[01]{6}$/.test(code)) {
      console.error(`卦象编码格式错误: ${code}`);
      return false;
    }

    // 验证卦象对应关系
    if(GUA_MAPPING[code] !== name) {
      console.error(`卦象编码错误: ${code} 应对应 ${name}, 实际对应 ${GUA_MAPPING[code]}`);
      return false;
    }

    return true;
  },

  /**
   * 批量验证卦象数据
   * @param {Object} guaData 卦象数据对象
   * @returns {Array} 错误信息列表
   */
  validateGuaData(guaData) {
    const errors = [];
    
    Object.entries(guaData).forEach(([code, gua]) => {
      // 验证编码格式
      if(!this.validateGuaCode(code, gua.name)) {
        errors.push(`卦象 ${gua.name} 编码错误: ${code}`);
      }

      // 验证数据完整性
      if(!gua.guaCi || !gua.yaoName || !gua.yaoCi || !gua.yaoExplain || !gua.fullExplain) {
        errors.push(`卦象 ${gua.name} 数据不完整`);
      }

      // 验证爻数据长度
      if(gua.yaoName.length !== 6 || gua.yaoCi.length !== 6 || gua.yaoExplain.length !== 6) {
        errors.push(`卦象 ${gua.name} 爻数据长度错误`);
      }
    });

    return errors;
  }
};

module.exports = guaValidator; 