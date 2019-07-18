<template>
    <base-edit-page
            :title="title"
            index-route-name="indexCertificate"
            index-label="Cертификаты"
            resource="certificates{/id}{/action_name}"
            form="certificate-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="certificate" resource="certificates{/id}{/action_name}"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'CertificateEditPage',
    middleware: 'auth',
    data() {
      return {
        title: ''
      }
    },
    methods: {
      handleFetch (model) {
        this.title = `Сертификат №${model.cost_price_id}-${model.id}`
      }
    },
  }
</script>
