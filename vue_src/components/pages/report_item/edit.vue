<template>
<base-edit-page :title="title" :actions="actions"
                index-route-name="indexReportItem"
                index-label="Отчеты"
                resource="report_items{/id}{/action_name}"
                form="report-item-form"
                @fetch="handleFetch">
  <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="report"/>
        </template>
</base-edit-page>
</template>

<script>
export default {
  name: 'ReportEditPage',
  middleware: 'auth',
  data() {
    return {
      title: '',
      actions: [{ label: 'Назад', command: this.back }]
    }
  },
  methods: {
    handleFetch(model) {
      this.title = `Отчет №${model.id}`
    },
    back() {
      this.$router.push({ name: 'indexReportItem' })
    }
  },
}
</script>
