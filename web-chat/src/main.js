import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
//创建v-highlight全局指令
app.directive('highlight',function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
  })