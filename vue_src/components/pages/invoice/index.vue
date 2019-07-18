<template>
    <base-index-page
            title="Счета"
            index-route-name="indexInvoice"
            new-route-name="newInvoice"
            edit-route-name="editInvoice"
            new-label="Добавить счет"
            resource="invoices{/id}{/action_name}"
            grid="invoice-grid"
            :row-style="rowStyle"
    />
</template>

<script>
  export default {
    name: 'InvoiceIndexPage',
    middleware: 'auth',
    methods: {
      rowStyle({row, rowIndex}) {
        if (row.consolidated) return 'background-color: #88FF88 !important;'
        if (row.in_consolidated) return 'background-color: #dddddd !important;'
      }
    }
  }
</script>
