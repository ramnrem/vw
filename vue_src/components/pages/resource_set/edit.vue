<template>
    <base-edit-page
            :title="title"
            index-route-name="indexResourceSet"
            index-label="Наборы ресурсов"
            :resource="resource"
            form="resource-set-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="resource_set"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ResourceSetEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resource_sets{/id}{/action_name}')
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
