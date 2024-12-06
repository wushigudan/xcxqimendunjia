const QimenBase = require('./qimenBase');
const BASE_DATA = require('../constants/baseData');

class RotatingPan extends QimenBase {
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
    const hourGan = ganzhi.hour.gan;     // 时干
    const isYang = ju.type === '阳';     // 阴阳遁
    const juNumber = ju.number;          // 局数

    // 计算值符星
    const zhifuStar = this.calculateZhiFuStar(hourGan, juNumber, isYang);
    
    // 计算值使门
    const zhishiDoor = this.calculateZhiShiDoor(hourGan, juNumber, isYang);

    // 根据局数确定起始位置
    const startPosition = this.getStartPosition(juNumber);

    // 计算九星分布
    const starDistribution = this.distributeStars(zhifuStar, isYang, startPosition);

    // 计算八门分布
    const doorDistribution = this.distributeDoors(zhishiDoor, isYang, startPosition);

    // 计算八神分布
    const godDistribution = this.distributeGods(isYang, startPosition);

    // 计算天干分布
    const ganDistribution = this.distributeGans(hourGan, isYang, startPosition);

    // 计算地支分布
    const zhiDistribution = this.distributeZhis(ganzhi.hour.zhi, isYang, startPosition);

    // 组合各宫位数据
    const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    positions.forEach((pos, index) => {
      if (pos === 5) {
        // 中宫特殊处理
        const centerGans = this.calculateCenterGan(hourGan, ganzhi.hour.zhi, isYang);
        this.palaces[index] = {
          position: pos,
          star: '天禽',
          door: '',
          god: '玄武',  // 中宫八神固定为玄武
          gan: centerGans,
          zhi: '辰',    // 中宫地支固定为辰
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

  // 根据局数获取起始位置
  getStartPosition(juNumber) {
    // 一三五局阳顺布，二四六局阴逆布
    const positions = {
      1: 1, // 一局戊寅
      2: 8, // 二局己巳
      3: 3, // 三局庚辰
      4: 4, // 四局辛未
      5: 9, // 五局壬戌
      6: 2  // 六局癸丑
    };
    return positions[juNumber] || 1;
  }

  // 计算值符星
  calculateZhiFuStar(hourGan, juNumber, isYang) {
    const starIndex = BASE_DATA.TIANGAN.indexOf(hourGan);
    const baseStarIndex = (starIndex + juNumber - 1) % 9;
    return this.jiuxing[baseStarIndex];
  }

  // 计算值使门
  calculateZhiShiDoor(hourGan, juNumber, isYang) {
    const doorIndex = BASE_DATA.TIANGAN.indexOf(hourGan);
    const baseDoorIndex = (doorIndex + juNumber - 1) % 8;
    return this.bamen[baseDoorIndex];
  }

  // 分配九星
  distributeStars(zhifuStar, isYang, startPosition) {
    const startIndex = this.jiuxing.indexOf(zhifuStar);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = '天禽'; // 中宫固定为天禽
        continue;
      }
      
      // 根据阴阳遁和起始位置计算偏移
      const offset = this.calculateOffset(i, startPosition, isYang);
      const index = (startIndex + offset) % 8;
      distribution[i] = this.jiuxing[index];
    }
    return distribution;
  }

  // 分配八门
  distributeDoors(zhishiDoor, isYang, startPosition) {
    const startIndex = this.bamen.indexOf(zhishiDoor);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = ''; // 中宫无门
        continue;
      }
      
      const offset = this.calculateOffset(i, startPosition, isYang);
      const index = (startIndex + offset) % 8;
      distribution[i] = this.bamen[index];
    }
    return distribution;
  }

  // 分配八神
  distributeGods(isYang, startPosition) {
    const distribution = new Array(9);
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = '玄武'; // 中宫固定为玄武
        continue;
      }
      
      const offset = this.calculateOffset(i, startPosition, isYang);
      distribution[i] = this.bashen[offset % 8];
    }
    return distribution;
  }

  // 分配天干
  distributeGans(hourGan, isYang, startPosition) {
    const ganIndex = BASE_DATA.TIANGAN.indexOf(hourGan);
    const distribution = new Array(9);
    
    // 三奇六仪排序
    const orderedGans = [...this.sanqi, ...this.liuyi];
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = isYang ? '戊' : '己'; // 中宫天干
        continue;
      }
      
      const offset = this.calculateOffset(i, startPosition, isYang);
      const index = (ganIndex + offset) % 8;
      distribution[i] = orderedGans[index];
    }
    return distribution;
  }

  // 分配地支
  distributeZhis(hourZhi, isYang, startPosition) {
    const zhiIndex = BASE_DATA.DIZHI.indexOf(hourZhi);
    const distribution = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        distribution[i] = '辰'; // 中宫地支固定为辰
        continue;
      }
      
      const offset = this.calculateOffset(i, startPosition, isYang);
      const index = (zhiIndex + offset) % 12;
      distribution[i] = BASE_DATA.DIZHI[index];
    }
    return distribution;
  }

  // 计算偏移量
  calculateOffset(position, startPosition, isYang) {
    if (position === 4) return 0; // 中宫
    
    // 根据阴阳遁确定方向
    const direction = isYang ? 1 : -1;
    
    // 计算当前位置相对于起始位置的偏移
    let offset = ((position - startPosition) * direction + 8) % 8;
    if (offset < 0) offset += 8;
    
    return offset;
  }

  // 计算中宫天干
  calculateCenterGan(hourGan, hourZhi, isYang) {
    // 三奇六仪
    const SANQI = ['乙', '丙', '丁'];
    const LIUYI = ['庚', '辛', '壬', '癸', '戊', '己'];

    // 时干的索引
    const ganIndex = BASE_DATA.TIANGAN.indexOf(hourGan);
    // 时支的索引
    const zhiIndex = BASE_DATA.DIZHI.indexOf(hourZhi);

    // 根据阴阳遁和时干支计算中宫天干
    let firstGan, secondGan;

    if (isYang) {
      firstGan = SANQI[ganIndex % 3];  // 从三奇中选择
      secondGan = LIUYI[zhiIndex % 6]; // 从六仪中选择
    } else {
      firstGan = LIUYI[ganIndex % 6];  // 从六仪中选择
      secondGan = SANQI[zhiIndex % 3]; // 从三奇中选择
    }

    return [firstGan, secondGan];
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

module.exports = RotatingPan;