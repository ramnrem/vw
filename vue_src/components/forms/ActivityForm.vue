<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-row type="flex" :gutter="18">
          <el-col>
            <el-form-item label="Тип" prop="type">
              <el-select v-model="model.type" @change="onChangeType" :disabled="model.id != null">
                <el-option
                  v-for="(label, type) in activity_types"
                  :key="type"
                  :value="type"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="Важное" prop="important">
              <el-switch v-model="model.important" active-text="Да"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Время" prop="period" :rules="rules.period">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="model.period"
            type="datetimerange"
            range-separator="По"
            start-placeholder="Время начала"
            end-placeholder="Время окончания"
            value-format="yyyy-MM-ddTHH:mm"
            format="dd.MM.yyyy HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Тема" prop="name" :rules="rules.name">
          <el-input v-model="model.name"/>
        </el-form-item>
        <el-form-item label="Место встречи" prop="location" v-if="model.type === 'meeting'">
          <el-input v-model="model.location"/>
        </el-form-item>
        <el-form-item label="Описание" prop="description">
          <el-input type="textarea" v-model="model.description"/>
        </el-form-item>
        <el-form-item label="Сделка/Лид" prop="activityable_id">
          <polymorphic-search-page
            :model="model"
            :value-type="model.activityable_type"
            :value-id="model.activityable_id"
            field-id="activityable_id"
            field-type="activityable_type"
            :types="[
                                {label: 'Лиды', type: 'Lead', resource: $resource('leads{/id}'), grid: 'lead-grid', form: 'lead-form', valueLabel: item => { return `Лид: ${item.label}` }},
                                {label: 'Сделки', type: 'Contract', resource: $resource('contracts{/id}'), grid: 'contract-grid', form: 'contract-form', valueLabel: item => { return `Сделка: ${item.label}` }}
                            ]"
          />
        </el-form-item>
        <el-form-item label="Ответственный" prop="assigned_id">
          <relation-select-input
            v-model="model.assigned_id"
            :init-model="model.assigned"
            resource="users{/id}{/action_name}"
            grid="user-grid"
            form="user-form"
            value-label="name"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ActivityForm",
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
        },
        period: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      activity_types: "constants/activity_types",
      activity_states: "constants/activity_states"
    })
  },
  methods: {
    onChangeType(value) {
      this.$router.push({
        query: {
          type: value
        }
      });
      this.$forceUpdate();
    }
  }
};
</script>
