<template>
  <div>
    <el-row type="flex" justify="end">
      <el-form-item prop="aasm_state" label="Статус документа">
        <el-select v-model="model.aasm_state">
          <el-option
            v-for="item in states['trainer_order'].items"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <cost-price-view v-model="model.cost_price_id" :readonly="model.id > 0"/>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Тренер" prop="trainer_id" :rules="rules.required">
          <relation-select-input
            v-model="model.trainer_id"
            :init-model="model.trainer"
            resource="trainers{/id}"
            grid="trainer-grid"
            form="trainer-form"
            value-label="name"
            @change="handleChangeTrainer"
            :readonly="model.id > 0"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <search-dialog
      resource="trainer_services{/id}{/action_name}"
      grid="trainer-service-grid"
      form="trainer-service-form"
      ref="searchTrainerServiceDialog"
      create-btn-label="Создать услугу"
      :createable="true"
      @select="handleTrainerServiceSelect"
      :multiselect="true"
    />
    <grid-input
      title="Услуги"
      :data="model.items_attributes"
      :commands="serviceCommands"
      :command-handler="serviceCommandHandler"
      :summary-method="getItemsSummaries"
      :show-summary="true"
    >
      <el-table-column prop="trainer_service_id" label="Услуга">
        <template slot-scope="scope">
          <relation-select-input
            v-if="scope.row.trainer_service_id"
            v-model="scope.row.trainer_service_id"
            :init-model="scope.row.trainer_service"
            resource="trainer_services{/id}{/action_name}"
            grid="trainer-service-grid"
            form="trainer-service-form"
            :value-label="function(service) {return model.trainer.staff ? service.name : (service.external_name || service.name) }"
            :readonly="true"
          />
          <el-input v-model="scope.row.name" v-else/>
        </template>
      </el-table-column>
      <el-table-column prop="period" label="Период">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.period"
            v-if="scope.row.unit === 'hour' || scope.row.unit === 'day'"
            type="datetimerange"
            range-separator="По"
            start-placeholder="Дата начала"
            end-placeholder="Дата окончания"
            value-format="yyyy-MM-ddTHH:mm"
            format="dd.MM.yyyy HH:mm"
            :default-time="defaultTimePeriod"
            @change="calculateDuration(scope.row)"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Цена" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price" @change="calculate"/>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty" @change="calculate"/>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="Ед. Изм." width="110">
        <template slot-scope="scope">
          <el-select v-model="scope.row.unit">
            <el-option v-for="(label, key) in units" :key="key" :value="key" :label="label"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="Сумма"
        width="120"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="note" label="Комментарий">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note"/>
        </template>
      </el-table-column>
    </grid-input>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TrainerOrderForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      defaultTimePeriod: "settings/defaultTimePeriod",
      states: "states/list"
    }),
    serviceCommands() {
      return [
        {
          label: "Добавить услугу",
          command: "add",
          disabled: false
        },
        {
          label: "Добавить произвольную услугу",
          command: "addItem",
          disabled: false
        },
        {
          divided: true
        },
        {
          label: "Удалить",
          command: "remove",
          disabled: this.isCommandDisabled
        }
      ];
    },
    units() {
      return {
        day: "День",
        hour: "Час",
        pcs: "Штука"
      };
    }
  },
  methods: {
    calculate() {
      this.$resource("trainer_orders/calculate")
        .save(this.model)
        .then(response => {
          Object.assign(this.model, response.data);

          this.$forceUpdate();
        });
    },
    handleChangeTrainer(trainer) {
      this.model.trainer = trainer;
      this.$resource("trainers{/id}/prices")
        .get({
          id: trainer.id
        })
        .then(response => {
          this.model.items_attributes = [];

          response.data.forEach(price => {
            this.model.items_attributes.push({
              price: price.price,
              trainer_service_id: price.trainer_service_id,
              trainer_service: price.trainer_service,
              unit: price.trainer_service.unit,
              qty: price.qty,
              number: price.trainer_service.number,
              _destroy: false
            });
          });
        });
    },
    serviceCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchTrainerServiceDialog.open();
      }
      if (command === "addItem") {
        let number = Math.max(
          0,
          ...this.model.items_attributes.map(item => item.number)
        );

        this.model.items_attributes.push({
          price: 0,
          trainer_service_id: null,
          name: "",
          qty: 0,
          unit: "pcs",
          number: number + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index < 5 || index > 6) {
          return;
        }
        if (index === 5) {
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
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    handleTrainerServiceSelect(serviceIds) {
      serviceIds.forEach(serviceId => {
        this.$resource("trainer_services{/id}")
          .get({ id: serviceId })
          .then(response => {
            let trainer_service = response.data;
            let number = Math.max(
              ...this.model.items_attributes.map(item => item.number)
            );

            this.model.items_attributes.push({
              trainer_service_id: trainer_service.id,
              trainer_service: trainer_service,
              unit: trainer_service.unit,
              number: number + 1,
              _destroy: false
            });
          });
      });
    },
    calculateDuration(context) {
      let attrs = {
        period: context.period,
        unit: context.unit,
        duration: 0
      };

      this.$periodTools.calculateDuration(attrs, this.defaultTimePeriod);

      Object.assign(context, { qty: attrs.duration });

      this.calculate();
    }
  }
};
</script>
