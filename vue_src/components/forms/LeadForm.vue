<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col :span="4">
        <el-form-item label="Кост-прайс" prop="cost_price_id">
          <relation-select-input
            v-model="model.cost_price_id"
            resource="cost_prices{/id}{/action_name}"
            form="cost-price-form"
            grid="cost-price-grid"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Аккаунт" prop="account_id">
          <relation-select-input
            v-model="model.account_id"
            resource="accounts{/id}{/action_name}"
            form="account-form"
            grid="account-grid"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Контакт" prop="contact_id">
          <relation-select-input
            v-model="model.contact_id"
            resource="contacts{/id}{/action_name}"
            form="contact-form"
            grid="contact-grid"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Участник" prop="participant_id">
          <relation-select-input
            v-model="model.participant_id"
            resource="participants{/id}{/action_name}"
            form="participant-form"
            grid="participant-grid"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Источник" prop="lead_source_id">
          <enumeration v-model="model.lead_source_id" code="lead_source"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Статус" prop="aasm_state">
          <el-select v-model="model.aasm_state">
            <el-option
              v-for="state in states.lead.items"
              :value="state.id"
              :label="state.name"
              :key="state.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Имя" prop="name">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Фамилия" prop="last_name">
          <el-input v-model="model.last_name"/>
        </el-form-item>
      </el-col>
    </el-row>
    <h4>Компания</h4>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Наименование" prop="company_name">
          <el-input v-model="model.company_name"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Уровень должности" prop="position_level_id">
          <enumeration v-model="model.position_level_id" code="position_level"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Сфера деятельности" prop="field_activity_id">
          <enumeration v-model="model.field_activity_id" code="field_activity"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Индустрия" prop="industry_id">
          <enumeration v-model="model.industry_id" code="industry"/>
        </el-form-item>
      </el-col>
    </el-row>
    <h4>Контакты</h4>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Телефон" prop="phone">
          <el-input v-model="model.phone"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="model.email"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Город" prop="city">
          <el-input v-model="model.city"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Страна" prop="country">
          <el-input v-model="model.country"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LeadForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters({
      list: "dictionary/list",
      states: "states/list"
    })
  }
};
</script>
