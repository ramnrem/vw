<template>
    <base-new-page
            title="Новый счет"
            index-route-name="indexInvoice"
            index-label="Счета"
            resource="invoices{/id}{/action_name}"
            form="invoice-form"
    />
</template>

<script>
  export default {
    name: 'InvoiceNewPage',
    middleware: 'auth'
  }
</script>
