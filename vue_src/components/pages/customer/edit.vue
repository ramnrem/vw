<template>
    <base-edit-page
            :title="title"
            index-route-name="indexCustomer"
            index-label="Плательщики"
            resource="customers{/id}{/action_name}"
            form="customer-form"
            @fetch="handleFetch">
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="customer"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'CustomerEditPage',
    middleware: 'auth',
    data () {
      return {
        title: ''
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      },
    },
  }
</script>
