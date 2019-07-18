<template>
  <base-edit-page
    :title="title"
    index-route-name="indexRoomReservation"
    index-label="Заявки на аудиторию"
    resource="room_reservations{/id}{/action_name}"
    form="room-reservation-form"
    @fetch="handleFetch"
    ref="page"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="room_reservation"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "RoomReservationEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = `№ ${model.id}`;
    }
  }
};
</script>
