import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import ruLocale from '../locales/ru'

export const i18n = new VueI18n({ locale: 'ru', messages: { ru: ruLocale } })