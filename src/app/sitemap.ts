import type { MetadataRoute } from 'next'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { projects } from '@/data/projects'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://alodev.vn'

/**
 * Real `lastModified` from filesystem mtimes — Google, Bing and AI crawlers
 * use this signal to decide re-crawl priority. The default `new Date()` on
 * every page lies (every page is "modified today") and gets discounted.
 *
 * Resolution strategy:
 *   • Static pages → mtime of the page.tsx file itself.
 *   • Project pages → max(mtime of [slug]/page.tsx, mtime of projects.ts)
 *     so portfolio additions/edits in projects.ts propagate even when the
 *     route file hasn't changed.
 *   • Build time as the floor — never report a date BEFORE deploy time
 *     (otherwise a brand-new deploy of un-edited content looks stale).
 */
const APP_DIR = join(process.cwd(), 'src', 'app')
const PROJECTS_DATA = join(process.cwd(), 'src', 'data', 'projects.ts')
const BUILD_NOW = new Date()

function fileMTime(absPath: string, fallback: Date = BUILD_NOW): Date {
  try {
    return statSync(absPath).mtime
  } catch {
    return fallback
  }
}

function pageMTime(routeRelPath: string): Date {
  return fileMTime(join(APP_DIR, routeRelPath, 'page.tsx'))
}

const projectsDataMTime = fileMTime(PROJECTS_DATA)
const projectRouteMTime = fileMTime(join(APP_DIR, 'du-an', '[slug]', 'page.tsx'))
const projectPageBaseline = projectsDataMTime > projectRouteMTime ? projectsDataMTime : projectRouteMTime

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                            lastModified: pageMTime(''),                              changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${BASE}/dich-vu`,                     lastModified: pageMTime('dich-vu'),                       changeFrequency: 'monthly', priority: 0.9  },
    { url: `${BASE}/dich-vu/thiet-ke-website`,    lastModified: pageMTime('dich-vu/thiet-ke-website'),      changeFrequency: 'monthly', priority: 0.9  },
    { url: `${BASE}/dich-vu/lap-trinh-app-mobile`,lastModified: pageMTime('dich-vu/lap-trinh-app-mobile'),  changeFrequency: 'monthly', priority: 0.9  },
    { url: `${BASE}/dich-vu/he-thong-quan-tri`,   lastModified: pageMTime('dich-vu/he-thong-quan-tri'),     changeFrequency: 'monthly', priority: 0.9  },
    { url: `${BASE}/du-an`,                       lastModified: pageMTime('du-an'),                         changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}/blog`,                        lastModified: pageMTime('blog'),                          changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/bao-gia`,                     lastModified: pageMTime('bao-gia'),                       changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/ve-chung-toi`,                lastModified: pageMTime('ve-chung-toi'),                  changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/lien-he`,                     lastModified: pageMTime('lien-he'),                       changeFrequency: 'yearly',  priority: 0.6  },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/du-an/${p.slug}`,
    lastModified: projectPageBaseline,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Blog posts — sourced from D1 sync at build time. lastmod = post's
  // updated_at (real edit signal, not deploy time).
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages, ...blogPages]
}
