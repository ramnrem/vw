<template>
<div>
  <el-form-item label="Тип" prop="type" :rules="rules.name">
    <el-select v-model="model.type">
      <el-option value="PrintForm::Act" label="Акт"/>
      <el-option value="PrintForm::Invoice" label="Счет"/>
      <el-option value="PrintForm::Certificate" label="Сертификат"/>
      <el-option value="PrintForm::Evaluation" label="Результаты опроса"/>
      <el-option value="PrintForm::CostPrice" label="Кост-прайс"/>
      <el-option value="PrintForm::Factura" label="Счет-фактура"/>
      <el-option value="PrintForm::TrainerOrder" label="Заказ-счет тренера"/>
      <el-option value="PrintForm::Enrollment" label="Электронный билет"/>
    </el-select>
  </el-form-item>

  <el-form-item label="Название" prop="name" :rules="rules.name">
    <el-input v-model="model.name" />
  </el-form-item>

  <el-form-item label="Шаблон">
    <a :href="model.template.url" v-if="model.template">{{model.template.filename}}</a>    
  </el-form-item>

  <el-upload :file-list="fileList" :action="action" :headers="headers" :on-error="uploadError" :on-success="uploadSuccess">
    <el-button size="small" type="primary" icon="el-icon-upload">Загрузить шаблон</el-button>
    <div class="el-upload__tip" slot="tip">Разрешенный формат шаблонов: pptx, xlsx</div>
  </el-upload>

  <el-form-item label="Ограничение" prop="scope">
    <el-input v-model="model.scope" />
  </el-form-item>

</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PrintFormForm',
  props: {
    model: {
      required: false,
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      rules: {
        name: {
          required: true,
          message: 'не может быть пустым',
        },
      },
      fileList: []
    }
  },
  computed: {
    ...mapGetters({
      token: 'auth/accessToken',
    }),
    headers() {
      return {
        'Authorization': `Bearer ${this.token}`
      }
    },
    action() {
      return `${this.$http.options.root}/api/v1/files?category=print_forms`
    }
  },
  methods: {
    uploadError(err, file, fileList) {
      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: JSON.parse(err.message).errors.template.join(', ')
      })
      this.fileList = []
    },
    uploadSuccess(response, file, fileList) {
      this.model.template = { key: response.key,
                              filename: response.filename,
                              url: response.url }
      this.fileList = []
    }
  }
}
</script>
