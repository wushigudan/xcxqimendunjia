class ErrorHandler {
  static handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    wx.showToast({
      title: this.getErrorMessage(error),
      icon: 'none',
      duration: 2000
    });
  }

  static getErrorMessage(error) {
    const errorMap = {
      'INVALID_DATE': '日期格式错误',
      'CALCULATION_ERROR': '计算错误',
      'DATA_ERROR': '数据错误',
      'DEFAULT': '系统错误'
    };

    return errorMap[error.code] || errorMap.DEFAULT;
  }
}

module.exports = ErrorHandler; 