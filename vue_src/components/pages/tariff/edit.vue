<template>
    <base-edit-page
            :title="title"
            index-route-name="indexTariff"
            index-label="Тарифы"
            :resource="resource"
            form="tariff-form"
            @fetch="handleFetch">
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="signer"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'TariffEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('tariffs{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
