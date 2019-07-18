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
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Цена" prop="price">
          <el-input v-model="model.price"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Затраты, %" prop="percent_cost">
          <el-input v-model="model.percent_cost"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item prop="cost_direction" label="Направление затрат">
          <select-constant v-model="model.cost_direction" code="cost_direction"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Сортировка" prop="number">
          <el-input v-model="model.number"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-row type="flex" :gutter="18">
        <el-col>
          <el-switch v-model="model.default" active-text="По умолчанию"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.discount" active-text="Скидка"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.is_royalty" active-text="Роялти"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.is_overhead" active-text="Накладные расходы"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.count_days" active-text="Кол-во дней"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.direct_cost_only" active-text="Прямые затраты"/>
        </el-col>
        <el-col>
          <el-switch v-model="model.required_note" active-text="Требует расшифровки"/>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ServiceForm",
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
