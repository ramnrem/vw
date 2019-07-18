<template>
    <base-new-page
            title="Новый поставщик"
            index-route-name="indexSupplier"
            index-label="Поставщики"
            :resource="resource"
            form="supplier-form"
    />
</template>

<script>
  export default {
    name: 'SupplierNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('suppliers{/id}{/action_name}')
      },
    },
  }
</script>
