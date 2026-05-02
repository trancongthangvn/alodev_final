import type { Metadata } from 'next'
import BlogList from './BlogList'

export const metadata: Metadata = {
  title: { absolute: 'Blog · Admin · Alodev' },
  robots: { index: false, follow: false },
}

export default function AdminBlogPage() {
  return <BlogList />
}
