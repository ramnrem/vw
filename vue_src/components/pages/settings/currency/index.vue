<template>
    <base-index-page
            title="Валюты"
            index-route-name="indexCurrency"
            new-route-name="newCurrency"
            edit-route-name="editCurrency"
            new-label="Добавить валюту"
            resource="currencies{/id}{/action_name}"
    />
</template>

<script>
  export default {
    name: 'CurrencyIndexPage',
    middleware: 'auth'
  }
</script>
