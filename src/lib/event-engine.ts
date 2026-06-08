// lib/event-engine.ts — 从 v1 utils/eventEngine.js 迁移的纯 TS 版本
// 不依赖任何 wx API，完全浏览器兼容

export interface StatEffects { duration: number; stability: number; fun: number }
export interface Choice {
  id: string; text: string; description: string
  statEffects: StatEffects; scoreBonus: number
}
export interface GameEvent {
  id: string; title: string; description: string
  type: 'weather' | 'obstacle' | 'emergency' | 'opportunity'
  choices: Choice[]
}
export interface FlightScores { braveIndex: number; creativeIndex: number; stableIndex: number; funIndex: number }
export interface ChoiceResult {
  eventId: string; eventTitle: string; choiceId: string; choiceText: string
  customText: string | null; statEffects: StatEffects; scoreBonus: number
  narration: string; remainingBattery: number; remainingEvents: number
}

// ===== 状态 =====
let currentBattery = 100
let maxEvents = 6
let eventHistory: Array<{ event: GameEvent; choice: Choice; isCustom?: boolean }> = []
let flightScores: FlightScores = { braveIndex: 0, creativeIndex: 0, stableIndex: 0, funIndex: 0 }

// ===== 26 个备用事件 =====
const FALLBACKS: GameEvent[] = [
  { id: 'weather_1', title: '阵风突袭', description: '突然一阵强风袭来', type: 'weather', choices: [
    { id: 's_a', text: '稳住飞行', description: '调整姿态对抗', statEffects: { duration: -5, stability: 5, fun: 5 }, scoreBonus: 5 },
    { id: 's_b', text: '借风滑行', description: '顺势而为省电', statEffects: { duration: 5, stability: -5, fun: 10 }, scoreBonus: 10 }] },
  { id: 'weather_2', title: '暴雨突降', description: '天空突然下起暴雨', type: 'weather', choices: [
    { id: 's_a', text: '寻找避雨', description: '在屋檐下暂避', statEffects: { duration: -3, stability: 8, fun: 0 }, scoreBonus: 5 },
    { id: 's_b', text: '雨中飞行', description: '测试防水性能', statEffects: { duration: -12, stability: -5, fun: 15 }, scoreBonus: 12 }] },
  { id: 'weather_3', title: '大雾弥漫', description: '浓雾覆盖了整个区域', type: 'weather', choices: [
    { id: 's_a', text: '降低高度', description: '到低空避开浓雾', statEffects: { duration: -5, stability: 5, fun: 0 }, scoreBonus: 5 },
    { id: 's_b', text: '盲飞穿越', description: '靠仪表飞行', statEffects: { duration: -8, stability: -8, fun: 12 }, scoreBonus: 8 }] },
  { id: 'weather_4', title: '夕阳眩光', description: '夕阳恰好直射镜头', type: 'weather', choices: [
    { id: 's_a', text: '调转方向', description: '避开强光角度', statEffects: { duration: -5, stability: 3, fun: 5 }, scoreBonus: 5 },
    { id: 's_b', text: '逆光拍摄', description: '利用光晕出片', statEffects: { duration: -3, stability: -5, fun: 20 }, scoreBonus: 15 }] },
  { id: 'obstacle_1', title: '飞鸟接近', description: '一只鸟好奇地靠近', type: 'obstacle', choices: [
    { id: 'o_a', text: '保持距离', description: '安全绕开', statEffects: { duration: -5, stability: 5, fun: 0 }, scoreBonus: 5 },
    { id: 'o_b', text: '靠近观察', description: '有趣但有风险', statEffects: { duration: 0, stability: -5, fun: 15 }, scoreBonus: 10 }] },
  { id: 'obstacle_2', title: '树枝拦路', description: '前方有伸出的树枝', type: 'obstacle', choices: [
    { id: 'o_a', text: '绕行避让', description: '从旁边绕过去', statEffects: { duration: -8, stability: 5, fun: 0 }, scoreBonus: 5 },
    { id: 'o_b', text: '俯冲穿过', description: '从树枝下方穿过', statEffects: { duration: -3, stability: -8, fun: 10 }, scoreBonus: 10 }] },
  { id: 'obstacle_3', title: '风筝靠近', description: '一个断了线的风筝飘来', type: 'obstacle', choices: [
    { id: 'o_a', text: '紧急避让', description: '快速规避', statEffects: { duration: -8, stability: 3, fun: 0 }, scoreBonus: 5 },
    { id: 'o_b', text: '帮忙回收', description: '用飞行器钩住风筝', statEffects: { duration: -15, stability: -5, fun: 18 }, scoreBonus: 15 }] },
  { id: 'obstacle_4', title: '电线纵横', description: '前方区域有许多电线', type: 'obstacle', choices: [
    { id: 'o_a', text: '绕道而行', description: '找安全的路线', statEffects: { duration: -12, stability: 8, fun: 0 }, scoreBonus: 5 },
    { id: 'o_b', text: '精准穿梭', description: '在电线间隙穿行', statEffects: { duration: -5, stability: -10, fun: 15 }, scoreBonus: 12 }] },
  { id: 'obstacle_5', title: '小孩围观', description: '一群小孩好奇地围观', type: 'obstacle', choices: [
    { id: 'o_a', text: '保持高度', description: '飞高一点避让', statEffects: { duration: -3, stability: 5, fun: 0 }, scoreBonus: 5 },
    { id: 'o_b', text: '展示特技', description: '表演一下吸引小孩', statEffects: { duration: -8, stability: -3, fun: 18 }, scoreBonus: 12 }] },
  { id: 'emergency_1', title: '信号微弱', description: '控制信号不太稳定', type: 'emergency', choices: [
    { id: 'e_a', text: '降低高度', description: '改善信号质量', statEffects: { duration: -8, stability: 5, fun: -5 }, scoreBonus: 0 },
    { id: 'e_b', text: '增强信号', description: '消耗更多电量', statEffects: { duration: -15, stability: 10, fun: 5 }, scoreBonus: 5 }] },
  { id: 'emergency_2', title: '电量告急', description: '电量已经低于 20%', type: 'emergency', choices: [
    { id: 'e_a', text: '立即返航', description: '安全第一', statEffects: { duration: -5, stability: 8, fun: 0 }, scoreBonus: 0 },
    { id: 'e_b', text: '坚持任务', description: '赌一把能撑到最后', statEffects: { duration: -20, stability: -5, fun: 12 }, scoreBonus: 10 }] },
  { id: 'emergency_3', title: '电机异响', description: '电机发出异常噪音', type: 'emergency', choices: [
    { id: 'e_a', text: '减速检查', description: '降低转速排查', statEffects: { duration: -10, stability: 10, fun: 0 }, scoreBonus: 0 },
    { id: 'e_b', text: '强行继续', description: '赌一把没问题', statEffects: { duration: -8, stability: -12, fun: 8 }, scoreBonus: 8 }] },
  { id: 'emergency_4', title: '摄像头模糊', description: '镜头被水雾遮挡', type: 'emergency', choices: [
    { id: 'e_a', text: '降落清洁', description: '清理后继续', statEffects: { duration: -12, stability: 8, fun: 0 }, scoreBonus: 3 },
    { id: 'e_b', text: '盲飞继续', description: '凭感觉完成', statEffects: { duration: -5, stability: -10, fun: 10 }, scoreBonus: 8 }] },
  { id: 'opp_1', title: '绝美景色', description: '前方出现绝美的日落景色', type: 'opportunity', choices: [
    { id: 'p_a', text: '停下拍摄', description: '记录这美丽一刻', statEffects: { duration: -5, stability: 3, fun: 15 }, scoreBonus: 10 },
    { id: 'p_b', text: '加速赶路', description: '任务优先', statEffects: { duration: 3, stability: 5, fun: -5 }, scoreBonus: 0 }] },
  { id: 'opp_2', title: '热源信号', description: '热成像仪发现异常热源', type: 'opportunity', choices: [
    { id: 'p_a', text: '前往查看', description: '看看有什么', statEffects: { duration: -10, stability: 0, fun: 20 }, scoreBonus: 12 },
    { id: 'p_b', text: '忽略信号', description: '专注当前任务', statEffects: { duration: 0, stability: 5, fun: 0 }, scoreBonus: 3 }] },
  { id: 'opp_3', title: '顺风气流', description: '出现一股强劲的顺风', type: 'opportunity', choices: [
    { id: 'p_a', text: '借风加速', description: '省电又快速', statEffects: { duration: 10, stability: 3, fun: 5 }, scoreBonus: 8 },
    { id: 'p_b', text: '谨慎飞行', description: '保持现有速度', statEffects: { duration: -3, stability: 8, fun: 0 }, scoreBonus: 5 }] },
  { id: 'opp_4', title: '发现捷径', description: '发现一条更快的路线', type: 'opportunity', choices: [
    { id: 'p_a', text: '走捷径', description: '节省时间但未知', statEffects: { duration: 5, stability: -5, fun: 8 }, scoreBonus: 8 },
    { id: 'p_b', text: '按计划走', description: '稳妥但更慢', statEffects: { duration: -8, stability: 8, fun: 0 }, scoreBonus: 5 }] },
  { id: 'opp_5', title: '遇见同行', description: '遇到另一个飞手在操作飞行器', type: 'opportunity', choices: [
    { id: 'p_a', text: '组队飞行', description: '一起完成任务', statEffects: { duration: -5, stability: 5, fun: 12 }, scoreBonus: 10 },
    { id: 'p_b', text: '独自行动', description: '专注自己的任务', statEffects: { duration: 0, stability: 5, fun: 0 }, scoreBonus: 3 }] },
  { id: 'opp_6', title: '飘落花瓣', description: '樱花飘落在航线周围', type: 'opportunity', choices: [
    { id: 'p_a', text: '穿过花雨', description: '拍一段唯美视频', statEffects: { duration: -5, stability: -3, fun: 22 }, scoreBonus: 15 },
    { id: 'p_b', text: '绕道避开', description: '避免花粉影响镜头', statEffects: { duration: -5, stability: 5, fun: 0 }, scoreBonus: 3 }] },
]

