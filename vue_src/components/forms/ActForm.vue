<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-row type="flex">
          <el-form-item label="Дата акта" prop="date" style="margin-right: 18px">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="model.date"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item
            label="Валюта акта"
            prop="currency_rate"
            style="margin-right: 18px"
            :rules="rules.required"
          >
            <el-input v-model="model.currency_rate" placeholder="Курс" style="width: 200px">
              <el-select v-model="model.currency" slot="append" style="min-width: 80px;">
                <el-option
                  v-for="currency in model.currencies"
                  :value="currency.symbol"
                  :label="currency.symbol"
                  :key="currency.symbol"
                />
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="Язык акта" prop="language" style="margin-right: 18px">
            <el-select v-model="model.language" style="width: 100%">
              <el-option value="ru" label="Русский"/>
              <el-option value="en" label="English"/>
            </el-select>
          </el-form-item>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="end">
          <el-form-item label="Статус" prop="aasm_state">
            <el-select v-model="model.aasm_state" style="width: 100%">
              <el-option
                v-for="state in states.act.items"
                :value="state.id"
                :label="state.name"
                :key="state.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </el-col>
    </el-row>

    <div class="el-card-title">
      <h3>Заказчик</h3>
      <el-form-item label="Тип заказчика" prop="customerable_type" :rules="rules.required">
        <el-select v-model="model.customerable_type" @change="handleChangeCustomerableType">
          <el-option label="Юр. лицо" value="Customer"></el-option>
          <el-option label="Физ. лицо" value="Participant"></el-option>
        </el-select>
      </el-form-item>
    </div>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td style="width: 30%;" class="el-table__cell el-table__cell--label">
            <span class="required">Заказчик:</span>
          </td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-if="model.customerable_type == 'Participant'"
              v-model="model.customerable_id"
              resource="participants{/id}{/action_name}"
              form="participant-form"
              grid="participant-grid"
              value-label="name"
            />
            <relation-select-input
              v-else
              v-model="model.customerable_id"
              resource="customers{/id}{/action_name}"
              form="customer-form"
              grid="customer-search-grid"
              value-label="legal_name"
            />
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">в лице:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.customer_contact"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">в лице, EN:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.customer_contact_en"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">в лице, род. падеж:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.customer_contact_declension"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">действующий на основании:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.customer_basis"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">действующий на основании, EN:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.customer_basis_en"/>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="el-spacer"/>
    <div class="el-card-title">
      <h3>Оказанные услуги</h3>
      <el-dropdown
        @command="handleItemsBatchCommand"
        split-button
        type="primary"
        @click="handleItemsBatchCommand('add')"
      >
        Добавить
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">Добавить</el-dropdown-item>
          <el-dropdown-item command="mergeInvoices">Объединить счета</el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item :disabled="itemsBachActionDisabled" command="remove">Удалить</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="activeItems"
      @selection-change="handleItemsSelectionChange"
      show-summary
      :summary-method="getItemsSummaries"
    >
      <el-table-column label="№" width="35">
        <template slot-scope="scope">{{scope.row.number}}</template>
      </el-table-column>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="name" label="Услуга">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" type="textarea" :rows="6"/>
          <div>
            <span>Cчет:</span>
            <relation-select-input
              v-model="scope.row.invoice_id"
              :resource="invoiceResource"
              grid="invoice-grid"
              form="invoice-form"
            />
            <span>Позиция в счете:</span>
            <relation-select-input
              v-model="scope.row.invoice_item_id"
              :resource="invoiceItemResource(scope.row)"
              grid="invoice-item-grid"
              form="invoice-item-form"
              :preview="true"
              @change="function(item) { handleInvoiceItemSelect(scope.row, item) }"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty"/>
        </template>
      </el-table-column>
      <el-table-column prop="currency_price" label="Цена" width="100">
        <template slot-scope="scope">{{$formatter.formatCurrency(scope.row.currency_price)}}</template>
      </el-table-column>
      <el-table-column prop="currency_sum" label="Сумма" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.currency_sum"/>
        </template>
      </el-table-column>
      <el-table-column prop="vat" label="НДС" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.vat">
            <el-option v-for="(label, val) in vats" :value="val" :key="val" :label="label"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="currency_vat_sum" label="Сумма НДС" width="100">
        <template slot-scope="scope">{{$formatter.formatCurrency(scope.row.currency_vat_sum)}}</template>
      </el-table-column>
      <el-table-column prop="currency_sum_with_vat" label="Сумма с НДС" width="100">
        <template slot-scope="scope">{{$formatter.formatCurrency(scope.row.currency_sum_with_vat)}}</template>
      </el-table-column>
    </el-table>

    <div class="el-spacer"/>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">
            <span class="required">Счет:</span>
          </td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.invoice_id"
              :resource="invoiceResource"
              grid="invoice-grid"
              form="invoice-form"
            />
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Счет-фактура:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.factura_id"
              :resource="$resource('facturas{/id}')"
              grid="factura-grid"
              form="factura-form"
              :readonly="true"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="el-spacer"/>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Подписант:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.signer_id"
              resource="signers{/id}{/action_name}"
              form="signer-form"
              grid="signer-search-grid"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="el-spacer"/>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Получен:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-checkbox v-model="model.received"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Примечание:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.comment"/>
          </td>
        </tr>
      </tbody>
    </table>

    <search-dialog
      :resource="invoiceResource"
      grid="invoice-grid"
      form="invoice-form"
      ref="searchInvoiceDialog"
      :createable="false"
      @select="handleInvoiceSelect"
      :multiselect="true"
    />
  </div>
