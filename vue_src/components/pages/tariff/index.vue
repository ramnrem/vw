<template>
    <base-index-page
            title="Тарифы"
            index-route-name="indexTariff"
            new-route-name="newTariff"
            edit-route-name="editTariff"
            new-label="Добавить тариф"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'TariffIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('tariffs{/id}{/action_name}')
      },
    },
  }
</script>
