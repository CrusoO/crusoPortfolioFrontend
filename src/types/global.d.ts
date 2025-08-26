// Global type declarations for better TypeScript support

declare global {
  interface Window {
    gsap?: any
  }
}

// Vue component types
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Export empty object to make this a module
export {}
