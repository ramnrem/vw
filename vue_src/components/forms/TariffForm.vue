<template>
  <div>
    <el-form-item label="Название" prop="name">
      <el-input v-model="model.name"/>
    </el-form-item>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Комиссия, %" prop="base">
          <el-input v-model="model.base"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Большая продажа, %" prop="base">
          <el-input v-model="model.big_sales"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Объем большой продажи, RUB" prop="base">
          <el-input v-model="model.big_sales_basis"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Новый клиент, %" prop="new_account">
          <el-input v-model="model.new_account"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="Новый клиент, Кол-во пропущеных месяцев"
          prop="new_account_skipped_months_count"
        >
          <el-input v-model="model.new_account_skipped_months_count"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Новый клиент, Кол-во тренигов" prop="new_account_courses_count">
          <el-input v-model="model.new_account_courses_count"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Новый клиент, Кол-во месяцев" prop="new_account_months_count">
          <el-input v-model="model.new_account_months_count"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Стоимость за день, %" prop="per_day">
          <el-input v-model="model.per_day"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-alert
          title="Внимание"
          type="info"
          description="Объем дневных продаж настраивается для каждого тренера индивидуально"
          show-icon
        ></el-alert>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Стратегический продукт, %" prop="strategical">
          <el-input v-model="model.strategical"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Сложная продажа, %" prop="difficult">
          <el-input v-model="model.difficult"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Сложные месяцы">
          <el-select v-model="model.difficult_months" multiple style="width: 100%;">
            <el-option v-for="(label, value) in months" :key="label" :label="label" :value="value"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Достижение персональных KPI, %" prop="reached_kpi">
          <el-input v-model="model.reached_kpi"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Достижения отдела, %" prop="reached_revenue">
          <el-input v-model="model.reached_revenue"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Достижения отдела, RUB" prop="reached_revenue_basis">
          <el-input v-model="model.reached_revenue_basis"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TariffForm",
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
  },
  computed: {
    ...mapGetters({
      months: "constants/months"
    })
  }
};
</script>
