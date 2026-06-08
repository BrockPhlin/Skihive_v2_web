// 装配数据 — 从 v1 packageA/pages/assembly/assembly.js 迁移
// stats: { duration, 稳定性, fun } 影响最终飞行评分

export interface Module {
  id: string; name: string; icon: string
  stats: { duration: number; 稳定性: number; fun: number }
  description: string; tip: string
}

export interface Body {
  id: string; name: string; icon: string
  stats: { duration: number; 稳定性: number; fun: number }
  description: string; tip: string
}

export interface Shell { id: string; name: string; icon: string; stats: { duration: number; 稳定性: number; fun: number }; description: string; tip: string }
export interface Color { id: string; name: string; color: string; description: string }
export interface Accessory { id: string; name: string; icon: string; stats: { duration: number; 稳定性: number; fun: number }; description: string; tip: string }

export const MODULES: Module[] = [
  { id: "bigBattery", name: "大电池", icon: "🔋", stats: { duration: 30, 稳定性: 5, fun: 10 }, description: "容量大幅提升，续航时间延长50%", tip: "配送/运输任务必选，避免中途没电" },
  { id: "nightCamera", name: "夜拍相机", icon: "📷", stats: { duration: -5, 稳定性: 0, fun: 25 }, description: "配备星光级传感器，暗光环境也能拍出清晰画面", tip: "夜景/跟拍必备" },
  { id: "gimbal", name: "云台稳定器", icon: "🎯", stats: { duration: -10, 稳定性: 30, fun: 15 }, description: "三轴机械云台，飞行中画面始终平稳", tip: "视频拍摄首选" },
  { id: "cargo", name: "小货仓", icon: "📦", stats: { duration: -15, 稳定性: 10, fun: 20 }, description: "可承载500g物品，配备减震托盘", tip: "外卖/快递核心装备" },
  { id: "searchLight", name: "探照灯", icon: "🔦", stats: { duration: -10, 稳定性: 5, fun: 20 }, description: "1000流明亮度，50米范围", tip: "夜间/搜救/探索首选" },
  { id: "grabClaw", name: "抓取爪", icon: "🦷", stats: { duration: -15, 稳定性: -5, fun: 30 }, description: "液压驱动，可抓取不超过300g的物品", tip: "救援/特殊投递关键" },
  { id: "speaker", name: "扬声器", icon: "🔊", stats: { duration: -5, 稳定性: 0, fun: 25 }, description: "50W大功率音箱，支持语音播报", tip: "娱乐/告白场景道具" },
  { id: "moodLight", name: "情绪灯带", icon: "💡", stats: { duration: -5, 稳定性: 5, fun: 30 }, description: "RGB氛围灯带，1600万种颜色", tip: "浪漫/表演氛围神器" },
  { id: "thermalCam", name: "热成像仪", icon: "🌡️", stats: { duration: -12, 稳定性: 0, fun: 15 }, description: "红外热成像，探测生命体征", tip: "搜救/夜间巡逻专业设备" },
  { id: "radar", name: "避障雷达", icon: "📡", stats: { duration: -8, 稳定性: 20, fun: 5 }, description: "360度全方位探测，自动绕行障碍", tip: "复杂环境安全保证" },
  { id: "relayStation", name: "信号中继", icon: "📶", stats: { duration: -10, 稳定性: 15, fun: 10 }, description: "增强信号覆盖，穿墙能力提升300%", tip: "超视距任务必备" },
  { id: "homingBeacon", name: "归航信标", icon: "🏠", stats: { duration: -5, 稳定性: 25, fun: 5 }, description: "精准定位，一键自动返航", tip: "新手必备" },
]

