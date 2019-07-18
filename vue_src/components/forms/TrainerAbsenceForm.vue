<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Тренер" prop="trainer_id" :rules="rules.trainer_id">
          <relation-select-input
            v-model="model.trainer_id"
            :init-model="model.trainer"
            resource="trainers{/id}{/action_name}"
            grid="trainer-grid"
            form="trainer-form"
            :readonly="model.id > 0"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Причина" prop="reason_absence_id" :rules="rules.reason_absence_id">
          <enumeration v-model="model.reason_absence_id" code="reason_absence" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Комментарий" prop="note">
      <el-input v-model="model.note" type="textarea" />
    </el-form-item>
    <div class="el-card-title">
      <h3>Даты</h3>
      <el-button size="small" type="primary" @click.prevent="addPeriod">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table :data="model.trainer_absence_periods_attributes">
      <el-table-column prop="period" label="Период">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.period"
            type="datetimerange"
            range-separator="По"
            start-placeholder="Дата начала"
            end-placeholder="Дата окончания"
            value-format="yyyy-MM-ddTHH:mm"
            format="dd.MM.yyyy HH:mm"
            :default-time="defaultTimePeriod"
            @change="$periodTools.calculateDuration(scope.row, defaultTimePeriod)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="Продолжительность">
        <template slot-scope="scope">
          <el-input v-model="scope.row.duration" class="input-with-select" style="width: 200px">
            <el-select
              v-model="scope.row.unit"
              slot="append"
              placeholder="Ед. изм"
              style="width: 100px"
              @change="$periodTools.calculateDuration(scope.row, defaultTimePeriod)"
            >
              <el-option label="Дни" value="day"></el-option>
              <el-option label="Часы" value="hour"></el-option>
            </el-select>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TrainerAbsenceForm",
  props: {
    model: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      rules: {
        reason_absence_id: {
          required: true,
          message: "не может быть пустым"
        },
        trainer_id: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      defaultTimePeriod: "settings/defaultTimePeriod"
    })
  },
  methods: {
    addPeriod() {
      this.model.trainer_absence_periods_attributes.push({
        _destroy: false,
        unit: "day",
        period: []
      });

      this.$forceUpdate();
    }
  }
};
</script>
