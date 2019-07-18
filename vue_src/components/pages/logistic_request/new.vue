<template>
  <base-new-page
    title="Новая заявка"
    index-route-name="indexLogisticRequest"
    index-label="Логистические заявки"
    resource="logistic_requests{/id}{/action_name}"
    form="logistic-request-form"
  />
</template>

<script>
export default {
  name: "LogisticRequestNewPage",
  middleware: "auth"
};
</script>
