-- ============================================
-- Asian Spice House — 评论表 + 香料字段（Ingredients / How to use）
-- 依赖 Phase 1 内容表、Phase 2 订单表
-- ============================================

-- 1. 香料表增加 ingredients、how_to_use（可选）
ALTER TABLE public.spices
  ADD COLUMN IF NOT EXISTS ingredients TEXT,
  ADD COLUMN IF NOT EXISTS how_to_use TEXT;

-- 2. 评论表（商品维度：spice 或 kit）
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('spice', 'kit')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  verified BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read reviews"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Allow anyone to insert review"
  ON public.reviews FOR INSERT WITH CHECK (true);

-- 3. 种子评论（固定 id 便于迁移可重复执行）
INSERT INTO public.reviews (id, product_id, product_type, rating, name, comment, verified) VALUES
  ('a0000001-0000-4000-8000-000000000001', 'mala-spice-blend', 'spice', 5, 'Michael R.', 'Amazing flavor. This mala spice blend tastes exactly like the hot pot in Chengdu.', true),
  ('a0000001-0000-4000-8000-000000000002', 'mala-spice-blend', 'spice', 5, 'Sarah L.', 'Perfect for hot pot at home. My family asks for it every week.', true),
  ('a0000001-0000-4000-8000-000000000003', 'star-anise', 'spice', 5, 'James K.', 'Best star anise I have found. Rich and aromatic.', true),
  ('a0000001-0000-4000-8000-000000000004', 'sichuan-peppercorn', 'spice', 4, 'Emily T.', 'Authentic numbing sensation. Great for mapo tofu.', false),
  ('a0000001-0000-4000-8000-000000000005', 'hotpot-kit', 'kit', 5, 'David C.', 'Everything you need for a real Sichuan hot pot. Worth every penny.', true)
ON CONFLICT (id) DO NOTHING;

-- 4. 示例：为部分香料补充 ingredients / how_to_use（可选）
UPDATE public.spices SET
  ingredients = '100% star anise (Illicium verum). No additives.',
  how_to_use = 'Add whole pods to braises, master stocks, and pho broth. Typically 1-2 stars per liter of liquid. Remove before serving if desired.'
WHERE id = 'star-anise';

UPDATE public.spices SET
  ingredients = 'Sichuan peppercorns (Zanthoxylum). May contain trace amounts of leaves.',
  how_to_use = 'Toast lightly in a dry wok before grinding for maximum aroma. Use in mapo tofu, kung pao, and hot pot. For numbing effect, add in the last minutes of cooking.'
WHERE id = 'sichuan-peppercorn';
