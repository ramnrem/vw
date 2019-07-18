<template>
  <div>
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
      <el-col>
        <el-form-item label="Код" prop="code">
          <el-input v-model="model.code"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Группа" prop="group">
          <enumeration v-model="model.course_group_id" code="course_group" clearable="true"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Поставщик" prop="supplier">
          <enumeration v-model="model.course_supplier_id" code="course_supplier" clearable="true"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Дата покупки" prop="purchase_at">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="model.purchase_at"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item
          label="Последние изменения"
          prop="updated_at"
        >{{ this.$formatter.formatDate(model.updated_at)}}</el-form-item>
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

    <el-row type="flex" :gutter="18">
      <el-col :span="8">
        <el-form-item prop="strategic" label="Стратегический">
          <el-switch v-model="model.strategic" active-text="Да"/>
        </el-form-item>
      </el-col>      
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item prop="business_simulation" label="Курс является бизнес-симуляцией">
          <el-switch v-model="model.business_simulation" active-text="Да"/>
        </el-form-item>
        <el-form-item
          prop="business_simulation"
          label="Бизнес-симуляция"
          v-if="!model.business_simulation"
        >
          <autocomplete v-model="model.simulation_id" resource="courses{/id}"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="Роялти">
          <el-input v-model="model.value_royalty" class="input-with-select">
            <select-constant
              v-model="model.unit_royalty"
              slot="append"
              style="width: 100px;"
              code="unit_royalty"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="Лимит" prop="limit">
          <el-input v-model="model.limit"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Примечание" prop="note">
      <el-input type="textarea" v-model="model.note"/>
    </el-form-item>
    <el-form-item label="Тема курса" prop="subject">
      <el-input type="textarea" v-model="model.subject"/>
    </el-form-item>
    <el-form-item label="Цель курса" prop="target">
      <el-input type="textarea" v-model="model.target"/>
    </el-form-item>

    <div class="el-card-title">
      <h3>Наборы ресурсов</h3>
      <el-button type="primary" @click.prevent="addResourceSet">
        <font-awesome-icon icon="plus"/>
      </el-button>
    </div>
    <el-table
      v-if="model.course_resource_sets_attributes"
      :data="model.course_resource_sets_attributes"
    >
      <el-table-column prop="note" label="Набор ресурсов">
        <template slot-scope="scope">
          <autocomplete v-model="scope.row.resource_set_id" resource="resource_sets{/id}"/>
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
    }
  },
  data() {
    return {
      rules: {
        name: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },  
  methods: {
    addResourceSet() {
      this.model.course_resource_sets_attributes.push({});
    }
  }
};
</script>
