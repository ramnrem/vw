<template>
    <div>
        <el-form-item label="Период" prop="period" :rules="rules.required">
            <el-date-picker :picker-options="{firstDayOfWeek:1}" 
                    v-model="model.period"
                    type="daterange"
                    range-separator="По"
                    start-placeholder="Дата начала"
                    end-placeholder="Дата окончания"
                    format="dd.MM.yyyy"
                    value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="Тип" prop="type_of_day" :rules="rules.required">
            <select-constant v-model="model.type_of_day" code="holiday_type" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="Примечание" prop="note">
            <el-input v-model="model.note"/>
        </el-form-item>
    </div>
</template>

<script>
  export default {
    name: 'HolidayForm',
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
