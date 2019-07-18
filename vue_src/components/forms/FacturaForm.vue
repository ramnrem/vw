<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Статус" prop="aasm_state">
          <el-select v-model="model.aasm_state">
            <el-option
              v-for="state in states.factura.items"
              :value="state.id"
              :label="state.name"
              :key="state.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Тип" prop="type">
          <el-select v-model="model.type" @change="calculate" :disabled="model.id > 0">
            <el-option v-for="(value, type) in types" :value="type" :label="value" :key="type"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Валюта счета" prop="currency_rate">
          <el-input v-model="model.currency_rate" placeholder="Курс" @change="calculate">
            <el-select
              v-model="model.currency"
              slot="append"
              style="min-width: 100px;"
              @change="handleChangeCurrency"
            >
              <el-option
                v-for="currency in model.currencies"
                :value="currency.symbol"
                :label="currency.symbol"
                :key="currency.symbol"
              />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Тип плательщика" prop="buyerable_type">
          <el-select v-model="model.buyerable_type">
            <el-option value="Customer" label="Юр. лицо"/>
            <el-option value="Participant" label="Физ. лицо"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col></el-col>
    </el-row>
    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Счет-Фактура №:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-row type="flex" :gutter="18">
              <el-col :span="10">
                <el-input v-model="model.factura_number">
                  <el-button slot="append" icon="el-icon-refresh" @click="refreshNumber"></el-button>
                </el-input>
              </el-col>
              <el-col>
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.factura_date"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-col>
            </el-row>
          </td>
          <td class="el-table__cell el-table__cell--notice">
            <b>(1)</b>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Исправление №:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-row type="flex" :gutter="18">
              <el-col :span="10">
                <el-input v-model="model.correct_number"/>
              </el-col>
              <el-col>
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.correct_date"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-col>
            </el-row>
          </td>
          <td class="el-table__cell el-table__cell--notice">(1а)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Продавец:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.own_firm_id"
              resource="own_firms{/id}"
              form="own-firm-form"
              grid="own-firm-search-grid"
            />
          </td>
          <td class="el-table__cell el-table__cell--notice">(2)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Адрес продавца:</td>
          <td class="el-table__cell el-table__cell--field">{{model.legal_address}}</td>
          <td class="el-table__cell el-table__cell--notice">(2а)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">ИНН/КПП продавца:</td>
          <td class="el-table__cell el-table__cell--field">{{model.innkpp}}</td>
          <td class="el-table__cell el-table__cell--notice">(2б)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Грузоотправитель и его адрес:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.address_from"/>
          </td>
          <td class="el-table__cell el-table__cell--notice">(3)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Грузополучатель и его адрес:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-input v-model="model.address_to"/>
          </td>
          <td class="el-table__cell el-table__cell--notice">(4)</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">К платежно-расчетному документу №:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-row type="flex" :gutter="18">
              <el-col :span="10">
                <el-input v-model="model.payment_doc_number"/>
              </el-col>
              <el-col></el-col>
            </el-row>
          </td>
          <td class="el-table__cell el-table__cell--notice">(5)</td>
        </tr>

        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Покупатель:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-if="model.buyerable_type === 'Customer'"
              v-model="model.buyerable_id"
              :resource="customerResource"
              value-label="legal_name"
              grid="customer-grid"
              form="customer-form"
              @change="calculate()"
            />
            <relation-select-input
              v-if="model.buyerable_type === 'Participant'"
              v-model="model.buyerable_id"
              resource="participants{/id}{/action_name}"
              value-label="name"
              grid="participant-grid"
              form="participant-form"
              @change="calculate()"
            />
          </td>
          <td class="el-table__cell el-table__cell--notice">(6)</td>
        </tr>

        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Адрес покупателя:</td>
          <td class="el-table__cell el-table__cell--field">{{model.buyer_address}}</td>
          <td class="el-table__cell el-table__cell--notice">(6а)</td>
        </tr>

        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">ИНН/КПП покупателя:</td>
          <td class="el-table__cell el-table__cell--field">{{model.buyer_innkpp}}</td>
          <td class="el-table__cell el-table__cell--notice">(6б)</td>
        </tr>

        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Валюта: наименование, код:</td>
          <td
            class="el-table__cell el-table__cell--field"
          >{{model.currency_fullname}}, {{model.currency_code}}</td>
          <td class="el-table__cell el-table__cell--notice">(7)</td>
        </tr>
      </tbody>
    </table>

    <div class="el-spacer"/>

    <grid-input
      title
      :data="model.factura_items_attributes"
      :commands="facturaItemsCommands"
      :command-handler="facturaItemsCommandHandler"
      :summary-method="getItemsSummaries"
      show-summary
    >
      <el-table-column prop="name" label="Наименование">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" type="textarea" :rows="6"/>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty" @change="calculate"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="currency_price"
        label="Цена за ед."
        width="100"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="currency_sum" label="Сумма" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.currency_sum" @change="handleChangeCurrencySum"/>
        </template>
      </el-table-column>
      <el-table-column prop="vat" label="Налоговая ставка" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.vat" @change="calculate">
            <el-option v-for="(label, val) in vats" :value="val" :key="val" :label="label"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="currency_vat_sum"
        label="Сумма налога"
        width="100"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column
        prop="currency_sum_with_vat"
        label="Стоимость с налогом"
        width="100"
        :formatter="$formatter.formatColumnCurrency"
      />
    </grid-input>

    <div class="el-spacer el-spacer--line"/>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Руководитель:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.director_id"
              :resource="$resource('signers{/id}')"
              grid="signer-grid"
              form="signer-form"
            />
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Бухгалтер:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.booker_id"
              :resource="$resource('signers{/id}')"
              grid="signer-grid"
              form="signer-form"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="el-spacer"/>

    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Акт:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.act_id"
              :resource="$resource('acts{/id}')"
              grid="act-grid"
              form="act-form"
              @change="handleChangeAct"
            />
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Счет:</td>
          <td class="el-table__cell el-table__cell--field">
            <relation-select-input
              v-model="model.invoice_id"
              :resource="$resource('invoices{/id}')"
              grid="invoice-grid"
              form="invoice-form"
              @change="handleChangeInvoice"
              :readonly="model.act_id > 0"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FacturaForm",
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
  computed: {
    ...mapGetters({
      states: "states/list",
      vats: "constants/vats",
      defaultVat: "constants/defaultVat"
    }),
    customerResource() {
      if (this.model.account_id) {
        return this.$resource(
          "customers{/id}{/action_name}",
          { scope: { account_id: this.model.account_id } }
        );
      } else {
        return this.$resource("customers{/id}{/action_name}");
      }
    },
    facturaItemsCommands() {
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
  data() {
    return {
      rules: {
        name: {
          required: true,
          message: "не может быть пустым"
        }
      },
      types: {
        "Factura::Regular": "Простая",
        "Factura::Advance": "Авансовая"
      }
    };
  },
  methods: {
    calculate(params = {}) {
      this.$resource("facturas/calculate")
        .save({ ...this.model, ...params })
        .then(response => {
          Object.assign(this.model, response.data);

          this.$forceUpdate();
        });
    },
    refreshNumber() {
      this.calculate({ refresh_number: true });
    },
    handleChangeAct(model) {
      Object.assign(this.model, { buyer_id: model.customer_id });

      this.calculate();
    },
    handleChangeInvoice(model) {
      Object.assign(this.model, { buyer_id: model.customer_id });

      this.calculate();
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "Итого:";
          return;
        }

        if (index < 2 || index == 5) return;

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
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    facturaItemsCommandHandler(context, command) {
      if (command === "add") {
        let max = Math.max(0, ...this.model.factura_items_attributes.map(item => item.number))
        this.model.factura_items_attributes.push({
          _destroy: false,
          number: max + 1,
          vat: this.defaultVat
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    handleChangeCurrency(value) {
      let currency = this.model.currencies.find(c => c.symbol === value);

      Object.assign(this.model, { currency_rate: currency.rate });

      this.calculate();
    },
    handleChangeCurrencySum(sum) {
      this.model.factura_items_attributes.forEach(item => {
        Object.assign(item, {
          sum: item.currency_sum * this.model.currency_rate
        });
      });

      this.calculate();
    }
  }
};
</script>
