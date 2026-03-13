-- ============================================
-- Asian Spice House — Phase 1: 种子数据
-- 依赖 20250309000000_phase1_content_tables.sql 已执行
-- 在 Supabase SQL Editor 中先执行建表，再执行本文件
-- ============================================

-- 1. 菜系
INSERT INTO public.cuisines (id, name, name_local, description, image) VALUES
  ('chinese', 'Chinese', '中国菜', 'From fiery Sichuan to delicate Cantonese', '/images/cuisines/chinese.jpg'),
  ('japanese', 'Japanese', '日本料理', 'Subtle umami and refined simplicity', '/images/cuisines/japanese.jpg'),
  ('korean', 'Korean', '한국 요리', 'Bold fermented flavors and heat', '/images/cuisines/korean.jpg'),
  ('thai', 'Thai', 'อาหารไทย', 'Sweet, sour, salty, spicy harmony', '/images/cuisines/thai.jpg'),
  ('vietnamese', 'Vietnamese', 'Ẩm thực Việt', 'Fresh herbs and aromatic broths', '/images/cuisines/vietnamese.jpg')
ON CONFLICT (id) DO NOTHING;

-- 2. 香料
INSERT INTO public.spices (id, slug, name, name_zh, price, image, category_slug, description, details, weight, origin, cuisines, in_stock, featured) VALUES
  ('star-anise', 'star-anise', 'Star Anise', '八角茴香', 28, '/images/products/star-anise.jpg', 'whole', 'Premium star anise with rich, sweet aroma. Essential for braising and stewing.', 'Sourced from Guangxi, China. Hand-selected for full, plump pods with deep reddish-brown color. Star anise is a cornerstone of Chinese cuisine, imparting a distinctive licorice-like sweetness to red-braised meats, master stocks, and pho broth.', '50g', 'Guangxi, China', ARRAY['chinese','vietnamese'], true, true),
  ('sichuan-peppercorn', 'sichuan-peppercorn', 'Sichuan Peppercorn', '四川花椒', 35, '/images/products/sichuan-peppercorn.jpg', 'whole', 'Authentic Hanyuan peppercorns with intense numbing sensation and citrus notes.', 'From Hanyuan County, Sichuan - the most prized origin for huajiao. These peppercorns deliver the signature ''mala'' (numbing-spicy) sensation essential to Sichuan cuisine. Vibrant red color with a clean, lingering tingle.', '30g', 'Sichuan, China', ARRAY['chinese'], true, true),
  ('cinnamon-sticks', 'cinnamon-sticks', 'Cinnamon Sticks', '肉桂条', 32, '/images/products/cinnamon-sticks.jpg', 'whole', 'Vietnamese cinnamon with sweet, warm fragrance. Perfect for stews and desserts.', 'Premium Vietnamese cassia cinnamon, known for its intense sweetness and bold flavor. Thicker bark with higher oil content than Ceylon varieties. Ideal for pho, braised dishes, and mulled beverages.', '40g', 'Vietnam', ARRAY['chinese','vietnamese'], true, false),
  ('bay-leaves', 'bay-leaves', 'Bay Leaves', '香叶', 18, '/images/products/bay-leaves.jpg', 'whole', 'Aromatic dried bay leaves for stews, braises, and sauces.', 'Imported Turkish bay leaves with intact leaves and fresh herbal aroma. Adds subtle depth to slow-cooked dishes, master stocks, and marinades across multiple cuisines.', '20g', 'Turkey', ARRAY['chinese','vietnamese','thai'], true, false),
  ('five-spice-powder', 'five-spice-powder', 'Five Spice Powder', '五香粉', 25, '/images/products/five-spice.jpg', 'ground', 'Traditional blend of five aromatic spices in perfect harmony.', 'A balanced blend of star anise, Sichuan peppercorn, cinnamon, cloves, and fennel seeds. This quintessential Chinese spice mix adds warmth and complexity to roasted meats, marinades, and stir-fries.', '50g', 'House Blend', ARRAY['chinese','vietnamese'], true, true),
  ('white-pepper-powder', 'white-pepper-powder', 'White Pepper Powder', '白胡椒粉', 38, '/images/products/white-pepper.jpg', 'ground', 'Hainan white pepper with pure, clean heat. Ideal for soups and seafood.', 'Finely ground Hainan white peppercorns, prized for their sharp yet refined heat. Essential for hot and sour soup, wonton fillings, and Cantonese-style seafood dishes where black pepper would be too visible.', '40g', 'Hainan, China', ARRAY['chinese','thai','vietnamese'], true, false),
  ('mala-spice-blend', 'mala-spice-blend', 'Mala Spice Blend', '麻辣调味料', 42, '/images/products/mala-blend.jpg', 'blends', 'Authentic Sichuan mala seasoning. Numbing, spicy, and deeply savory.', 'A complex blend of Sichuan peppercorns, dried chilies, doubanjiang, and aromatics. Creates the signature ''mala'' flavor profile for hot pot, malatang, and dry pot dishes.', '150g', 'Sichuan, China', ARRAY['chinese'], true, true),
  ('char-siu-spice', 'char-siu-spice', 'Char Siu Spice', '叉烧调味粉', 36, '/images/products/bbq-spice.jpg', 'blends', 'Hong Kong-style BBQ spice blend. Sweet, savory, and aromatic.', 'Our signature char siu blend combines five-spice, fermented red bean curd essence, honey powder, and aromatics. Simply marinate and roast for restaurant-quality Cantonese BBQ pork at home.', '100g', 'House Blend', ARRAY['chinese'], true, false)
