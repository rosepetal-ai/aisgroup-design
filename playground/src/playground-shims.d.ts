declare module '@/playground/ComponentPage.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{ page: { id: string, title: string, description?: string } }>
  export default component
}
