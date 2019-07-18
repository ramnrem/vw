import Vue from 'vue'
import Content from './Content'

import BaseColumn from './base/BaseColumn'
import BaseGrid from './base/BaseGrid'
import BaseForm from './base/BaseForm'
import BaseFilter from './base/BaseFilter'
import BasePage from './base/BasePage'
import BaseIndexPage from './base/BaseIndexPage'
import BaseNewPage from './base/BaseNewPage'
import BaseEditPage from './base/BaseEditPage'
import GridColumns from './base/GridColumns'

import StatusBadge from './resource/StatusBadge'
import ResourceStatusLine from './resource/StatusLine'
import History from './resource/History'
import Print from './resource/Print'

import PolymorphicSearchPage from './dialogs/PolymorphicSearchPage'
import CreateDialog from './dialogs/CreateDialog'
import SearchDialog from './dialogs/SearchDialog'

import QueryBuilder from './query-builder/QueryBuilder'

import RelationSelectInput from './controls/RelationSelectInput'
import GridInput from './controls/GridInput'
import Autocomplete from './controls/Autocomplete'
import Enumeration from './controls/Enumeration'
import SelectConstant from './controls/SelectConstant'
import CalendarEvent from './controls/CalendarEvent'

import CostPriceView from './views/CostPriceView'
import ResourceStatusBadge from './views/ResourceStatusBadge'

// Mixins
import LocaleMixin from './mixins/locale'

import './forms'

[
  Content,

  BaseForm,
  BaseColumn,
  BaseGrid,
  BasePage,
  BaseFilter,
  BaseIndexPage,
  BaseNewPage,
  BaseEditPage,
  GridColumns,

  History,
  Print,
  StatusBadge,
  ResourceStatusLine,

  PolymorphicSearchPage,

  CreateDialog,
  SearchDialog,

  RelationSelectInput,
  Autocomplete,
  Enumeration,
  GridInput,
  SelectConstant,
  QueryBuilder,
  CalendarEvent,

  CostPriceView,
  ResourceStatusBadge
].forEach(Component => {
  Vue.component(Component.name, Component)
})

Vue.mixin(LocaleMixin)