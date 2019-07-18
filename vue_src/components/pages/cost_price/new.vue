<template>
    <base-new-page
            title="Новый кост-прайс"
            index-route-name="indexCostPrice"
            index-label="Кост-прайсы"
            resource="cost_prices{/id}{/action_name}"
            form="cost-price-form"
    />
</template>

<script>
  export default {
    name: 'CostPriceNewPage',
    middleware: 'auth'
  }
</script>
