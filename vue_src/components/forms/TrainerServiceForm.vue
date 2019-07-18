<template>
  <div>
    <el-form-item label="Наименование" prop="name" :rules="rules.required">
      <el-input v-model="model.name"/>
    </el-form-item>
    <el-form-item label="Наименование для внештатных тренеров" prop="external_name">
      <el-input v-model="model.external_name"/>
    </el-form-item>
    <el-form-item label="Описание" prop="description">
      <el-input v-model="model.description"/>
    </el-form-item>
    <el-form-item label="Ед. Изм." prop="unit">
      <el-select v-model="model.unit">
        <el-option v-for="unit in units" :key="unit.id" :value="unit.id" :label="unit.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Проставлять даты" prop="auto_period">
      <el-checkbox v-model="model.auto_period" />
    </el-form-item>
    <el-form-item label="Сортировка" prop="number">
      <el-input v-model="model.number"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "TrainerServiceForm",
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
  },
  computed: {
    units() {
      return [
        { id: "day", value: "День" },
        { id: "hour", value: "Час" },
        { id: "pcs", value: "Штука" }
      ];
    }
  }
};
</script>