export const BODIES: Body[] = [
  { id: "airLite", name: "Air Lite", icon: "🛸", stats: { duration: 10, 稳定性: 5, fun: 5 }, description: "轻量化设计，机身仅重250g，续航能力出色", tip: "适合日常任务，新手友好" },
  { id: "speedBee", name: "Speed Bee", icon: "🐝", stats: { duration: -10, 稳定性: -5, fun: 15 }, description: "竞速型飞行器，最高时速可达80km/h", tip: "追求速度和刺激的用户首选" },
  { id: "stablePro", name: "Stable Pro", icon: "🛡️", stats: { duration: 5, 稳定性: 15, fun: 0 }, description: "专业级稳定架构，抗风能力7级", tip: "恶劣天气、追求稳定首选" },
  { id: "stealthX", name: "Stealth X", icon: "🦇", stats: { duration: 0, 稳定性: 10, fun: 10 }, description: "静音设计，噪声低于45分贝", tip: "夜间巡逻/博物馆等安静场所" },
  { id: "megaCarrier", name: "Mega Carrier", icon: "🚁", stats: { duration: -15, 稳定性: 5, fun: 5 }, description: "大型运输机型，载重能力2kg", tip: "大型物资运输/货运" },
]

export const SHELLS: Shell[] = [
  { id: "round", name: "圆润治愈壳", icon: "🫧", stats: { duration: 0, 稳定性: 5, fun: 10 }, description: "流线型圆润设计，触感细腻", tip: "适合温柔、治愈系任务" },
  { id: "speed", name: "流线速度壳", icon: "⚡", stats: { duration: -5, 稳定性: 5, fun: 10 }, description: "风洞测试优化，风阻降低40%", tip: "高速任务、竞赛首选" },
  { id: "tech", name: "城市科技壳", icon: "🏙️", stats: { duration: 0, 稳定性: 5, fun: 5 }, description: "赛博朋克风格，霓虹灯效", tip: "城市任务、科技展" },
  { id: "bio", name: "仿生生物壳", icon: "🦋", stats: { duration: -5, 稳定性: 0, fun: 15 }, description: "模拟生物形态，自然伪装", tip: "野外拍摄、观察任务" },
  { id: "stealth", name: "隐形外壳", icon: "👻", stats: { duration: -3, 稳定性: 8, fun: 5 }, description: "哑光材质，减少雷达反射", tip: "秘密任务、巡逻任务" },
  { id: "armor", name: "防护装甲", icon: "🛡️", stats: { duration: -8, 稳定性: 15, fun: 0 }, description: "钛合金加强结构，抗冲击", tip: "恶劣环境、危险任务" },
]

export const COLORS: Color[] = [
  { id: "cityWhite", name: "城市白", color: "#f5f5f5", description: "简洁干净" },
  { id: "nightBlack", name: "夜行黑", color: "#1a1a1a", description: "神秘酷炫" },
  { id: "sageGreen", name: "鼠尾草绿", color: "#9dc183", description: "自然柔和" },
  { id: "desertOrange", name: "沙漠橙", color: "#e8a87c", description: "温暖活力" },
  { id: "glacierBlue", name: "冰川蓝", color: "#a8d8ea", description: "清爽科技" },
  { id: "sunsetPink", name: "落日粉", color: "#ffb7c5", description: "浪漫温馨" },
  { id: "midnightPurple", name: "午夜紫", color: "#4a3f6b", description: "神秘高贵" },
]

export const ACCESSORIES: Accessory[] = [
  { id: "lightStrip", name: "灯带", icon: "💫", stats: { duration: -5, 稳定性: 0, fun: 15 }, description: "RGB灯带，飞行中留下光轨", tip: "表演/告白氛围加成" },
  { id: "charm", name: "小挂件", icon: "🎀", stats: { duration: 0, 稳定性: 0, fun: 10 }, description: "可爱装饰，个性展示", tip: "增加趣味性" },
  { id: "guard", name: "护圈", icon: "⭕", stats: { duration: 0, 稳定性: 10, fun: 0 }, description: "环形保护架，防止碰撞", tip: "新手保护、复杂环境" },
  { id: "wing", name: "尾翼", icon: "✈️", stats: { duration: -5, 稳定性: 5, fun: 10 }, description: "空气动力学尾翼", tip: "高速飞行稳定加成" },
  { id: "antenna", name: "高增益天线", icon: "📶", stats: { duration: -3, 稳定性: 8, fun: 5 }, description: "增强信号接收", tip: "远距离任务信号保障" },
  { id: "mirror", name: "镜面贴片", icon: "🪞", stats: { duration: 0, 稳定性: 0, fun: 15 }, description: "镜面反光效果，闪耀全场", tip: "表演、吸引眼球" },
]

