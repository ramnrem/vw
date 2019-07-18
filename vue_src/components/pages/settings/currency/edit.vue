<template>
  <base-edit-page
    :title="title"
    index-route-name="indexCurrency"
    index-label="Валюты"
    resource="currencies{/id}{/action_name}"
    form="currency-form"
    @fetch="handleFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="currency"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "CurrencyEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = model.name;
    }
  }
};
</script>
