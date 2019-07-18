<template>
    <base-index-page
            title="Организации"
            index-route-name="indexOwnFirm"
            new-route-name="newOwnFirm"
            edit-route-name="editOwnFirm"
            new-label="Добавить организацию"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'OwnFirmIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('own_firms{/id}{/action_name}')
      },
    },
  }
</script>
