<template>
    <base-index-page
            title="Плательщики"
            index-route-name="indexCustomer"
            new-route-name="newCustomer"
            edit-route-name="editCustomer"
            new-label="Добавить плательщика"
            resource="customers{/id}{/action_name}"
            grid="customer-grid"
            id="customer-index-page"
    />
</template>

<script>
  export default {
    name: 'CustomerIndexPage',
    middleware: 'auth'
  }
</script>
