<template>
    <base-edit-page
            :title="title"
            index-route-name="indexManager"
            index-label="Менеджеры"
            :resource="resource"
            form="manager-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="manager"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ManagerEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('managers{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.name
      }
    },
  }
</script>
