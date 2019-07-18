<template>
    <base-edit-page
            :title="title"
            index-route-name="indexSupplier"
            index-label="Поставщики"
            :resource="resource"
            form="supplier-form"
            @fetch="handleFetch">
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="supplier"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'SupplierEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('suppliers{/id}{/action_name}')
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
