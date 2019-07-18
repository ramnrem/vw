<template>
  <base-page :title="title" :breadcrumbs="breadcrumbs" :menu="menu">
    <div slot="content" class="calendar">
      <el-form label-position="top" v-model="filter" class="calendar-filter">
        <el-row type="flex" :gutter="18">
          <el-col>
            <el-form-item label="Тренер" prop="trainer_ids">
              <el-row type="flex">
                <autocomplete
                  v-model="filter.trainer_ids"
                  resource="trainers{/id}?sort=name"
                  value-label="name"
                  class="el-form-item--inline"
                  :multiple="true"
                />
                <el-color-picker
                  v-if="!currentSettings.hide_items"
                  v-model="filter.trainer_color"
                  :predefine="predefineColors"
                />
              </el-row>
            </el-form-item>
            <el-form-item label="Менеджер" prop="manager_ids">
              <el-row type="flex">
                <autocomplete
                  v-model="filter.manager_ids"
                  resource="managers{/id}?sort=name"
                  value-label="name"
                  class="el-form-item--inline"
                  :multiple="true"
                />
                <el-color-picker
                  v-if="!currentSettings.hide_items"
                  v-model="filter.manager_color"
                  :predefine="predefineColors"
                />
              </el-row>
            </el-form-item>
            <el-form-item label="Ассистент" prop="assistant_ids">
              <el-row type="flex">
                <autocomplete
                  v-model="filter.assistant_ids"
                  resource="assistants{/id}?sort=name"
                  value-label="name"
                  class="el-form-item--inline"
                  :multiple="true"
                />
                <el-color-picker
                  v-if="!currentSettings.hide_items"
                  v-model="filter.assistant_color"
                  :predefine="predefineColors"
                />
              </el-row>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="Аудитория" prop="room_ids">
              <el-row type="flex">
                <autocomplete
                  v-model="filter.room_ids"
                  resource="rooms{/id}?sort=name"
                  value-label="name"
                  class="el-form-item--inline"
                  :multiple="true"
                />
                <el-color-picker
                  v-if="!currentSettings.hide_items"
                  v-model="filter.room_color"
                  :predefine="predefineColors"
                />
              </el-row>
            </el-form-item>
            <el-form-item label="Аккаунт" prop="account_ids">
              <el-row type="flex">
                <autocomplete
                  v-model="filter.account_ids"
                  resource="accounts{/id}?sort=name"
                  value-label="name"
                  class="el-form-item--inline"
                  :multiple="true"
                />
                <el-color-picker
                  v-if="!currentSettings.hide_items"
                  v-model="filter.account_color"
                  :predefine="predefineColors"
                />
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="calendar-sidebar-panel" ref="filterPanel">
        <div class="calendar-sidebar-panel__header">
          <h3 class="calendar-sidebar-panel__header-title">Фильтр</h3>
          <el-button type="text" @click="hideFilterPanel" class="calendar-sidebar-panel__header-close">
            <font-awesome-icon icon="times"/>
          </el-button>
        </div>
        <el-form label-position="top" v-model="filter" class="calendar-filter-mobile">
          <el-form-item label="Тренер" prop="trainer_ids">
            <el-row type="flex">
              <autocomplete
                v-model="filter.trainer_ids"
                resource="trainers{/id}?sort=name"
                value-label="name"
                class="el-form-item--inline"
                :multiple="true"
              />
              <el-color-picker
                v-if="!currentSettings.hide_items"
                v-model="filter.trainer_color"
                :predefine="predefineColors"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="Менеджер" prop="manager_ids">
            <el-row type="flex">
              <autocomplete
                v-model="filter.manager_ids"
                resource="managers{/id}?sort=name"
                value-label="name"
                class="el-form-item--inline"
                :multiple="true"
              />
              <el-color-picker
                v-if="!currentSettings.hide_items"
                v-model="filter.manager_color"
                :predefine="predefineColors"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="Ассистент" prop="assistant_ids">
            <el-row type="flex">
              <autocomplete
                v-model="filter.assistant_ids"
                resource="assistants{/id}?sort=name"
                value-label="name"
                class="el-form-item--inline"
                :multiple="true"
              />
              <el-color-picker
                v-if="!currentSettings.hide_items"
                v-model="filter.assistant_color"
                :predefine="predefineColors"
              />
            </el-row>
          </el-form-item>

          <el-form-item label="Аудитория" prop="room_ids">
            <el-row type="flex">
              <autocomplete
                v-model="filter.room_ids"
                resource="rooms{/id}?sort=name"
                value-label="name"
                class="el-form-item--inline"
                :multiple="true"
              />
              <el-color-picker
                v-if="!currentSettings.hide_items"
                v-model="filter.room_color"
                :predefine="predefineColors"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="Аккаунт" prop="account_ids">
            <el-row type="flex">
              <autocomplete
                v-model="filter.account_ids"
                resource="accounts{/id}?sort=name"
                value-label="name"
                class="el-form-item--inline"
                :multiple="true"
              />
              <el-color-picker
                v-if="!currentSettings.hide_items"
                v-model="filter.account_color"
                :predefine="predefineColors"
              />
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="calendar-sidebar-panel" ref="settingsPanel">
        <div class="calendar-sidebar-panel__header">
          <h3 class="calendar-sidebar-panel__header-title">Настройки</h3>
          <el-button type="text" @click="hideSettingsPanel" class="calendar-sidebar-panel__header-close">
            <font-awesome-icon icon="times"/>
          </el-button>
        </div>

        <el-form v-model="currentSettings" label-position="top" class="calendar-settings">
            <el-form-item prop="default_type" label="Тип календаря">
              <el-select v-model="currentSettings.default_type">
                <el-option
                  v-for="type in types"
                  :key="type.id"
                  :value="type.id"
                  :label="type.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="hide_personal" label="Персональные события">
              <el-switch
                v-model="currentSettings.hide_personal"
                active-text="Скрыть"
                inactive-text="Показать"
              />
            </el-form-item>
            <el-form-item prop="hide_hint" label="Всплывающие подсказки">
              <el-switch
                v-model="currentSettings.hide_hint"
                active-text="Скрыть"
                inactive-text="Показать"
              />
            </el-form-item>
            <el-form-item prop="hide_items" label="Работа фильтра">
              <el-switch
                v-model="currentSettings.hide_items"
                active-text="Скрыть"
                inactive-text="Подсветить"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="hideSettingsPanel">Закрыть</el-button>
              <el-button type="primary" @click="saveCalendarSettings">Сохранить</el-button>
            </el-form-item>
          </el-form>
      </div>
      <div :class="isFullscreen ? 'calendar-fullscreen': ''">
        <el-form class="calendar-toolbar">
          <div class="calendar-toolbar__container">
            <div class="calendar-toolbar__item">
            <el-select v-model="type" :disabled="loading">
              <el-option v-for="type in types" :key="type.id" :value="type.id" :label="type.label" />
            </el-select>
            </div>
            <div class="calendar-toolbar__item">
            <div style="align-items: center;display: flex;">
              <el-button
                icon="el-icon-d-arrow-left"
                type="primary"
                class="h-40"
                @click="prevPeriod"
                :disabled="loading"
              ></el-button>
              <el-date-picker
                :picker-options="{firstDayOfWeek:1}"
                v-model="period"
                type="daterange"
                range-separator="По"
                start-placeholder="Дата начала"
                end-placeholder="Дата окончания"
                format="dd.MM.yyyy"
                value-format="dd.MM.yyyy"
                :disabled="loading"
              />
              <el-button
                icon="el-icon-d-arrow-right"
                type="primary"
                class="h-40"
                @click="nextPeriod"
                :disabled="loading"
              ></el-button>
            </div>
            </div>
            <div class="calendar-toolbar__item">
              <el-radio-group v-model="periodType" :disabled="loading">
                <el-radio-button label="month">Месяц</el-radio-button>
                <el-radio-button label="isoWeek">Неделя</el-radio-button>
                <el-radio-button label="day">День</el-radio-button>
              </el-radio-group>
            </div>
            <div class="calendar-toolbar__item calendar-toolbar__item_mobile-hide">
              <el-button-group>
                <el-button
                  @click="selectItems"
                  icon="el-icon-refresh"
                  type="danger"
                  title="Обновить"
                />
                <el-button
                  @click="toggleFullscreenCalendar"
                  :type="isFullscreen ? 'primary': 'default'"
                  icon="el-icon-rank"
                  title="На весь экран"
                />
                <el-button @click="dialogCalendarSettingVisible = true" title="Настройка">
                  <font-awesome-icon icon="cog" />
                </el-button>
                <el-button @click="print" title="Печать" :loading="printing">
                  <font-awesome-icon icon="print" v-if="!printing" />
                </el-button>
              </el-button-group>
              </div>
            </div>
        </el-form>
        <div v-loading="loading" element-loading-text="Загрузка..." style="min-height: 200px;">
          <div class="calendar-table-wrapper">
            <table class="calendar-table">
              <thead>
                <tr>
                  <th class="calendar-table__header-cell calendar-table__header-cell--first">Ресурс</th>
                  <th
                    class="calendar-table__header-cell"
                    v-for="date in dates"
                    :key="date.toString()"
                  >{{date.format('DD.MM')}}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(group, name) in groups">
                  <tr v-for="(row, rowIndex) in group.rows" :key="`${name}_${rowIndex.toString()}`">
                    <td
                      class="fixed calendar-table__cell calendar-table__cell--first calendar-table__cell--divider"
                      :rowspan="group.rows.length"
                      v-if="rowIndex === 0"
                    >{{name}}</td>
                    <td
                      :class="`calendar-table__cell ${(rowIndex == 0) ? 'calendar-table__cell--divider' : ''}`"
                      v-for="(cell, index) in row"
                      :key="index.toString()"
                      :colspan="cell.colspan"
                      @click="handleCellClick(cell)"
                      :style="`color: ${cell.color}; background-color: ${cell.backgroundColor};`"
                    >
                      <div class="calendar-table__markers">
                        <div
                          v-for="marker in cell.markers"
                          :key="marker"
                          :style="`background-color: ${marker}`"
                          class="calendar-table__marker"
                        />
                      </div>
                      <div :class="`calendar-event calendar-event--${group.rowModifier}`">
                        <div class="calendar-event__title">
                          <template v-if="settings.hide_hint">
                            <template v-if="cell.origin.attributes">
                              <div v-if="cell.origin.attributes.model.type == 'cost_price'">
                                <span
                                  v-if="cell.origin.attributes.model.attributes.bs"
                                  class="calendar-event__bs"
                                >
                                BS</span>

                                <span
                                  v-if="cell.origin.attributes.model.attributes.number_participant > 0"
                                  :class="`calendar-event__number_participant calendar-event__number_participant--${cell.origin.attributes.model.attributes.number_participant < 15 ? 'small' : 'big'}`"
                                >
                                {{cell.origin.attributes.model.attributes.number_participant}}</span>

                                <span
                                  v-if="cell.origin.attributes.model.attributes.number_participant == 0 && cell.origin.attributes.model.attributes.count_participants_plan > 0"
                                  :class="`calendar-event__number_participant calendar-event__number_participant--${cell.origin.attributes.model.attributes.count_participants_plan < 15 ? 'small' : 'big'}`"
                                >
                                {{cell.origin.attributes.model.attributes.count_participants_plan}}</span>
                                <template v-if="type == 'trainer'">

                                  <span
                                    v-if="cell.origin.attributes.model.attributes.code == 'CC'"
                                    class="calendar-event__account-code"
                                  >
                                  {{cell.origin.attributes.model.attributes.account_code}}</span>
                                  <span
                                    class="calendar-event__course-code"
                                  >
                                  {{cell.origin.attributes.model.attributes.course_code}}</span>
                                </template>
                                <template v-else>
                                  <span
                                    v-if="cell.origin.attributes.model.attributes.code == 'CC'"
                                    class="calendar-event__account-code"
                                  >
                                  {{cell.origin.attributes.model.attributes.account_name}}</span>
                                  <span
                                    class="calendar-event__course-code"
                                  >
                                  {{cell.origin.attributes.model.attributes.course_name}}
                                  </span>
                                </template>
                                <span
                                  class="calendar-event__location"
                                >
                                {{cell.origin.attributes.model.attributes.location}}</span>
                                <span
                                  v-if="type === 'room'"
                                  class="calendar-event__trainer-codes"
                                >
                                {{cell.origin.attributes.model.attributes.trainer_codes}}</span>
                                <span
                                  class="calendar-event__note"
                                >
                                {{cell.origin.attributes.model.attributes.note}}</span>
                              </div>

                              <div
                                v-else-if="cell.origin.attributes.model.type == 'trainer_absence'"
                              >
                                <span>
                                  {{cell.origin.attributes.model.attributes.reason}}: {{cell.origin.attributes.model.attributes.note}}</span>
                              </div>

                              <div
                                v-else-if="cell.origin.attributes.model.type == 'room_reservation'"
                              >
                                <div>Резерв №{{cell.origin.attributes.model.id}}</div>
                                <div>{{cell.origin.attributes.model.attributes.short_note}}</div>
                                <div>{{cell.origin.attributes.model.attributes.note}}</div>
                              </div>

                              <div v-else-if="cell.origin.attributes.model.type == 'external'">
                                <span>
                                  {{cell.origin.attributes.model.attributes.subject}}</span>
                              </div>
                              <template v-else>{{cell.origin.attributes.model.attributes.subject}}</template>
                            </template>
                          </template>
                          <template v-else>
                            <template v-if="cell.origin.attributes">
                              <el-popover
                                v-if="cell.origin.attributes.model.type == 'cost_price'"
                                placement="right"
                                :title="formatPeriod(cell)"
                                trigger="hover"
                                :width="500"
                                :disabled="settings.hide_hint"
                              >
                                <div
                                  class="calendar-event__body"
                                >
                                {{cell.origin.attributes.model.attributes.body}}</div>
                                <div slot="reference">
                                  <span
                                    v-if="cell.origin.attributes.model.attributes.bs"
                                    class="calendar-event__bs"
                                  >
                                  BS</span>
                                  <span
                                    v-if="cell.origin.attributes.model.attributes.number_participant > 0"
                                    :class="`calendar-event__number_participant calendar-event__number_participant--${cell.origin.attributes.model.attributes.number_participant < 15 ? 'small' : 'big'}`"
                                  >
                                  {{cell.origin.attributes.model.attributes.number_participant}}</span>
                                  <span
                                    v-if="cell.origin.attributes.model.attributes.number_participant == 0 && cell.origin.attributes.model.attributes.count_participants_plan > 0"
                                    :class="`calendar-event__number_participant calendar-event__number_participant--${cell.origin.attributes.model.attributes.count_participants_plan < 15 ? 'small' : 'big'}`"
                                  >
                                  {{cell.origin.attributes.model.attributes.count_participants_plan}}</span>
                                  <template v-if="type == 'trainer'">
                                    <span
                                      v-if="cell.origin.attributes.model.attributes.code == 'CC'"
                                      class="calendar-event__account-code"
                                    >
                                    {{cell.origin.attributes.model.attributes.account_code}}</span>
                                    <span
                                      class="calendar-event__course-code"
                                    >
                                    {{cell.origin.attributes.model.attributes.course_code}}</span>
                                  </template>
                                  <template v-else>
                                    <span
                                      v-if="cell.origin.attributes.model.attributes.code == 'CC'"
                                      class="calendar-event__account-code"
                                    >
                                    {{cell.origin.attributes.model.attributes.account_name}}</span>
                                    <span
                                      class="calendar-event__course-code"
                                    >
                                    {{cell.origin.attributes.model.attributes.course_name}}</span>
                                  </template>
                                  <span
                                    class="calendar-event__location"
                                  >
                                  {{cell.origin.attributes.model.attributes.location}}</span>
                                  <span
                                    v-if="type === 'room'"
                                    class="calendar-event__trainer-codes"
                                  >
                                  {{cell.origin.attributes.model.attributes.trainer_codes}}</span>
                                  <span
                                    class="calendar-event__note"
                                  >
                                  {{cell.origin.attributes.model.attributes.note}}</span>
                                </div>
                              </el-popover>

                              <el-popover
                                v-else-if="cell.origin.attributes.model.type == 'trainer_absence'"
                                placement="right"
                                :title="formatPeriod(cell)"
                                trigger="hover"
                                :width="500"
                                :disabled="settings.hide_hint"
                              >
                                <div
                                  class="calendar-event__body"
                                >
                                {{cell.origin.attributes.model.attributes.body}}</div>
                                <div slot="reference">
                                  <span>
                                    {{cell.origin.attributes.model.attributes.reason}}: {{cell.origin.attributes.model.attributes.note}}</span>
                                </div>
                              </el-popover>

                              <el-popover
                                v-else-if="cell.origin.attributes.model.type == 'room_reservation'"
                                placement="right"
                                :title="formatPeriod(cell)"
                                trigger="hover"
                                :width="500"
                                :disabled="settings.hide_hint"
                              >
                                <div
                                  class="calendar-event__body"
                                >
                                {{cell.origin.attributes.model.attributes.body}}</div>
                                <div slot="reference">
                                  <div>Резерв №{{cell.origin.attributes.model.id}}</div>
                                  <div>{{cell.origin.attributes.model.attributes.short_note}}</div>
                                  <div>{{cell.origin.attributes.model.attributes.note}}</div>
                                </div>
                              </el-popover>

                              <el-popover
                                v-else-if="cell.origin.attributes.model.type == 'external'"
                                placement="right"
                                :title="formatPeriod(cell)"
                                trigger="hover"
                                :width="500"
                                :disabled="settings.hide_hint"
                              >
                                <h4>{{cell.origin.attributes.model.attributes.subject}}</h4>
                                <div v-html="cell.origin.attributes.model.attributes.body" />
                                <div slot="reference">
                                  <span>
                                    {{cell.origin.attributes.model.attributes.subject}}</span>
                                </div>
                              </el-popover>
                              <template v-else>
                                {{cell.origin.attributes.model.attributes.subject}}</template>
                            </template>
                          </template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <el-dialog
          v-if="currentItem"
          ref="eventDialog"
          width="80%"
          :title="currentItem.origin.attributes.model.attributes.subject"
          :visible.sync="itemDialogVisible"
          append-to-body
        >
          <div>Начало: {{currentItem.start}}</div>
          <div>Окончание: {{currentItem.finish}}</div>
          <hr />
          <div v-html="currentItem.origin.attributes.model.attributes.body" />
          <div slot="footer" class="dialog-footer">
            <el-button @click="itemDialogVisible = false">Закрыть</el-button>
            <el-button type="danger" @click="destroyCalendarItem">Удалить</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="50%"
          title="Настройки"
          :visible.sync="dialogCalendarSettingVisible"
          append-to-body
        >
          <el-form v-model="currentSettings" label-width="300px">
            <el-form-item prop="default_type" label="Тип календаря">
              <el-select v-model="currentSettings.default_type">
                <el-option
                  v-for="type in types"
                  :key="type.id"
                  :value="type.id"
                  :label="type.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="hide_personal" label="Персональные события">
              <el-switch
                v-model="currentSettings.hide_personal"
                active-text="Скрыть"
                inactive-text="Показать"
              />
            </el-form-item>
            <el-form-item prop="hide_hint" label="Всплывающие подсказки">
              <el-switch
                v-model="currentSettings.hide_hint"
                active-text="Скрыть"
                inactive-text="Показать"
              />
            </el-form-item>
            <el-form-item prop="hide_items" label="Работа фильтра">
              <el-switch
                v-model="currentSettings.hide_items"
                active-text="Скрыть"
                inactive-text="Подсветить"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCalendarSettingVisible = false">Закрыть</el-button>
            <el-button type="primary" @click="saveCalendarSettings">Сохранить</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </base-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

