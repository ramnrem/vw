<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Аккаунт" prop="account_id">
          <relation-select-input
            ref="account"
            v-model="model.account_id"
            :init-model="model.account"
            resource="accounts{/id}{/action_name}"
            grid="account-grid"
            form="account-form"
            value-label="name"
            @change="handleChangeAccount"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Дополнительно">
          <el-checkbox v-model="model.is_difficult">Сложный</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>

    <search-dialog
      :resource="contractResource"
      grid="contract-grid"
      form="contract-form"
      ref="searchContractDialog"
      create-btn-label="Создать договор"
      :createable="this.model.account_id > 0"
      :params="{ account_id: this.model.account_id }"
      @select="handleContractSelect"
      :multiselect="true"
    />
    <grid-input
      v-if="this.model.account_id > 0"
      title="Договора"
      :data="model.cost_price_contracts_attributes"
      :commands="contractCommands"
      :command-handler="contractCommandHandler"
    >
      <el-table-column prop="id" label="№" width="150">
        <template slot-scope="scope">
          <relation-select-input
            v-if="scope.row.contract.id"
            v-model="scope.row.contract.id"
            :init-model="scope.row.contract"
            :resource="contractResource"
            grid="contract-grid"
            form="contract-form"
            :readonly="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.date"
        label="Дата заключения"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
      <el-table-column
        prop="contract.start"
        label="Дата начала"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
      <el-table-column
        prop="contract.finish"
        label="Дата окончания"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
      <el-table-column prop="contract.planned_days" label="Запланировано дней" width="100"/>
      <el-table-column prop="contract_status_id" label="Статус">
        <template slot-scope="scope">
          <enumeration v-model="scope.row.contract_status_id" clearable code="contract_status"/>
        </template>
      </el-table-column>
      <el-table-column prop="to_invoice" label="В счет" width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.to_invoice"/>
        </template>
      </el-table-column>
      <el-table-column prop="default" label="По умолчанию" width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.default"/>
        </template>
      </el-table-column>
      <el-table-column prop="contract.customer_name" label="Плательщик"/>
    </grid-input>
  </div>
</template>

<script>
export default {
  name: "CostPriceAccountTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  computed: {
    contractResource() {
      return `contracts{/id}{/action_name}?scope[account_id]=${
        this.model.account_id
      }`;
    },
    contractCommands() {
      return [
        {
          label: "Добавить договор",
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
  methods: {
    handleChangeAccount(value) {
      Object.assign(this.model, {
        account: value,
        manager_id: value.manager_id,
        is_new_account: value.is_new_account
      });
    },
    contractCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchContractDialog.open();
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    handleContractSelect(contractIds) {
      contractIds.forEach(contractId => {
        this.$resource("contracts{/id}")
          .get({ id: contractId })
          .then(response => {
            let contract = response.data;

            this.model.cost_price_contracts_attributes.push({
              contract_id: contract.id,
              contract: contract,
              contract_status_id: contract.contract_status_id,
              _destroy: false
            });
          });
      });
    }
  }
};
</script>
