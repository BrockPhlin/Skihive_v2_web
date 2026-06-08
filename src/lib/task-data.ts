// 任务数据 — 从 v1 pages/task-card/task-card.js 迁移
export interface Task {
  id: number
  name: string
  image: string
}

export const TASKS: Task[] = [
  { id: 1, name: "暴雨校园奶茶速递", image: "https://cdn.phototourl.com/free/2026-04-27-03f58944-4f0b-460a-badf-b53c79fca63c.jpg" },
  { id: 2, name: "蓝眼泪海边夜拍", image: "https://cdn.phototourl.com/free/2026-04-27-92056768-6e90-4107-996d-2b9abcdd66cf.jpg" },
  { id: 3, name: "樱花大道毕业跟拍", image: "https://cdn.phototourl.com/free/2026-04-27-1e9d0613-622d-49aa-921f-3bf2bf2320ba.png" },
  { id: 4, name: "天台告白玫瑰空投", image: "https://cdn.phototourl.com/free/2026-04-27-ff3ac0ea-0d49-4866-a951-474d467fa2b4.png" },
  { id: 5, name: "音乐节空中运镜", image: "https://cdn.phototourl.com/free/2026-04-27-fb3825e2-9179-449f-8424-8a0054bdffe7.jpg" },
  { id: 6, name: "宿舍深夜外卖救援", image: "https://cdn.phototourl.com/free/2026-04-27-d8ad578d-9a24-4468-9071-167ddce425f6.jpg" },
  { id: 7, name: "博物馆夜间秘密导览", image: "https://cdn.phototourl.com/free/2026-04-27-14f72fb9-6293-4ab2-ab1c-eb1c329ed7cc.png" },
  { id: 8, name: "山谷露营物资空投", image: "https://cdn.phototourl.com/free/2026-04-27-eb71ba3a-c5f6-4a97-a1dc-8d7b3fb0fc5f.jpg" },
  { id: 9, name: "未来城市低空巡游", image: "https://cdn.phototourl.com/free/2026-04-27-7f2f0b7a-eeee-4bc8-a266-be8c712c9523.png" },
  { id: 10, name: "屋顶猫咪营救", image: "https://cdn.phototourl.com/member/2026-04-27-5d37ec09-9bdd-44ca-949f-01b790951137.png" },
]

// 环境数据 — 从 v1 pages/environment/environment.js 迁移
export interface Environment {
  id: number
  name: string
  icon: string
  description: string
}

export const ENVIRONMENTS: Environment[] = [
  { id: 1, name: "航拍出片", icon: "📷", description: "稳定飞行，拍摄风景" },
  { id: 2, name: "室内练习", icon: "🏠", description: "轻量，安全" },
  { id: 3, name: "高速飞行", icon: "⚡", description: "速度与机动性" },
  { id: 4, name: "入门教学", icon: "📖", description: "低成本，低速可飞" },
]
