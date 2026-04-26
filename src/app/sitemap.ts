import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://alodev.vn'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/dich-vu`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Service detail pages — keyword-targeted landing pages
    { url: `${BASE}/dich-vu/thiet-ke-website`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/dich-vu/lap-trinh-app-mobile`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/dich-vu/he-thong-quan-tri`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/bao-gia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/du-an`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/ve-chung-toi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/lien-he`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/du-an/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
  return [...staticPages, ...projectPages]
}
