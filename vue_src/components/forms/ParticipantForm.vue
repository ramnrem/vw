<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="ФИО" prop="name" :rules="rules.name">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="ФИО, EN" prop="name_en">
          <el-input v-model="model.name_en"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Дата рождения" prop="birthday">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="model.birthday"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Пол" prop="sex">
          <select-constant v-model="model.sex" code="sex"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Образование" prop="education">
          <enumeration v-model="model.education_id" code="education"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Уровень" prop="level">
          <enumeration v-model="model.position_level_id" code="position_level"/>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Паспортные данные</h3>
    </div>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Серия" prop="passport_series">
          <el-input v-model="model.passport_series"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Номер" prop="passport_num">
          <el-input v-model="model.passport_num"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Кем выдан" prop="passport_whom_given_out">
          <el-input v-model="model.passport_whom_given_out"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Дата выдачи" prop="education">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="model.passport_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Прописка" prop="passport_address">
      <el-input v-model="model.passport_address"/>
    </el-form-item>
    <div class="el-spacer"></div>

    <div class="el-card-title">
      <h3>Контакты</h3>
    </div>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="model.email"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Телефон" prop="phone">
          <el-input v-model="model.phone"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Департамент" prop="department">
          <el-input v-model="model.department"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Номер машины" prop="car_number">
          <el-input v-model="model.car_number"/>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="el-spacer"></div>
    <el-row type="flex" :gutter="18">
      <el-col :span="12">
        <el-form-item label="Аккаунт" prop="account_id">
          <relation-select-input
            v-model="model.account_id"
            :init-model="model.account"
            resource="accounts{/id}{/account_name}"
            grid="account-grid"
            form="account-form"
            value-label="name"            
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Примечание" prop="note">
      <el-input type="textarea" v-model="model.note"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ParticipantForm",
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
  }
};
</script>
