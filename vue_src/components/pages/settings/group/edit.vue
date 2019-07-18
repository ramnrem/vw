<template>
    <base-edit-page
            :title="title"
            index-route-name="indexGroup"
            index-label="Группы"
            :resource="resource"
            form="group-form"
            @fetch="handleFetch"
            :model="model"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="group"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'GroupEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('groups{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
        model: { aasm_state: '' },
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
