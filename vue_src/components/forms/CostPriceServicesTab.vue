<template>
  <div>
    <grid-input
      :data="model.cost_price_services_attributes"
      :commands="serviceCommands"
      :command-handler="serviceCommandHandler"
      :show-summary="true"
      :summary-method="summaryServices"
    >
      <el-table-column prop="service_id" label="Услуга">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.service_id"
            style="width: 100%"
            @change="handleChangeService(scope.row)"
          >
            <el-option v-for="item in services" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>

          <el-input
            v-model="scope.row.note"
            type="textarea"
            placeholder="Комментарий"
            style="margin-top: 5px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty"/>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Цена" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"/>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="Скидка, %" width="100">
        <template slot-scope="scope" v-if="serviceDiscountActive(scope.row.service_id)">
          <el-input v-model="scope.row.discount"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="Сумма"
        width="100"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column
        prop="cost_royalty"
        label="Роялти"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column prop="percent_cost" label="Затраты, %" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.percent_cost"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        label="Затраты"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column prop="to_invoice" label="В счет" width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.to_invoice"/>
        </template>
      </el-table-column>
    </grid-input>
  </div>
</template>

<script>
export default {
  name: "CostPriceServicesTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      services: []
    };
  },
  computed: {
    serviceCommands() {
      return [
        {
          label: "Добавить",
          command: "add",
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
    }
  },
  watch: {
    model: {
      handler: "calculate",
      deep: true
    }
  },
  created() {
    this.fetchServices();
  },
  methods: {
    fetchServices() {
      this.$resource("services")
        .query()
        .then(response => {
          this.services = response.data.items;
        });
    },
    handleChangeService(context) {
      if (context.service_id) {
        let service = this.services.find(s => s.id === context.service_id);

        context.percent_cost = service.percent_cost;
      }
    },
    serviceCommandHandler(context, command) {
      if (command === "add") {
        let max = Math.max(
          0,
          ...this.model.cost_price_services_attributes.map(item => item.number)
        );

        this.model.cost_price_services_attributes.push({
          number: max + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    summaryServices(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (![4, 5, 6, 8].includes(index)) {
          return;
        }
        if (index === 4) {
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
    serviceDiscountActive(service_id) {
      let service = this.services.find(s => s.id === service_id);

      if (!service) {
        return true;
      }

      return service.discount;
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    calculate(model) {      
      model.cost_price_services_attributes.forEach(item => {
        const qty = this.parseNumber(item.qty);
        const price = this.parseNumber(item.price);
        const discount = this.parseNumber(item.discount);
        const percentCost = this.parseNumber(item.percent_cost);
        const sum = qty * price * (1 - discount / 100);
        const cost = sum * percentCost / 100;
        let costRoyalty = 0
        
        if (item.service.is_royalty && (model.course || {}).unit_royalty === 'percent')
        {
          costRoyalty = sum * model.course.value_royalty / 100          
        }

        Object.assign(item, { sum: sum, cost: cost, cost_royalty: costRoyalty });
      })
    },   
    parseNumber(value) {
      const result = Number(value);

      return Number.isNaN(result) ? 0 : result;
    }
  }
};
</script>

