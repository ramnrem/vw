<template>
  <base-edit-page
    :title="title"
    index-route-name="indexInvoice"
    index-label="Счета"
    resource="invoices{/id}{/action_name}"
    form="invoice-form"
    :menu="menu"
    @fetch="handlerFetch"
    ref="page"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line
        :model="scope.model"
        states="invoice"
        resource="invoices{/id}{/action_name}"
      />
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "AccountEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  computed: {
    menu() {
      return {
        label: "Действия",
        items: [
          {
            label: "Выписать авансовую счет-фактуру",
            command: this.createFacturaAdvance
          },
          {
            label: "Выписать счет-фактуру",
            command: this.createFacturaRegular
          }
        ]
      };
    }
  },
  methods: {
    handlerFetch(model) {
      this.title = `Счет №${model.id}`;
    },
    createFacturaAdvance() {
      let routeData = this.$router.resolve({
        name: "newFactura",
        query: {
          invoice_id: this.$refs.page.model.id,
          type: "Factura::Advance",
          redirect: this.$route.fullPath
        }
      });

      window.open(routeData.href, "_blank");
    },
    createFacturaRegular() {
      let routeData = this.$router.resolve({
        name: "newFactura",
        query: {
          invoice_id: this.$refs.page.model.id,
          type: "Factura::Regular",
          redirect: this.$route.fullPath
        }
      });

      window.open(routeData.href, "_blank");
    }
  }
};
</script>
