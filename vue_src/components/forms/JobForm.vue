<template>
  <div>
    <el-form-item label="Задача" prop="code">
      <el-select v-model="model.code" :disabled="model.id > 0">
        <el-option v-for="(label, code) in codes" :key="code" :label="label" :value="code"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Уведомить по завершению" prop="notify">
      <el-checkbox v-model="model.notify" :disabled="model.id > 0"/>
    </el-form-item>

    <template v-if="model.code == 'CalculateDocumentsJob'">
      <el-form-item label="Документ">
        <el-select v-model="model.args.document_type" :disabled="model.id > 0">
          <el-option
            v-for="document in allowedDocuments"
            :key="document"
            :label="documents[document].label"
            :value="document"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Период">
        <el-date-picker
          :disabled="model.id > 0"
          :picker-options="{firstDayOfWeek:1}"
          v-model="model.args.period"
          type="daterange"
          range-separator="По"
          start-placeholder="Дата начала"
          end-placeholder="Дата окончания"
          value-format="yyyy-MM-dd"
          format="dd.MM.yyyy"
        />
      </el-form-item>
    </template>

     <template v-if="model.code == 'BuildParticipantsCertificateJob'">
       <el-form-item label="Кост-прайс">
        <relation-select-input
              v-model="model.args.document_id"
              resource="cost_prices{/id}"
              form="cost-price-form"
              grid="cost-price-grid"
            />
       </el-form-item>
    </template>

    <template v-if="model.id > 0">
      <h4>Результат</h4>
      <div v-html="model.output"/>
    </template>
  </div>
</template>
  
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "JobForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters({
      documents: "settings/documents"
    }),
    codes() {
      return {
        CalculateDocumentsJob: "Пересчитать документы за период",
        SyncCalendarItemsJob: "Запустить синхронизацию календаря",
        LoadCurrencyRatesJob: "Загрузить курсы валют",  
        BuildParticipantsCertificateJob: "Сформировать групповой сертификат"      
      };
    },
    allowedDocuments() {
      return [
        "CostPrice",
        "Act",        
        "Invoice",
        "Factura",        
        "LogisticRequest",
        "TrainerOrder"
      ];
    }
  }
};
</script>
