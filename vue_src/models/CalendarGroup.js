var moment = require("moment");

const DATE_FORMAT = "DD.MM.YYYY";

const colorScheme = {
  cost_price_created_cc: {
    backgroundColor: "#e0e0e0",
    color: "#000000"
  },
  cost_price_in_progress_cc: {
    backgroundColor: "#e0e0e0",
    color: "#000000"
  },
  cost_price_completed_cc: {
    backgroundColor: "#666666",
    color: "#ffffff"
  },
  cost_price_created_oe: {
    backgroundColor: "#f6f6f6",
    color: "#000000"
  },
  cost_price_in_progress_oe: {
    backgroundColor: "#f6f6f6",
    color: "#000000"
  },
  cost_price_completed_oe: {
    backgroundColor: "#666666",
    color: "#ffffff"
  },
  cost_price_created_ev: {
    backgroundColor: "#f6f6f6",
    color: "#000000"
  },
  cost_price_in_progress_ev: {
    backgroundColor: "#f6f6f6",
    color: "#000000"
  },
  cost_price_completed_ev: {
    backgroundColor: "#666666",
    color: "#ffffff"
  },
  cost_price_additional_cc: {
    backgroundColor: "#008000",
    color: "#ffffff"
  },
  cost_price_additional_oe: {
    backgroundColor: "#008000",
    color: "#ffffff"
  },
  cost_price_additional_ev: {
    backgroundColor: "#008000",
    color: "#ffffff"
  },
  trainer_absence: {
    backgroundColor: "#d2e9ff",
    color: "#000000"
  },
  room_reservation: {
    backgroundColor: "#b3ffbf",
    color: "#000000"
  },
  external: {
    backgroundColor: "#fdda51",
    color: "#000000"
  },
  private: {
    backgroundColor: "#ff0000",
    color: "#ffffff"
  },
  weekend: {
    backgroundColor: "#fffacd",
    color: "#000000"
  },
  blank: {
    backgroundColor: "#ffffff",
    color: "#000000"
  }
}
export default class CalendarGroup {

  constructor(name, days, weekends, filter, filterMode) {
    this.name = name
    this.items = []
    this.days = days
    this.rows = []
    this.busyDates = []
    this.weekends = weekends.map(weekend => weekend.format(DATE_FORMAT))
    this.filter = filter
    this.filterMode = filterMode
  }

  get startDate() {
    return this.days[0];
  }

  get finishDate() {
    return this.days[this.days.length - 1];
  }

  distribute() {
    this.items.sort((a, b) => moment(a.attributes.start).isAfter(moment(b.attributes.start)) ? 1 : -1)

    this.items.forEach(item => {
      var startDate = moment(item.attributes.start_date);
      var finishDate = moment(item.attributes.finish_date);
      startDate = this.startDate.isAfter(startDate) ?
        this.startDate :
        startDate;
      finishDate = this.finishDate.isBefore(finishDate) ?
        this.finishDate :
        finishDate;

      this.addItem(startDate, finishDate, item, this.makeCodeByOrigin(item));
    });

    this.rows.forEach((_row, rowIndex) => {
      this.days.forEach(date => {
        if (this.isBusy(rowIndex, date)) return;

        this.addItem(date, date, {}, this.isWeekend(date) ? "weekend" : "blank");
      });
    });

    this.rows = this.rows.map(row => Object.values(row).sort((a, b) => a.startDate.isBefore(b.startDate) ? -1 : 1))
    this.clean()
  }

  clean() {
    delete this.items
    delete this.filter
    delete this.days
    delete this.busyDates
    delete this.weekends

    this.rows.map(row => Object.values(row).forEach(item => {
      delete item.startDate
      delete item.finishDate
    }))
  }

  isWeekend(date) {
    return date.isoWeekday() == 6 ||
      date.isoWeekday() == 7 ||
      this.weekends.includes(date.format(DATE_FORMAT))
  }

  addOriginalItem(item) {
    this.items.push(item)
  }

