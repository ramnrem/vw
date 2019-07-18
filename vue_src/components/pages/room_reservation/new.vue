<template>
  <base-new-page
    title="Новая заявка"
    index-route-name="indexRoomReservation"
    index-label="Заявки на аудиторию"
    resource="room_reservations{/id}{/action_name}"
    form="room-reservation-form"
  />
</template>

<script>
export default {
  name: "RoomReservationNewPage",
  middleware: "auth"
};
</script>
