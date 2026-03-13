-- ============================================
-- Asian Spice House — Phase 1: 内容表
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 1. 菜系（先建，recipes 会引用）
CREATE TABLE IF NOT EXISTS public.cuisines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_local TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 香料
CREATE TABLE IF NOT EXISTS public.spices (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image TEXT,
  category_slug TEXT NOT NULL CHECK (category_slug IN ('whole', 'ground', 'blends')),
  description TEXT,
  details TEXT,
  weight TEXT,
  origin TEXT,
  cuisines TEXT[] DEFAULT '{}',  -- 存菜系 id 数组，如 {'chinese','vietnamese'}
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 烹饪套装
CREATE TABLE IF NOT EXISTS public.kits (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image TEXT,
  description TEXT,
  details TEXT,
  servings TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_time TEXT,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 食谱
CREATE TABLE IF NOT EXISTS public.recipes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  image TEXT,
  cook_time TEXT,
  servings INTEGER NOT NULL CHECK (servings > 0),
  cuisine_id TEXT NOT NULL REFERENCES public.cuisines(id),
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ingredients JSONB DEFAULT '[]',  -- 字符串数组
  steps JSONB DEFAULT '[]',       -- 字符串数组
  kit_id TEXT REFERENCES public.kits(id),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 食谱 ↔ 香料（多对多）
CREATE TABLE IF NOT EXISTS public.recipe_spices (
  recipe_id TEXT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  spice_id TEXT NOT NULL REFERENCES public.spices(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, spice_id)
);

-- 6. 套装 ↔ 香料（多对多）
CREATE TABLE IF NOT EXISTS public.kit_spices (
  kit_id TEXT NOT NULL REFERENCES public.kits(id) ON DELETE CASCADE,
  spice_id TEXT NOT NULL REFERENCES public.spices(id) ON DELETE CASCADE,
  PRIMARY KEY (kit_id, spice_id)
);

-- 7. 套装 ↔ 食谱（多对多）
CREATE TABLE IF NOT EXISTS public.kit_recipes (
  kit_id TEXT NOT NULL REFERENCES public.kits(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (kit_id, recipe_id)
);

-- 索引（按 slug / 外键查询）
CREATE INDEX IF NOT EXISTS idx_spices_slug ON public.spices(slug);
CREATE INDEX IF NOT EXISTS idx_spices_category ON public.spices(category_slug);
CREATE INDEX IF NOT EXISTS idx_spices_featured ON public.spices(featured);
CREATE INDEX IF NOT EXISTS idx_kits_slug ON public.kits(slug);
CREATE INDEX IF NOT EXISTS idx_kits_featured ON public.kits(featured);
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine_id);
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON public.recipes(featured);
CREATE INDEX IF NOT EXISTS idx_recipe_spices_recipe ON public.recipe_spices(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_spices_spice ON public.recipe_spices(spice_id);
CREATE INDEX IF NOT EXISTS idx_kit_spices_kit ON public.kit_spices(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_spices_spice ON public.kit_spices(spice_id);
CREATE INDEX IF NOT EXISTS idx_kit_recipes_kit ON public.kit_recipes(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_recipes_recipe ON public.kit_recipes(recipe_id);

-- RLS：内容表对所有人只读（后续再加管理员写权限）
ALTER TABLE public.cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read cuisines" ON public.cuisines FOR SELECT USING (true);
CREATE POLICY "Allow public read spices" ON public.spices FOR SELECT USING (true);
CREATE POLICY "Allow public read kits" ON public.kits FOR SELECT USING (true);
CREATE POLICY "Allow public read recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Allow public read recipe_spices" ON public.recipe_spices FOR SELECT USING (true);
CREATE POLICY "Allow public read kit_spices" ON public.kit_spices FOR SELECT USING (true);
CREATE POLICY "Allow public read kit_recipes" ON public.kit_recipes FOR SELECT USING (true);
