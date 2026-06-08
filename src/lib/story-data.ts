// 4 章剧情数据 — 从 v1 packageA/pages/story/story.js 迁移
export interface DialogLine { character: string; characterIcon: string; text: string }
export interface StoryOption { id: string; text: string; tag: 'main' | 'branch' | 'secret'; tagText: string; resultPreview: string; nextScene: number | string; effect: Record<string, number>; nextChapter?: number; secretTrigger?: boolean }
export interface Scene { narration: string; dialogues: DialogLine[]; options: StoryOption[]; secretHint?: { title: string; description: string } }
export interface Chapter { id: number; title: string; description: string; icon: string; scenes: Scene[]; locked?: boolean }

export const CHAPTERS: Chapter[] = [
  {
    id: 1, title: '黎明之约', description: '你第一次接触无人机飞行，开启这段奇妙的旅程', icon: '🌅', locked: false,
    scenes: [
      {
        narration: '清晨的阳光洒在操作场上，一架崭新的无人机静静地停在那里，等待着它的主人。',
        dialogues: [
          { character: '导师', characterIcon: '👨‍🏫', text: '欢迎来到无人机训练场，新人。今天将是你的第一次飞行。' },
          { character: '你', characterIcon: '🧑', text: '老师，我有点紧张...这是我第一次操控无人机。' },
          { character: '导师', characterIcon: '👨‍🏫', text: '别担心，无人机就像是你的伙伴，只要你了解它，它就会配合你。先从基础操作开始吧。' },
        ],
        options: [
          { id: 'a', text: '仔细阅读操作手册', tag: 'main', tagText: '主线', resultPreview: '稳扎稳打', nextScene: 1, effect: { patience: 1 } },
          { id: 'b', text: '直接尝试飞行', tag: 'branch', tagText: '分支', resultPreview: '大胆尝试', nextScene: 2, effect: { courage: 1 } },
        ],
        secretHint: { title: '细心观察', description: '在第一章的第三幕，选择"观察无人机状态"可能触发隐藏剧情' },
      },
      {
        narration: '你按照指导认真地检查无人机，了解每一个部件的功能。',
        dialogues: [
          { character: '导师', characterIcon: '👨‍🏫', text: '很好，你展现出了作为飞手最重要的品质——耐心。现在，让我们进行第一次起飞。' },
          { character: '你', characterIcon: '🧑', text: '明白了！我会按照您教的方法一步一步来。' },
        ],
        options: [
          { id: 'a', text: '缓慢加速起飞', tag: 'main', tagText: '主线', resultPreview: '循序渐进', nextScene: 3, effect: { caution: 1 } },
          { id: 'b', text: '直接拉升到中空', tag: 'branch', tagText: '分支', resultPreview: '挑战自我', nextScene: 4, effect: { confidence: 1 } },
        ],
      },
      {
        narration: '无人机平稳升空，你小心翼翼地操控着。',
        dialogues: [
          { character: '导师', characterIcon: '👨‍🏫', text: '做得好！你已经掌握了基本的起飞和控制。' },
        ],
        options: [
          { id: 'a', text: '记录飞行要点', tag: 'main', tagText: '主线', resultPreview: '好记性不如烂笔头', nextScene: 5, effect: { wisdom: 1 } },
        ],
      },
      {
        narration: '完成基础训练后，导师向你介绍了即将到来的任务。',
        dialogues: [
          { character: '导师', characterIcon: '👨‍🏫', text: '你已经具备了基础飞行能力，接下来我将交给你第一个真正的任务——城市速递。' },
          { character: '你', characterIcon: '🧑', text: '是什么任务呢？' },
          { character: '导师', characterIcon: '👨‍🏫', text: '城市速递任务。你需要操控无人机穿越城市，将包裹安全送达目的地。' },
        ],
        options: [
          { id: 'a', text: '接受任务，开启新章节', tag: 'main', tagText: '主线', resultPreview: '迎接新挑战', nextScene: 0, nextChapter: 2, effect: { determination: 1 } },
        ],
      },
    ],
  },
  {
    id: 2, title: '夜空挑战', description: '夜间飞行任务，面对黑暗中的未知挑战', icon: '🌙', locked: true,
    scenes: [
      {
        narration: '夜幕降临，城市的灯光如同星河。在这个神秘的夜晚，你将执行一次特殊的飞行任务。',
        dialogues: [
          { character: '队友', characterIcon: '👩‍✈️', text: '今晚的任务是穿过城区，将医疗物资紧急送往医院。' },
          { character: '你', characterIcon: '🧑', text: '夜间飞行...我还没有经验，会不会有问题？' },
          { character: '队友', characterIcon: '👩‍✈️', text: '别担心，我会通过通讯频道全程引导你。' },
        ],
        options: [
          { id: 'a', text: '打开全部灯光', tag: 'main', tagText: '主线', resultPreview: '确保良好视线', nextScene: 1, effect: { caution: 1 } },
          { id: 'b', text: '只保留导航灯', tag: 'branch', tagText: '分支', resultPreview: '节省电量', nextScene: 2, effect: { efficiency: 1 } },
          { id: 'c', text: '关闭所有灯光只靠仪表', tag: 'secret', tagText: '隐藏', resultPreview: '极高难度，可能发现城市的另一面', nextScene: 'secret_1', effect: { intuition: 1 }, secretTrigger: true },
        ],
      },
      {
        narration: '无人机升空，你按照队友的引导穿越城市的夜空。高楼大厦的灯光从身边掠过。',
        dialogues: [
          { character: '队友', characterIcon: '👩‍✈️', text: '前方就是第一段路程，注意保持高度，避开那座塔吊。' },
        ],
        options: [
          { id: 'a', text: '降低速度观察', tag: 'main', tagText: '主线', resultPreview: '安全第一', nextScene: 3, effect: { patience: 1 } },
          { id: 'b', text: '保持速度，相信训练', tag: 'branch', tagText: '分支', resultPreview: '信心十足', nextScene: 4, effect: { confidence: 1 } },
        ],
        secretHint: { title: '黑暗中的微光', description: '第二章的隐藏结局与"信任"有关' },
      },
      {
        narration: '任务顺利完成，医疗物资准时送达医院。你成功完成了第一次夜间飞行任务。',
        dialogues: [
          { character: '队友', characterIcon: '👩‍✈️', text: '干得漂亮！这次任务你表现得非常出色。' },
          { character: '你', characterIcon: '🧑', text: '谢谢您的引导。' },
          { character: '队友', characterIcon: '👩‍✈️', text: '这只是开始。接下来还有城市速递在等着你。' },
        ],
        options: [
          { id: 'a', text: '继续下一个任务', tag: 'main', tagText: '主线', resultPreview: '迎接新挑战', nextScene: 0, nextChapter: 3, effect: { courage: 1 } },
        ],
      },
    ],
  },
  {
    id: 3, title: '城市速递', description: '配送任务剧情，穿梭于城市之间', icon: '🏙️', locked: true,
    scenes: [
      {
        narration: '城市的繁华街道上，无人机群穿梭其间。你接到了一个重要的配送任务。',
        dialogues: [
          { character: '调度员', characterIcon: '📡', text: '新人，你今天的任务是穿越半个城区，配送一件重要包裹。' },
          { character: '你', characterIcon: '🧑', text: '半个城区？这看起来很有挑战性。' },
        ],
        options: [
          { id: 'a', text: '规划最短路线', tag: 'main', tagText: '主线', resultPreview: '效率优先', nextScene: 1, effect: { efficiency: 1 } },
          { id: 'b', text: '选择最安全路线', tag: 'branch', tagText: '分支', resultPreview: '安全第一', nextScene: 2, effect: { caution: 1 } },
        ],
      },
      {
        narration: '你选择了路线，开始了紧张刺激的配送之旅。',
        dialogues: [
          { character: '调度员', characterIcon: '📡', text: '注意调整飞行高度，绕过那片施工区域。' },
        ],
        options: [
          { id: 'a', text: '降低高度躲避', tag: 'main', tagText: '主线', resultPreview: '谨慎通过', nextScene: 3, effect: { adaptability: 1 } },
          { id: 'b', text: '拉升绕行', tag: 'branch', tagText: '分支', resultPreview: '节省时间', nextScene: 4, effect: { creativity: 1 } },
        ],
        secretHint: { title: '意外相遇', description: '第三章隐藏结局与城市中的某个神秘人物有关' },
      },
      {
        narration: '任务完成，你获得了宝贵的城市飞行经验。',
        dialogues: [
          { character: '调度员', characterIcon: '📡', text: '你的表现超出预期。下一个任务是风暴任务，那将是真正的考验。' },
        ],
        options: [
          { id: 'a', text: '准备迎接风暴挑战', tag: 'main', tagText: '主线', resultPreview: '勇往直前', nextScene: 0, nextChapter: 4, effect: { determination: 1 } },
        ],
      },
    ],
  },
  {
    id: 4, title: '风暴来临', description: '紧急情况处理，面对极端天气', icon: '⛈️', locked: true,
    scenes: [
      {
        narration: '天空骤然变暗，暴风雨即将来临。这时你收到了紧急任务——必须立即转移设备。',
        dialogues: [
          { character: '指挥员', characterIcon: '👨‍🚀', text: '紧急召集！暴风雨即将来袭，我们需要立即转移设备到安全地点。' },
          { character: '你', characterIcon: '🧑', text: '这种天气条件下飞行？太危险了吧...' },
          { character: '指挥员', characterIcon: '👨‍🚀', text: '我知道这很危险，但设备不能落入暴风雨中。你是唯一能完成这个任务的人。' },
        ],
        options: [
          { id: 'a', text: '接受任务，义不容辞', tag: 'main', tagText: '主线', resultPreview: '勇敢担当', nextScene: 1, effect: { courage: 2 } },
          { id: 'b', text: '提出备用方案', tag: 'branch', tagText: '分支', resultPreview: '开动脑筋', nextScene: 2, effect: { wisdom: 1 } },
          { id: 'c', text: '请求更多支援', tag: 'secret', tagText: '隐藏', resultPreview: '团队协作', nextScene: 'secret_final', effect: { leadership: 1 }, secretTrigger: true },
        ],
      },
      {
        narration: '你顶着强风起飞，无人机在狂风中艰难前行。风速太大了...无人机在偏航...',
        dialogues: [
          { character: '指挥员', characterIcon: '👨‍🚀', text: '稳住！调低重心，逆风飞行！' },
        ],
        options: [
          { id: 'a', text: '立刻降低高度', tag: 'main', tagText: '主线', resultPreview: '稳妥应对', nextScene: 3, effect: { caution: 1 } },
          { id: 'b', text: '保持高度修正航向', tag: 'branch', tagText: '分支', resultPreview: '挑战极限', nextScene: 4, effect: { confidence: 1 } },
        ],
        secretHint: { title: '团队力量', description: '第四章隐藏结局与"信任同伴"有关' },
      },
      {
        narration: '暴风雨中，你成功地将设备转移到了安全地点。任务完成，你成为了真正的无人机飞行者。',
        dialogues: [
          { character: '指挥员', characterIcon: '👨‍🚀', text: '太棒了！你已经证明了自己是一名合格的无人机飞手。' },
          { character: '你', characterIcon: '🧑', text: '谢谢您，是这次经历让我成长了很多。' },
          { character: '指挥员', characterIcon: '👨‍🚀', text: '这只是开始。无人机的世界还有更多精彩等着你去探索。继续努力吧，飞手！' },
        ],
        options: [
          { id: 'a', text: '查看完整结局', tag: 'main', tagText: '主线', resultPreview: '恭喜完成旅程', nextScene: 'ending_main', effect: { achievement: 1 } },
          { id: 'b', text: '探索隐藏结局', tag: 'secret', tagText: '隐藏', resultPreview: '发现真谛...', nextScene: 'ending_secret', effect: { wisdom: 1 }, secretTrigger: true },
        ],
      },
    ],
  },
]
