# 食材反查 — 锅内容量感知

**日期:** 2026-07-22
**状态:** 已确认

## 问题

当前反查只对选中食材做标签求和，不检查锅的 4 格容量限制。选中 6 种食材也直接加总标签值，不符合游戏实际。

## 设计

### 分两条路径

**≤4 食材：** 保持现有标签求和逻辑，加容量校验（食材数 ≤4），通过则 `combinationCount = 1`。

**>4 食材：** 枚举所有 size 1-4 的子集，每个子集做标签求和 + 需求匹配 + specifics/exclusions 检查，按 recipe 聚合可行子集数。`combinationCount > 0` 即为"能做"。

子集上限：C(50,1)+C(50,2)+C(50,3)+C(50,4) ≈ 250K，单次子集检查很快，总耗时 <500ms。

### 展示

- ≤4 食材时展示不变
- >4 食材时，"能做"卡片显示 `N种方案` 徽章（N 即该 recipe 的可行组合数）
- "还差一点"区逻辑不变
- 弹窗内展示具体组合列表留到后续迭代

### 数据模型

`ReverseLookupResult` 新增 `combinationCount: number` 字段。

### 影响文件

| 文件 | 改动 |
|---|---|
| `src/filter/reverseLookup.ts` | 子集枚举逻辑，接口加 `combinationCount` |
| `src/components/LookupResults.tsx` | 传递 `combinationCount` |
| `src/components/RecipeCard.tsx` | 接收新 prop，渲染徽章 |
