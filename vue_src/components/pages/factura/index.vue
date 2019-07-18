<template>
    <base-index-page
            title="Счета-фактуры"
            index-route-name="indexFactura"
            new-route-name="newFactura"
            edit-route-name="editFactura"
            new-label="Добавить счет-фактуру"
            resource="facturas{/id}{/action_name}"
            grid="factura-grid"
            id="factura-index-page"
    />
</template>

<script>
  export default {
    name: 'FacturaIndexPage',
    middleware: 'auth'
  }
</script>
