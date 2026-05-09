// Common framework: insert posts into D1 with full SEO metadata.
// Each batch script imports insertPosts() và truyền array<PostInput>.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = '/home/claude/104/projects/alodev'
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT,'.d1.env'),'utf8').split('\n').filter(Boolean).map(l=>l.split('=').map(s=>s.trim()))
)
const { CLOUDFLARE_ACCOUNT_ID:ACC, CLOUDFLARE_API_TOKEN:TOK, D1_DATABASE_ID:DB } = env

export async function d1(sql, params=[]) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACC}/d1/database/${DB}/query`, {
    method:'POST', headers:{Authorization:`Bearer ${TOK}`,'Content-Type':'application/json'},
    body: JSON.stringify({sql, params}),
  })
  const j = await r.json()
  if (!j.success) throw new Error(JSON.stringify(j.errors))
  return j.result?.[0]
}

function uuid() {
  // simple deterministic-ish uuid
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random()*16)|0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function insertPosts(posts, opts = {}) {
  let ok = 0, dup = 0
  for (const p of posts) {
    // Check dup
    const exist = await d1('SELECT id FROM blog_posts WHERE slug = ?', [p.slug])
    if (exist.results.length) {
      if (opts.skipDup) { dup++; continue }
      // Update existing
      await d1(`UPDATE blog_posts SET
        title=?, seo_title=?, description=?, focus_keyword=?,
        content_html=?, content='', tags=?,
        lsi_keywords=?, faq=?, key_takeaways=?, related_entities=?,
        content_type=?, primary_intent=?, reading_min=?,
        cover_image=?, status='published',
        updated_at=?, published_at=COALESCE(published_at, ?)
        WHERE slug=?`,
        [p.title, p.seo_title, p.description, p.focus_keyword,
         p.content_html, p.tags.join(','),
         JSON.stringify(p.lsi_keywords), JSON.stringify(p.faq),
         JSON.stringify(p.key_takeaways), JSON.stringify(p.related_entities),
         p.content_type, p.primary_intent, p.reading_min,
         p.cover_image || null,
         new Date().toISOString(), new Date().toISOString(),
         p.slug])
    } else {
      const now = new Date().toISOString()
      await d1(`INSERT INTO blog_posts
        (id, slug, title, seo_title, description, focus_keyword,
         content, content_html, tags, author_name,
         lsi_keywords, faq, key_takeaways, related_entities,
         content_type, primary_intent, reading_min,
         cover_image, status, published_at, created_at, updated_at)
        VALUES (?,?,?,?,?,?, '',?,?,?, ?,?,?,?, ?,?,?, ?, 'published', ?,?,?)`,
        [uuid(), p.slug, p.title, p.seo_title, p.description, p.focus_keyword,
         p.content_html, p.tags.join(','), 'Trần Công Thắng',
         JSON.stringify(p.lsi_keywords), JSON.stringify(p.faq),
         JSON.stringify(p.key_takeaways), JSON.stringify(p.related_entities),
         p.content_type, p.primary_intent, p.reading_min,
         p.cover_image || null, now, now, now])
    }
    ok++
  }
  console.log(`Inserted/updated: ${ok}, skipped (dup): ${dup}`)
}

// Helper to validate post object before insert
export function validatePost(p) {
  const errors = []
  if (!p.slug || p.slug.length > 60) errors.push(`slug bad: ${p.slug}`)
  if (!p.title || p.title.length < 30 || p.title.length > 65) errors.push(`title len ${p.title?.length}`)
  if (!p.seo_title || p.seo_title.length < 40 || p.seo_title.length > 65) errors.push(`seo_title len ${p.seo_title?.length}`)
  if (!p.description || p.description.length < 120 || p.description.length > 160) errors.push(`description len ${p.description?.length}`)
  if (!p.focus_keyword) errors.push('no focus_keyword')
  if (!p.tags || p.tags.length < 5) errors.push(`tags ${p.tags?.length}`)
  if (!p.lsi_keywords || p.lsi_keywords.length < 5) errors.push(`lsi ${p.lsi_keywords?.length}`)
  if (!p.faq || p.faq.length < 4) errors.push(`faq ${p.faq?.length}`)
  if (!p.key_takeaways || p.key_takeaways.length < 4) errors.push(`keys ${p.key_takeaways?.length}`)
  if (!p.related_entities || p.related_entities.length < 3) errors.push(`rel ${p.related_entities?.length}`)
  if (!p.content_html || p.content_html.length < 4000) errors.push(`content ${p.content_html?.length}`)
  // Check focus_keyword in title and description
  const norm = (s) => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')
  if (!norm(p.seo_title).includes(norm(p.focus_keyword))) errors.push(`fk not in seo_title`)
  if (!norm(p.description).includes(norm(p.focus_keyword))) errors.push(`fk not in description`)
  return errors
}
