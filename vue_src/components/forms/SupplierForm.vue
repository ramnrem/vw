<template>
    <div>
        <el-row type="flex" :gutter="18">
            <el-col>
                <el-form-item label="Название" prop="name" :rules="rules.required">
                    <el-input v-model="model.name"/>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="Название, EN" prop="name_en">
                    <el-input v-model="model.name_en"/>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="Адрес" prop="address">
            <el-input v-model="model.address"/>
        </el-form-item>

        <el-row type="flex" :gutter="18">
            <el-col :span="6">
                <el-form-item label="Контакт" prop="contact">
                    <el-input v-model="model.contact"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="Email" prop="email">
                    <el-input v-model="model.email"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="Телефон" prop="phone">
                    <el-input v-model="model.phone"/>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="el-spacer"></div>
        <div class="el-card-title">
            <h3>Реквизиты</h3>
        </div>
        <el-form-item label="Юридическое Название" prop="legal_name">
            <el-input v-model="model.legal_name"/>
        </el-form-item>
        <el-form-item label="Юридический Адрес" prop="legal_address">
            <el-input v-model="model.legal_address"/>
        </el-form-item>
        <el-row type="flex" :gutter="18">
            <el-col :span="6">
                <el-form-item label="ИНН" prop="inn">
                    <el-input v-model="model.inn"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="КПП" prop="kpp">
                    <el-input v-model="model.kpp"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="18">
            <el-col :span="6">
                <el-form-item label="Банк" prop="bank_name">
                    <el-input v-model="model.bank_name"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="Адрес банка" prop="bank_address">
                    <el-input v-model="model.bank_address"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="18">
            <el-col :span="6">
                <el-form-item label="Расчётный счёт" prop="rs">
                    <el-input v-model="model.rs"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="Корреспондентский счёт" prop="cs">
                    <el-input v-model="model.cs"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="Показывать в отчете" prop="show_in_report">
            <el-switch v-model="model.show_in_report" active-text="Да" />
        </el-form-item>
    </div>
</template>

<script>
  export default {
    name: 'SupplierForm',
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
    },
  }
</script>
