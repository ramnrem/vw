<template>
    <base-index-page
            title="Отчеты"
            index-route-name="indexReportItem"
            new-route-name="newReportItem"
            edit-route-name="editReportItem"
            new-label="Сформировать отчет"
            :resource="resource"
            grid="report-grid"
    />
</template>

<script>
  export default {
    name: 'ReportItemIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('report_items{/id}{/action_name}')
      },
    },
  }
</script>