ON CONFLICT (id) DO NOTHING;

-- 3. 烹饪套装
INSERT INTO public.kits (id, slug, name, name_zh, price, image, description, details, servings, difficulty, estimated_time, in_stock, featured) VALUES
  ('hotpot-kit', 'hot-pot-spice-kit', 'Hot Pot Spice Kit', '火锅香料套装', 88, '/images/kits/hotpot-kit.jpg', 'Complete hot pot spice set with all essential aromatics and seasonings.', 'Everything you need for an authentic Sichuan hot pot experience at home. Includes premium dried chilies, Sichuan peppercorns, and our signature spice blend. Detailed recipe card included.', 'Serves 4-6', 'medium', '45 min', true, true),
  ('braised-pork-kit', 'braised-pork-spice-kit', 'Braised Pork Spice Kit', '红烧肉香料套装', 68, '/images/kits/braised-pork-kit.jpg', 'Classic red-braised pork spice set for rich, caramelized flavor.', 'The essential spices for Shanghai-style hong shao rou. Pre-portioned and ready to use. One kit makes enough for 1-1.5kg of pork belly.', 'Serves 4-6', 'medium', '90 min', true, true),
  ('mapo-tofu-kit', 'mapo-tofu-spice-kit', 'Mapo Tofu Spice Kit', '麻婆豆腐调味套装', 45, '/images/kits/mapo-tofu-kit.jpg', 'Authentic Sichuan mapo tofu seasoning. Numbing, spicy perfection.', 'Restaurant-quality mapo tofu at home. Includes Pixian doubanjiang, ground Sichuan peppercorn, and our signature chili oil blend.', 'Serves 2-3', 'easy', '20 min', true, true),
  ('kung-pao-kit', 'kung-pao-chicken-kit', 'Kung Pao Chicken Kit', '宫保鸡丁调味套装', 52, '/images/kits/hotpot-kit.jpg', 'Classic Sichuan kung pao seasoning with dried chilies and peppercorns.', 'All the spices and sauces needed for authentic kung pao chicken. Just add chicken, peanuts, and vegetables.', 'Serves 2-4', 'medium', '30 min', true, true)
ON CONFLICT (id) DO NOTHING;

