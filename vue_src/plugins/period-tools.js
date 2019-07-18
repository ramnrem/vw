import Vue from 'vue'

var moment = require("moment");

const PeriodTools = {
  install(Vue, options) {
    Object.defineProperty(Vue.prototype, '$periodTools', {
      get: function get() {
        return {
          calculateDuration(context, timePeriod, callback) {
            if (!Array.isArray(context.period)) return
            
            context.unit = context.unit || "day";

            let start = moment(context.period[0]);
            let finish = moment(context.period[1]);
            let duration = finish.diff(start, context.unit) + (context.unit == 'day' ? 1 : 0)
            let days = finish.diff(start, "day")

            if (context.unit == "hour") duration = duration - days * (24 - 8)

            Object.assign(context, {duration: duration});

            if (typeof callback == 'function') callback()
          },
        }
      },
    })
  },
}

Vue.use(PeriodTools)
