<template>
    <base-new-page
            title="Новый тариф"
            index-route-name="indexTariff"
            index-label="Тарифы"
            :resource="resource"
            form="tariff-form"
    />
</template>

<script>
  export default {
    name: 'TariffNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('tariffs{/id}{/action_name}')
      },
    },
  }
</script>
