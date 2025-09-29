import { app } from "./layout/App.ts"
import { plugin_ElementPlus } from "./plugins/plugin_ElementPlus.ts"
import { plugin_pinia } from "./plugins/plugin_pinia.ts"
import { plugin_UnoCss } from "./plugins/plugin_UnoCss.ts"
import router from "./router"
async function main() {
  // await plugin_ElementPlus({ app });
  await plugin_pinia({ app })
  await plugin_UnoCss({ app })
  app.use(router)
  app.mount("#app")
}
main()
