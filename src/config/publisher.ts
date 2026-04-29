/**
 * Publisher / brand config for SEO-enriched article generation (alodev).
 * Keep fields parallel with onthi365's so the article import pipeline ports cleanly.
 */

export const PUBLISHER = {
  name: 'Alodev',
  legal_name: 'Alodev Studio',
  url: 'https://alodev.vn',
  logo: 'https://alodev.vn/logo.png',
  site_name: 'Alodev',
  locale: 'vi_VN',
  hreflang: 'vi-VN',
  twitter_handle: '@alodev',
} as const;

export interface AuthorDefaults {
  job_title: string;
  expertise: string[];
  social_profiles: string[];
  avatar: string;
  bio_fallback: string;
}

export const DEFAULT_AUTHOR: AuthorDefaults = {
  job_title: 'Founder & lead developer, Alodev',
  expertise: ['Next.js', 'React', 'TypeScript', 'Cloudflare', 'SEO kỹ thuật', 'Mobile app', 'CRM/ERP'],
  social_profiles: ['https://alodev.vn/ve-chung-toi#founder'],
  avatar: 'https://alodev.vn/og-image.png',
  bio_fallback:
    'Trần Công Thắng — founder Alodev, studio thiết kế web & lập trình app với 11+ sản phẩm vận hành thật cho doanh nghiệp Việt.',
};

export const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const SRCSET_WIDTHS = [400, 800, 1200] as const;

export const IMAGE_SIZES = {
  featured: '(max-width: 768px) 100vw, 1200px',
  inline: '(max-width: 768px) 100vw, 800px',
} as const;

export const OG_IMAGE = { width: 1200, height: 630 } as const;

export const READING_WPM = 220;

export const POST_PUBLISH_CHECKLIST: Array<{
  key: string;
  label: string;
  url?: string;
}> = [
  { key: 'gsc_index', label: 'Submit URL vào Google Search Console', url: 'https://search.google.com/search-console' },
  { key: 'rich_results', label: 'Test Rich Results', url: 'https://search.google.com/test/rich-results' },
  { key: 'fb_debug', label: 'Refresh cache Facebook Debugger', url: 'https://developers.facebook.com/tools/debug/' },
  { key: 'twitter_debug', label: 'Refresh cache Twitter Card Validator', url: 'https://cards-dev.twitter.com/validator' },
  { key: 'internal_links', label: 'Thêm internal links từ 2-3 bài liên quan' },
  { key: 'webp', label: 'Convert ảnh lớn sang WebP để giảm LCP' },
  { key: 'cwv', label: 'Check Core Web Vitals', url: 'https://pagespeed.web.dev/' },
  { key: 'share_purge', label: 'Share social + purge CDN cache' },
];

export const CONTENT_TYPES = ['guide', 'listicle', 'how-to', 'review', 'comparison', 'news'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const PRIMARY_INTENTS = ['informational', 'commercial', 'transactional'] as const;
export type PrimaryIntent = (typeof PRIMARY_INTENTS)[number];

/** Article tag → human display label. Alodev's blog uses comma-separated tag strings,
 *  not predefined slugs, so this map mostly forwards values unchanged. */
export const CATEGORY_LABELS: Record<string, string> = {
  'nextjs': 'Next.js',
  'seo': 'SEO',
  'cloudflare': 'Cloudflare',
  'mobile': 'Mobile App',
  'crm': 'CRM/ERP',
  'case-study': 'Case Study',
  'founder-perspective': 'Founder Perspective',
  'stack-choice': 'Lựa chọn stack',
};
