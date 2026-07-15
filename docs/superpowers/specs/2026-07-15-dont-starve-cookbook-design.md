# Don't Starve 食谱大全 — 设计文档

## 概述

一个纯点击式网页应用，收录饥荒单人版 (Don't Starve + DLCs) 和联机版 (Don't Starve Together) 的全部烹饪锅食谱。支持按食材反查、属性筛选、DLC 版本切换。全程无需键盘输入。

## 技术栈

- React 18 + TypeScript + Vite
- Tailwind CSS
- 纯静态站点，数据内嵌为 TS 源文件
- 部署目标：GitHub Pages / Vercel / 任意静态托管

## 数据模型

### 食谱 Recipe

```ts
interface Recipe {
  id: string
  name: { zh: string; en: string }
  stats: { health: number; hunger: number; sanity: number }
  cookTime: number          // 烹饪秒数
  spoilTime: number         // 保质期（天）
  priority: number          // 烹饪锅优先级
  requirements: TagRequirement[]
  exclusions?: string[]     // 禁止食材标签
  dlc: DLC[]                // DS, RoG, SW, HAM, DST
  temperature?: { effect: 'heat' | 'cool'; duration: number }
  notes?: { zh: string; en: string }
}

interface TagRequirement {
  tag: string    // 'meat' | 'vegetable' | 'fruit' | 'egg' | ...
  min: number    // 最小需求
  max?: number   // 最大限制（可选）
}
```

### 食材 Ingredient

```ts
interface Ingredient {
  id: string
  name: { zh: string; en: string }
  tags: Record<string, number>  // 标签 → 数值
  category: IngredientCategory  // 所属大类
}

type DLC = 'DS' | 'RoG' | 'SW' | 'HAM' | 'DST'

type IngredientCategory = 'meat' | 'vegetable' | 'fruit' | 'egg_dairy'
  | 'monster' | 'filler' | 'sweetener' | 'fish' | 'other'
```

### 标签 Tag

```ts
interface Tag {
  id: string
  name: { zh: string; en: string }
  description: { zh: string; en: string }
}
```

## 界面布局

### 桌面端：三栏

```
┌──────────────────────────────────────────────────┐
│  食谱大全                          [DS] [DST] ✓   │
│  [全部] [肉类] [蔬菜] [回血高] [高饱腹] ...       │
├────────────┬──────────────────┬──────────────────┤
│  筛选       │                  │  食材反查         │
│            │  食谱卡片网格     │                 │
│ 📊 属性    │ ┌────┐ ┌────┐   │ 📦 肉类          │
│ 生命 ≥ [滑块]│ │肉丸│ │炖肉│   │ ☐ 大肉 ☐ 小肉  │
│ 饥饿 ≥ [滑块]│ └────┘ └────┘   │ ☐ 怪物肉        │
│ 精神 ≥ [滑块]│                  │                 │
│            │ ┌────┐ ┌────┐   │ 🥬 蔬菜          │
│ 🏷️ 类型    │ │水饺│ │火鸡│   │ ☐ 胡萝卜 ☐ 玉米  │
│ ☐ 肉类食物  │ └────┘ └────┘   │ ☐ 茄子  ☐ 南瓜  │
│ ☐ 蔬菜食物  │                  │                 │
│ ☐ 水果食物  │                  │ [能做这些菜 →]   │
│            │                  │                 │
│ 🔪 排除    │                  │ 结果: 3 道菜     │
│ ☐ 树枝     │                  │ • 肉丸 (62.5)    │
│ ☐ 冰块     │                  │ • 肉汤 (150)     │
│            │                  │ • 培根煎蛋 (75)  │
└────────────┴──────────────────┴──────────────────┘
```

### 移动端：单列 + 标签切换

- 顶部快速标签横向滚动
- 底部三个标签：[食谱列表] [筛选] [反查]
- 每个标签下对应内容全屏

## 核心交互（全部纯点击，零输入）

### 1. 浏览与快速筛选

- 顶部**标签按钮**：全部 / 肉类食物 / 蔬菜食物 / 水果食物 / 高回血 / 高饱腹 / 回精神
- 点击即筛选，再次点击取消
- 支持多标签叠加

### 2. 属性筛选

- 生命/饥饿/精神三个滑块，拖动设下限
- 只显示三项属性均 ≥ 该值的食谱

### 3. 类型筛选

- 勾选食物类型（肉类食物 / 蔬菜食物 / 水果食物 / 怪物食物等）
- 多选取并集

### 4. 排除食材

- 勾选要排除的食材类型（树枝 / 冰块 / 怪物肉等）
- 含该食材的食谱被隐藏

### 5. 食材反查

- 食材按大类分组，每组可折叠
- 点击勾选手中拥有的食材
- 点击「能做这些菜」按钮
- 结果弹窗列出所有可制作的食谱，按优先级排序
- 显示属性值和还缺什么食材的提示

### 6. 食谱详情

- 点击食谱卡片弹出模态窗
- 显示：中英文名、生命/饥饿/精神（绿/橙/蓝色值）、烹饪时间、保质期、优先级
- 标签需求转译为中文说明（如 "肉度 ≥ 2.0 + 蔬菜度 ≥ 1.0" → "至少 2 个大肉或等量的肉 + 至少 1 个蔬菜"）
- 所属 DLC 标记
- 特殊效果（升温/降温等）

### 7. 版本切换

- 顶部 DS / DST 切换按钮
- 同时选中两个显示全部，选一个只显示对应版本

## 数据规模

- 饥荒烹饪食谱总数约 **60-70 道**（含所有 DLC）
- 食材种类约 **50-60 种**
- 标签类型约 **15-20 个**
- 数据完全静态，无分页必要

## 组件树

```
App
├── Header
│   ├── VersionToggle     (DS/DST 切换)
│   └── QuickTags         (快速标签按钮)
├── MainLayout
│   ├── FilterPanel       (左侧 - 桌面端 / 底部标签 - 移动端)
│   │   ├── StatSliders   (属性滑块)
│   │   ├── TypeFilter    (食物类型勾选)
│   │   └── ExcludeFilter (排除食材勾选)
│   ├── RecipeGrid        (中间 - 食谱卡片网格)
│   │   └── RecipeCard[]  (单个食谱卡片)
│   └── ReverseLookup     (右侧 - 桌面端 / 底部标签 - 移动端)
│       ├── IngredientGroup[] (食材分组列表)
│       ├── LookupButton  (反查按钮)
│       └── ResultList    (反查结果)
└── RecipeModal            (食谱详情弹窗)
```

## 状态管理

- 无需全局状态库，React 内置 useState/useContext 足够
- 状态：选中版本、选中快速标签、滑块值、类型勾选、排除勾选、反查选中食材
- 筛选和反查逻辑为纯函数，输入状态 → 输出过滤后的食谱列表

## 非功能需求

- 首次加载 < 2s（静态站点，无网络请求）
- 所有交互 < 100ms 响应
- 移动端适配（responsive）
- 中英文双语（数据层面）
