const DateUtil = require('../utils/dateUtil');

function testGanzhi() {
  const testCases = [
    {
      date: new Date(2024, 11, 1, 13, 8),
      expect: {
        year: '甲辰',
        month: '乙亥',
        day: '己亥',
        hour: '辛未'
      }
    },
    // 添加更多测试用例
  ];

  testCases.forEach((test, index) => {
    const result = DateUtil.getFullGanzhi(test.date);
    console.log(`测试用例 ${index + 1}:`);
    console.log('期望结果:', test.expect);
    console.log('实际结果:', {
      year: result.year.gan + result.year.zhi,
      month: result.month.gan + result.month.zhi,
      day: result.day.gan + result.day.zhi,
      hour: result.hour.gan + result.hour.zhi
    });
  });
}

// 运行测试
testGanzhi(); 