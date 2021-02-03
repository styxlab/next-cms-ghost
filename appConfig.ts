/**
 * Some of the defaults defined here can be overwritten by environment variables
 * Check lib/environments.ts
 */

// Cache control
export const fileCache: boolean = true

// Dark mode
export type DarkMode = 'dark' | 'light' | null
export const defaultMode: DarkMode = 'light'
export const overrideOS: boolean = true

// Images
export const nextFeatureImages: boolean = true
export const nextInlineImages: boolean = true
export const imageQuality: number = 80
export const sourceImages: boolean = false

// RSS
export const rssFeed: boolean = true

// Ghost Member Subscriptions
export const memberSubscriptions: boolean = true

// Commenting system
export type CommentingSystem = 'commento' | 'disqus' | null
export const commenting: CommentingSystem = null

export const commentoUrl: string = 'https://cdn.commento.io' // 'https://commento.your-blog.com'
export const disqusShortname: string = 'short-name-here'

// PrismJS
export const prism: boolean = true
export const prismIgnoreMissing: boolean = true

// Contact Page
export const contactPage: boolean = true
export const customPage = {}

// Table of Contents
export const toc: boolean = true
export const maxDepth: number = 2

// Custom site navigation (default: [], label is case sensitive)
// Override: [{ label: 'Home', url: '/' }]
// Add new: [{ label: 'Contact', url: '/contact' }]
import { NavItem } from '@lib/ghost'
export const customNavigation: NavItem[] = [{ label: 'Contact', url: '/contact' }]

// Incremental Static Regenerations (ISR)
export const isr: boolean = true
export const maxNumberOfPosts: number = 20
export const maxNumberOfPages: number = 20
