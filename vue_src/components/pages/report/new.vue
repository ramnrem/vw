<template>
  <base-new-page
    title="Новый отчет"
    index-route-name="indexReport"
    index-label="Настройка отчетов"
    resource="reports{/id}{/action_name}"
    form="report-form"
  />
</template>

<script>
export default {
  name: "ReportNewPage",
  middleware: "auth"
};
</script>
