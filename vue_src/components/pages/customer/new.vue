<template>
    <base-new-page
            title="Новый плательщик"
            index-route-name="indexCustomer"
            index-label="Плательщики"
            resource="customers{/id}{/action_name}"
            form="customer-form"
    />
</template>

<script>
  export default {
    name: 'CustomerNewPage',
    middleware: 'auth'
  }
</script>