export const FEEDBACKS: Record<string, string> = {
  bigBattery: "续航给力，安全感满满",
  nightCamera: "今晚很适合出片",
  gimbal: "稳得一批，画面不抖",
  cargo: "这台一看就很能送",
  searchLight: "夜里会很有安全感",
  grabClaw: "抓取小能手上线",
  speaker: "能唱歌的飞行器诶",
  moodLight: "这台开始有点招人喜欢了",
  round: "圆润圆润，看着就治愈",
  speed: "看着就很想飞快一点",
  tech: "科技感拉满，很酷",
  bio: "仿生设计，有点可爱",
  cityWhite: "城市白，很干净",
  nightBlack: "夜行黑，神秘感十足",
  sageGreen: "有点温柔，好看",
  desertOrange: "沙漠橙，暖洋洋的",
  glacierBlue: "冰川蓝，清爽",
  lightStrip: "灯带一装，炫酷加倍",
  charm: "小挂件可可爱爱",
  guard: "护圈加装，安全放心",
  wing: "尾翼有点帅",
}

// 远程图片 — 24 个具名 + 13 个旧版
const IMG_BASE = "https://link.jiyiho.cn/orfile/view.php"
export const ASSEMBLY_IMAGES: Record<string, string> = {
  "1_1": `${IMG_BASE}/81bc1ecc1b0285ceb324341263403f06.png`,
  "1_2": `${IMG_BASE}/f6dac7380327f245144d4101d5ecf9f4.png`,
  "1_3": `${IMG_BASE}/b984fbd2c3d1ba51af66a0887d125960.png`,
  "1_4": `${IMG_BASE}/af2c7429adf6ae9d16f12a352b795274.png`,
  "2_1": `${IMG_BASE}/e85cd71ad2075c8bec37873114eee06d.png`,
  "2_2": `${IMG_BASE}/c4a647ab42f1c1561566d5b1e5be5b04.png`,
  "2_3": `${IMG_BASE}/c20491075bb2eb404fe5cf0e41081a06.png`,
  "2_4": `${IMG_BASE}/060f590d0b26b9fbbd83ba068de059ab.png`,
  "3_1": `${IMG_BASE}/8818c697728c4f9a0d3638989be35fc8.png`,
  "3_2": `${IMG_BASE}/116d871216f4ad0efa4bde643b9b231d.png`,
  "3_3": `${IMG_BASE}/4d43275945039a8ee384154c752809ba.png`,
  "3_4": `${IMG_BASE}/efb01e85324dceb91e1371914df400dd.png`,
  "4_1": `${IMG_BASE}/692876def797037db058b74eb8bf3622.png`,
  "4_2": `${IMG_BASE}/817899831e24aad8c03e5f9630a42a40.png`,
  "4_3": `${IMG_BASE}/d5aa742a59b7ed726af3daf186ee1f3f.png`,
  "4_4": `${IMG_BASE}/9bace3f30d88d80474eacc52e75a497f.png`,
  "5_1": `${IMG_BASE}/8db0c2f22264a3bfe1c24d3ecf1ee92c.png`,
  "5_2": `${IMG_BASE}/8ea0d1d441915f6bd4e0a8a1ef061d7a.png`,
  "5_3": `${IMG_BASE}/0ac2e6e0d4505b603bb11f63de954c3c.png`,
  "5_4": `${IMG_BASE}/d041e124d2afa1048b6d8320d380834b.png`,
  "6_1": `${IMG_BASE}/b7d483bd1d0ac0b7de15e6a7b206c1c4.png`,
  "6_2": `${IMG_BASE}/47443591a63912e5b4556082b84d5cf3.png`,
  "6_3": `${IMG_BASE}/ad69d16275c70d1c9c2e3abfc8f049a5.png`,
  "6_4": `${IMG_BASE}/adcb1c76da57e615ad1a8d44f618ee81.png`,
  "default": `${IMG_BASE}/ccbf67b5f200001fd4d71a8f8a2cbe5d.png`,
}

