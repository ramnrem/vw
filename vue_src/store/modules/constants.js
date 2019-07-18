export const state = {
  vats: {
    '-1': 'Без НДС',
    '0': '0%',
    '18': '18%',
    '20': '20%'
  },
  defaultVat: '20',
  activity_types: {
    meeting: 'Встреча',
    incoming_call: 'Входящий звонок',
    outgoing_call: 'Исходящий звонок',
  },
  questionnaire_areas: {
    general: 'Общие',
    course: 'Курс',
    trainer: 'Тренер',
    material: 'Материал',
  },
  sex: {
    female: 'Женский',
    male: 'Мужской',
  },
  unit_royalty: {
    percent: '%',
    usd: '$',
    usd_participant: '$/чел.',
    rub: '₽',
    rub_participant: '₽/чел.',
  },
  cost_direction: {
    cbsd: 'CBSD',
  },
  resource_kind: {
    human: 'Человек',
    material: 'Материал',
  },
  room_reservation_reason: {
    course: 'Курс',
    other: 'Другое',
  },
  room_reservation_type: {
    main: 'Основной',
    additional: 'Дополнительный',
  },
  holiday_type: {
    weekend: 'Выходной день',
    working_day: 'Рабочий день'
  },
  months: {
    1: 'Январь',
    2: 'Февраль',
    3: 'Март',
    4: 'Апрель',
    5: 'Май',
    6: 'Июнь',
    7: 'Июль',
    8: 'Август',
    9: 'Сентябрь',
    10: 'Октябрь',
    11: 'Ноябрь',
    12: 'Декабрь'
  }
}

export const getters = {
  vats: state => state.vats,
  defaultVat: state => state.defaultVat,
  activity_types: state => state.activity_types,
  questionnaire_areas: state => state.questionnaire_areas,
  sex: state => state.sex,
  unit_royalty: state => state.unit_royalty,
  cost_direction: state => state.cost_direction,
  resource_kind: state => state.resource_kind,
  room_reservation_reason: state => state.room_reservation_reason,
  room_reservation_type: state => state.room_reservation_type,
  holiday_type: state => state.holiday_type,
  months: state => state.months
}