export const EventEngine = {
  initFlightSession(stats: { duration?: number; stability?: number; fun?: number }, selectedModules: string[]) {
    currentBattery = stats.duration ?? 50
    maxEvents = selectedModules.includes('bigBattery') ? 6 : 5
    eventHistory = []
    flightScores = { braveIndex: 0, creativeIndex: 0, stableIndex: 0, funIndex: 0 }
  },

  getCurrentBattery() { return currentBattery },
  getRemainingEvents() { return maxEvents - eventHistory.length },
  getFlightScores(): FlightScores { return { ...flightScores } },
  getEventHistory() { return eventHistory },

  getStartingEvent(_taskName?: string): GameEvent {
    eventHistory = []
    return this.getFallbackEvent()
  },

  getNextEvent(_context?: any, _eventIndex?: number, _isFinal?: boolean): GameEvent {
    return this.getFallbackEvent()
  },

  getFallbackEvent(): GameEvent {
    const used = eventHistory.map((h) => h.event.id)
    const fresh = FALLBACKS.filter((f) => !used.includes(f.id))
    const pool = fresh.length >= 2 ? fresh : FALLBACKS
    return pool[Math.floor(Math.random() * pool.length)]
  },

  processChoice(event: GameEvent, choiceId: string, customText?: string, _currentStats?: any): ChoiceResult | null {
    let choice = event.choices[0] // fallback to choice A
    let isCustom = false

    if (choiceId === 'custom' || choiceId === 'custom_input') {
      choice = { id: 'custom', text: customText || '自由发挥', description: '自定义行动', statEffects: { duration: -8, stability: 0, fun: 10 }, scoreBonus: 8 }
      isCustom = true
    } else {
      const found = event.choices.find((c) => c.id === choiceId)
      if (!found) return null
      choice = found
    }

    currentBattery = Math.max(0, currentBattery + choice.statEffects.duration)

    // 更新多维评分
    if ((choice.statEffects.stability ?? 0) < -5 || choice.scoreBonus > 10) flightScores.braveIndex += Math.abs(choice.statEffects.stability ?? 0) > 8 ? 3 : 1
    if ((choice.statEffects.fun ?? 0) > 10) flightScores.creativeIndex += 2
    else if ((choice.statEffects.fun ?? 0) > 5) flightScores.creativeIndex += 1
    if ((choice.statEffects.stability ?? 0) > 5) flightScores.stableIndex += 1
    flightScores.funIndex += Math.max(0, choice.scoreBonus)
    flightScores.braveIndex = Math.min(100, flightScores.braveIndex)
    flightScores.creativeIndex = Math.min(100, flightScores.creativeIndex)
    flightScores.stableIndex = Math.min(100, flightScores.stableIndex)
    flightScores.funIndex = Math.min(100, flightScores.funIndex)

    eventHistory.push({ event, choice, isCustom })

    return {
      eventId: event.id, eventTitle: event.title,
      choiceId: choice.id, choiceText: choice.text,
      customText: isCustom ? (customText || null) : null,
      statEffects: choice.statEffects, scoreBonus: choice.scoreBonus,
      narration: `你选择了"${choice.text}"${currentBattery <= 30 ? '，电量告急！' : ''}`,
      remainingBattery: currentBattery,
      remainingEvents: maxEvents - eventHistory.length,
    }
  },
}

export function isBatteryDepleted() { return currentBattery <= 0 }
export function getMaxEvents() { return maxEvents }
export function getEventIndex() { return eventHistory.length }
