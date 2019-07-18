<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Калькуляция" name="first">
      <el-row type="flex" :gutter="18">
        <el-col>
          <el-form-item label="Номер договора" prop="name" :rules="rules.name">
            <el-input v-model="model.name" :disabled="model.type === 'Contract::Annex'"/>
          </el-form-item>
          <el-row type="flex" :gutter="18" v-if="model.type === 'Contract::Annex'">
            <el-col>
              <el-form-item label="Номер приложения" prop="annex_number" :rules="rules.name">
                <el-input v-model="model.annex_number"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="Тип приложения" prop="contract_type">
                <enumeration v-model="model.contract_type_id" code="contract_type"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="18">
            <el-col>
              <el-form-item label="Дата" prop="date">
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.date"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="Статус">
                <enumeration v-model="model.contract_status_id" clearable code="contract_status"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="18">
            <el-col>
              <el-form-item label="Дата получения" prop="receipt_date">
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.receipt_date"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="Дата начала" prop="start">
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.start"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="Дата окочания" prop="finish">
                <el-date-picker
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="model.finish"
                  format="dd.MM.yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="18">
            <el-col :span="8">
              <el-form-item label="Запланировано дней" prop="planned_days">
                <el-input v-model="model.planned_days"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-form-item label="Тип договора" prop="type" :rules="rules.contract_type">
            <el-select v-model="model.type" :disabled="model.id > 0">
              <el-option label="Юридическое лицо" value="Contract::LegalPerson"></el-option>
              <el-option label="Физическое лицо" value="Contract::NaturalPerson"></el-option>
              <el-option v-if="model.id > 0" label="Приложение" value="Contract::Annex"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Аккаунт"
            prop="account_id"
            v-if="model.type === 'Contract::LegalPerson' || model.type === 'Contract::Annex'"
          >
            <relation-select-input
              v-model="model.account_id"
              :resource="$resource('accounts{/id}')"
              grid="account-grid"
              form="account-form"
              @change="handleChangeAccount"
              :readonly="model.type === 'Contract::Annex'"
            />
          </el-form-item>
          <el-form-item
            label="Плательщик"
            prop="customer_id"
            v-if="(model.type === 'Contract::LegalPerson'  || model.type === 'Contract::Annex') && model.account_id > 0"
          >
            <relation-select-input
              v-model="model.customer_id"
              :resource="customerResource"
              grid="customer-grid"
              form="customer-form"
              :createable="true"
              create-label="Новый плательщик"
            />
          </el-form-item>
          <el-form-item
            label="Участник"
            prop="participant_id"
            v-if="model.type === 'Contract::NaturalPerson'"
          >
            <relation-select-input
              v-model="model.participant_id"
              :resource="$resource('participants{/id}{/action_name}')"
              grid="participant-grid"
              form="participant-form"
            />
          </el-form-item>
          <el-form-item
            label="Основной договор"
            prop="contract_id"
            v-if="model.type === 'Contract::Annex'"
          >
            <relation-select-input
              v-model="model.contract_id"
              :resource="$resource('contracts{/id}{/action_name}')"
              grid="contract-grid"
              form="contract-form"
              :readonly="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane
      label="Договора"
      name="contracts"
      v-if="model.type != 'Contract::Annex' && model.type != 'Contract::NaturalPerson'"
    >
      <grid-input
        title="Договора"
        :data="model.items_attributes"
        :commands="contractCommands"
        :command-handler="contractCommandHandler"
        :height="500"
      >
        <el-table-column prop="annex_number" label="Номер" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.annex_number"/>
          </template>
        </el-table-column>
        <el-table-column prop="contract_type_id" label="Тип" width="200">
          <template slot-scope="scope">
            <enumeration v-model="scope.row.contract_type_id" code="contract_type"/>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Дата" width="155">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.date"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="receipt_date" label="Дата получения" width="155">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.receipt_date"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="start" label="Дата начала" width="155">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.start"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="finish" label="Дата окончания" width="155">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.finish"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="planned_days" label="Дней" width="70">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planned_days"/>
          </template>
        </el-table-column>
        <el-table-column prop="contract_status_id" label="Статус" width="200">
          <template slot-scope="scope">
            <enumeration
              v-model="scope.row.contract_status_id"
              code="contract_status"
              style="width: 100%"
              clearable
            />
          </template>
        </el-table-column>
        <el-table-column prop="customer_id" label="Плательщик">
          <template slot-scope="scope">
            <relation-select-input
              v-model="scope.row.customer_id"
              :resource="customerResource"
              grid="customer-grid"
              form="customer-form"
              :createable="true"
              create-label="Новый плательщик"
            />
          </template>
        </el-table-column>
      </grid-input>
    </el-tab-pane>
    <el-tab-pane label="Кост-прайсы" name="costPrice">
      <el-table :data="model.cost_prices" :height="500">
        <el-table-column prop="label" label="№" width="130">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.label"
              :to="{ name: 'editCostPrice', params: { id: scope.row.id}}"
            >{{scope.row.label}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="aasm_state" label="Статус" width="130">
          <template slot-scope="scope">
            <status-badge :state="scope.row.aasm_state" states="cost_price"/>
          </template>
        </el-table-column>
        <el-table-column prop="course_id" label="Курс">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.course_id"
              :to="{ name: 'editCostPrice', params: { id: scope.row.id}}"
            >{{scope.row.course.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="start"
          label="Дата начала"
          width="120"
          :formatter="$formatter.formatColumnDate"
        />
        <el-table-column
          prop="finish"
          label="Дата окнчания"
          width="120"
          :formatter="$formatter.formatColumnDate"
        />
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ContractForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    },
    mode: {
      required: false,
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      activeName: "first",
      rules: {
        name: {
          required: true,
          message: "не может быть пустым"
        },
        contract_type: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      list: "dictionaries/all"
    }),
    customerResource() {
      return this.$resource(
        "customers{/id}{/action_name}",
        { scope: { account_id: this.model.account_id } }
      );
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
      this.model.customer_id = value.default_customer_id;
      this.model.items_attributes.forEach(item => {
        item.customer_id = value.default_customer_id;
      });
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    contractCommandHandler(context, command) {
      if (command === "add") {
        var max = Math.max(0, ...this.model.items_attributes.map(item => item.number))
        this.model.items_attributes.unshift({
          number: max + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    }
  }
};
</script>
