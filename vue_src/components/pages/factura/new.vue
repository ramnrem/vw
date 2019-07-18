<template>
    <base-new-page
            title="Новая счет-фактура"
            index-route-name="indexFactura"
            index-label="Счета-фактуры"
            resource="facturas{/id}{/action_name}"
            form="factura-form"
    />
</template>

<script>
  export default {
    name: 'FacturaNewPage',
    middleware: 'auth'
  }
</script>
