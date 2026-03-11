// Hong Kong school net lookup by district (mapLoc key)
// 小學校網: EDB primary school placement nets
// 中學校網: 18-district secondary school allocation districts

export const PRIMARY_SCHOOL_NET: Record<string, string> = {
  '太古城': '第14組',   // 東區
  '西貢':   '第95組',   // 西貢區
  '山頂':   '第11組',   // 中西區
  '旺角':   '第31組',   // 油尖旺區
  '將軍澳': '第95組',   // 西貢區
  '半山':   '第11組',   // 中西區
  '沙田':   '第89組',   // 沙田區
  '大埔':   '第84組',   // 大埔區
};

export const SECONDARY_SCHOOL_NET: Record<string, string> = {
  '太古城': '東區',
  '西貢':   '西貢區',
  '山頂':   '中西區',
  '旺角':   '油尖旺區',
  '將軍澳': '西貢區',
  '半山':   '中西區',
  '沙田':   '沙田區',
  '大埔':   '大埔區',
};
