<template>
    <base-edit-page
            :title="title"
            index-route-name="indexContract"
            index-label="Договора"
            resource="contracts{/id}{/action_name}"
            form="contract-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="contract"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ContractEditPage',
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
