<template>
  <base-index-page
    title="Настройка отчетов"
    index-route-name="indexReport"
    new-route-name="newReport"
    edit-route-name="editReport"
    resource="reports{/id}{/action_name}"
    grid="report-grid"
  />
</template>

<script>
export default {
  name: "ReportIndexPage",
  middleware: "auth"
};
</script>
