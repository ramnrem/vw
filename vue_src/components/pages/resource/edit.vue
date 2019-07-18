<template>
    <base-edit-page
            :title="title"
            index-route-name="indexResource"
            index-label="Ресурсы"
            :resource="resource"
            form="resource-form"
            @fetch="handleFetch">
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="supplier"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ResourceEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resources{/id}{/action_name}')
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
