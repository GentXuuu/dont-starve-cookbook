import type { Tag } from '../types'

const tags: Tag[] = [
  {
    id: 'meat',
    name: { zh: '肉', en: 'Meat' },
    description: { zh: '肉类食材提供的肉度', en: 'Meat value from meat ingredients' },
  },
  {
    id: 'vegetable',
    name: { zh: '蔬菜', en: 'Vegetable' },
    description: { zh: '蔬菜类食材提供的蔬菜度', en: 'Vegetable value from vegetable ingredients' },
  },
  {
    id: 'fruit',
    name: { zh: '水果', en: 'Fruit' },
    description: { zh: '水果类食材提供的水果度', en: 'Fruit value from fruit ingredients' },
  },
  {
    id: 'egg',
    name: { zh: '蛋', en: 'Egg' },
    description: { zh: '蛋类食材提供的蛋度', en: 'Egg value from egg ingredients' },
  },
  {
    id: 'fish',
    name: { zh: '鱼', en: 'Fish' },
    description: { zh: '鱼类食材提供的鱼度', en: 'Fish value from fish ingredients' },
  },
  {
    id: 'monster',
    name: { zh: '怪物', en: 'Monster' },
    description: { zh: '怪物类食材提供的怪物度', en: 'Monster value from monster ingredients' },
  },
  {
    id: 'sweetener',
    name: { zh: '甜味剂', en: 'Sweetener' },
    description: { zh: '甜味食材提供的甜度', en: 'Sweetener value from sweet ingredients' },
  },
  {
    id: 'dairy',
    name: { zh: '乳制品', en: 'Dairy' },
    description: { zh: '乳制品食材提供的乳度', en: 'Dairy value from dairy ingredients' },
  },
  {
    id: 'filler',
    name: { zh: '填充物', en: 'Filler' },
    description: { zh: '可做填充的食材', en: 'Ingredients that can act as filler' },
  },
  {
    id: 'inedible',
    name: { zh: '不可食用', en: 'Inedible' },
    description: { zh: '不可直接食用的食材（如树枝）', en: 'Inedible ingredients like twigs' },
  },
  {
    id: 'frozen',
    name: { zh: '冷冻', en: 'Frozen' },
    description: { zh: '冰冷食材（如冰块）', en: 'Frozen ingredients like ice' },
  },
  {
    id: 'decoration',
    name: { zh: '装饰', en: 'Decoration' },
    description: { zh: '装饰性食材（如蝴蝶翅膀）', en: 'Decorative ingredients like butterfly wings' },
  },
  {
    id: 'seafood',
    name: { zh: '海鲜', en: 'Seafood' },
    description: { zh: '船难DLC的海鲜食材', en: 'Seafood ingredients from Shipwrecked DLC' },
  },
  {
    id: 'warly',
    name: { zh: '大厨专属', en: 'Warly Exclusive' },
    description: { zh: '仅Warly可用便携烹饪锅制作', en: 'Only craftable by Warly in Portable Crock Pot' },
  },
  {
    id: 'bug',
    name: { zh: '虫子', en: 'Bug' },
    description: { zh: '虫类食材', en: 'Bug-based ingredients' },
  },
]

export default tags