var moment = require("moment");

const DATE_FORMAT = "DD.MM.YYYY";
const TIME_FORMAT = "DD.MM.YYYY HH:mm";

import Calendar from "../../../models/Calendar";

export default {
  name: "CalendarIndexPage",
  middleware: "auth",
  data() {
    return {
      title: "Расписание",
      breadcrumbs: [
        { label: "Расписание", command: { name: this.indexCalendar } }
      ],
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585"
      ],
      currentSettings: {},
      currentItem: null,
      isFullscreen: false,
      dialogCalendarSettingVisible: false,
      itemDialogVisible: false,
      printing: false,
      menu: [
        {
          icon: "filter",
          command: this.showFilterPanel,
          class: "calendar-button-mobile"
        },
        {
          icon: "cogs",
          command: this.showSettingsPanel,
          class: "calendar-button-mobile"
        }
      ]
    };
  },
  beforeCreate() {
    var state = {};

    if (this.$route.query.filter)
      state.filter = JSON.parse(this.$route.query.filter);
    if (this.$route.query.type) state.type = this.$route.query.type;
    if (this.$route.query.period) state.period = this.$route.query.period;
    if (this.$route.query.period_type)
      state.periodType = this.$route.query.period_type;

    this.$store.dispatch("calendar/initState", state);
  },
  created() {
    this.findSettings().then(() => this.selectItems());
  },
  computed: {
    ...mapGetters({
      loading: "calendar/loading",
      settings: "calendar/settings",
      dates: "calendar/dates",
      groups: "calendar/groups",
      filter: "calendar/filter"
    }),
    period: {
      get() {
        return this.$store.getters["calendar/period"];
      },
      set(period) {
        this.setPeriod(period);
      }
    },
    periodType: {
      get() {
        return this.$store.getters["calendar/periodType"];
      },
      set(periodType) {
        this.setPeriodType(periodType);
      }
    },
    type: {
      get() {
        return this.$store.getters["calendar/type"];
      },
      set(type) {
        this.setType(type);
      }
    },
    types() {
      return [
        { id: "trainer", label: "Тренеры" },
        { id: "room", label: "Аудитории" }
      ];
    },
    routeQuery() {
      return this.$route.query;
    }
  },
  watch: {
    settings: {
      handler: "setSettings",
      deep: true
    },
    loading: "fixTable",
    isFullscreen: "fullscreenChange",
    type: "setupParams",
    period: "setupParams",
    periodType: "setupParams",
    filter: {
      handler: function(filter) {
        this.setupParams();
        this.setFilter(filter);
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      findSettings: "calendar/findSettings",
      saveSettings: "calendar/saveSettings",
      setPeriod: "calendar/setPeriod",
      prevPeriod: "calendar/prevPeriod",
      nextPeriod: "calendar/nextPeriod",
      setPeriodType: "calendar/setPeriodType",
      setType: "calendar/setType",
      selectItems: "calendar/selectItems",
      destroyItem: "calendar/destroyItem",
      setFilter: "calendar/setFilter"
    }),
    setupParams() {
      this.$router.replace({
        name: this.$route.name,
        query: {
          type: this.type,
          period: this.period,
          period_type: this.periodType,
          filter: JSON.stringify(this.filter)
        }
      });
    },
    setSettings(settings) {
      this.currentSettings = Object.assign({}, settings);
    },
    formatPeriod(item) {
      let start = moment(item.origin.attributes.start).format(TIME_FORMAT);
      let finish = moment(item.origin.attributes.finish).format(TIME_FORMAT);

      return `Период с ${start} по ${finish}`;
    },
    toggleFullscreenCalendar() {
      this.isFullscreen = !this.isFullscreen;
    },
    fullscreenChange() {
      window.scrollTo(0, 0);

      if (this.isFullscreen) {
        document.querySelector("body").style.overflow = "hidden";
      } else {
        document.querySelector("body").style = "";
      }
    },
    print() {
      let groups = {};
      this.printing = true;
      Object.keys(this.groups).forEach(groupName => {
        groups[groupName] = this.groups[groupName].rows;
      });

      this.$resource("calendar/print")
        .save({
          calendar: {
            dates: this.dates.map(d => d.format(DATE_FORMAT)),
            groups: groups
          }
        })
        .then(response => {
          window.open(response.data.link, "_blank");
          this.printing = false;
        })
        .catch(error => {
          this.printing = false;

          throw error;
        });
    },
    handleCellClick(cell) {
      if (cell.origin.attributes.model.type == "external") {
        this.currentItem = Object.assign({}, cell);
        this.currentItem.start = moment(cell.origin.attributes.start).format(
          TIME_FORMAT
        );
        this.currentItem.finish = moment(cell.origin.attributes.finish).format(
          TIME_FORMAT
        );
        this.itemDialogVisible = true;
      } else if (cell.origin.attributes.model) {
        let routeData = this.$router.resolve({
          path: cell.origin.attributes.model.links.self
        });

        window.open(routeData.href, "_blank");
      }
    },
    saveCalendarSettings() {
      this.$store.dispatch("calendar/saveSettings", this.currentSettings);
      this.dialogCalendarSettingVisible = false;
      this.hideSettingsPanel();
    },
    destroyCalendarItem() {
      this.destroyItem(this.currentItem.origin.id).then(() => {
        this.itemDialogVisible = false;
        this.selectItems();
      });
    },
    fixTable() {
      var container = document.querySelector(".calendar-table-wrapper");
      var thead = container.querySelector("thead");
      var tbody = container.querySelector("tbody");

      container.style.overflow = "auto";
      container.style.position = "relative";

      function relayout() {
        var ths = [].slice.call(thead.querySelectorAll("th"));
        var tbodyTrs = [].slice.call(tbody.querySelectorAll("tr"));

        tbody.setAttribute("style", "");
        thead.style.width = "";
        thead.style.position = "";
        thead.style.top = "";
        thead.style.left = "";
        thead.style.zIndex = "";
        ths.forEach(function(th) {
          th.style.display = "";
          th.style.width = "";
          th.style.position = "";
          th.style.top = "";
          th.style.left = "";
        });
        tbodyTrs.forEach(function(tr) {
          tr.setAttribute("style", "");
        });
        [].slice.call(tbody.querySelectorAll("td.fixed")).forEach(function(td) {
          td.style.width = "";
          td.style.position = "";
          td.style.left = "";
        });

        var thStyles = ths.map(function(th) {
          var rect = th.getBoundingClientRect();
          var style = document.defaultView.getComputedStyle(th, "");
          return {
            boundingWidth: rect.width,
            boundingHeight: rect.height,
            width: parseInt(style.width, 10),
            paddingLeft: parseInt(style.paddingLeft, 10)
          };
        });

        var totalWidth = thStyles.reduce(function(sum, cur) {
          return sum + cur.boundingWidth;
        }, 0);
        tbody.style.display = "block";
        tbody.style.width = totalWidth + "px";
        thead.style.width = totalWidth - thStyles[0].boundingWidth + "px";

        thead.style.position = "absolute";
        thead.style.top = "0";
        thead.style.left = thStyles[0].boundingWidth + "px";
        thead.style.zIndex = 10;

        ths.forEach(function(th, i) {
          th.style.width = thStyles[i].width + "px";
          if (i === 0) {
            th.style.position = "absolute";
            th.style.top = "0";
            th.style.left = -thStyles[0].boundingWidth + "px";
          }
        });

        tbody.style.marginTop = thStyles[0].boundingHeight + "px";

        tbodyTrs.forEach(function(tr, i) {
          tr.style.display = "block";
          tr.style.paddingLeft = thStyles[0].boundingWidth + "px";
          [].slice
            .call(tr.querySelectorAll("td.fixed"))
            .forEach(function(td, j) {
              td.style.width = thStyles[j].width + "px";
              if (j === 0) {
                td.style.position = "absolute";
                td.style.left = "0";
              }
            });
        });
      }

      relayout();

      container.addEventListener("scroll", function() {
        thead.style.transform = "translate3d(0," + this.scrollTop + "px,0)";
        var hTransform = "translate3d(" + this.scrollLeft + "px,0,0)";
        thead.querySelector("th").style.transform = hTransform;
        [].slice
          .call(tbody.querySelectorAll("tr > td.fixed"))
          .forEach(function(td, i) {
            td.style.transform = hTransform;
          });
      });

      return {
        relayout: relayout
      };
    },
    showFilterPanel() {
      this.$refs.filterPanel.style.right = '0px'
    },
    hideFilterPanel() {
      this.$refs.filterPanel.style.right = '-475px'
    },
    showSettingsPanel() {
      this.$refs.settingsPanel.style.right = '0px'
    },
    hideSettingsPanel() {
      this.$refs.settingsPanel.style.right = '-475px'
    }
  }
};
</script>

