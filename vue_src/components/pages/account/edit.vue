<template>
    <base-edit-page
            :title="title"
            index-route-name="indexAccount"
            index-label="Аккаунты"
            :resource="resource"
            form="account-form"
            @fetch="handlerFetch"
            :model="model"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="account"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'AccountEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('accounts{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
        model: {
          aasm_state: null,
          foreign_company: null,
          new_account: null,
          exception: null,
        },
      }
    },
    methods: {
      handlerFetch (model) {
        this.title = model.label
      },
    },
  }
</script>
