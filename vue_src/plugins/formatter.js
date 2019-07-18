import Vue from 'vue'

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ' '));
};

const Formatter = {
  install(Vue, options) {
    Object.defineProperty(Vue.prototype, '$formatter', {
      get: function get() {
        return {
          formatColumnDate(column, row, value, index) {
            if (!value) {
              return value
            }

            let date = value.split('T')[0].split('-')

            return [date[2], date[1], date[0]].join('.')
          },
          formatColumnTime(column, row, value, index) {
            if (!value) return ''

            let date = new Date(value)

            return date.toLocaleDateString('ru-RU') + ' ' +
              date.toLocaleTimeString('ru-RU', {
                timeZone: 'Europe/Moscow',
                hour: '2-digit',
                minute: '2-digit'
              })
          },
          formatDate(value) {
            if (!value) return ''

            let date = new Date(value)

            return date.toLocaleDateString('ru-RU')
          },
          formatTime(value) {
            if (!value) return ''

            let date = new Date(value)

            return date.toLocaleDateString('ru-RU') + ' ' +
              date.toLocaleTimeString('ru-RU', {
                timeZone: 'Europe/Moscow',
                hour: '2-digit',
                minute: '2-digit'
              })
          },
          formatDuration(value, unit) {
            if (!value) return ''

            if (unit === 'day') {
              unit = 'д.'
            } else if (unit === 'hour') {
              unit = 'ч.'
            }

            return `${value} ${unit}`
          },
          formatColumnCurrency(column, row, value, index) {
            if (!value) {
              return value
            }


            value = Number(value)

            return value.format(2)
          },
          formatColumnBoolean(column, row, value, index) {
            if (!value) {
              return value
            }

            return value ? 'Да': ''
          },
          formatColumnVat(column, row, value, index) {
            if (!value || value === '-1' || value === -1) {
              return 'Без НДС'
            }

            return `${value}%`
          },
          formatCurrency(value) {
            if (!value) {
              return value
            }


            value = Number(value)

            return value.format(2)
          },
          formatInteger(value) {
            if (!value) {
              return value
            }

            value = Number(value)

            return value.format(0)
          }
        }
      },
    })
  },
}

Vue.use(Formatter)
