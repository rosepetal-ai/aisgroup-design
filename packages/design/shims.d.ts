// For the typecheck only: the InspectionGrid block is plain JS, so vue-tsc gets its props from here (as in the playground).
declare module '*InspectionGrid.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{ paused?: boolean }>
  export default component
}
