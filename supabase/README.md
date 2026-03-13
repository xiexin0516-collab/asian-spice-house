# Supabase 迁移说明

## 第一阶段：内容表 + 种子数据

### 1. 在 Supabase 里执行迁移

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选择项目 **asian-spice-house**。
2. 左侧进入 **SQL Editor**。
3. **先执行建表**：打开 `migrations/20250309000000_phase1_content_tables.sql`，复制全部内容，粘贴到 SQL Editor，点击 **Run**。
4. **再执行种子数据**：打开 `migrations/20250309000001_phase1_seed_data.sql`，复制全部内容，粘贴到 SQL Editor，点击 **Run**。

### 2. 验证

在 **Table Editor** 中应能看到：

- `cuisines`：5 行  
- `spices`：8 行  
- `kits`：4 行  
- `recipes`：4 行  
- `recipe_spices`、`kit_spices`、`kit_recipes`：各有对应行数  

### 3. 前端接 Supabase（已做）

- 项目已安装 `@supabase/supabase-js`，并新增 `lib/supabase/client.ts`、`lib/data-supabase.ts`。
- **环境变量**：在项目根目录把 `.env.local.example` 复制为 `.env.local`，填入 Supabase 的 **Project URL** 和 **anon public key**（在 Dashboard → Project Settings → API 可看到）。否则首页、商品页会报错。
- 首页、商品页已改为从 Supabase 读数据；其余页面已接 Supabase 或购物车/订单逻辑。

---

## 第二阶段：用户与订单

### 1. 执行 Phase 2 迁移

在 **SQL Editor** 中执行：`migrations/20250309100000_phase2_users_orders.sql`。

将创建：

- **profiles**：用户资料，并设有 `on_auth_user_created` 触发器，新注册用户自动插入一条 profile。
- **addresses**：收货地址（按 user_id RLS）。
- **orders**：订单主表。
- **order_items**：订单明细（快照）。

### 2. 已存在用户补建 profile（可选）

若在加此迁移前已有 auth 用户，可在 SQL Editor 中执行一次：

```sql
INSERT INTO public.profiles (id, role)
SELECT id, 'customer' FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

### 3. 前端行为

- 购物车：使用 Context + localStorage，商品页「Add to Cart」会写入购物车，结账时从购物车读取并创建订单。
- 结账：未登录会跳转到 `/login?next=/checkout`；登录后可填地址、选支付方式并提交订单，订单写入 `orders` 与 `order_items`，成功后跳转 `/checkout/success?order=<id>`。
