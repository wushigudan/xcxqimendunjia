const QimenBase = require('./qimenBase');
const BASE_DATA = require('../constants/baseData');

class FlyingPan extends QimenBase {
  constructor() {
    super();
    this.initializeData();
  }

  initializeData() {
    // 初始化基础数据
    this.sanqi = BASE_DATA.SANQI;        // 三奇
    this.liuyi = BASE_DATA.LIUYI;        // 六仪
    this.jiuxing = BASE_DATA.JIUXING;    // 九星
    this.bamen = BASE_DATA.BAMEN;        // 八门
    this.bashen = BASE_DATA.BASHEN;      // 八神
  }

  calculateLayout(params) {
    const { ganzhi, ju } = params;
    const dayGan = ganzhi.day.gan;       // 日干
    const hourGan = ganzhi.hour.gan;     // 时干
    const isYang = ju.type === '阳';     // 阴阳遁
    const juNumber = ju.number;          // 局数

    // 计算值符星
    const zhifuStar = this.calculateZhiFuStar(dayGan, juNumber, isYang);
    
    // 计算值使门
    const zhishiDoor = this.calculateZhiShiDoor(hourGan, juNumber, isYang);

    // 计算九星分布
    const starDistribution = this.distributeStars(zhifuStar, isYang);

    // 计算八门分布
    const doorDistribution = this.distributeDoors(zhishiDoor, isYang);

    // 计算八神分布
    const godDistribution = this.distributeGods(isYang);

    // 计算天干分布
    const ganDistribution = this.distributeGans(dayGan, isYang);

    // 计算地支分布
    const zhiDistribution = this.distributeZhis(ganzhi.day.zhi, isYang);

    // 组合各宫位数据
    const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    positions.forEach((pos, index) => {
      if (pos === 5) {
        // 中宫特殊处理
        this.palaces[index] = {
          position: pos,
          star: '天禽',
          door: '',
          god: '玄武', // 中宫八神固定为玄武
          gan: this.calculateCenterGan(dayGan, isYang),
          zhi: '辰',   // 中宫地支固定为辰
          yinyang: '阳',
          wuxing: this.getWuxing('天禽')
        };
        return;
      }

      this.palaces[index] = {
        position: pos,
        star: starDistribution[index],
        door: doorDistribution[index],
        god: godDistribution[index],
        gan: ganDistribution[index],
        zhi: zhiDistribution[index],
        yinyang: this.getYinYang(starDistribution[index]),
        wuxing: this.getWuxing(starDistribution[index])
      };
    });

    return this.palaces;
  }

  // 计算值符星
  calculateZhiFuStar(dayGan, juNumber, isYang) {
    // 根据日干获取值符星
    const starIndex = BASE_DATA.TIANGAN.indexOf(dayGan);
    const baseStarIndex = (starIndex + juNumber - 1) % 9;
    return this.jiuxing[baseStarIndex];
  }

  // 计算值使门
  calculateZhiShiDoor(hourGan, juNumber, isYang) {
    // 根据时干获取值使门
    const doorIndex = BASE_DATA.TIANGAN.indexOf(hourGan);
    const baseDoorIndex = (doorIndex + juNumber - 1) % 8;
    return this.bamen[baseDoorIndex];
  }

  // 分配九星
  distributeStars(zhifuStar, isYang) {
    const startIndex = this.jiuxing.indexOf(zhifuStar);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue; // 跳过中宫
      const offset = isYang ? i : (8 - i);
      const index = (startIndex + offset) % 8;
      distribution[i] = this.jiuxing[index];
    }
    distribution[4] = '天禽'; // 中宫固定为天禽
    return distribution;
  }

  // 分配八门
  distributeDoors(zhishiDoor, isYang) {
    const startIndex = this.bamen.indexOf(zhishiDoor);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = ''; // 中宫无门
        continue;
      }
      const offset = isYang ? i : (8 - i);
      const index = (startIndex + offset) % 8;
      distribution[i] = this.bamen[index];
    }
    return distribution;
  }

  // 分配八神
  distributeGods(isYang) {
    const distribution = new Array(9);
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = '玄武'; // 中宫固定为玄武
        continue;
      }
      const index = isYang ? i : (8 - i);
      distribution[i] = this.bashen[index % 8];
    }
    return distribution;
  }

  // 分配天干
  distributeGans(dayGan, isYang) {
    const ganIndex = BASE_DATA.TIANGAN.indexOf(dayGan);
    const distribution = new Array(9);
    
    // 三奇六仪排序
    const orderedGans = [...this.sanqi, ...this.liuyi];
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = isYang ? '戊' : '己'; // 中宫天干
        continue;
      }
      const offset = isYang ? i : (8 - i);
      const index = (ganIndex + offset) % 8;
      distribution[i] = orderedGans[index];
    }
    return distribution;
  }

  // 分配地支
  distributeZhis(dayZhi, isYang) {
    const zhiIndex = BASE_DATA.DIZHI.indexOf(dayZhi);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = '辰'; // 中宫地支固定为辰
        continue;
      }
      const offset = isYang ? i : (8 - i);
      const index = (zhiIndex + offset) % 12;
      distribution[i] = BASE_DATA.DIZHI[index];
    }
    return distribution;
  }

  // 计算中宫天干
  calculateCenterGan(dayGan, isYang) {
    return isYang ? '戊' : '己';
  }

  // 获取五行属性
  getWuxing(element) {
    if (BASE_DATA.JIUXING_WUXING[element]) {
      return BASE_DATA.JIUXING_WUXING[element];
    }
    return '';
  }

  // 获取阴阳属性
  getYinYang(element) {
    if (BASE_DATA.JIUXING_YINYANG[element]) {
      return BASE_DATA.JIUXING_YINYANG[element];
    }
    return '';
  }
}

module.exports = FlyingPan;