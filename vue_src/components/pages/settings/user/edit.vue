<template>
    <base-edit-page
            :title="title"
            index-route-name="indexUser"
            index-label="Пользователи"
            resource="users{/id}{/action_name}"
            form="user-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="user"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'UserEditPage',
    middleware: 'auth',
    data () {
      return {
        title: ''
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.name
      }
    },
  }
</script>
