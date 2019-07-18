<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Фамилия" prop="last_name">
          <el-input v-model="model.last_name"/>
        </el-form-item>
        <el-form-item label="Имя" prop="first_name">
          <el-input v-model="model.first_name"/>
        </el-form-item>
        <el-form-item label="Отчество" prop="middle_name">
          <el-input v-model="model.middle_name"/>
        </el-form-item>
        <el-form-item label="Должность" prop="post">
          <el-input v-model="model.post"/>
        </el-form-item>
        <el-form-item label="Действует на основании" prop="base">
          <el-input v-model="model.base"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Фамилия, EN" prop="last_name_en">
          <el-input v-model="model.last_name_en"/>
        </el-form-item>
        <el-form-item label="Имя, EN" prop="first_name_en">
          <el-input v-model="model.first_name_en"/>
        </el-form-item>
        <el-form-item label="Отчество, EN" prop="middle_name_en">
          <el-input v-model="model.middle_name_en"/>
        </el-form-item>
        <el-form-item label="Должность, EN" prop="post_en">
          <el-input v-model="model.post_en"/>
        </el-form-item>
        <el-form-item label="Действует на основании, EN" prop="base_en">
          <el-input v-model="model.base_en"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Фамилия, Род. Падеж" prop="genitive_last_name">
          <el-input v-model="model.genitive_last_name"/>
        </el-form-item>
        <el-form-item label="Имя, Род. Падеж" prop="genitive_first_name">
          <el-input v-model="model.genitive_first_name"/>
        </el-form-item>
        <el-form-item label="Отчество, Род. Падеж" prop="genitive_middle_name">
          <el-input v-model="model.genitive_middle_name"/>
        </el-form-item>
        <el-form-item label="Должность, Род. Падеж" prop="genitive_post">
          <el-input v-model="model.genitive_post"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "SignerForm",
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
