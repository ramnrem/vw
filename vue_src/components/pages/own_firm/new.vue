<template>
    <base-new-page
            title="Новая организация"
            index-route-name="indexOwnFirm"
            index-label="Организации"
            :resource="resource"
            form="own-firm-form"
    />
</template>

<script>
  export default {
    name: 'OwnFirmNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('own_firms{/id}{/action_name}')
      },
    },
  }
</script>
