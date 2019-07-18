<template>
    <base-index-page
            title="Логистические заявки"
            index-route-name="indexLogisticRequest"
            new-route-name="newLogisticRequest"
            edit-route-name="editLogisticRequest"
            new-label="Добавить заявку"
            resource="logistic_requests{/id}{/action_name}"
            grid="logistic-request-grid"
            id="logistic-request-index-page"
    />
</template>

<script>
  export default {
    name: 'LogisticRequestIndexPage',
    middleware: 'auth'
  }
</script>
