<template>
    <base-index-page
            title="Аудитории"
            index-route-name="indexRoom"
            new-route-name="newRoom"
            edit-route-name="editRoom"
            new-label="Добавить"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'RoomIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('rooms{/id}{/action_name}')
      },
    },
  }
</script>
