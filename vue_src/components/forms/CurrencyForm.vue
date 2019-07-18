<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Название" prop="name" :rules="rules.required">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Сокращение" prop="short_name" :rules="rules.required">
          <el-input v-model="model.short_name"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Символ" prop="symbol" :rules="rules.required">
          <el-input v-model="model.symbol"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Код" prop="code" :rules="rules.required">
          <el-input v-model="model.code"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Текущий курс" prop="last_rate" :rules="rules.required">
          <el-input v-model="model.last_rate"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CurrencyForm",
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
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  }
};
</script>
