import { app } from './layout/App';

import './plugins/tailwind.css';
import './plugins/uno_css.ts';

async function main() {
  app.mount('#app');
}
main();
