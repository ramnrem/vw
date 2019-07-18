<template>
    <base-edit-page
            :title="title"
            index-route-name="indexFactura"
            index-label="Счета-фактуры"
            resource="facturas{/id}{/action_name}"
            form="factura-form"
            @fetch="handlerFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="factura" resource="facturas{/id}{/action_name}"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'FacturaEditPage',
    middleware: 'auth',
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handlerFetch (model) {
        this.title = `Счет-фактура №${model.id}`
      },
    },
  }
</script>
