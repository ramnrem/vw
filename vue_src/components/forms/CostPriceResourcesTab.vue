  <template>
  <div>
    <search-dialog
      :resource="simulationsResource"
      grid="resource-grid"
      form="resource-form"
      ref="searchSimulationsDialog"
      create-btn-label="Создать симуляцию"
      :createable="true"
      :params="{ bs: true }"
      @select="handleSimulationSelect"
      :multiselect="false"
    />
    <grid-input
      title="Бизнес-симуляции"
      :data="model.cost_price_simulations_attributes"
      :commands="simulationsCommands"
      :command-handler="simulationsCommandHandler"
    >
      <el-table-column prop="resource_id" label="Симуляция" width="150">
        <template slot-scope="scope">
          <relation-select-input
            v-model="scope.row.resource_id"
            :init-model="scope.row.resource"
            resource="resources{/id}{/action_name}"
            grid="resource-grid"
            form="resource-form"
            value-label="name"
            :readonly="true"
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
      <el-table-column
        prop="sum"
        label="Сумма"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column
        prop="cost_royalty"
        label="Роялти"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
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
  name: "CostPriceResourcesTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  computed: {
    simulationsResource() {
      return "resources{/id}{/action_name}?scope[business_simulation]=1";
    },
    simulationsCommands() {
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
  methods: {
    handleSimulationSelect(simulationIds) {
      simulationIds.forEach(simulationId => {
        this.$resource("resources{/id}")
          .get({ id: simulationId })
          .then(response => {
            this.model.cost_price_simulations_attributes.push({
              resource_id: simulationId,
              resource: response.data,
              qty: null,
              price: null,
              sum: null,
              _destroy: false
            });
          });
      });
    },
    simulationsCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchSimulationsDialog.open();
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    calculate(model) {
      model.cost_price_simulations_attributes.forEach(item => {
        const qty = this.parseNumber(item.qty);
        const price = this.parseNumber(item.price);
        const sum = qty * price;        
        let costRoyalty = this.calcCostRoyalty(item.resource, sum, qty);

        Object.assign(item, { sum: sum, cost_royalty: costRoyalty });
      });
    },
    calcCostRoyalty(resource, sum, qty) {
      const price = this.findResourcePriceItem(resource, qty);

      if (!price) return 0;
      
      switch (resource.royalty_unit) {
        case "percent":
          return (sum * Number(price.price)) / 100;
        case "pcs":
          return Number(price.price) * qty * this.resourceCurrencyRate(resource);
        default:
          return 0;
      }
    },
    findResourcePriceItem(resource, qty) {      
      return resource.resource_prices_attributes.find(price => {
        return (
          qty >= Number(price.min_qty) &&
          (Number(price.max_qty) === 0 ? true : qty <= Number(price.max_qty))
        );
      });
    },
    resourceCurrencyRate(resource) {
      return this.parseNumber(this.model.currency[resource.royalty_currency]);
    },
    parseNumber(value) {
      const result = Number(value);

      return Number.isNaN(result) ? 0 : result;
    }
  }
};
</script>

