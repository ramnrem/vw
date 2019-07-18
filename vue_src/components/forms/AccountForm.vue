<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Основные" name="first">
      <el-row type="flex" :gutter="18">
        <el-col>
          <el-form-item label="Название" prop="name" :rules="rules.name">
            <el-input v-model="model.name"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="Название, EN" prop="name_en">
            <el-input v-model="model.name_en"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="18">
        <el-col :span="6">
          <el-form-item label="Код" prop="code" :rules="rules.code">
            <el-input v-model="model.code"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Индустрия" prop="industry_id" :rules="rules.industry_id">
            <enumeration v-model="model.industry_id" code="industry"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Сколько раз уже обучался" prop="count_courses">
            <el-input v-model="model.count_courses" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="18">
        <el-col :span="6">
          <el-form-item label="Процент" prop="percent">
            <el-input v-model="model.percent"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Иностранная компания" prop="foreign_company">
            <el-switch v-model="model.foreign_company" active-text="Да"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Новый аккаунт" prop="is_new_account">
            <el-switch v-model="model.is_new_account" active-text="Да"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Исключение"
            prop="exception"
            title="Не вычислять автоматический - Новый клиент"
          >
            <el-switch v-model="model.exception" active-text="Да"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="18">
        <el-col :span="6">
          <el-form-item label="Менеджер" prop="manager_id">
            <relation-select-input
              v-model="model.manager_id"
              :init-model="model.manager"
              resource="managers{/id}{/action_name}"
              grid="manager-grid"
              form="manager-form"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Логотип">
        <el-upload
          class="avatar-uploader"
          :file-list="fileList"
          :action="action"
          :headers="headers"
          :on-error="uploadError"
          :on-success="uploadSuccess"
        >
          <img v-if="model.logo" :src="model.logo.url" class="avatar" style="max-height: 100px;">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="Особые требования" prop="special_requirements">
        <el-input type="textarea" v-model="model.special_requirements"/>
      </el-form-item>
      <el-form-item label="Примечание" prop="note">
        <el-input type="textarea" v-model="model.note"/>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="Фирмы клиента" name="customers">
      <div class="el-card-title">
        <h3></h3>
        <el-button size="small" type="primary" @click.prevent="newCustomer">Добавить</el-button>
      </div>
      <el-table :data="model.customers">
        <el-table-column prop="id" label="№" width="90"/>
        <el-table-column prop="name" label="Плательщик">
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'editCustomer', params: { id: scope.row.id}}"
            >{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="default"
          label="По умолчанию"
          width="200"
          :formatter="formatBoolean"
        />
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="Контакты" name="contacts">
      <div class="el-card-title">
        <h3></h3>
        <el-button size="small" type="primary" @click.prevent="newContact">Добавить</el-button>
      </div>
      <el-table :data="model.contacts">
        <el-table-column prop="id" label="№" width="90"/>
        <el-table-column prop="name" label="Имя">
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'editContact', params: { id: scope.row.id } }"
            >{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="work_phone" label="Рабочий телефон" width="200"/>
        <el-table-column prop="home_phone" label="Домашний телефон" width="200"/>
        <el-table-column prop="email" label="E-mail" width="200"/>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="Договора" name="contracts">
      <div class="el-card-title">
        <h3></h3>
        <el-button size="small" type="primary" @click.prevent="newContract">Добавить</el-button>
      </div>
      <el-table :data="model.contracts">
        <el-table-column prop="id" label="№" width="90"/>
        <el-table-column prop="aasm_state" label="Статус" width="130">
          <template slot-scope="scope">
            <status-badge :state="scope.row.aasm_state" states="contract"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Номер" width="100">
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'editContract', params: { id: scope.row.id}}"
            >{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="Дата"
          width="200"
          :formatter="$formatter.formatColumnDate"
        />
        <el-table-column
          prop="contract_status_id"
          label="Статус"
          width="200"
          :formatter="formatContractStatus"
        />
        <el-table-column prop="customer_id" label="Плательщик">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.customer_id"
              :to="{ name: 'editCustomer', params: { id: scope.row.customer.id}}"
            >{{scope.row.customer.name}}</router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="Кост-прайсы" name="cost_prices">
      <div class="el-card-title">
        <h3></h3>
        <el-button size="small" type="primary" @click.prevent="newCostPrice">Добавить</el-button>
      </div>
      <el-table :data="model.cost_prices">
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
    <el-tab-pane label="Большие продажи" name="big_sales_periods">
      <grid-input
        :data="model.big_sale_periods_attributes"
        :commands="bigSalesPeriodsCommands"
        :command-handler="bigSalesPeriodsCommandHandler"
      >
        <el-table-column prop="start" label="Дата начала" width="250">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              type="date"
              v-model="scope.row.start"
              value-format="yyyy-MM-dd"
              format="dd.MM.yyyy"
            />
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="Период, мес." width="250">
          <template slot-scope="scope">
            <el-input v-model="scope.row.duration"/>
          </template>
        </el-table-column>
        <el-table-column/>
      </grid-input>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AccountForm",
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
        code: {
          required: true,
          message: "не может быть пустым"
        },
        industry_id: {
          required: true,
          message: "не может быть пустым"
        }
      },
      fileList: []
    };
  },
  computed: {
    ...mapGetters({
      list: "dictionary/list",
      states: "states/list",
      token: "auth/accessToken"
    }),
    headers() {
      return {
        Authorization: `Bearer ${this.token}`
      };
    },
    action() {
      return `${this.$http.options.root}/api/v1/files?category=logos`;
    },
    bigSalesPeriodsCommands() {
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
  methods: {
    formatContractStatus(row, column, value, index) {
      const items = this.list["contract_status"].items;

      return items[value] ? items[value].value : "";
    },
    formatBoolean(row, column, value, index) {
      return value ? "Да" : "";
    },
    newCustomer() {
      this.$router.push({
        name: "newCustomer",
        query: { account_id: this.model.id }
      });
    },
    newContact() {
      this.$router.push({
        name: "newContact",
        query: { account_id: this.model.id }
      });
    },
    newContract() {
      this.$router.push({
        name: "newContract",
        query: { account_id: this.model.id }
      });
    },
    newCostPrice() {
      this.$router.push({
        name: "newCostPrice",
        query: { account_id: this.model.id }
      });
    },
    uploadError(err, file, fileList) {
      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: JSON.parse(err.message).errors.logo.join(", ")
      });
      this.fileList = [];
    },
    uploadSuccess(response, file, fileList) {
      this.model.logo = {
        key: response.key,
        filename: response.filename,
        url: response.url
      };
      this.fileList = [];
    },
    bigSalesPeriodsCommandHandler(context, command) {
      if (command === "add") {
        this.model.big_sale_periods_attributes.push({
          start: null,
          duration: 12,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    }
  }
};
</script>
