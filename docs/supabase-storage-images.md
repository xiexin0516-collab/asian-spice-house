# 用 Supabase Storage 存商品图

商品图统一放在 Supabase Storage，数据库里只存图片的**公开 URL**。下面按步做即可。

---

## 第一步：在 Supabase 里建一个放图的桶（Bucket）

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选项目 **asian-spice-house**。
2. 左侧点 **Storage**。
3. 点 **New bucket**。
4. 填写：
   - **Name**：`product-images`（或你喜欢的英文名，不要空格）。
   - **Public bucket**：勾选 **勾上**（这样前端才能直接通过 URL 显示图片）。
5. 点 **Create bucket**。

---

## 第二步：在桶里建文件夹（可选但建议）

方便以后区分香料、套装、食谱等：

1. 点进刚建好的 **product-images** 桶。
2. 点 **New folder**，建几个文件夹，例如：
   - `spices`（香料图）
   - `kits`（套装图）
   - `recipes`（食谱图）
   - `cuisines`（菜系图）

不建文件夹也可以，所有图都扔在桶根目录。

---

## 第三步：上传第一张图

1. 在 **product-images** 里（或进某个子文件夹）。
2. 点 **Upload file**，选一张图（如某香料的照片）。
3. 上传完成后，点一下该文件。
4. 右侧会显示 **Public URL**，类似：
   ```text
   https://svhamlmqtvebzsjfdppz.supabase.co/storage/v1/object/public/product-images/spices/star-anise.jpg
   ```
5. **复制这个 URL**，后面会用到。

---

## 第四步：把 URL 写进数据库

图片地址要存到表里，前端才会显示 Supabase 的图。

**方式 A：在 Supabase 里改（适合偶尔改一两张）**

1. 左侧 **Table Editor** → 选表 **spices**（或 **kits** / **recipes**）。
2. 找到要换图的那一行，点进 **image** 这一列。
3. 把原来的值（如 `/images/products/star-anise.jpg`）删掉，改成刚才复制的 **Public URL**。
4. 保存。

**方式 B：用 SQL 改（适合批量）**

1. 左侧 **SQL Editor** →  New query。
2. 示例（把某一条的图换成 Storage 的 URL）：
   ```sql
   UPDATE spices
   SET image = 'https://你的项目ID.supabase.co/storage/v1/object/public/product-images/spices/star-anise.jpg'
   WHERE id = 'star-anise';
   ```
3. 把 URL 和 `id` 换成你自己的，点 **Run**。

---

## 第五步：确认网站能显示

- 项目里的 **next.config.mjs** 已配置允许从 `*.supabase.co` 的 `/storage/v1/object/public/**` 加载图片。
- 保存好数据库里的 URL 后，刷新商品页/首页，应能直接看到 Supabase Storage 的图。

---

## 以后加新商品图时

1. 在 **Storage → product-images**（或对应子文件夹）里 **Upload file**。
2. 复制该文件的 **Public URL**。
3. 在 **Table Editor** 里新增/编辑该商品时，把 **image** 填成这个 URL；或后台做「上传后自动把 URL 写进数据库」的功能（后续再做也可以）。

---

## 小结

| 你做的 | 说明 |
|--------|------|
| Storage 建桶 | 名字如 `product-images`，并勾选 **Public bucket** |
| 上传文件 | 在桶里（或子文件夹里）上传图片 |
| 复制 Public URL | 在文件详情里复制 |
| 写进数据库 | 把该 URL 填进 spices / kits / recipes 的 **image** 字段 |

按上面做完，网站就会用 Supabase Storage 的图；之后新图也按「上传 → 复制 URL → 写进 image」即可。
