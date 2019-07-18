<template>
    <div>
        <el-row type="flex" :gutter="18">
            <el-col>
                <el-form-item label="ФИО" prop="name" :rules="rules.required">
                    <el-input v-model="model.name"/>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="Аккаунт" prop="account_id" :rules="rules.required">
                    <relation-select-input
                            v-model="model.account_id"
                             :init-model="model.account"
                            resource="accounts{/id}{/action_name}"
                            grid="account-grid"
                            form="account-form"
                    />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="18">
            <el-col>
                <el-form-item label="Мобильный телефон" prop="work_phone">
                    <el-input v-model="model.mobile_phone"/>
                </el-form-item>
                <el-form-item label="Рабочий телефон" prop="work_phone">
                    <el-input v-model="model.work_phone"/>
                </el-form-item>
                <el-form-item label="Домашний телефон" prop="work_phone">
                    <el-input v-model="model.home_phone"/>
                </el-form-item>
                <el-form-item label="Факс" prop="fax_number">
                    <el-input v-model="model.fax_number"/>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="E-mail" prop="email">
                    <el-input v-model="model.email"/>
                </el-form-item>
                <el-form-item label="Подразделение" prop="department">
                    <el-input v-model="model.department"/>
                </el-form-item>
                <el-form-item label="Должность" prop="position">
                    <el-input v-model="model.position"/>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="el-card-title">
            <h3>Служебные сведения</h3>
        </div>
        <el-row type="flex" :gutter="18">
            <el-col>
                <el-form-item label="Руководитель" prop="director_name">
                    <el-input v-model="model.director_name"/>
                </el-form-item>
                <el-form-item label="Телефон руководителя" prop="director_phone">
                    <el-input v-model="model.director_phone"/>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="Помощник" prop="assistant_name">
                    <el-input v-model="model.assistant_name"/>
                </el-form-item>
                <el-form-item label="Телефон помощника" prop="assistant_phone">
                    <el-input v-model="model.assistant_phone"/>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  export default {
    name: 'ContactForm',
    props: {
      model: {
        required: false,
        type: Object,
        default: {},
      },
    },
    data () {
      return {
        rules: {
          required: {
            required: true, message: 'не может быть пустым',
          },
        },
      }
    }
  }
</script>