</template>

<script>
import { stringify } from "qs";
import { mapGetters } from "vuex";

export default {
  name: "ActForm",
  props: {
    model: {
      required: true,
      type: Object
    },
    mode: {
      required: false,
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      },
      multipleItemsSelection: []
    };
  },
  computed: {
    ...mapGetters({
      states: "states/list",
      vats: "constants/vats",
      defaultVat: "constants/defaultVat"
    }),
    currency() {
      return this.model.currencies.find(c => c.symbol == this.model.currency);
    },
    itemsBachActionDisabled() {
      return this.multipleItemsSelection.length == 0;
    },
    activeItems() {
      return this.model.act_items_attributes.filter(item => !item._destroy);
    },
    invoiceResource() {
      let scope = {};

      if (this.model.customerable_type)
        scope.customerable_type = this.model.customerable_type;
      if (this.model.customerable_id)
        scope.customerable_id = this.model.customerable_id;

      return `invoices{/id}{/action_name}?${stringify({ scope })}`;
    }
  },
  watch: {
    "model.currency": "handleChangeCurrency",
    "model.currency_rate": "handleChangeCurrencyRate",
    model: {
      handler: "calculate",
      deep: true
    }
  },
  methods: {
    invoiceItemResource(context) {
      let scope = {};

      if (context.invoice_id) scope.invoice_id = context.invoice_id;
      if (this.model.customerable_type)
        scope.customerable_type = this.model.customerable_type;
      if (this.model.customerable_id)
        scope.customerable_id = this.model.customerable_id;

      return `invoice_items{/id}{/action_name}?${stringify({ scope })}`;
    },
    handleItemsSelectionChange(val) {
      this.multipleItemsSelection = val;
    },
    handleItemsBatchCommand(command) {
      if (command === "add") {
        let max = Math.max(
          0,
          ...this.model.act_items_attributes.map(item => item.number)
        );
        this.model.act_items_attributes.push({
          vat: this.defaultVat,
          sum: 0,
          number: max + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        this.multipleItemsSelection.forEach(item => (item._destroy = true));
        this.multipleItemsSelection = [];
      }
      if (command === "mergeInvoices") {
        this.$refs.searchInvoiceDialog.open();
      }
    },
    handleInvoiceSelect(invoideIds) {
      this.$resource("acts/new")
        .get({ ...this.$route.query, invoice_ids: invoideIds })
        .then(response => {
          Object.assign(this.model, response.data);
        });
    },
    handleInvoiceItemSelect(context, invoiceItem) {
      context.invoice_id = invoiceItem.invoice_id;
    },
    handleChangeCustomerableType() {
      this.model.customerable_id = null;
    },
    handleChangeCurrency(value) {
      let currency = this.model.currencies.find(c => c.symbol === value);

      Object.assign(this.model, { currency_rate: currency.rate });
    },
    handleChangeCurrencyRate(rate) {
      const currencyRate = this.parseNumber(rate);

      if (currencyRate === 0) return;

      this.model.act_items_attributes.forEach(item => {
        Object.assign(item, {
          currency_sum: (item.sum / currencyRate).toFixed(2)
        });
      });
    },
    calculate(model) {
      const currencyRate = this.parseNumber(model.currency_rate);

      if (currencyRate === 0) return;

      model.act_items_attributes
        .filter(item => !item._destroy)
        .forEach((item, index) => {
          const qty = this.parseNumber(item.qty);
          const currencySum = this.parseNumber(item.currency_sum);
          const currencyPrice = qty !== 0 ? currencySum / qty : 0;
          const currencyVatSum = (currencySum * this.parseVat(item.vat)) / 100;
          const sum = currencySum * currencyRate;
          const price = qty !== 0 ? sum / qty : 0;

          Object.assign(item, {
            sum: sum,
            price: price,
            currency_price: currencyPrice,
            currency_vat_sum: currencyVatSum,
            currency_sum_with_vat: currencySum + currencyVatSum,
            number: index + 1
          });
        });
    },
    parseNumber(value) {
      const result = Number(value);

      return Number.isNaN(result) ? 0 : result;
    },
    parseVat(value) {
      const result = Number(value);

      return Number.isNaN(result) || result < 0 ? 0 : result;
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 6 || index < 2) {
          return;
        }
        if (index === 2) {
          sums[index] = "Итого:";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
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

<style lang="scss">
.required {
  &:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>

