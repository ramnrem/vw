<template>
  <div>
    <el-form-item label="Отчет" prop="report_id" :rules="rules.required">
      <relation-select-input
        v-model="model.report_id"
        resource="reports{/id}"
        grid="report-grid"
        form="report-form"
        @change="handleChangeReport"
      />
    </el-form-item>
    <template v-for="param in this.model.report_item_parameters_attributes">
      <el-form-item
        :label="param.report_parameter.label"
        :key="param.report_parameter.label"
      >
        <el-input v-model="param.value" v-if="param.report_parameter.data_type === 'string'" :disabled="model.id > 0"/>
        <el-date-picker :picker-options="{firstDayOfWeek:1}" 
          v-model="param.value"
          v-if="param.report_parameter.data_type === 'date'"
          format="dd.MM.yyyy"
          value-format="yyyy-MM-dd"
          :disabled="model.id > 0"
        />
        <el-date-picker :picker-options="{firstDayOfWeek:1}" 
          v-model="param.value"
          type="datetime"
          v-if="param.report_parameter.data_type === 'datetime'"
          format="dd.MM.yyyy HH::mm"
          value-format="yyyy-MM-dd HH::mm"
          :disabled="model.id > 0"
        />
        <relation-select-input
          v-if="param.report_parameter.data_type === 'entity'"
          v-model="param.value"
          :resource="`${param.report_parameter.entity_pluralize}{/id}`"
          :grid="`${param.report_parameter.entity_underscore}-grid`"
          :form="`${param.report_parameter.entity_underscore}-form`"
          :readonly="model.id > 0"
        />
      </el-form-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "ReportItemForm",
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
  methods: {
    handleChangeReport(report) {
      report.report_parameters_attributes.forEach(parameter => {
        this.model.report_item_parameters_attributes.push({
          report_parameter_id: parameter.id,
          report_parameter: parameter
        });
      });
    }
  }
};
</script>
