<template>
    <base-index-page
            title="Заявки на аудиторию"
            index-route-name="indexRoomReservation"
            new-route-name="newRoomReservation"
            edit-route-name="editRoomReservation"
            new-label="Добавить заявку"
            resource="room_reservations{/id}{/action_name}"
            grid="room-reservation-grid"
            id="room-reservation-index-page"
    />
</template>

<script>
  export default {
    name: 'RoomReservationIndexPage',
    middleware: 'auth'
  }
</script>
