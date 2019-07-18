<template>
    <div>
        <el-row type="flex" :gutter="18">
            <el-col>
                <el-form-item label="Название" prop="name">
                    <el-input v-model="model.name"/>
                </el-form-item>
                <el-form-item label="ИНН/КПП" prop="innkpp">
                    <el-input v-model="model.innkpp"/>
                </el-form-item>
                <el-form-item label="Юридический адрес" prop="legal_address">
                    <el-input v-model="model.legal_address"/>
                </el-form-item>
                <el-form-item label="Фактический адрес" prop="address">
                    <el-input v-model="model.address"/>
                </el-form-item>
                <el-form-item label="Банковские реквизиты" prop="bank_account">
                    <el-input type="textarea" v-model="model.bank_account"/>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="Название, EN" prop="name_en">
                    <el-input v-model="model.name_en"/>
                </el-form-item>
                <el-form-item label="ИНН/КПП, EN" prop="innkpp_en">
                    <el-input v-model="model.innkpp_en"/>
                </el-form-item>
                <el-form-item label="Юридический адрес, EN" prop="legal_address_en">
                    <el-input v-model="model.legal_address_en"/>
                </el-form-item>
                <el-form-item label="Фактический адрес, EN" prop="address_en">
                    <el-input v-model="model.address_en"/>
                </el-form-item>
                <el-form-item label="Банковские реквизиты, EN" prop="bank_account_en">
                    <el-input type="textarea" v-model="model.bank_account_en"/>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  export default {
    name: 'OwnFirmForm',
    props: {
      model: {
        required: false,
        type: Object,
        default: {},
      },
      mode: {
        required: false,
        type: String,
        default: 'default',
      },
    },
    data () {
      return {
        rules: {
          name: {
            required: true, message: 'не может быть пустым',
          },
        },
      }
    },
  }
</script>
