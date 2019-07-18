<template>
  <div>
    <grid-input
      :data="model.cost_price_periods_attributes"
      :commands="periodCommands"
      :command-handler="periodCommandHandler"
    >
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
          <el-input
            v-model="scope.row.duration"
            class="input-with-select"            
            style="width: 200px"
          >
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
    </grid-input>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CostPriceScheduleTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      defaultTimePeriod: "settings/defaultTimePeriod"
    }),
    periodCommands() {
      return [
        {
          label: "Добавить",
          command: "add",
          disabled: false
        },
        {
          divided: true
        },
        {
          label: "Удалить",
          command: "remove",
          disabled: this.isCommandDisabled
        }
      ];
    }
  },
  methods: {
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    periodCommandHandler(context, command) {
      if (command === "add") {
        this.model.cost_price_periods_attributes.push({
          _destroy: false,
          unit: "day",
          duration: 0,
          period: []
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    }
  }
};
</script>
