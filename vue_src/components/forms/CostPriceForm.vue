<template>
  <div>
    <div v-if="leads.length > 0">
      <el-alert
        :closable="false"
        title="Есть не подтвержденные заявки на регистрацию! Перейдите на вкладку «Участники курса»"
        type="error"
      />
      <br>
    </div>

    <el-row type="flex" :gutter="18">
      <el-col :span="4">
        <el-form-item label="Тип курса" prop="code">
          <el-select v-model="model.code">
            <el-option label="Корпоративный" value="CC"/>
            <el-option label="Открытый" value="OE"/>
            <el-option label="Мероприятие" value="EV"/>
          </el-select>
        </el-form-item>
      </el-col>
      <template v-for="currency in model.currencies">
        <el-col :span="3" :key="currency.symbol" v-if="!currency.default">
          <el-form-item :label="`Курс, ${currency.symbol}`">
            <el-input v-model="model.currency[currency.symbol]"/>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="14">
        <el-row type="flex" justify="end">
          <el-form-item prop="aasm_state" label="Рабочие статусы Кост-прайса" style="width: 250px;">
            <el-select v-model="model.aasm_state" style="width: 100%;">
              <el-option
                v-for="item in states['cost_price'].items"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="reason_cancellation_id"
            label="Причина"
            v-if="canceled"
            style="margin-left: 18px;"
          >
            <enumeration v-model="model.reason_cancellation_id" code="reason_cancellation"/>
          </el-form-item>
          <el-form-item
            prop="reason_cancellation_comment"
            label="Комментарий"
            v-if="canceled"
            style="margin-left: 18px;"
          >
            <el-input v-model="model.reason_cancellation_comment"/>
          </el-form-item>
        </el-row>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="Калькуляция" name="first">
        <CostPriceCalculationTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane label="Аккаунт" name="account" v-if="model.code == 'CC'">
        <CostPriceAccountTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane label="Место проведения" name="location">
        <CostPriceLocationTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane label="Расписание" name="schedule">
        <CostPriceScheduleTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane
        :label="`Услуги (${model.cost_price_services_attributes.length})`"
        name="services"
      >
        <CostPriceServicesTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane
        :label="`Тренеры (${model.cost_price_trainers_attributes.length})`"
        name="trainers"
      >
        <CostPriceTrainersTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane
        :label="`Бизнес-симуляции (${model.cost_price_simulations_attributes.length})`"
        name="resources"
      >
        <CostPriceResourcesTab :model="model"/>
      </el-tab-pane>
      <el-tab-pane
        :label="`Участники курса (${model.cost_price_participants_attributes.length})`"
        name="participants"
      >
        <CostPriceParticipantsTab :model="model" :leads="leads" @refresh="refresh"/>
      </el-tab-pane>
      <el-tab-pane label="Итоги" name="summaries" v-if="model.id > 0" lazy>
        <CostPriceSummariesTab :model="model" :save="save"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CostPriceForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    },
    originalModel: {
      required: false,
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeName: "first",
      calculation: {},
      leads: []
    };
  },
  created() {
    this.fetchLeads();
  },
  computed: {
    ...mapGetters({
      defaultTimePeriod: "settings/defaultTimePeriod",
      states: "states/list"
    }),
    canceled() {
      var states = ["canceled", "deleted"];

      return (
        this.originalModel.aasm_state != this.model.aasm_state &&
        states.includes(this.model.aasm_state)
      );
    }
  },
  methods: {
    fetchLeads() {
      if (this.model.id) {
        this.$resource("leads{/id}{/action_name}")
          .get({
            scope: { cost_price_id: this.model.id, aasm_state: "created" }
          })
          .then(response => {
            this.leads = response.data.items;
          });
      }
    },
    refresh() {
      this.$resource("cost_prices{/id}")
        .get({ id: this.model.id })
        .then(response => {
          Object.assign(this.model, response.data);

          this.$forceUpdate();
        });
      this.fetchLeads();
    },
    save(options) {
      return this.$resource("cost_prices{/id}")
        .update({ id: this.model.id }, { ...options, ...this.model })
        .then(response => {
          Object.assign(this.originalModel, response.data);
          Object.assign(this.model, response.data);
        });
    }
  }
};
</script>
