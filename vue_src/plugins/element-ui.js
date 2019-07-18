import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ruLocale from '../locales/ru'
import ElementLocale from 'element-ui/lib/locale'
import { i18n } from './i18n'

Vue.use(ElementUI, { ruLocale })

ElementLocale.i18n((key, value) => i18n.t(key, value))