-- 4. 食谱（ingredients / steps 用 JSONB）
INSERT INTO public.recipes (id, slug, title, title_zh, image, cook_time, servings, cuisine_id, description, difficulty, ingredients, steps, kit_id, featured) VALUES
  ('kung-pao-chicken', 'kung-pao-chicken', 'Kung Pao Chicken', '宫保鸡丁', '/images/recipes/kung-pao-chicken.jpg', '30 min', 4, 'chinese', 'Classic Sichuan stir-fry with tender chicken, crunchy peanuts, and the signature mala tingle.', 'medium',
   '["300g chicken breast, diced","50g roasted peanuts","10 dried red chilies","1 tsp Sichuan peppercorns","3 cloves garlic, minced","1 inch ginger, minced","2 tbsp soy sauce","1 tbsp Chinkiang vinegar","1 tbsp sugar"]'::jsonb,
   '["Marinate diced chicken with 1 tbsp soy sauce, 1 tsp cornstarch, and a splash of Shaoxing wine for 15 minutes.","Toast peanuts in a dry wok until fragrant. Set aside.","Heat oil over medium heat. Add dried chilies and Sichuan peppercorns, fry until fragrant (about 30 seconds). Remove peppercorns.","Turn heat to high. Add chicken and stir-fry until just cooked through, about 3-4 minutes.","Add garlic and ginger, stir-fry for 30 seconds.","Pour in the sauce (remaining soy sauce, vinegar, sugar, and a splash of water). Toss to coat.","Add peanuts, give a final toss, and serve immediately over rice."]'::jsonb,
   'kung-pao-kit', true),
  ('braised-pork-belly', 'red-braised-pork-belly', 'Red Braised Pork Belly', '红烧肉', '/images/recipes/braised-pork.jpg', '90 min', 6, 'chinese', 'Melt-in-your-mouth pork belly in a rich, caramelized soy glaze. The ultimate comfort food.', 'medium',
   '["500g pork belly, cut into 3cm cubes","30g rock sugar","2 star anise","1 cinnamon stick","3 bay leaves","3 tbsp light soy sauce","1 tbsp dark soy sauce","2 tbsp Shaoxing wine"]'::jsonb,
   '["Blanch pork belly in boiling water for 3 minutes to remove impurities. Drain and rinse.","In a dry wok or pot, melt rock sugar over low heat until it turns amber.","Add pork belly and toss to coat in caramel. The sugar will harden then melt again.","Add star anise, cinnamon, bay leaves, both soy sauces, and Shaoxing wine.","Add enough hot water to just cover the pork. Bring to a boil.","Reduce heat to low, cover, and simmer for 60-90 minutes until pork is tender.","Uncover and increase heat to reduce sauce until glossy and coating the meat."]'::jsonb,
   'braised-pork-kit', true),
  ('mapo-tofu', 'mapo-tofu', 'Mapo Tofu', '麻婆豆腐', '/images/recipes/mapo-tofu.jpg', '20 min', 4, 'chinese', 'Silky tofu in a fiery, numbing sauce. The definitive Sichuan comfort dish.', 'easy',
   '["400g soft tofu, cut into 2cm cubes","100g ground pork","2 tbsp Pixian doubanjiang","1 tsp Sichuan peppercorn powder","2 cloves garlic, minced","1 tbsp soy sauce","1 tsp cornstarch mixed with 2 tbsp water","2 green onions, chopped"]'::jsonb,
   '["Gently blanch tofu cubes in salted water for 2 minutes. This helps them hold shape. Drain carefully.","Heat oil in a wok over medium heat. Add ground pork and stir-fry until browned.","Push pork to the side, add doubanjiang to the oil and fry until the oil turns red.","Add garlic and stir briefly, then add 1 cup water and soy sauce. Bring to a simmer.","Gently slide in the tofu. Simmer for 3-5 minutes, gently stirring occasionally.","Drizzle in cornstarch slurry while gently stirring. Cook until sauce thickens.","Transfer to a serving bowl, sprinkle generously with Sichuan peppercorn powder and green onions."]'::jsonb,
   'mapo-tofu-kit', true),
  ('sichuan-hot-pot', 'sichuan-hot-pot', 'Sichuan Hot Pot', '四川火锅', '/images/dishes/hotpot-premium.jpg', '45 min', 6, 'chinese', 'The ultimate communal dining experience. Bubbling, spicy broth for cooking fresh ingredients.', 'medium',
   '["2L beef or chicken stock","100g beef tallow or vegetable oil","50g Pixian doubanjiang","30g dried chilies","20g Sichuan peppercorns","5 star anise","2 cinnamon sticks","1 cao guo (black cardamom)","Ginger, garlic, green onions"]'::jsonb,
   '["Heat tallow/oil in a large pot. Add doubanjiang and fry until oil turns red.","Add dried chilies and Sichuan peppercorns, fry for 1 minute until fragrant.","Add remaining whole spices, ginger, garlic. Fry another minute.","Pour in stock, bring to a boil, then simmer for 20 minutes to develop flavor.","Strain if desired for a cleaner broth, or leave spices in for more intensity.","Transfer to a hot pot burner at the table. Prepare dipping sauces (sesame oil, garlic, cilantro).","Add your choice of thinly sliced meats, vegetables, tofu, and noodles to cook in the bubbling broth."]'::jsonb,
   'hotpot-kit', false)
ON CONFLICT (id) DO NOTHING;

-- 5. 食谱 ↔ 香料
INSERT INTO public.recipe_spices (recipe_id, spice_id) VALUES
  ('kung-pao-chicken', 'sichuan-peppercorn'),
  ('braised-pork-belly', 'star-anise'),
  ('braised-pork-belly', 'cinnamon-sticks'),
  ('braised-pork-belly', 'bay-leaves'),
  ('mapo-tofu', 'sichuan-peppercorn'),
  ('mapo-tofu', 'mala-spice-blend'),
  ('sichuan-hot-pot', 'sichuan-peppercorn'),
  ('sichuan-hot-pot', 'star-anise'),
  ('sichuan-hot-pot', 'cinnamon-sticks'),
  ('sichuan-hot-pot', 'bay-leaves'),
  ('sichuan-hot-pot', 'mala-spice-blend')
ON CONFLICT (recipe_id, spice_id) DO NOTHING;

-- 6. 套装 ↔ 香料
INSERT INTO public.kit_spices (kit_id, spice_id) VALUES
  ('hotpot-kit', 'sichuan-peppercorn'),
  ('hotpot-kit', 'star-anise'),
  ('hotpot-kit', 'cinnamon-sticks'),
  ('hotpot-kit', 'bay-leaves'),
  ('braised-pork-kit', 'star-anise'),
  ('braised-pork-kit', 'cinnamon-sticks'),
  ('braised-pork-kit', 'bay-leaves'),
  ('mapo-tofu-kit', 'sichuan-peppercorn'),
  ('mapo-tofu-kit', 'mala-spice-blend'),
  ('kung-pao-kit', 'sichuan-peppercorn')
ON CONFLICT (kit_id, spice_id) DO NOTHING;

-- 7. 套装 ↔ 食谱
INSERT INTO public.kit_recipes (kit_id, recipe_id) VALUES
  ('hotpot-kit', 'sichuan-hot-pot'),
  ('braised-pork-kit', 'braised-pork-belly'),
  ('mapo-tofu-kit', 'mapo-tofu'),
  ('kung-pao-kit', 'kung-pao-chicken')
ON CONFLICT (kit_id, recipe_id) DO NOTHING;
