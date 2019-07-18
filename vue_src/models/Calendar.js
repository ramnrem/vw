import CalendarGroup from "./CalendarGroup";

var moment = require("moment");

const COURSE_COUNT = "Количество курсов";
const NO_TRAINERS = "Без тренера";
const NO_ROOMS = "Без аудитории";
const OUT = "OUT"

export default class Calendar {
  constructor(data, days, type, weekends, filter, filterMode) {    
    this.filter = filter
    this.filterMode = filterMode
    if (filterMode) {
      this.data = this.applyFilter(data, filter)
    } else {
      this.data = data
    }
    this.days = days
    this.type = type
    this.weekends = weekends
    this.groups = {}
    
    this.build()
    this.clean()
  }

  clean(){
    delete this.days
    delete this.type
    delete this.weekends
    delete this.filter
  }

  build() {    
    if (this.type == "trainer") {
      this.buildTrainerCalendar(this.filterMode)
    } else {
      this.buildRoomCalendar(this.filterMode)
    }    
    Object.values(this.groups).forEach(group => group.distribute())
  }

  buildTrainerCalendar(filterMode) {
    var groupNames = []
    var groups = {}    
    this.data.forEach(item => {
      var groupName = NO_TRAINERS;
      if (item.attributes.folder_owner_type === "Trainer") {
        groupName = item.attributes.folder_owner_name;
        if (!groupNames.includes(groupName)) groupNames.push(groupName)
      }
      
      this.addToGroup(groupName, item, filterMode)
    })

    groups[COURSE_COUNT] = this.buildSummaries()

    groupNames.sort().forEach(name => groups[name] = this.groups[name])

    if (this.groups[NO_TRAINERS]) groups[NO_TRAINERS] = this.groups[NO_TRAINERS]

    this.groups = groups
  }

  buildRoomCalendar(filterMode) {
    var groupNames = []
    var groups = {}

    this.data.forEach(item => {
      var groupName = OUT;
      if (item.attributes.folder_owner_type == "Room") {
        groupName = item.attributes.folder_owner_name;
        if (!groupNames.includes(groupName)) groupNames.push(groupName)
      } else if (item.attributes.model.attributes.local) {
        groupName = NO_ROOMS
      }
      
      this.addToGroup(groupName, item, filterMode)
    });

    groups[COURSE_COUNT] = this.buildSummaries()

    groupNames.sort().forEach(name => groups[name] = this.groups[name])

    if (this.groups[OUT]) groups[OUT] = this.groups[OUT]
    if (this.groups[NO_ROOMS]) groups[NO_ROOMS] = this.groups[NO_ROOMS]

    this.groups = groups
  }

  addToGroup(name, item, filterMode) {        
    if (this.groups[name] == undefined) this.groups[name] = new CalendarGroup(name, this.days, this.weekends, this.filter, filterMode);

    this.groups[name].addOriginalItem(item)
  }

  buildRows() {
    return Object.values(this.groups).flatMap(group => group.rows)
  }

  applyFilter(data, filter) {
    return data.filter(item => {
      let model = item.attributes.model.attributes
      if (filter.trainer_ids.length > 0) {
        var exists = model.trainer_ids.filter(id => filter.trainer_ids.includes(id)).length > 0

        if (!exists) return false
      }
      if (filter.manager_ids.length > 0) {
        var exists = model.manager_ids.filter(id => filter.manager_ids.includes(id)).length > 0

        if (!exists) return false
      }
      if (filter.account_ids.length > 0) {
        var exists = model.account_ids.filter(id => filter.account_ids.includes(id)).length > 0

        if (!exists) return false
      }
      if (filter.room_ids.length > 0) {
        var exists = model.room_ids.filter(id => filter.room_ids.includes(id)).length > 0

        if (!exists) return false
      }
      if (filter.assistant_ids.length > 0) {
        var exists = model.assistant_ids.filter(id => filter.assistant_ids.includes(id)).length > 0

        if (!exists) return false
      }

      return true
    })
  }

  buildSummaries() {
    let group = new CalendarGroup(name, this.days, this.weekends);

    this.days.forEach(date => {
      let values = Object.values(this.groups).map(g => {
        return g.items.filter(item => {
          let start = moment(item.attributes.start_date)
          let finish = moment(item.attributes.finish_date)

          return date.isBetween(start, finish, null, '[]') &&
            item.attributes.model.type == 'cost_price' &&
            item.attributes.model.attributes.local
        }).length
      })
      let count = values.length == 0 ? 0 : values.reduce((a, b) => a + b)

      group.addItem(date, date, {
        attributes: {
          model: {
            attributes: {
              subject: count
            }
          }
        }
      }, group.isWeekend(date) ? "weekend" : "blank")
    })

    group.rowModifier = 'summary'

    return group
  }
}
