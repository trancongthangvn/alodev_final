import type { Metadata } from 'next'
import AnalyticsDashboard from './AnalyticsDashboard'

export const metadata: Metadata = {
  title: { absolute: 'Analytics · Admin · Alodev' },
  robots: { index: false, follow: false },
}

export default function AdminAnalyticsPage() {
  return <AnalyticsDashboard />
}
