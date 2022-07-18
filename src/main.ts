import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import {
  Button,
  Tabbar,
  TabbarItem,
  Popup,
  Icon,
  List,
  NumberKeyboard,
  Field,
  DatetimePicker,
  CellGroup,
  Cell,
  NavBar,
  Progress,
} from 'vant'

import './assets/main.css'

const vantComponents = [
  Button,
  Tabbar,
  TabbarItem,
  Popup,
  Icon,
  List,
  NumberKeyboard,
  Field,
  DatetimePicker,
  CellGroup,
  Cell,
  NavBar,
  Progress,
]

const app = createApp(App)

app.use(router)
app.use(pinia)
vantComponents.forEach(component => app.use(component))

app.mount('#app')
