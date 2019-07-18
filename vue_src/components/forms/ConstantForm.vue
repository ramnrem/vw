<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название" prop="name" :rules="rules.required">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Код" prop="code" :rules="rules.required">
          <el-select v-model="model.code">
            <el-option
              v-for="(code, value) in codes"
              :key="value"
              :value="value"
              :label="code.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Дата начала" prop="start" :rules="rules.required">
      <el-date-picker
        :picker-options="{firstDayOfWeek:1}"
        v-model="model.start"
        format="dd.MM.yyyy"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="Значение" prop="value" :rules="rules.required">
      <el-input v-model="model.value" style="width: 220px;"/>
    </el-form-item>

    <el-alert
      style="width: 220px;"
      v-if="currentCode && currentCode.description"
      :title="currentCode.description"
      type="info"
      show-icon
    ></el-alert>
  </div>
</template>

<script>
export default {
  name: "ConstantForm",
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
    codes() {
      return {
        direct_cost_percent: {
          label: "Процент прямых затрат"
        },
        trainer_daily_limit: {
          label: "Дневной лимит по умолчанию"
        },
        booker_post: {
          label: "Должность главного бухгалтера"
        },
        booker_name: { label: "Имя главного бухгалтера" },
        big_sale_start_period: {
          label: "Дата начала действия больших продаж"
        },
        big_sale_duration: {
          label: "Период больших продаж в месяцах"
        },
        assistant_commission_percent: {
          label: "Размер комиссии для асситента"
        },
        start_time: {
          label: "Время начала по умолчанию",
          description: "Формат значения: HH:MM:CC (09:00:00)"
        },
        finish_time: {
          label: "Время окончания по умолчанию",
          description: "Формат значения: HH:MM:CC (17:00:00)"
        }
      };
    },
    currentCode() {
      return this.codes[this.model.code];
    }
  }
};
</script>
