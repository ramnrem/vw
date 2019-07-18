<template>
    <base-edit-page
            :title="title"
            index-route-name="indexRole"
            index-label="Роли"
            :resource="resource"
            form="role-form"
            @fetch="handleFetch"
            :model="model"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="role"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'RoleEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('roles{/id}{/action_name}')
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
