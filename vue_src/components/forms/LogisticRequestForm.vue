<template>
  <div>
    <el-row type="flex" justify="end">
      <el-form-item prop="aasm_state" label="Статус документа">
        <el-select v-model="model.aasm_state">
          <el-option
            v-for="item in states['logistic_request'].items"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <cost-price-view v-model="model.cost_price_id" :readonly="model.id > 0"/>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Ресурсы</h3>
      <el-dropdown
        @command="handleItemsBatchCommand"
        split-button
        type="primary"
        @click="handleItemsBatchCommand('addDictionaryResource')"
      >Добавить ресурс
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="addResource">Добавить</el-dropdown-item>
          <el-dropdown-item command="addDictionaryResource">Добавить ресурс из справочника</el-dropdown-item>          
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item :disabled="itemsBachActionDisabled" command="remove">Удалить</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="model.resources_attributes"
      @selection-change="handleItemsSelectionChange"
      :row-class-name="tableItemsRowClass"
      :summary-method="getItemsSummaries"
      show-summary
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="name" label="Ресурс">
        <template slot-scope="scope">
          <relation-select-input
            v-if="scope.row.resource_id"
            v-model="scope.row.resource_id"
            resource="resources{/id}{/action_name}"
            grid="resource-grid"
            form="resource-form"
          />
          <template v-else>
            <el-input v-model="scope.row.name"/>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty" @change="calculate"/>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Цена" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price" @change="calculate"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="Сумма"
        width="120"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="cost_direction" label="Направление затрат" width="240">
        <template slot-scope="scope">
          <select-constant
            v-model="scope.row.cost_direction"
            code="cost_direction"
            @change="calculate"
          />
        </template>
      </el-table-column>
      <el-table-column prop="department_id" label="Департамент" width="240">
        <template slot-scope="scope">
          <enumeration v-model="scope.row.department_id" code="department"/>
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy"/>
        </template>
      </el-table-column>
    </el-table>

    <search-dialog
      resource="resources{/id}{/action_name}"
      grid="resource-grid"
      form="resource-form"
      ref="searchResourceDialog"
      create-btn-label="Добавить ресурс"
      :createable="true"
      :multiselect="true"
      @select="handleResourceSelect"
    />
  </div>
</template>


<style>
.el-table .hidden {
  display: none;
}
</style>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LogisticRequestForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      multipleItemsSelection: []
    };
  },
  computed: {
    ...mapGetters({
      states: "states/list"
    }),
    itemsBachActionDisabled() {
      return this.multipleItemsSelection.length == 0;
    }
  },
  methods: {
    handleItemsSelectionChange(val) {
      this.multipleItemsSelection = val;
    },
    handleItemsBatchCommand(command) {
      if (command === "addResource") {
        this.model.resources_attributes.push({
          name: "",
          qty: 1,
          price: 0,
          _destroy: false
        });
      }
      if (command === "addDictionaryResource") {
        this.$refs.searchResourceDialog.open();
      }      
      if (command === "remove") {
        this.multipleItemsSelection.forEach(item => (item._destroy = true));
        this.multipleItemsSelection = [];
      }
    },
    tableItemsRowClass({ row, rowIndex }) {
      if (row._destroy) return "hidden";
    },
    handleResourceSelect(resourceIds) {
      resourceIds.map(resourceId => {
        this.model.resources_attributes.push({
          resource_id: resourceId,
          _destroy: false
        });
      });
      this.calculate();
    },
    calculate() {
      this.$resource("logistic_requests/calculate")
        .save(this.model)
        .then(response => {
          Object.assign(this.model, response.data);

          this.$forceUpdate();
        });
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index < 1 || index > 4) {
          return;
        }
        if (index === 1) {
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
    }
  }
};
</script>
