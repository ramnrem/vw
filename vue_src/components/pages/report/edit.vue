<template>
  <base-edit-page
    :title="title"
    index-route-name="indexReport"
    index-label="Настройка отчетов"
    resource="reports{/id}{/action_name}"
    form="report-form"
    @fetch="handleFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="report"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "ReportEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = model.label;
    }
  }
};
</script>
