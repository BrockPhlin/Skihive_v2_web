// 12 种飞手人格 — 从 v1 utils/personality.js 迁移
export const PERSONALITIES: Record<string, string> = {
  '追光狂 LIGHT-HUNT': '黑夜也挡不住你追光的心',
  '送达王 DROP-MAX': '稳稳送到，使命必达',
  '戏精机长 DRAMA-PILOT': '一个普通任务都能拍成预告片',
  '稳如老狗 SAFE-DOG': '安全第一，稳得一批',
  '社牛飞手 CROWD-LOVER': '人越多飞得越嗨',
  '猫派救援师 CAT-SAVER': '为了一只猫可以飞到天涯海角',
  '乱飞艺术家 CHAOS-AIR': '没有航线就是最好的航线',
  '夜游人 NIGHT-GOGO': '夜深了才是你的主场',
  '浪漫病 LOVE-DROP': '飞行器也能制造浪漫',
  '赌命飞手 RISK-ONE': '续航低也要飞出精彩',
  '收藏癖 SHOT-HOARDER': '续航够长才能拍个够',
  '脑洞怪 WTF-AIR': '没有人知道你下一秒要干嘛',
}

export function computePersonality(stats: { duration?: number; stability?: number; fun?: number } | null, taskName?: string): string {
  if (!stats) return '脑洞怪 WTF-AIR'
  const d = stats.duration ?? 0
  const s = stats.stability ?? 0
  const f = stats.fun ?? 0
  const isNightTask = taskName?.includes('夜') || taskName?.includes('夜间')

  if (isNightTask && f > 60) return '追光狂 LIGHT-HUNT'
  if (taskName && (taskName.includes('外卖') || taskName.includes('奶茶') || taskName.includes('物资'))) {
    if (s > 60) return '送达王 DROP-MAX'
  }
  if (f > 70) return '戏精机长 DRAMA-PILOT'
  if (s > 70 && d > 60) return '稳如老狗 SAFE-DOG'
  if (f > 50 && isNightTask) return '夜游人 NIGHT-GOGO'
  if (taskName?.includes('猫')) return '猫派救援师 CAT-SAVER'
  if (f > 80) return '乱飞艺术家 CHAOS-AIR'
  if (taskName && (taskName.includes('浪漫') || taskName.includes('告白'))) return '浪漫病 LOVE-DROP'
  if (d < 40 && f > 50) return '赌命飞手 RISK-ONE'
  if (d > 80) return '收藏癖 SHOT-HOARDER'

  return '脑洞怪 WTF-AIR'
}
