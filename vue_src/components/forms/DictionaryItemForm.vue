<template>
    <div>
        <el-form-item label="Значение" prop="value" :rules="rules.required">
            <el-input v-model="model.value"/>
        </el-form-item>
        <el-form-item label="Описание" prop="description">
            <el-input v-model="model.description"/>
        </el-form-item>
        <el-form-item label="Код" prop="code">
            <el-input v-model="model.code"/>
        </el-form-item>
        <el-form-item label="Сортировка" prop="number">
            <el-input v-model="model.number"/>
        </el-form-item>
    </div>
</template>

<script>
  export default {
    name: 'DictionaryItemForm',
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
