import type { Metadata } from 'next'
import BlogEditor from '../BlogEditor'

export const metadata: Metadata = {
  title: { absolute: 'Bài mới · Blog · Admin · Alodev' },
  robots: { index: false, follow: false },
}

export default function NewBlogPostPage() {
  return <BlogEditor mode="new" />
}
