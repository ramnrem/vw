<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Калькуляция" prop="cost_price_id">
          <relation-select-input
            v-model="model.cost_price_id"
            :init-model="model.cost_price"
            resource="cost_prices{/id}{/action_name}"
            grid="cost-price-grid"
            form="cost-price-form"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Участник" prop="participant_id">
          <relation-select-input
            v-model="model.participant_id"
            :init-model="model.participant"
            resource="participants{/id}{/action_name}"
            grid="participant-grid"
            form="participant-form"
            value-label="name"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Комментарий" prop="note">
      <el-input type="textarea" v-model="model.note"/>
    </el-form-item>

    <el-form-item label="Оценка" prop="rate">
      <el-rate v-model="model.rate"/>
    </el-form-item>

    <el-form-item label="Отзыв" prop="comment">
      <el-input type="textarea" v-model="model.comment"/>
    </el-form-item>

    <el-form-item label="Сертификат">
      <a :href="model.file.url" v-if="model.file">{{model.file.filename}}</a>
      <el-alert
        v-else
        title="Сертифкат не сформирован, сгенерируйте сертифкат через печать"
        type="warning"
        show-icon
      ></el-alert>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "CertificateForm",
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
        name: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  }
};
</script>