const SHELL_TO_SERIES: Record<string, string> = {
  tech: "1", bio: "2", stealth: "3", armor: "3", round: "4", speed: "5",
}
const SERIES_VARIANTS: Record<string, string[]> = {
  "1": ["cityWhite", "nightBlack", "glacierBlue", "sageGreen"],
  "2": ["sageGreen", "desertOrange", "sunsetPink", "glacierBlue"],
  "3": ["nightBlack", "midnightPurple", "glacierBlue", "cityWhite"],
  "4": ["glacierBlue", "sageGreen", "sunsetPink", "cityWhite"],
  "5": ["desertOrange", "sunsetPink", "glacierBlue", "cityWhite"],
  "6": ["cityWhite", "sageGreen", "desertOrange", "nightBlack"],
}

export function getAssemblyImage(bodyId: string, shellId: string, colorId: string): string {
  if (bodyId && ASSEMBLY_IMAGES[bodyId]) return ASSEMBLY_IMAGES[bodyId]
  if (shellId && ASSEMBLY_IMAGES[shellId]) return ASSEMBLY_IMAGES[shellId]
  const series = SHELL_TO_SERIES[shellId || ""] || "6"
  const colorOptions = SERIES_VARIANTS[series] || SERIES_VARIANTS["6"]
  const variantIndex = colorOptions.indexOf(colorId || "")
  const variantNum = variantIndex >= 0 ? variantIndex + 1 : 1
  return ASSEMBLY_IMAGES[`${series}_${variantNum}`] || ASSEMBLY_IMAGES["default"]
}

export interface Stats { duration: number; 稳定性: number; stability: number; fun: number }

export function computeStats(
  selectedModules: string[],
  bodyId: string | null,
  shellId: string | null,
  colorId: string | null,
  accessoryId: string | null,
): Stats {
  let duration = 50, 稳定性 = 50, fun = 50
  for (const id of selectedModules) {
    const m = MODULES.find((x) => x.id === id)
    if (m) { duration += m.stats.duration; 稳定性 += m.stats.稳定性; fun += m.stats.fun }
  }
  const b = BODIES.find((x) => x.id === bodyId)
  if (b) { duration += b.stats.duration; 稳定性 += b.stats.稳定性; fun += b.stats.fun }
  const s = SHELLS.find((x) => x.id === shellId)
  if (s) { duration += s.stats.duration; 稳定性 += s.stats.稳定性; fun += s.stats.fun }
  const a = ACCESSORIES.find((x) => x.id === accessoryId)
  if (a) { duration += a.stats.duration; 稳定性 += a.stats.稳定性; fun += a.stats.fun }
  return {
    duration: Math.max(0, Math.min(100, duration)),
    稳定性: Math.max(0, Math.min(100, 稳定性)),
    stability: Math.max(0, Math.min(100, 稳定性)),
    fun: Math.max(0, Math.min(100, fun)),
  }
}

export function computeMatch(
  taskName: string,
  selectedModules: string[],
  bodyId: string | null,
  shellId: string | null,
): number {
  let match = 50
  const nightTasks = ["蓝眼泪海边夜拍", "博物馆夜间秘密导览", "未来城市低空巡游"]
  const deliveryTasks = ["暴雨校园奶茶速递", "宿舍深夜外卖救援", "山谷露营物资空投"]
  const photoTasks = ["樱花大道毕业跟拍", "天台告白玫瑰空投", "音乐节空中运镜"]

  if (nightTasks.includes(taskName) && selectedModules.some((id) => ["nightCamera", "searchLight", "moodLight"].includes(id))) match += 20
  if (deliveryTasks.includes(taskName) && selectedModules.some((id) => ["cargo", "bigBattery"].includes(id))) match += 20
  if (photoTasks.includes(taskName) && selectedModules.some((id) => ["nightCamera", "gimbal"].includes(id))) match += 20
  if (taskName.includes("猫咪") && selectedModules.includes("grabClaw")) match += 25
  if (taskName.includes("告白") && selectedModules.some((id) => ["speaker", "moodLight"].includes(id))) match += 15
  if (taskName.includes("配送") && bodyId === "airLite") match += 5
  if (deliveryTasks.includes(taskName) && shellId === "speed") match += 5
  if (photoTasks.includes(taskName) && shellId === "bio") match += 10
  return Math.min(100, match)
}
