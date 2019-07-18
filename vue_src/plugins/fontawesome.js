import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faPlus, faDownload, faPencilAlt, faFilter, faBars, faCogs, faTimes, faCalculator, faCog, faPrint, faHistory, faSync, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSignOutAlt, faPlus, faDownload, faPencilAlt, faFilter, faBars, faCogs, faTimes, faCalculator, faCog, faPrint, faHistory, faSync, faSearch)

Vue.component('font-awesome-icon', FontAwesomeIcon)
