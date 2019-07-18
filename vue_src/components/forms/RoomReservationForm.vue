<template>
  <div>
    <el-row type="flex" justify="end">
      <el-form-item prop="aasm_state" label="Статус документа">
        <el-select v-model="model.aasm_state">
          <el-option
            v-for="item in states['room_reservation'].items"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <cost-price-view v-model="model.cost_price_id" :readonly="model.id > 0" />
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Причина" prop="reason" :rules="rules.required">
          <el-select v-model="model.reason">
            <el-option
              v-for="(label, value) in room_reservation_reason"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Тип" prop="reservation_type" :rules="rules.required">
          <el-select v-model="model.reservation_type">
            <el-option
              v-for="(label, value) in room_reservation_type"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Аудитория" prop="room_id" :rules="rules.required">
          <relation-select-input
            v-model="model.room_id"
            :resource="$resource('rooms{/id}')"
            grid="room-grid"
            form="room-form"
          ></relation-select-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Даты</h3>
      <el-button size="small" type="primary" @click.prevent="addPeriod">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table :data="model.room_reservation_periods_attributes">
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
    <div class="el-spacer"></div>
    <el-form-item label="Дополнительные требования" prop="short_note">
      <el-input v-model="model.short_note" type="textarea" />
    </el-form-item>
    <el-form-item label="Дополнительная информация о резерве" prop="note">
      <el-input v-model="model.note" type="textarea" />
    </el-form-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RoomReservationForm",
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
    ...mapGetters({
      states: "states/list",
      defaultTimePeriod: "settings/defaultTimePeriod",
      room_reservation_reason: "constants/room_reservation_reason",
      room_reservation_type: "constants/room_reservation_type"
    })
  },
  methods: {
    addPeriod() {
      this.model.room_reservation_periods_attributes.push({
        _destroy: false,
        duration: null,
        unit: "day",
        period: []
      });
    }
  }
};
</script>
