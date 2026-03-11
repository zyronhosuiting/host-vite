import type { ListingExtra } from '../types';

const detailExtras: Record<number, ListingExtra> = {
  1: {
    area: 720, beds: 2, baths: 1,
    propertyType: '私人屋苑', leaseTerm: '12個月',
    desc: '太古城中心高層單位，座向開揚，室內裝修簇新，廚房及浴室均經翻新。步行5分鐘到太古地鐵站，商場、超市、餐廳一應俱全。業主誠意放租，歡迎預約睇樓。',
    features: [
      '業主直租 — 免佣金，直接與業主聯絡',
      '全新裝修 — 廚房及浴室均於2024年翻新',
      '交通便利 — 步行5分鐘到太古地鐵站',
    ],
    amenities: ['elevator', 'security', 'gym'],
  },
  2: {
    area: 1800, beds: 3, baths: 2,
    propertyType: '村屋', leaseTerm: '12個月',
    desc: '西貢三層村屋，連私人花園及車位，環境清幽，海風習習。頂層設開放式天台，可遠眺西貢海景。適合喜愛郊外生活的家庭，附近有超市、街市及多間特色海鮮餐廳。',
    features: [
      '連私人車位 — 車位已包含於租金內',
      '三層村屋 — 每層獨立起居空間',
      '近西貢市中心 — 駕車約5分鐘',
    ],
    amenities: ['parking', 'balcony', 'pets'],
  },
  3: {
    area: 3200, beds: 4, baths: 3,
    propertyType: '豪宅', leaseTerm: '24個月',
    desc: '山頂稀有獨立洋房，坐擁360度全海景，室內設私人泳池、健身室及娛樂室。高端智能家居系統，進口廚具，管家服務可按需安排。極罕見盤源，適合追求頂級生活品味之人士。',
    features: [
      '私人泳池 — 室內恆溫泳池',
      '全景視野 — 維港、南丫島一覽無遺',
      '豪華裝修 — 意大利進口大理石地台',
    ],
    amenities: ['pool', 'gym', 'security', 'parking', 'balcony'],
  },
  4: {
    area: 280, beds: 0, baths: 1,
    propertyType: '唐樓', leaseTerm: '12個月',
    desc: '旺角鬧市中心唐樓開放式單位，裝修整潔，傢俬電器齊備，即租即住。步行1分鐘到旺角地鐵站，生活配套極方便。適合單身人士或學生。',
    features: [
      '即租即住 — 傢俬電器全包',
      '地鐵一分鐘 — 旺角站A出口',
      '生活便利 — 樓下便利店及茶餐廳',
    ],
    amenities: ['elevator'],
  },
  5: {
    area: 430, beds: 1, baths: 1,
    propertyType: '私人屋苑', leaseTerm: '12個月',
    desc: '日出康城Phase 1一房一廳，高層海景，裝修時尚，廚房採開放式設計。屋苑設會所、泳池、健身室等豐富設施，鄰近將軍澳地鐵站，交通方便。',
    features: [
      '高層海景 — 清水灣海景無遮擋',
      '會所設施 — 泳池、健身室、兒童遊樂場',
      '近地鐵站 — 步行8分鐘到將軍澳站',
    ],
    amenities: ['elevator', 'pool', 'gym', 'security'],
  },
  6: {
    area: 1650, beds: 3, baths: 2,
    propertyType: '豪宅', leaseTerm: '24個月',
    desc: '半山高層三房大宅，維港全景一覽無遺，裝修豪華，主人套房設步入式衣帽間及浴缸。24小時保安及禮賓服務，名校網覆蓋，適合外籍家庭入住。',
    features: [
      '維港全景 — 270°開揚景觀',
      '頂級裝修 — 意大利廚具，智能系統',
      '名校網 — 近多間國際學校',
    ],
    amenities: ['elevator', 'security', 'gym', 'parking'],
  },
  7: {
    area: 580, beds: 2, baths: 1,
    propertyType: '私人屋苑', leaseTerm: '12個月',
    desc: '沙田第一城中層兩房，實用靚則，採光充足，窗外對翠綠山景。屋苑管理完善，會所設施齊全，鄰近沙田火車站及新城市廣場，生活配套極佳。',
    features: [
      '實用靚則 — 方正格局，空間感強',
      '山景單位 — 對翠綠山景，環境清幽',
      '近火車站 — 步行5分鐘到沙田站',
    ],
    amenities: ['elevator', 'security', 'gym', 'pool'],
  },
  8: {
    area: 2400, beds: 4, baths: 2,
    propertyType: '獨立屋', leaseTerm: '24個月',
    desc: '大埔三層獨立屋，連私人花園及車位，環境清幽，附近有大埔墟街市及大型超市。距大埔墟火車站約10分鐘步行，適合喜愛新界生活的大家庭。',
    features: [
      '私人花園 — 約400呎花園，可舉辦戶外活動',
      '四房大宅 — 適合三代同堂家庭',
      '連車位 — 可停泊兩部私家車',
    ],
    amenities: ['parking', 'balcony', 'pets'],
  },
};

export default detailExtras;
