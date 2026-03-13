import type { RentalTransaction } from '../types';

export const RENTAL_TRANSACTIONS: RentalTransaction[] = [
  // 太古城 — 東區 estate
  { date: '2025-10-08', district: '太古城', building: '太古城中心', categories: ['estate'], unitType: '2房1廁', area: 720,  monthlyRent: 22000 },
  { date: '2025-08-14', district: '太古城', building: '太古城中心', categories: ['estate'], unitType: '1房1廁', area: 510,  monthlyRent: 16500 },
  { date: '2025-06-03', district: '太古城', building: '愛秩序灣',   categories: ['estate'], unitType: '2房1廁', area: 680,  monthlyRent: 20000 },
  { date: '2025-03-19', district: '太古城', building: '太古城中心', categories: ['estate'], unitType: '3房2廁', area: 980,  monthlyRent: 30000 },
  { date: '2024-12-27', district: '太古城', building: '愛秩序灣',   categories: ['estate'], unitType: '1房1廁', area: 490,  monthlyRent: 15800 },
  { date: '2024-10-11', district: '太古城', building: '太古城中心', categories: ['estate'], unitType: '2房1廁', area: 700,  monthlyRent: 21000 },
  { date: '2024-07-22', district: '太古城', building: '太古灣',     categories: ['estate'], unitType: '開放式', area: 320,  monthlyRent: 11500 },

  // 西貢 — village
  { date: '2025-09-25', district: '西貢',   building: '西貢村屋',   categories: ['village'], unitType: '3房2廁', area: 1800, monthlyRent: 28000 },
  { date: '2025-07-10', district: '西貢',   building: '清水灣村屋', categories: ['village'], unitType: '3房2廁', area: 1650, monthlyRent: 26000 },
  { date: '2025-04-18', district: '西貢',   building: '西貢村屋',   categories: ['village'], unitType: '2房1廁', area: 1200, monthlyRent: 20000 },
  { date: '2025-01-30', district: '西貢',   building: '坑口村屋',   categories: ['village'], unitType: '3房2廁', area: 1700, monthlyRent: 24000 },
  { date: '2024-11-05', district: '西貢',   building: '清水灣村屋', categories: ['village'], unitType: '2房1廁', area: 1100, monthlyRent: 18500 },
  { date: '2024-08-20', district: '西貢',   building: '坑口村屋',   categories: ['village'], unitType: '4房2廁', area: 2200, monthlyRent: 35000 },

  // 山頂 — 中西區 luxury
  { date: '2025-10-01', district: '山頂',   building: '天比高',     categories: ['luxury'], unitType: '4房3廁', area: 3200, monthlyRent: 85000 },
  { date: '2025-07-28', district: '山頂',   building: '環翠園',     categories: ['luxury'], unitType: '3房2廁', area: 2400, monthlyRent: 65000 },
  { date: '2025-05-12', district: '山頂',   building: '天比高',     categories: ['luxury'], unitType: '4房3廁', area: 3000, monthlyRent: 80000 },
  { date: '2025-02-06', district: '山頂',   building: '山頂道別墅', categories: ['luxury'], unitType: '5房4廁', area: 4500, monthlyRent: 120000 },
  { date: '2024-11-19', district: '山頂',   building: '環翠園',     categories: ['luxury'], unitType: '3房2廁', area: 2200, monthlyRent: 60000 },
  { date: '2024-09-03', district: '山頂',   building: '天比高',     categories: ['luxury'], unitType: '4房3廁', area: 3100, monthlyRent: 82000 },

  // 旺角 — 油尖旺 tong
  { date: '2025-10-12', district: '旺角',   building: '旺角唐樓',   categories: ['tong'], unitType: '開放式', area: 280,  monthlyRent: 8500  },
  { date: '2025-08-01', district: '旺角',   building: '旺角唐樓',   categories: ['tong'], unitType: '1房1廁', area: 380,  monthlyRent: 11000 },
  { date: '2025-05-20', district: '旺角',   building: '亞皆老街唐樓', categories: ['tong'], unitType: '開放式', area: 260,  monthlyRent: 8000  },
  { date: '2025-02-14', district: '旺角',   building: '洗衣街唐樓', categories: ['tong'], unitType: '1房1廁', area: 350,  monthlyRent: 10500 },
  { date: '2024-12-09', district: '旺角',   building: '旺角唐樓',   categories: ['tong'], unitType: '2房1廁', area: 480,  monthlyRent: 14000 },
  { date: '2024-09-28', district: '旺角',   building: '亞皆老街唐樓', categories: ['tong'], unitType: '開放式', area: 255,  monthlyRent: 7800  },

  // 將軍澳 — estate
  { date: '2025-09-18', district: '將軍澳', building: '日出康城',   categories: ['estate'], unitType: '1房1廁', area: 430,  monthlyRent: 14500 },
  { date: '2025-07-05', district: '將軍澳', building: '日出康城',   categories: ['estate'], unitType: '2房1廁', area: 620,  monthlyRent: 19000 },
  { date: '2025-04-22', district: '將軍澳', building: '新都城',     categories: ['estate'], unitType: '1房1廁', area: 400,  monthlyRent: 13500 },
  { date: '2025-01-08', district: '將軍澳', building: '新都城',     categories: ['estate'], unitType: '2房1廁', area: 590,  monthlyRent: 17500 },
  { date: '2024-10-30', district: '將軍澳', building: '日出康城',   categories: ['estate'], unitType: '3房2廁', area: 820,  monthlyRent: 25000 },
  { date: '2024-08-15', district: '將軍澳', building: '維景灣畔',   categories: ['estate'], unitType: '1房1廁', area: 420,  monthlyRent: 14000 },

  // 半山 — 中西區 luxury
  { date: '2025-10-05', district: '半山',   building: '干德道豪宅', categories: ['luxury'], unitType: '3房2廁', area: 1650, monthlyRent: 62000 },
  { date: '2025-08-22', district: '半山',   building: '嘉富麗苑',   categories: ['luxury'], unitType: '2房2廁', area: 1100, monthlyRent: 42000 },
  { date: '2025-06-09', district: '半山',   building: '干德道豪宅', categories: ['luxury'], unitType: '4房3廁', area: 2200, monthlyRent: 85000 },
  { date: '2025-03-27', district: '半山',   building: '嘉富麗苑',   categories: ['luxury'], unitType: '3房2廁', area: 1550, monthlyRent: 58000 },
  { date: '2024-12-14', district: '半山',   building: '羅便臣道大廈', categories: ['luxury'], unitType: '2房1廁', area: 980,  monthlyRent: 38000 },
  { date: '2024-10-01', district: '半山',   building: '干德道豪宅', categories: ['luxury'], unitType: '3房2廁', area: 1600, monthlyRent: 60000 },

  // 沙田 — estate
  { date: '2025-09-29', district: '沙田',   building: '第一城',     categories: ['estate'], unitType: '2房1廁', area: 580,  monthlyRent: 16800 },
  { date: '2025-07-17', district: '沙田',   building: '第一城',     categories: ['estate'], unitType: '1房1廁', area: 410,  monthlyRent: 12500 },
  { date: '2025-04-04', district: '沙田',   building: '沙田第一城', categories: ['estate'], unitType: '3房2廁', area: 820,  monthlyRent: 22000 },
  { date: '2025-01-21', district: '沙田',   building: '廣源邨',     categories: ['estate'], unitType: '2房1廁', area: 540,  monthlyRent: 15000 },
  { date: '2024-11-08', district: '沙田',   building: '第一城',     categories: ['estate'], unitType: '2房1廁', area: 570,  monthlyRent: 16000 },
  { date: '2024-08-26', district: '沙田',   building: '廣源邨',     categories: ['estate'], unitType: '1房1廁', area: 395,  monthlyRent: 12000 },

  // 大埔 — house
  { date: '2025-10-10', district: '大埔',   building: '大埔獨立屋', categories: ['house'], unitType: '4房2廁', area: 2400, monthlyRent: 38000 },
  { date: '2025-08-04', district: '大埔',   building: '大埔獨立屋', categories: ['house'], unitType: '3房2廁', area: 1800, monthlyRent: 28000 },
  { date: '2025-05-29', district: '大埔',   building: '汀角路村屋', categories: ['house'], unitType: '3房2廁', area: 1750, monthlyRent: 26000 },
  { date: '2025-02-16', district: '大埔',   building: '汀角路村屋', categories: ['house'], unitType: '4房3廁', area: 2200, monthlyRent: 34000 },
  { date: '2024-12-03', district: '大埔',   building: '大埔獨立屋', categories: ['house'], unitType: '3房2廁', area: 1900, monthlyRent: 30000 },
  { date: '2024-09-17', district: '大埔',   building: '汀角路村屋', categories: ['house'], unitType: '2房1廁', area: 1200, monthlyRent: 20000 },
];
