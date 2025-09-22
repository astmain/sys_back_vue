import { app } from "./layout/App.ts"
import { plugin_ElementPlus } from "./plugins/plugin_ElementPlus.ts"
import { plugin_pinia } from "./plugins/plugin_pinia.ts"
async function main() {
  // await plugin_ElementPlus({ app });
  await plugin_pinia({ app })
  app.mount("#app")
}
main()
