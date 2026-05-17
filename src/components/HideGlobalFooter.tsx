'use client'
import { useEffect } from 'react'

/**
 * Adds `home-mag-page` class to <body> while the homepage is mounted.
 * CSS in globals.css hides #global-footer when this class is present.
 * The compact in-column footer inside .mag-scroll takes its place.
 * Cleans up on unmount so other pages aren't affected.
 */
export default function HideGlobalFooter() {
  useEffect(() => {
    document.body.classList.add('home-mag-page')
    return () => document.body.classList.remove('home-mag-page')
  }, [])
  return null
}