  addItem(startDate, finishDate, item, code) {
    var rowIndex = this.findFreeRow(startDate, finishDate);

    if (rowIndex > this.rows.length - 1) this.rows.push({});

    if (!colorScheme[code]) console.log(code)

    this.rows[rowIndex][startDate.format(DATE_FORMAT)] = {
      startDate: startDate,
      finishDate: finishDate,
      colspan: finishDate.diff(startDate, "days") + 1,
      origin: item,
      group: this.name,
      code: code,
      color: colorScheme[code].color,
      backgroundColor: colorScheme[code].backgroundColor,
      markers: this.buildMarkers(item)
    };

    this.addBusyDates(rowIndex, startDate, finishDate);
  }

  findFreeRow(startDate, finishDate) {
    var freeRowIndex = this.rows.findIndex(
      (_row, rowIndex) => {
        let range = this.datesRange(startDate, finishDate)

        return !range.find(d => this.isBusy(rowIndex, d))
      }
    );

    return freeRowIndex == -1 ? this.rows.length : freeRowIndex;
  }

  addBusyDates(rowIndex, startDate, finishDate) {
    if (rowIndex > this.busyDates.length - 1) this.busyDates.push([]);

    var days = finishDate.diff(startDate, "days");
    for (var i = 0; i <= days; i++) {
      let date = moment(startDate).add(i, "day").format(DATE_FORMAT);

      if (!this.busyDates[rowIndex].includes(date))
        this.busyDates[rowIndex].push(date);
    }

    this.busyDates[rowIndex] = this.busyDates[rowIndex].sort();
  }

  isBusy(rowIndex, date) {
    return this.busyDates[rowIndex].includes(date.format(DATE_FORMAT));
  }

  makeCodeByOrigin(origin) {
    if (origin.attributes.model) {
      if (origin.attributes.model.type == 'cost_price') {
        return `cost_price_${origin.attributes.model.attributes.state}_${origin.attributes.model.attributes.code.toLowerCase()}`
      } else if (origin.attributes.model.type == 'trainer_absence') {
        return `trainer_absence`
      } else if (origin.attributes.model.type == 'room_reservation') {
        return `room_reservation`
      } else {
        return origin.attributes.model.attributes.private ? 'private' : origin.attributes.model.type
      }
    }
  }

  datesRange(startDate, finishDate) {
    let dates = []
    let daysCount = finishDate.diff(startDate, "days") + 1

    for (let i = 0; i < daysCount; i++) dates.push(moment(startDate).add(i, "day"))

    return dates
  }

  buildMarkers(item) {
    var markers = []
    
    if (this.filter && !this.filterMode && item.attributes) {
      let model = item.attributes.model.attributes
      if (this.filter.trainer_ids.length > 0 && this.filter.trainer_color && model.trainer_ids) {
        var exists = model.trainer_ids.filter(id => this.filter.trainer_ids.includes(id)).length > 0

        if (exists) markers.push(this.filter.trainer_color)
      }
      if (this.filter.manager_ids.length > 0 && this.filter.manager_color && model.manager_ids) {
        var exists = model.manager_ids.filter(id => this.filter.manager_ids.includes(id)).length > 0

        if (exists) markers.push(this.filter.manager_color)
      }
      if (this.filter.account_ids.length > 0 && this.filter.account_color && model.account_ids) {
        var exists = model.account_ids.filter(id => this.filter.account_ids.includes(id)).length > 0

        if (exists) markers.push(this.filter.account_color)
      }
      if (this.filter.room_ids.length > 0 && this.filter.room_color && model.room_ids) {
        var exists = model.room_ids.filter(id => this.filter.room_ids.includes(id)).length > 0

        if (exists) markers.push(this.filter.room_color)
      }
      if (this.filter.assistant_ids.length > 0 && this.filter.assistant_color && model.assistant_ids) {
        var exists = model.assistant_ids.filter(id => this.filter.assistant_ids.includes(id)).length > 0

        if (exists) markers.push(this.filter.assistant_color)
      }
    }

    return markers
  }
}