<style lang="scss">
// .calendar-event__title {
//   span {
//     word-spacing: normal;
//     margin-right: 2px;
//     word-wrap: normal;
//   }
// }
.calendar {
  &-button {
    &-mobile {
      display: none;
    }
  }

  &-sidebar-panel {
    position: fixed;
    top: 0;
    right: -475px;
    max-width: 375px;
    width: 100%;
    bottom: 0;
    z-index: 100;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    background-color: #ffffff;
    transition: 0.5s all;

    &__header {
      padding: 0 10px;
      display: flex;
      justify-content: space-between;

      &-close {
        font-size: 18px;
        color: #909399;

        &:hover {
          color: #545c6a;
        }
      }
    }

    &_active {
      right: 0;
    }
  }

  &-toolbar {
    &__container {
      display: flex;
      justify-content: space-between;
    }
  }
}
@media (max-width: 1357px) {
  .calendar {
    &-filter {
      display: none;
    }

    &-toolbar {
      &__item {
        &_mobile-hide {
          display: none;
        }
      }
    }

    &-button {
      &-mobile {
        display: inline-block;
      }
    }
  }
}

@media (max-width: 940px) {
  .calendar {
   &-toolbar {
      &__container {
        display: flex;
        flex-direction: column;
      }

      &__item {
        margin-bottom: 10px;

        .el-select {
          width: 100%;
        }

        .el-date-editor {
          width: 100%;
        }

        .el-radio-group {
          width: 100%;
          display: flex;

          .el-radio-button {
            flex: 1;

            &__inner {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>