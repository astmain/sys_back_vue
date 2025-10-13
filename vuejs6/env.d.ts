/// <reference types="vite/client" />

declare module "vue-drag-resize/src" {
  import { DefineComponent } from "vue"
  const VueDragResize: DefineComponent<any, any, any>
  export default VueDragResize
}



declare global {
  interface Document {
    querySelector<E extends Element = Element>(selectors: string): E
  }
}