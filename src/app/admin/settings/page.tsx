import type { Metadata } from 'next'
import SettingsForm from './SettingsForm'

export const metadata: Metadata = {
  title: { absolute: 'Cài đặt · Admin · Alodev' },
  robots: { index: false, follow: false },
}

export default function AdminSettingsPage() {
  return <SettingsForm />
}
