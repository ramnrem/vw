<template>
    <base-new-page
            title="Новая аудитория"
            index-route-name="indexRoom"
            index-label="Аудитории"
            :resource="resource"
            form="room-form"
    />
</template>

<script>
  export default {
    name: 'RoomNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('rooms{/id}{/action_name}')
      },
    },
  }
</script>
