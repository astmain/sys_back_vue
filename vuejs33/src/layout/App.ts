import { createApp } from 'vue';
// 自定义
import App from './App.vue';
import router from '../router';

const app = createApp(App);

app.use(router);


export { app };
