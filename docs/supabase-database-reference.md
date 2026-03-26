# Supabase Database Reference (Confirmed Snapshot)

This document stores the confirmed online schema metadata provided from Supabase queries.
Use it as the canonical reference before writing SQL updates.

## Foreign Keys

| table_name | column_name | foreign_table_name | foreign_column_name |
|---|---|---|---|
| kit_recipes | kit_id | kits | id |
| kit_recipes | recipe_id | recipes | id |
| kit_spices | kit_id | kits | id |
| kit_spices | spice_id | spices | id |
| order_items | order_id | orders | id |
| recipe_spices | recipe_id | recipes | id |
| recipe_spices | spice_id | spices | id |
| recipes | cuisine_id | cuisines | id |
| recipes | kit_id | kits | id |

## Primary Key / Unique Constraints

| table_name | constraint_type | constraint_name | column_name |
|---|---|---|---|
| addresses | PRIMARY KEY | addresses_pkey | id |
| cuisines | PRIMARY KEY | cuisines_pkey | id |
| kit_recipes | PRIMARY KEY | kit_recipes_pkey | recipe_id |
| kit_recipes | PRIMARY KEY | kit_recipes_pkey | kit_id |
| kit_spices | PRIMARY KEY | kit_spices_pkey | kit_id |
| kit_spices | PRIMARY KEY | kit_spices_pkey | spice_id |
| kits | PRIMARY KEY | kits_pkey | id |
| kits | UNIQUE | kits_slug_key | slug |
| order_items | PRIMARY KEY | order_items_pkey | id |
| orders | PRIMARY KEY | orders_pkey | id |
| profiles | PRIMARY KEY | profiles_pkey | id |
| recipe_spices | PRIMARY KEY | recipe_spices_pkey | spice_id |
| recipe_spices | PRIMARY KEY | recipe_spices_pkey | recipe_id |
| recipes | PRIMARY KEY | recipes_pkey | id |
| recipes | UNIQUE | recipes_slug_key | slug |
| reviews | PRIMARY KEY | reviews_pkey | id |
| spices | PRIMARY KEY | spices_pkey | id |
| spices | UNIQUE | spices_slug_key | slug |

## Indexes

- `addresses`: `addresses_pkey`, `idx_addresses_user_id`
- `cuisines`: `cuisines_pkey`
- `kit_recipes`: `kit_recipes_pkey`, `idx_kit_recipes_kit`, `idx_kit_recipes_recipe`
- `kit_spices`: `kit_spices_pkey`, `idx_kit_spices_kit`, `idx_kit_spices_spice`
- `kits`: `kits_pkey`, `kits_slug_key`, `idx_kits_featured`, `idx_kits_slug`
- `order_items`: `order_items_pkey`, `idx_order_items_order_id`
- `orders`: `orders_pkey`, `idx_orders_user_id`, `idx_orders_created_at`
- `profiles`: `profiles_pkey`
- `recipe_spices`: `recipe_spices_pkey`, `idx_recipe_spices_recipe`, `idx_recipe_spices_spice`
- `recipes`: `recipes_pkey`, `recipes_slug_key`, `idx_recipes_cuisine`, `idx_recipes_featured`, `idx_recipes_slug`
- `reviews`: `reviews_pkey`, `idx_reviews_product`, `idx_reviews_created_at`
- `spices`: `spices_pkey`, `spices_slug_key`, `idx_spices_category`, `idx_spices_featured`, `idx_spices_slug`

## RLS Policies

| table_name | policyname | cmd |
|---|---|---|
| addresses | Users can manage own addresses | ALL |
| cuisines | Allow public read cuisines | SELECT |
| kit_recipes | Allow public read kit_recipes | SELECT |
| kit_spices | Allow public read kit_spices | SELECT |
| kits | Allow public read kits | SELECT |
| order_items | Users can insert order items for own order | INSERT |
| order_items | Users can read own order items | SELECT |
| orders | Users can insert own orders | INSERT |
| orders | Users can read own orders | SELECT |
| profiles | Users can read own profile | SELECT |
| profiles | Users can update own profile | UPDATE |
| recipe_spices | Allow public read recipe_spices | SELECT |
| recipes | Allow public read recipes | SELECT |
| reviews | Allow anyone to insert review | INSERT |
| reviews | Allow public read reviews | SELECT |
| spices | Allow public read spices | SELECT |

## Practical Notes

- Current public content read path is open via RLS `SELECT true` on content tables.
- `reviews` allows public inserts; if spam appears later, add rate-limit or authenticated insert policy.
- For product operations, use `spices.id` as stable key and keep `slug` unique.
