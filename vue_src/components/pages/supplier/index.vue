<template>
    <base-index-page
            title="Поставщики"
            index-route-name="indexSupplier"
            new-route-name="newSupplier"
            edit-route-name="editSupplier"
            new-label="Добавить поставщика"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'SupplierIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('suppliers{/id}{/action_name}')
      },
    },
  }
</script>
