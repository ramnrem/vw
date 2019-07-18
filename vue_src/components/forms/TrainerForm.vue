<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Тренер" name="first">
      <el-row :gutter="18" type="flex">
        <el-col :span="6">
          <el-form-item label="Имя" prop="name" :rules="rules.name">
            <el-input v-model="model.name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Имя, EN" prop="name_en" :rules="rules.name_en">
            <el-input v-model="model.name_en" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Код" prop="code" :rules="rules.code">
            <el-input v-model="model.code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="18" type="flex">
        <el-col :span="4">
          <el-form-item label="Тип договора" prop="trainer_contract_type_id">
            <enumeration v-model="model.trainer_contract_type_id" code="trainer_contract_type" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="№ договора" prop="contract_no">
            <el-input v-model="model.contract_no" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Дата договора" prop="contract_date">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="model.contract_date"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Пользователь" prop="user_id">
        <relation-select-input
          v-model="model.user_id"
          resource="users{/id}{/action_name}"
          grid="user-grid"
          form="user-form"
          value-label="name"
        />
      </el-form-item>
      <h2>Паспортные данные</h2>
      <el-row :gutter="18" type="flex">
        <el-col :span="4">
          <el-form-item label="Гражданство" prop="citizenship">
            <el-input v-model="model.citizenship" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Серия" prop="passport_series">
            <el-input v-model="model.passport_series" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Номер" prop="passport_number">
            <el-input v-model="model.passport_number" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Дата выдачи" prop="passport_data">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="model.passport_date"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Код подразделения" prop="passport_department_code">
            <el-input v-model="model.passport_department_code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="18" type="flex">
        <el-col>
          <el-form-item label="Кем выдан" prop="passport_who_given">
            <el-input v-model="model.passport_who_given" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="18" type="flex">
        <el-col>
          <el-form-item label="Адрес регистрации" prop="legal_address">
            <el-input v-model="model.legal_address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="18" type="flex">
        <el-col :span="4">
          <el-form-item label="ИНН" prop="inn">
            <el-input v-model="model.inn" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="ОГРНИП" prop="ogrnip">
            <el-input v-model="model.ogrnip" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Подпись в сертификате" prop="inscription">
        <el-input v-model="model.inscription" />
      </el-form-item>

      <el-form-item label="Подпись">
        <el-upload
          class="avatar-uploader"
          :file-list="fileList"
          :action="action"
          :headers="headers"
          :on-error="uploadError"
          :on-success="uploadSuccess"
        >
          <img v-if="model.sign" :src="model.sign.url" class="avatar" style="max-height: 100px;" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-upload
        :file-list="fileList"
        :action="action"
        :headers="headers"
        :on-error="uploadError"
        :on-success="uploadSuccess"
      >
        <el-button size="small" type="primary" icon="el-icon-upload">Загрузить подпись</el-button>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="Расценки" name="prices" v-if="model.id && mode !== 'search'">
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
        :data="model.prices_attributes"
        :commands="serviceCommands"
        :command-handler="serviceCommandHandler"
      >
        <el-table-column prop="start" label="Дата">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.start"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
            />
          </template>
        </el-table-column>
        <el-table-column prop="trainer_service_id" label="Услуга">
          <template slot-scope="scope">
            <relation-select-input
              v-model="scope.row.trainer_service_id"
              :init-model="scope.row.trainer_service"
              resource="trainer_services{/id}{/action_name}"
              grid="trainer-service-grid"
              form="trainer-service-form"
              value-label="name"
              :readonly="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="Цена">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" />
          </template>
        </el-table-column>
        <el-table-column prop="_destroy" label="Удалить" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row._destroy" />
          </template>
        </el-table-column>
      </grid-input>
    </el-tab-pane>
    <el-tab-pane label="Тарифы" name="trainer_daily_limits" v-if="model.id && mode !== 'search'">
      <el-button size="small" type="primary" @click.prevent="newDailyLimit">
        <font-awesome-icon icon="plus" />
        Добавить дневной лимит
      </el-button>
      <el-table
        :data="model.trainer_daily_limits_attributes"
        v-if="model.trainer_daily_limits_attributes && model.trainer_daily_limits_attributes.length > 0"
      >
        <el-table-column prop="start" label="Дата">
          <template slot-scope="scope">
            <el-date-picker
              :picker-options="{firstDayOfWeek:1}"
              v-model="scope.row.start"
              format="dd.MM.yyyy"
              value-format="yyyy-MM-dd"
            />
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Значение, RUB">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" />
          </template>
        </el-table-column>
        <el-table-column prop="_destroy" label="Удалить" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row._destroy" />
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <br />
        <el-alert
          title="Внимание!"
          type="warning"
          description="Если не указан тариф, Будет использован тариф по умолчанию."
        ></el-alert>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Кост-прайсы" name="cost_prices" v-if="model.id && mode !== 'search'">
      <base-grid
        :resource="resourceCostPrice"
        :context-menu="contextMenuCostPrice"
        id="trainer-from-cost-price-grid"
      />
    </el-tab-pane>
    <el-tab-pane label="График отсутствий" name="absences" v-if="model.id && mode !== 'search'">
      <base-grid
        :resource="resourceAbsence"
        :remote-sortable="false"
        :context-menu="contextMenuAbsence"
        ref="gridAbsence"
        id="trainer-from-absence-grid"
      ></base-grid>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TrainerForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    },
    mode: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      activeName: "first",
      fileList: [],
      rules: {
        name: {
          required: true,
          message: "не может быть пустым"
        },
        name_en: {
          required: true,
          message: "не может быть пустым"
        },
        code: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  created() {
    this.retrieveTab();
  },
  watch: {
    activeName: "storeTab"
  },
  computed: {
    resourceAbsence() {
      return this.$resource("calendar/trainer_absences", {
        scope: { trainer_id: this.model.id }
      });
    },
    contextMenuAbsence() {
      return [
        {
          label: "Редактировать",
          command: this.editAbsence,
          primary: true
        }
      ];
    },
    resourceCostPrice() {
      return this.$resource("cost_prices", {
        scope: { trainer_id: this.model.id }
      });
    },
    contextMenuCostPrice() {
      return [
        {
          label: "Редактировать",
          command: this.editCostPrice,
          primary: true
        }
      ];
    },
    idForm() {
      return `${this.$options.name}|${this.$route.path}|${this.$parent.name}`;
    },
    ...mapGetters({
      token: "auth/accessToken"
    }),
    headers() {
      return {
        Authorization: `Bearer ${this.token}`
      };
    },
    action() {
      return `${this.$http.options.root}/api/v1/files?category=signs`;
    },
    serviceCommands() {
      return [
        {
          label: "Добавить услугу",
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
    newPrice() {
      this.model.prices_attributes.push({});
    },
    newDailyLimit() {
      this.model.trainer_daily_limits_attributes.push({});
    },
    editAbsence(context) {
      this.$router.push({
        name: "editTrainerAbsence",
        params: {
          id: context.id
        }
      });
    },
    editCostPrice(context) {
      this.$router.push({
        name: "editCostPrice",
        params: {
          id: context.id
        }
      });
    },
    storeTab(tab) {
      localStorage.setItem(this.idForm, tab);
    },
    retrieveTab() {
      this.activeName = localStorage.getItem(this.idForm) || "first";
    },
    uploadError(err, file, fileList) {
      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: JSON.parse(err.message).errors.logo.join(", ")
      });
      this.fileList = [];
    },
    uploadSuccess(response, file, fileList) {
      this.model.sign = {
        key: response.key,
        filename: response.filename,
        url: response.url
      };
      this.fileList = [];
    },
    serviceCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchTrainerServiceDialog.open();
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
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

            this.model.prices_attributes.push({
              trainer_service_id: trainer_service.id,
              trainer_service: trainer_service,
              _destroy: false
            });
          });
      });
    }
  }
};
</script>