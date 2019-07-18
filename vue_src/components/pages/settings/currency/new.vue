<template>
  <base-new-page
    title="Новая валюта"
    index-route-name="indexCurrency"
    index-label="Валюты"
    resource="currencies{/id}{/action_name}"
    form="currency-form"
  />
</template>

<script>
export default {
  name: "CurrencyNewPage",
  middleware: "auth"
};
</script>
