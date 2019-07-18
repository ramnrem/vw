<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Курс" prop="course_id">
          <relation-select-input
            v-model="model.course_id"
            :init-model="model.course"
            resource="courses{/id}{/action_name}"
            grid="course-grid"
            form="course-form"
            value-label="name"
            @change="handleChangeCourse"
            ref="course"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Код группы" v-if="model.course">
          <b>{{model.course.group}}</b>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Менеджер" prop="manager_id">
          <relation-select-input
            v-model="model.manager_id"
            :init-model="model.manager"
            resource="managers{/id}{/action_name}"
            grid="manager-grid"
            form="manager-form"
            value-label="name"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Ассистент" prop="assistant_id">
          <relation-select-input
            v-model="model.assistant_id"
            :init-model="model.assistant"
            resource="assistants{/id}{/action_name}"
            grid="assistant-grid"
            form="assistant-form"
            value-label="name"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название курса" prop="name_course">
          <el-input v-model="model.name_course"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Название курса, EN" prop="name_course_en">
          <el-input v-model="model.name_course_en"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Название курса для документов" prop="name_course_buh">
          <el-input v-model="model.name_course_buh"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Комментарий" prop="note">
          <el-input v-model="model.note"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Шаблон сертификата" prop="certificate_print_form_id">
          <relation-select-input
            v-model="model.certificate_print_form_id"
            :init-model="model.certificate_print_form"
            resource="print_forms{/id}{/action_name}?scope[type]=PrintForm::Certificate"
            form="print-form-form"
            grid="print-form-grid"
            value-label="name"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <div class="el-spacer"></div>

    <div class="el-card-title">
      <h3>Документы</h3>
      <el-dropdown @command="handleDocumentCommand" v-if="model.id">
        <el-button type="primary">
          Добавить
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logistic_request">Логистическую заявку</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table :data="model.documents">
      <el-table-column sortable prop="aasm_state" label="Статус" width="130">
        <template slot-scope="scope">
          <status-badge :state="scope.row.aasm_state" :states="scope.row.class"/>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="№" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.id"
            :to="{ name: `edit${scope.row.type}`, params: { id: scope.row.id}}"
          >{{scope.row.label}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Тип" width="200"/>
      <el-table-column prop="customerable" label="Плательщик/Участник"/>
      <el-table-column
        prop="cost"
        label="Стоимость"
        :formatter="$formatter.formatColumnCurrency"
        width="100"
      />
      <el-table-column
        prop="created_at"
        label="Создан"
        :formatter="$formatter.formatColumnTime"
        width="100"
      />
      <el-table-column
        prop="updated_at"
        label="Обновлен"
        :formatter="$formatter.formatColumnTime"
        width="100"
      />
      <el-table-column prop="owner" label="Автор" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.owner.id"
            :to="{ name: `editUser`, params: { id: scope.row.owner.id}}"
          >{{scope.row.owner.name}}</router-link>
        </template>
      </el-table-column>
    </el-table>
    <h2>Стоимость</h2>
    <el-table :data="prices">
      <el-table-column prop="code" label="Регистр" width="400">
        <template slot-scope="scope">{{$t(`resource.cost_price.summaries.${scope.row.code}`)}}</template>
      </el-table-column>
      <el-table-column prop="value" label="RUB" :formatter="$formatter.formatColumnCurrency"/>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CostPriceCalculationTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  computed: {
    prices() {
      const codes = [
        "service_sum",
        "service_sum_wo_discount",
        "external_service_sum",
        "external_service_sum_wo_discount"
      ];

      if (!this.model || !this.model.summaries) return [];

      return codes
        .map(code => {
          return this.model.summaries.find(s => s.code === code);
        })
        .filter(item => item != null);
    }
  },
  methods: {
    handleChangeCourse(value) {
      Object.assign(this.model, {
        course: value,
        is_strategical: value.strategic,
        certificate_print_form_id: value.certificate_print_form_id,
        name_course: value.name,
        name_course_en: value.name_en,
        name_course_buh: value.name        
      });
    },
    handleDocumentCommand(command) {
      switch (command) {
        case "logistic_request":
          this.$router.push({
            name: "newLogisticRequest",
            query: {
              cost_price_id: this.model.id,
              redirect: this.$route.fullPath
            }
          });

          break;
      }
    }
  }
};
</script>
