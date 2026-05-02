import type { Metadata } from 'next'
import AdminInbox from './AdminInbox'

/**
 * /admin — lead inbox (Tier 1). Static page; data fetched client-side
 * from /api/admin/leads which lives behind Basic Auth (browser sends the
 * same Authorization header automatically once the user is authenticated
 * for /admin via the middleware).
 *
 * No layout/footer/nav: this is an internal tool, not part of the public
 * marketing surface. Robots metadata blocks indexing as a defense layer
 * (middleware already injects X-Robots-Tag).
 */

export const metadata: Metadata = {
  title: { absolute: 'Admin — Alodev Leads' },
  robots: { index: false, follow: false, noarchive: true, nocache: true },
}

export default function AdminPage() {
  return <AdminInbox />
}
