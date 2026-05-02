import type { Metadata } from 'next'
import BlogEditor from '../BlogEditor'

export const metadata: Metadata = {
  title: { absolute: 'Sửa bài · Blog · Admin · Alodev' },
  robots: { index: false, follow: false },
}

/**
 * Static page; reads ?id= from URL at runtime (BlogEditor is client component).
 * Avoids dynamic route segment which would force `dynamicParams: false` /
 * `generateStaticParams` returning all known IDs at build time — but blog
 * IDs come from D1 and are unknown to the admin shell.
 */
export default function EditBlogPostPage() {
  return <BlogEditor mode="edit" />
}
