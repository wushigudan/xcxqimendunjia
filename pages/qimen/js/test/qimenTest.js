const QimenPan = require('../core/qimenPan');
const GanzhiUtil = require('../utils/ganzhi');

function testQimenLayout() {
  // 获取当前时间的干支
  const now = new Date();
  const yearGanzhi = GanzhiUtil.getYearGanzhi(now.getFullYear());
  const monthGanzhi = GanzhiUtil.getMonthGanzhi(yearGanzhi.gan, now.getMonth() + 1);
  const dayGanzhi = GanzhiUtil.getDayGanzhi(now);
  const hourGanzhi = GanzhiUtil.getHourGanzhi(dayGanzhi.gan, now.getHours());

  // 测试数据
  const testParams = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    ganzhi: {
      year: yearGanzhi,
      month: monthGanzhi,
      day: dayGanzhi,
      hour: hourGanzhi
    }
  };

  console.log('测试参数:', {
    时间: `${testParams.year}年${testParams.month}月${testParams.day}日${testParams.hour}时`,
    干支: {
      年: `${yearGanzhi.gan}${yearGanzhi.zhi}`,
      月: `${monthGanzhi.gan}${monthGanzhi.zhi}`,
      日: `${dayGanzhi.gan}${dayGanzhi.zhi}`,
      时: `${hourGanzhi.gan}${hourGanzhi.zhi}`
    }
  });

  // 测试转盘布局
  console.log('\n测试转盘布局:');
  const rotatingPan = new QimenPan('rotating');
  testParams.type = 'rotating';
  const rotatingLayout = rotatingPan.calculateLayout(testParams);
  console.log('转盘布局结果:', formatLayout(rotatingLayout));

  // 测试飞盘布局
  console.log('\n测试飞盘布局:');
  const flyingPan = new QimenPan('flying');
  testParams.type = 'flying';
  const flyingLayout = flyingPan.calculateLayout(testParams);
  console.log('飞盘布局结果:', formatLayout(flyingLayout));
}

// 格式化布局结果
function formatLayout(layout) {
  return layout.map(palace => ({
    宫位: palace.position,
    九星: palace.star,
    八门: palace.door,
    八神: palace.god,
    值符: palace.isZhiFu ? '是' : '否',
    值使: palace.isZhiShi ? '是' : '否'
  }));
}

// 运行测试
try {
  console.log('开始奇门遁甲布局测试...\n');
  testQimenLayout();
} catch (error) {
  console.error('测试出错:', error);
}

module.exports = {
  testQimenLayout
}; 