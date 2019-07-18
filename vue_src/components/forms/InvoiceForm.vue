<template>
  <div>
    <el-row type="flex" :gutter="24">
      <el-col :span="16">
        <el-form-item label="Кост-прайс" prop="cost_price_id">
          <relation-select-input
            v-model="model.cost_price_id"
            resource="cost_prices{/id}{/action_name}"
            form="cost-price-form"
            grid="cost-price-grid"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-row type="flex" :gutter="18">
          <el-col>
            <el-form-item label="Язык счета" prop="language">
              <el-select v-model="model.language" @change="calculate" style="width: 100%">
                <el-option value="ru" label="Русский" />
                <el-option value="en" label="English" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="Предмет счета" prop="invoice_default_service_id">
              <enumeration
                v-model="model.invoice_default_service_id"
                code="invoice_default_service"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="Статус" prop="aasm_state">
              <el-select v-model="model.aasm_state" style="width: 100%">
                <el-option
                  v-for="state in states.invoice.items"
                  :value="state.id"
                  :label="state.name"
                  :key="state.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="4">
        <el-form-item label="Период действия, дней" prop="valid_day">
          <el-input v-model="model.valid_day">
            <el-select v-model="model.day_type" slot="append" style="min-width: 150px;">
              <el-option value="banking" label="Банковских" />
              <el-option value="calendar" label="Календарных" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Номер заказа" prop="order_number">
          <el-input v-model="model.order_number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Валюта счета" prop="currency_rate">
          <el-input
            v-model="model.currency_rate"
            placeholder="Курс"
            @change="handleChangeCurrencyRate"
          >
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
      <el-col :span="4">
        <el-form-item label="Главбух" prop="booker">
          <el-checkbox v-model="model.booker" />
        </el-form-item>
      </el-col>
       <el-col :span="4" v-if="!model.provisional">
        <el-form-item label="Сводный счет" prop="consolidated">
          <el-checkbox v-model="model.consolidated" />
        </el-form-item>
      </el-col>
      <el-col :span="4" v-if="!model.consolidated">
        <el-form-item label="Предварительный" prop="provisional">
          <el-checkbox v-model="model.provisional" />
        </el-form-item>
      </el-col>
      
    </el-row>
    <el-row type="flex" :gutter="18" v-if="!model.consolidated">
      <el-col :span="6" v-if="!model.id && !model.provisional">
        <div style="margin-bottom: 24px;">
          <el-button
            type="primary"
            @click="createConsalidatedInvoice"
            v-if="!this.model.id"
          >Выписать сводный счет</el-button>
          <search-dialog
            resource="invoices{/id}{/action_name}"
            grid="invoice-grid"
            form="invoice-form"
            ref="searchInvoiceDialog"
            :createable="false"
            @select="handleInvoiceSelect"
            :multiselect="true"
          />
        </div>
      </el-col>
      <el-col :span="6" v-if="model.provisional">
        <div class="el-form-item">
          <span>Сводный счет:</span>
          <relation-select-input
            v-model="model.consolidated_invoice_id"
            :resource="invoiceResource({ consolidated: true })"
            form="invoice-form"
            grid="invoice-grid"
          />
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col align="center">
        <h4>Сводный счет</h4>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="4">
        <el-form-item label="Полный номер счета" prop="invoice_full_number">
          <el-input v-model="model.invoice_full_number" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Номер счета" prop="invoice_number">
          <el-input v-model="model.invoice_number" @change="calculate" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Код" prop="invoice_code_id">
          <enumeration v-model="model.invoice_code_id" code="invoice_code" @change="calculate" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Дата счета" prop="invoice_date">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="model.invoice_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            @change="calculate"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Поставщик</h3>
    </div>
    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td style="width: 200px;" class="el-table__cell el-table__cell--label">
            <span class="required">Поставщик:</span>
          </td>
          <td class="el-table__cell el-table__cell--field">
            <el-form-item prop="own_firm_id" class="el-form-item--no-label">
              <relation-select-input
                v-model="model.own_firm_id"
                :init-model="model.own_firm"
                value-label="name"
                resource="own_firms{/id}"
                form="own-firm-form"
                grid="own-firm-grid"
                @change="calculate"
                ref="ownFirmSelect"
              />
            </el-form-item>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">ИНН/КПП:</td>
          <td class="el-table__cell el-table__cell--field">{{model.own_firm.innkpp}}</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Юридический адрес:</td>
          <td class="el-table__cell el-table__cell--field">{{model.own_firm.legal_address}}</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Фактический адрес:</td>
          <td class="el-table__cell el-table__cell--field">{{model.own_firm.address}}</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Банковские реквизиты:</td>
          <td class="el-table__cell el-table__cell--field">{{model.own_firm.bank_account}}</td>
        </tr>
      </tbody>
    </table>
    <div class="el-spacer" />
    <div>
      <div class="el-card-title">
        <h3>Плательщик</h3>
        <el-form-item label="Тип плательщика" prop="customerable_type" :rules="rules.required">
          <el-select v-model="model.customerable_type" @change="handleChangeCustomerableType">
            <el-option label="Юр. лицо" value="Customer"></el-option>
            <el-option label="Физ. лицо" value="Participant"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <table class="el-table el-table--info">
        <tbody>
          <tr class="el-table__row">
            <td style="width: 200px;" class="el-table__cell el-table__cell--label">Аккаунт:</td>
            <td class="el-table__cell el-table__cell--field">
              <el-form-item prop="account_id" class="el-form-item--no-label">
                <relation-select-input
                  v-model="model.account_id"
                  resource="accounts{/id}{/action_name}"
                  grid="account-grid"
                  form="account-form"
                  :readonly="true"
                />
              </el-form-item>
            </td>
          </tr>
          <tr class="el-table__row">
            <td style="width: 200px;" class="el-table__cell el-table__cell--label">
              <span class="required">Плательщик:</span>
            </td>
            <td class="el-table__cell el-table__cell--field">
              <el-form-item
                prop="customer_id"
                class="el-form-item--no-label"
                v-if="model.customerable_type"
              >
                <relation-select-input
                  v-model="model.customerable_id"
                  :init-model="model.customerable"
                  :resource="customerableResource"
                  :form="`${model.customerable_type.toLowerCase()}-form`"
                  :grid="`${model.customerable_type.toLowerCase()}-grid`"
                  value-label="name"
                  :createable="true"
                  create-label="Добавить плательщика"
                  @change="calculate"
                  ref="customerableSelect"
                />
              </el-form-item>
            </td>
          </tr>
          <tr class="el-table__row" v-if="model.customerable_id > 0">
            <td style="width: 200px;" class="el-table__cell el-table__cell--label">Договор:</td>
            <td class="el-table__cell el-table__cell--field">
              <el-form-item prop="contract_id" class="el-form-item--no-label">
                <relation-select-input
                  v-model="model.contract_id"
                  :resource="contractResource"
                  form="contract-form"
                  grid="contract-grid"
                  @change="calculate"
                  :createable="true"
                  create-label="Добавить договор"
                />
              </el-form-item>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table__cell el-table__cell--label">
              <template v-if="model.customerable_type === 'Customer'">Адрес:</template>
            </td>
            <td class="el-table__cell el-table__cell--field">{{model.customerable.address}}</td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table__cell el-table__cell--label">
              <template v-if="model.customerable_type === 'Customer'">ИНН/КПП:</template>
            </td>
            <td class="el-table__cell el-table__cell--field">{{model.customerable.inn_kpp}}</td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table__cell el-table__cell--label">Комментарий:</td>
            <td class="el-table__cell el-table__cell--field">
              <el-input v-model="model.comment" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="el-spacer" />
    <div class="el-card-title">
      <h3>Услуги</h3>
      <el-dropdown
        @command="handleItemsBatchCommand"
        split-button
        type="primary"
        @click="handleItemsBatchCommand('add')"
      >
        Добавить
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">Добавить</el-dropdown-item>
          <el-dropdown-item :disabled="itemsBachActionDisabled" command="createAct">Выписать акт</el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item :disabled="itemsBachActionDisabled" command="remove">Удалить</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="activeItems"
      @selection-change="handleItemsSelectionChange"
      :summary-method="getItemsSummaries"
      show-summary
    >
      <el-table-column label="№" width="35">
        <template slot-scope="scope">{{scope.row.number}}</template>
      </el-table-column>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="name" label="Услуга">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" type="textarea" :rows="6" />
          <template v-if="scope.row.acts && scope.row.acts.length > 0">
            Акты:
            <span v-for="(act, index) in scope.row.acts" :key="`${act.id}_${index}`">
              <span v-if="index !== 0">,</span>
              <router-link :to="{ name: `editAct`, params: { id: act.id}}">№ {{act.id}}</router-link>
            </span>
          </template>
          <div v-if="false">
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
      <el-table-column prop="start" label="Начало" width="150">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.start"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="finish" label="Конец" width="150">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.finish"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="Кол-во" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty" @change="calculate" />
        </template>
      </el-table-column>
      <el-table-column prop="currency_price" label="Цена" width="100">
        <template slot-scope="scope">{{$formatter.formatCurrency(scope.row.currency_price)}}</template>
      </el-table-column>
      <el-table-column prop="currency_sum" label="Сумма" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.currency_sum" @change="handleChangeCurrencySum" />
        </template>
      </el-table-column>
      <el-table-column prop="vat" label="НДС" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.vat" @change="calculate">
            <el-option v-for="(label, val) in vats" :value="val" :key="val" :label="label" />
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
    <br />
    <div class="el-spacer" />
    <div class="el-card-title">
      <h3>Платежи</h3>
      <el-dropdown
        @command="handleClaimsBatchCommand"
        split-button
        type="primary"
        @click="handleClaimsBatchCommand('add')"
      >
        Добавить
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">Добавить</el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item :disabled="claimsBachActionDisabled" command="remove">Удалить</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="activeClaims"
      @selection-change="handleClaimsSelectionChange"
      :summary-method="getClaimsSummaries"
      show-summary
    >
      <el-table-column type="index" width="35"></el-table-column>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="invoice_item_id" label="К строке" width="100">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.invoice_item_id"
            @change="(item) => handleSelectInvoiceItem(item, scope.row)"
          >
            <el-option
              v-for="item in sortedInvoiceItems"
              :value="item.id"
              :label="item.label"
              :key="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="advance" label="Аванс" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.advance" />
        </template>
      </el-table-column>
      <el-table-column prop="payment_doc_date" label="Дата оплаты" width="200">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.payment_doc_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sum" label="Сумма" width="150" />
      <el-table-column prop="vat" label="НДС" width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.vat" @change="calculate">
            <el-option v-for="(label, val) in vats" :value="val" :key="val" :label="label" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sum_with_vat" label="Сумма с НДС" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sum_with_vat" />
        </template>
      </el-table-column>
      <el-table-column prop="payment_number" label="№ п/п" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.payment_number" />
        </template>
      </el-table-column>
      <el-table-column prop="invoice_item_id" label="Дата п/п" width="200">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.payment_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="note" label="Примечание">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note" />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Документы</h3>
    </div>
    <el-table :data="model.documents">
      <el-table-column sortable prop="aasm_state" label="Статус" width="130">
        <template slot-scope="scope">
          <status-badge :state="scope.row.aasm_state" :states="scope.row.class" />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="№" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.id"
            :to="{ name: `edit${scope.row.type}`, params: { id: scope.row.id}}"
          >{{scope.row.id}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Тип" />
      <el-table-column
        prop="sum"
        label="Сумма"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column
        prop="vat_sum"
        label="Сумма НДС"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column
        prop="sum_with_vat"
        label="Сумма c НДС"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column
        prop="created_at"
        label="Создан"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
      <el-table-column
        prop="updated_at"
        label="Обновлен"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
    </el-table>
  </div>
</template>

<script>
import { stringify } from "qs";
import { mapGetters } from "vuex";

export default {
  name: "InvoiceForm",
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
        name: {
          required: true,
          message: "не может быть пустым"
        }
      },
      multipleItemsSelection: [],
      multipleClaimsSelection: []
    };
  },
  computed: {
    activeItems() {
      return this.model.invoice_items_attributes.filter(item => !item._destroy);
    },
    activeClaims() {
      return this.model.invoice_claim_payments_attributes.filter(
        item => !item._destroy
      );
    },
    itemsBachActionDisabled() {
      return this.multipleItemsSelection.length == 0;
    },
    claimsBachActionDisabled() {
      return this.multipleClaimsSelection.length == 0;
    },
    sortedInvoiceItems() {
      return this.model.invoice_items_attributes
        .filter(item => !item._destroy && item.id)
        .map(function(item, index) {
          return {
            id: item.id,
            label: index + 1
          };
        });
    },
    contractResource() {
      let scope = {};
      if (this.model.customerable_type === "Customer") {
        scope.customer_id = this.model.customerable_id;
      } else {
        scope.participant_id = this.model.customerable_id;
      }

      return this.$resource("contracts{/id}{/action_name}", { scope });
    },
    customerableResource() {
      return this.model.customerable_type === "Participant"
        ? "participants{/id}{/action_name}"
        : "customers{/id}{/action_name}";
    },
    ...mapGetters({
      states: "states/list",
      vats: "constants/vats",
      defaultVat: "constants/defaultVat"
    })
  },
  mounted() {
    if (!this.model.id && this.model.related_invoice_ids.length > 0) {
      this.$message.info(
        "Счета добавлены. Добавлены только счета с одинаковым плательщиком!"
      );
    }
  },
  methods: {
    handleChangeCustomerableType() {
      this.model.customerable_id = null;
      this.calculate();
    },
    handleItemsSelectionChange(val) {
      this.multipleItemsSelection = val;
    },
    handleClaimsSelectionChange(val) {
      this.multipleClaimsSelection = val;
    },
    handleItemsBatchCommand(command) {
      if (command === "add") {
        let max = Math.max(
          0,
          ...this.model.invoice_items_attributes.map(item => item.number)
        );
        this.model.invoice_items_attributes.push({
          vat: this.defaultVat,
          sum: 0,
          number: max + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        this.multipleItemsSelection.forEach(item => (item._destroy = true));
        this.multipleItemsSelection = [];
        this.activeItems.forEach((item, index) => {
          Object.assign(item, { number: index + 1 });
        });
        this.activeClaims.forEach((item, index) => {
          Object.assign(item, { number: index + 1 });
        });
      }
      if (command === "createAct") {
        let routeData = this.$router.resolve({
          name: "newAct",
          query: {
            invoice_id: this.model.id,
            invoice_item_ids: this.multipleItemsSelection.map(item => item.id),
            redirect: this.$route.fullPath
          }
        });

        window.open(routeData.href, "_blank");
      }
    },
    handleClaimsBatchCommand(command) {
      if (command === "add") {
        this.model.invoice_claim_payments_attributes.push({
          vat: this.defaultVat,
          _destroy: false
        });
      }
      if (command === "remove") {
        this.multipleClaimsSelection.forEach(item => (item._destroy = true));
        this.multipleClaimsSelection = [];
      }
    },
    calculate() {
      this.$resource("invoices/calculate")
        .save(this.model)
        .then(response => {
          Object.assign(this.model, response.data);
          this.$refs.customerableSelect.updateLabel(this.model.customerable);
        });
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 8 || index < 4) {
          return;
        }
        if (index === 4) {
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
    },
    getClaimsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 6) {
          sums[index] = "Итого:";
          return;
        }
        if (index !== 7) return;
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
    createConsalidatedInvoice() {
      this.$refs.searchInvoiceDialog.open();
    },
    handleInvoiceSelect(invoiceIds) {
      this.$router.push({
        name: "newInvoice",
        query: { related_invoice_ids: invoiceIds }
      });
    },
    handleChangeCurrency(value) {
      let currency = this.model.currencies.find(c => c.symbol === value);

      Object.assign(this.model, { currency_rate: currency.rate });

      this.handleChangeCurrencyRate(currency.rate);
    },
    handleChangeCurrencyRate(currency_rate) {
      this.model.invoice_items_attributes.forEach(item => {
        Object.assign(item, { currency_sum: item.sum / currency_rate });
      });

      this.calculate();
    },
    handleChangeCurrencySum(sum) {
      this.model.invoice_items_attributes.forEach(item => {
        Object.assign(item, {
          sum: item.currency_sum * this.model.currency_rate
        });
      });

      this.calculate();
    },
    handleSelectInvoiceItem(itemId, context) {
      let item = this.model.invoice_items_attributes.find(
        item => item.id == itemId
      );

      context.vat = item.vat;
    },
    invoiceResource(filter) {
      let scope = Object.assign({}, filter);

      if (this.model.customerable_type)
        scope.customerable_type = this.model.customerable_type;
      if (this.model.customerable_id)
        scope.customerable_id = this.model.customerable_id;

      return `invoices{/id}{/action_name}?${stringify({ scope })}`;
    },
    invoiceItemResource(context) {
      let scope = {};

      if (context.invoice_id) scope.invoice_id = context.invoice_id;
      if (this.model.customerable_type)
        scope.customerable_type = this.model.customerable_type;
      if (this.model.customerable_id)
        scope.customerable_id = this.model.customerable_id;

      return `invoice_items{/id}{/action_name}?${stringify({ scope })}`;
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
