<template>
<base-new-page
ref='page'
title="Сформировать отчет"
index-route-name="indexReportItem"
index-label="Отчеты"
 resource="report_items{/id}{/action_name}"
 form="report-item-form"
 :actions="actions"
 :back="back" />
</template>

<script>
export default {
  name: 'ReportItemNewPage',
  middleware: 'auth',
  computed: {
    actions () {
      return [
        { label: 'Сформировать', command: () => this.$refs.page.create(), validate: true, type: 'primary' },
        { label: 'Отмена', command: this.back },
      ]
    },
  },
  methods: {
    back () {
      this.$router.push({ name: 'indexReportItem' })
    },
  }
}
</script>
