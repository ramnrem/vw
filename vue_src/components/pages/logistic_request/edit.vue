<template>
  <base-edit-page
    :title="title"
    index-route-name="indexLogisticRequest"
    index-label="Логистические заявки"
    resource="logistic_requests{/id}{/action_name}"
    form="logistic-request-form"
    @fetch="handleFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="logistic_request"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "LogisticRequestEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = `№ ${model.id}`;
    }
  }
};
</script>
