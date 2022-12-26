/**
 * GA integration
 * https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics
 */
import { processEnv } from '@lib/processEnv'

export const GA_TRACKING_ID = processEnv.gaMeasurementId

/**
 * Custom event type for Google Analytics.
 * The action field is required.
 */
export interface EventType {
  action: string,
  category?: string,
  label?: string,
  value?: string
}

/**
 * Triggers a GA page view event.
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 * 
 * @param {string} url The URL to save the page view event with.
 */
export const pageview = (url: string): void => {
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

/**
 * Pushes a custom GA event.
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/events
 * 
 * @param {EventType} parameters The event parameters.
 */
export const event = ({ action, category, label, value }: EventType): void => {
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
