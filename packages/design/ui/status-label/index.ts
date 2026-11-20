export { default as StatusLabel } from './StatusLabel.vue'

/** success, warning and destructive for outcomes; info for a neutral fact worth noticing; neutral for an idle state; running for work in progress (a spinning icon). */
export type StatusTone = 'success' | 'warning' | 'destructive' | 'info' | 'neutral' | 'running'
