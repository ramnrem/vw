<template>
  <div class="v-cost-price">
    <el-row type="flex" :gutter="12">
      <el-col>
        <div class="v-cost-price__name">
          <span>Кост-прайс:</span>
          <relation-select-input
            v-model="currentValue"
            resource="cost_prices{/id}"
            grid="cost-price-grid"
            form="cost-price-form"
            :readonly="readonly"
            @change-model="assignCostPrice"
            @input="handleInput"
          />
        </div>
        <template v-if="costPrice">
          <table class="v-cost-price__details">
            <tbody>
              <tr>
                <td>Курс:</td>
                <td>
                  <relation-select-input
                    v-model="costPrice.course_id"
                    :init-model="costPrice.course"
                    resource="courses{/id}"
                    grid="course-grid"
                    form="course-form"
                    value-label="name"
                    :readonly="true"
                  />
                </td>
              </tr>
              <tr>
                <td>Наименование курса:</td>
                <td>{{costPrice.name_course}}</td>
              </tr>
              <tr>
                <td>Наименование курса, EN:</td>
                <td>{{costPrice.name_course_en}}</td>
              </tr>
              <tr>
                <td>Аккаунт:</td>
                <td>
                  <relation-select-input
                    v-model="costPrice.account_id"
                    :init-model="costPrice.account"
                    resource="accounts{/id}"
                    grid="account-grid"
                    form="account-form"
                    value-label="name"
                    :readonly="true"
                  />
                </td>
              </tr>
              <tr>
                <td>Менеджер:</td>
                <td>
                  <relation-select-input
                    v-model="costPrice.manager_id"
                    :init-model="costPrice.manager"
                    resource="managers{/id}"
                    grid="manager-grid"
                    form="manager-form"
                    value-label="name"
                    :readonly="true"
                  />
                </td>
              </tr>
              <tr>
                <td>Кол-во слушателей:</td>
                <td>Планируемое: {{costPrice.count_participants_plan}} / Реальное: {{countParticipantReal}}</td>
              </tr>
            </tbody>
          </table>
          <div class="v-cost-price__name">Тренеры</div>
          <table class="v-cost-price__details">
            <tbody>
              <tr>
                <th>Код</th>
                <th>Имя</th>
              </tr>
              <tr v-for="trainer in costPrice.trainers" :key="trainer.id">
                <td>{{trainer.code}}</td>
                <td>
                  <relation-select-input
                    class="v-cost-price__name"
                    v-model="trainer.id"
                    :init-model="trainer"
                    resource="trainers{/id}"
                    grid="trainer-grid"
                    form="trainer-form"
                    value-label="name"
                    :readonly="true"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </el-col>
      <el-col v-if="costPrice">
        <div class="v-cost-price__name">Итоги</div>
        <table class="v-cost-price__details">
          <tbody>
            <tr>
              <td>Стоимость контракта:</td>
              <td>
                <b>{{contractPrice}}</b>
              </td>
            </tr>
            <tr>
              <td>Продолжительность:</td>
              <td>
                <b>{{duration}}</b>
              </td>
            </tr>
            <tr>
              <td>Стоимость тренеров / Стоимость контракта:</td>
              <td>{{trainersCostPercent}}</td>
            </tr>
          </tbody>
        </table>
        <div class="v-cost-price__name">Даты</div>
        <table class="v-cost-price__details">
          <tbody>
            <tr>
              <th>Дата начала</th>
              <th>Дата окончания</th>
              <th>Продолжительность</th>
            </tr>
            <tr v-for="period in costPrice.cost_price_periods_attributes" :key="period.id">
              <td>{{$formatter.formatTime(period.start)}}</td>
              <td>{{$formatter.formatTime(period.finish)}}</td>
              <td>{{$formatter.formatDuration(period.duration, period.unit)}}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CostPriceView",
  props: {
    value: {
      required: true
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: null,
      costPrice: null
    };
  },
  mounted() {
    this.currentValue = this.value;
  },
  computed: {
    countParticipantReal() {
      if (!this.costPrice) return;

      return Number(
        this.costPrice.summaries.find(
          register => register.code === "number_participant"
        ).value
      );
    },
    contractPrice() {
      if (!this.costPrice) return;

      return this.costPrice.summaries.find(
        register => register.code === "contract_sum"
      ).value;
    },
    duration() {
      if (!this.costPrice) return;

      return this.costPrice.summaries.find(
        register => register.code === "duration"
      ).value;
    },
    trainersCostPercent() {
      if (!this.costPrice) return;
      
      let trainer_order_cost = this.costPrice.summaries.find(
        register => register.code === "trainer_order_sum"
      ).value;

      return (trainer_order_cost / this.contractPrice).toFixed(2);
    }
  },
  watch: {
    value: "assignCurrentValue"
  },
  methods: {
    assignCurrentValue(value) {
      this.currentValue = value;
    },
    assignCostPrice(model) {
      this.costPrice = model;

      this.$emit("change-model", model.id);
    },
    handleInput(value) {
      this.$emit("change", value);
      this.$emit("input", value);
    }
  }
};
</script>
