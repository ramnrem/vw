<template>
  <div>
    <search-dialog
      resource="trainers{/id}{/action_name}"
      grid="trainer-grid"
      form="trainer-form"
      ref="searchTrainerDialog"
      create-btn-label="Создать тренера"
      :createable="true"
      @select="handleTrainerSelect"
      :multiselect="true"
    />
    <grid-input
      title="Бронирование"
      :data="model.cost_price_trainers_attributes"
      :commands="trainerCommands"
      :command-handler="trainerCommandHandler"
    >
      <el-table-column prop="id" label="№">
        <template slot-scope="scope">
          <relation-select-input
            v-model="scope.row.trainer_id"
            :init-model="scope.row.trainer"
            resource="trainers{/id}{/action_name}"
            grid="trainer-grid"
            form="trainer-form"
            value-label="name"
            :readonly="true"
          />
        </template>
      </el-table-column>
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
            style="width: 100%"
          />
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="Продолжительность" width="200">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.duration"
            class="input-with-select"
            style="width: 100%"
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
      <el-table-column prop="action" width="200">
        <template slot-scope="scope">
          <el-button @click="addTrainerOrder(scope.row)">Создать заказ-счет</el-button>
        </template>
      </el-table-column>
    </grid-input>
    <div class="el-card-title">
      <h3>Заказ-счета</h3>
    </div>
    <el-table :data="model.trainer_orders">
      <el-table-column sortable prop="aasm_state" label="Статус" width="130">
        <template slot-scope="scope">
          <status-badge :state="scope.row.aasm_state" :states="scope.row.class"/>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="№" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.id"
            :to="{ name: `editTrainerOrder`, params: { id: scope.row.id}}"
          >{{scope.row.id}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="trainer.name" label="Тренер"/>
      <el-table-column
        prop="cost"
        label="Сумма, RUB"
        width="240"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="start" label="Начало" width="120"/>
      <el-table-column prop="finish" label="Окончание" width="120"/>
      <el-table-column prop="owner" label="Автор" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.owner.id"
            :to="{ name: `editUser`, params: { id: scope.row.owner.id}}"
          >{{scope.row.owner.name}}</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "CostPriceTrainersTab",
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
    trainerCommands() {
      return [
        {
          label: "Добавить тренера",
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
    handleTrainerSelect(trainerIds) {
      trainerIds.forEach(trainerId => {
        this.$resource("trainers{/id}")
          .get({ id: trainerId })
          .then(response => {
            let trainer = response.data;

            if (this.model.cost_price_periods_attributes.length > 0) {
              this.model.cost_price_periods_attributes.forEach(period => {
                var cpt = this.model.cost_price_trainers_attributes.find(
                  cpt => {
                    return (
                      cpt.trainer_id == trainer.id &&
                      cpt.period[0] == period.period[0] &&
                      cpt.period[1] == period.period[1]
                    );
                  }
                );
                if (!cpt) {
                  this.model.cost_price_trainers_attributes.push({
                    trainer_id: trainer.id,
                    trainer: trainer,
                    period: period.period,
                    duration: period.duration,
                    unit: period.unit,
                    _destroy: false
                  });
                }
              });
            } else {
              this.model.cost_price_trainers_attributes.push({
                trainer_id: trainer.id,
                trainer: trainer,
                period: [],
                duration: 0,
                unit: "day",
                _destroy: false
              });
            }
          });
      });
    },
    trainerCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchTrainerDialog.open();
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    addTrainerOrder(context) {
      this.$router.push({
        name: "newTrainerOrder",
        query: {
          cost_price_id: this.model.id,
          trainer_id: context.trainer_id,
          cost_price_id: this.model.id,
          start: context.period[0].toString(),
          finish: context.period[1].toString(),
          unit: context.unit,
          duration: context.duration,
          redirect: this.$route.fullPath
        }
      });
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    }
  }
};
</script>