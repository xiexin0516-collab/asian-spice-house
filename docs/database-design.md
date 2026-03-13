# Asian Spice House — 数据库设计说明

本文档记录与 Supabase 对接时的表结构、分阶段实施计划和约定，便于后续开发或交接。

---

## 一、最终确定的表清单（第一版约 11 张）

### 商品与内容（7 张）

| 表名 | 说明 |
|------|------|
| **spices** | 香料。分类用字段（如 `category_slug`：whole / ground / blends），不单独做 categories 表。 |
| **kits** | 烹饪套装。不存 `includes` JSONB，「包含什么」只由关系表表达。 |
| **recipes** | 食谱。`ingredients`、`steps` 用 JSONB 存储。 |
| **cuisines** | 菜系。单独成表，便于做 /cuisines/chinese 等 SEO 页面。 |
| **recipe_spices** | 食谱 ↔ 香料，多对多。 |
| **kit_spices** | 套装 ↔ 香料，多对多。 |
| **kit_recipes** | 套装 ↔ 食谱，多对多。 |

### 用户与交易（4 张）

| 表名 | 说明 |
|------|------|
| **profiles** | 用户资料（扩展 Supabase auth.users），含 role：customer / admin。 |
| **addresses** | 收货地址，关联 user_id。 |
| **orders** | 订单主表：状态、金额、配送信息、支付方式等。 |
| **order_items** | 订单明细。每条为快照：product_type、product_id、product_name、product_name_zh、unit_price、quantity、line_total、product_slug 等，避免改价后历史订单错乱。 |

### 暂不做的

- **categories**：当前只有 whole / ground / blends，在 spices 上用字段或枚举即可；以后要做动态分类、SEO 再加表。
- **cart_items**：购物车先用 localStorage，登录与订单稳定后再做服务端持久化。
- **kits.includes**：不单独存 JSONB，避免与 kit_spices / kit_recipes 不一致。

---

## 二、实施阶段

### 第一阶段：内容表 + 前端接 Supabase

- 建表：**spices, kits, recipes, cuisines, recipe_spices, kit_spices, kit_recipes**。
- 目标：网站从 Supabase 读数据，**替换 lib/data.ts**，业务逻辑和 UI 基本不动。

### 第二阶段：用户与订单

- 建表：**profiles, addresses, orders, order_items**。
- 目标：用户登录、收货地址、真实下单与订单记录。

### 第三阶段：扩展

- 视需求再考虑：**cart_items**、管理后台、库存扣减、支付回调、多语言内容管理等。

---

## 三、重要约定（方便以后建表 / 写迁移时对照）

1. **spices**：分类用 `category_slug` 或枚举（whole / ground / blends），不建 categories 表。
2. **cuisines**：保留独立表，用于筛选和 /cuisines/:slug 等页面。
3. **recipes**：`ingredients`、`steps` 用 JSONB；与香料的关系用 **recipe_spices**。
4. **kits**：不存 `includes` JSONB；「套装包含」仅由 **kit_spices**、**kit_recipes** 表示。
5. **order_items**：必须存下单时快照（如 product_name、product_name_zh、unit_price、quantity、line_total、product_type、product_slug），不依赖实时商品表。
6. **order_items** 的 product_type + product_id（spice | kit + id）暂不做多表外键，先保证能跑、结构简单。
7. Supabase 新建项目时建议**开启「Enable automatic RLS」**，新表默认开启行级安全，再按需写策略。

---

## 四、与当前前端的对应关系

| 前端（lib/data.ts） | 数据库 |
|---------------------|--------|
| spices 数组 | spices 表 |
| kits 数组 | kits 表 |
| recipes 数组 | recipes 表 |
| cuisines 数组 | cuisines 表 |
| 分类（whole/ground/blends） | spices.category_slug，无 categories 表 |
| recipe.spiceIds | recipe_spices 表 |
| kit.spiceIds | kit_spices 表 |
| kit.recipeIds | kit_recipes 表 |
| kit.includes | 由 kit_spices / kit_recipes 查出来再拼，不单独存 |

---

*文档版本：与 Supabase 对接前约定，首次整理。后续建表或调整时可在此文件追加修改记录。*
