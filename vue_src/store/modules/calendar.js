import Vue from 'vue'
import Calendar from "../../models/Calendar";

var moment = require("moment");

const DATE_FORMAT = "DD.MM.YYYY";
const TIME_FORMAT = "DD.MM.YYYY HH:mm";

function datesRange(start, finish) {
  let dates = []
  let daysCount = finish.diff(start, "days") + 1

  for (let i = 0; i < daysCount; i++) dates.push(moment(start).add(i, "day"))

  return dates
}

export const types = {
  SET_LOADING: 'SET_LOADING',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_PERIOD: 'SELECT_PERIOD',
  SET_PERIOD_TYPE: 'SET_PERIOD_TYPE',
  SET_TYPE: 'SET_TYPE',
  SET_FILTER: 'SET_FILTER',
  SET_FILTER: 'SET_FILTER',
  SET_DATA: 'SET_DATA',
  SET_ITEMS: 'SELECT_ITEMS'
}

export const state = {
  loading: false,
  settings: {},
  filter: {
    trainer_ids: [],
    trainer_color: null,
    manager_ids: [],
    manager_color: null,
    room_ids: [],
    room_color: null,
    account_ids: [],
    account_color: null,
    assistant_ids: [],
    assistant_color: null
  },
  period: [],
  periodType: 'month',
  type: null,
  dates: [],
  groups: [],
  data: {}
}

export const getters = {
  loading: state => state.loading,
  settings: state => state.settings,
  filter: state => state.filter,
  period: state => state.period.map(d => d.format(DATE_FORMAT)),
  periodType: state => state.periodType,
  type: state => state.type,
  dates: state => state.dates,
  groups: state => state.groups
}

export const mutations = {
  [types.SET_LOADING](state, value) {
    state.loading = value
  },
  [types.SET_SETTINGS](state, settings) {
    state.settings = settings
    state.type = state.type || settings.default_type
  },
  [types.SET_PERIOD](state, period) {
    state.period = period
    state.dates = datesRange(state.period[0], state.period[1])
  },
  [types.SET_PERIOD_TYPE](state, periodType) {
    state.periodType = periodType
  },
  [types.SET_TYPE](state, type) {
    state.type = type
  },
  [types.SET_FILTER](state, filter) {
    state.filter = filter
  },
  [types.SET_DATA](state, data) {
    state.data = data
  },
  [types.SET_ITEMS](state, data) {
    if (data) {
      let weekends = data.meta.weekends.data.flatMap(weekend => {
        return datesRange(moment(weekend.attributes.start_date), moment(weekend.attributes.finish_date))
      })      
      let calendar = new Calendar(
        data.data,
        state.dates,
        state.type,
        weekends,
        state.filter,
        state.settings.hide_items
      );

      state.groups = calendar.groups
    } else {
      state.groups = []
    }
  }
}

export const actions = {
  findSettings(context) {
    context.commit(types.SET_LOADING, true)

    return Vue.resource('calendar/user_setting').get().then(response => {
      context.commit(types.SET_SETTINGS, response.data)
      context.commit(types.SET_LOADING, false)
    }).catch((error) => {
      context.commit(types.SET_LOADING, false)

      return error
    })
  },
  saveSettings(context, settings) {
    context.commit(types.SET_LOADING, true)

    return Vue.resource('calendar/user_setting').update(settings).then(response => {
      context.commit(types.SET_SETTINGS, response.data)
      context.commit(types.SET_LOADING, false)

      context.dispatch('selectItems')
    }).catch((error) => {
      context.commit(types.SET_LOADING, false)

      throw error;
    })
  },
  setPeriod(context, period) {
    context.commit(types.SET_PERIOD, period.map(d => moment(d, DATE_FORMAT)))

    context.dispatch('selectItems')
  },
  setFilter(context, filter) {    
    context.commit(types.SET_LOADING, true)
    context.commit(types.SET_FILTER, filter)
    context.commit(types.SET_ITEMS, context.state.data)
    context.commit(types.SET_LOADING, false)
  },
  initState(context, state) {        
    if (state.filter) context.commit(types.SET_FILTER, state.filter)
    if (state.type) context.commit(types.SET_TYPE, state.type)
    if (state.periodType) context.commit(types.SET_PERIOD_TYPE, state.periodType)
    if (state.period) context.commit(types.SET_PERIOD, state.period.map(d => moment(d, DATE_FORMAT)))    
  },
  prevPeriod(context) {
    var period = [
      context.state.period[0].add(-1, context.state.periodType)
      .startOf(context.state.periodType),
      context.state.period[1].add(-1, context.state.periodType)
      .endOf(context.state.periodType)
    ];

    context.dispatch('setPeriod', period)
  },
  nextPeriod(context) {
    var period = [
      context.state.period[0].add(1, context.state.periodType)
      .startOf(context.state.periodType),
      context.state.period[1].add(1, context.state.periodType)
      .endOf(context.state.periodType)
    ];

    context.dispatch('setPeriod', period)
  },
  setPeriodType(context, periodType) {
    context.commit(types.SET_PERIOD_TYPE, periodType)

    let start = state.period[0].startOf(periodType)
    let finish = moment(start).endOf(periodType)

    context.dispatch('setPeriod', [start, finish])
  },
  setType(context, type) {
    context.commit(types.SET_TYPE, type)

    context.dispatch('selectItems')
  },
  selectItems(context) {
    context.commit(types.SET_LOADING, true)
    context.commit(types.SET_ITEMS, null)

    return Vue.resource("calendar/items")
      .get({
        period: context.getters.period,
        type: context.getters.type
      })
      .then(response => {
        context.commit(types.SET_DATA, response.data)
        context.commit(types.SET_ITEMS, response.data)
        context.commit(types.SET_LOADING, false)
      })
      .catch(error => {
        context.commit(types.SET_LOADING, false)

        throw error;
      });
  },
  destroyItem(context, id) {
    context.commit(types.SET_LOADING, true)
    
    return Vue.resource("calendar/items{/id}")
      .delete({id: id})
      .then(response => {
        context.commit(types.SET_LOADING, false)
      })
      .catch(error => {
        context.commit(types.SET_LOADING, false)

        throw error;
      });
  }
}

mutations[types.SET_PERIOD](state, [moment().startOf(state.periodType), moment().endOf(state.periodType)]);
