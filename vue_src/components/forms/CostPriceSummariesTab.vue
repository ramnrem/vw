<template>
  <div>
    <div class="el-card-title">
      <h3>Итого по документу</h3>
      <el-button type="primary" @click="calculate" :loading="submiting">
        <font-awesome-icon icon="calculator"/>
        Рассчитать
      </el-button>
    </div>
    <el-table :data="summaries" v-loading="submiting">
      <el-table-column prop="code" label="Регистр" width="400">
        <template slot-scope="scope">{{$t(`resource.cost_price.summaries.${scope.row.code}`)}}</template>
      </el-table-column>
      <el-table-column prop="value" label="Значение">
        <template slot-scope="scope">
          {{$formatter.formatCurrency(scope.row.value)}}
          <template
            v-if="scope.row.percent !== 0"
          >({{scope.row.percent}}%)</template>
        </template>
      </el-table-column>
    </el-table>

    <div class="el-card-title">
      <h3>Итоги по аккаунтам</h3>
      <el-form-item
        prop="commission_base_percent"
        label="Базовый процент"
        class="el-form-item--base-percent-inline"
      >
        <el-input v-model="model.commission_base_percent" style="width: 65px;"/>
      </el-form-item>
    </div>
    <el-table :data="model.accounts" v-loading="submiting" show-summary :summary-method="getSummaries">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row type="flex" :gutter="36">
            <el-col>
              <h4 style="text-align: center;">Комиссионные менеджеру</h4>
              <el-table :data="formatManagerCommissions(props.row.manager_commissions)">
                <el-table-column prop="code" label="Регистр" width="400">
                  <template
                    slot-scope="scope"
                  >{{$t(`resource.cost_price.commissions.${scope.row.code}`)}}</template>
                </el-table-column>
                <el-table-column prop="value" label="Значение">
                  <template slot-scope="scope">
                    {{$formatter.formatCurrency(scope.row.value)}}
                    ({{scope.row.percent}}%)
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col>
              <h4 style="text-align: center;">Комиссионные ассистенту</h4>
              <el-table :data="formatAssistantCommissions(props.row.assistant_commissions)">
                <el-table-column prop="code" label="Регистр" width="400">
                  <template
                    slot-scope="scope"
                  >{{$t(`resource.cost_price.commissions.${scope.row.code}`)}}</template>
                </el-table-column>
                <el-table-column prop="value" label="Значение">
                  <template slot-scope="scope">
                    {{$formatter.formatCurrency(scope.row.value)}}
                    ({{scope.row.percent}}%)
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="accountable_name" label="Аккаунт"/>
      <el-table-column prop="manager_name" label="Менеджер"/>
      <el-table-column prop="assistant_name" label="Ассистент"/>
      <el-table-column
        prop="contract_sum"
        label="Сумма"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="percent" label="Процент" :formatter="$formatter.formatColumnCurrency"/>
      <el-table-column
        prop="gross_margin"
        label="Маржа"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column
        prop="is_new_account"
        label="Новый"
        :formatter="$formatter.formatColumnBoolean"
      />
      <el-table-column
        prop="is_difficult"
        label="Сложный"
        :formatter="$formatter.formatColumnBoolean"
      />
      <el-table-column
        prop="is_strategical"
        label="Стр-ский"
        :formatter="$formatter.formatColumnBoolean"
      />
      <el-table-column
        prop="is_big_sales"
        label="Боль. продажа"
        :formatter="$formatter.formatColumnBoolean"
      />
      <el-table-column
        prop="big_sales_volume"
        label="Объем"
        :formatter="$formatter.formatColumnCurrency"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CostPriceSummariesTab",
  props: {
    model: {
      required: true,
      type: Object
    },
    save: {
      required: true,
      type: Function
    }
  },
  data () {
    return  {
      submiting: false
    }
  },
  computed: {
    summaries() {
      const codes = [
        "service_sum",
        "service_sum_wo_discount",
        "external_service_sum",
        "external_service_sum_wo_discount",
        "duration",
        "number_participant",
        "course_participant_sum",
        "contract_sum",
        "trainer_order_sum",
        "logistic_request_sum",
        "cost_service",
        "cost_royalty",
        "cost_overhead",
        "direct_cost",
        "gross_margin"
      ];

      if (!this.model || !this.model.summaries) return [];

      return codes
        .map(code => {
          return this.model.summaries.find(s => s.code === code);
        })
        .filter(item => item != null);
    }
  },  
  methods: {
    formatManagerCommissions(commissions) {
      const codes = [
        "base",
        "new_account",
        "big_sales",
        "day_cost",
        "strategical",
        "difficult",
        "quarter",
        "kpi",
        "year",
        "summary"
      ];

      return codes
        .map(code => {
          return commissions.find(s => s.code === code);
        })
        .filter(item => item != null);
    },
    formatAssistantCommissions(commissions) {
      const codes = ["base"];

      return codes
        .map(code => {
          return commissions.find(s => s.code === code);
        })
        .filter(item => item != null);
    },
    calculate() {
      this.submiting = true
      this.save({ validate: false })
      .then( () => this.submiting = false)
      .catch( () => this.submiting = false)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index < 3 || index > 6) {
          return;
        }
        if (index === 3) {
          sums[index] = "Итого:";
          return;
        }
        const values = data
          .filter(item => !item._destroy)
          .map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);

          sums[index] = this.$formatter.formatCurrency(sums[index]);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
  }
};
</script>