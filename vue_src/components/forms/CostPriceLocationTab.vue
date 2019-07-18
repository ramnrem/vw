<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col :span="8">
        <el-form-item label="Расположение" prop="location_id">
          <enumeration v-model="model.location_id" code="location"/>
        </el-form-item>
      </el-col>
      <el-col style="padding-top: 30px">
        <el-button @click="handleDocumentCommand('room_reservation')">Добавить резервирование</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Место поездки" prop="place_to_go">
          <el-input v-model="model.place_to_go"/>
        </el-form-item>
        <el-form-item label="Требования к помещению" prop="require_room">
          <el-input type="textarea" v-model="model.require_room"/>
        </el-form-item>
        <el-form-item label="Количество участников" prop="count_participants_plan">
          <el-input v-model="model.count_participants_plan"/>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Заявки на аудитории</h3>
    </div>
    <el-table :data="model.room_reservations">
      <el-table-column sortable prop="aasm_state" label="Статус" width="130">
        <template slot-scope="scope">
          <status-badge :state="scope.row.aasm_state" :states="scope.row.class"/>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="№" width="100">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.id"
            :to="{ name: `edit${scope.row.type}`, params: { id: scope.row.id}}"
          >{{scope.row.id}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="room" label="Аудитория">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.room_id"
            :to="{ name: `editRoom`, params: { id: scope.row.room_id}}"
          >{{scope.row.room.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Тип" width="200">
        <template slot-scope="scope">{{room_reservation_type[scope.row.reservation_type]}}</template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="Создан"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
      <el-table-column
        prop="updated_at"
        label="Обновлен"
        :formatter="$formatter.formatColumnDate"
        width="100"
      />
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
import { mapGetters } from "vuex";

export default {
  name: "CostPriceLocationTab",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapGetters({      
      room_reservation_type: "constants/room_reservation_type"
    }),      
  },
  methods: {
    handleDocumentCommand(command) {
      switch (command) {
        case "room_reservation":
          this.$router.push({
            name: "newRoomReservation",
            query: {
              cost_price_id: this.model.id,
              redirect: this.$route.fullPath
            }
          });

          break;
      }
    }
  }
};
</script>
