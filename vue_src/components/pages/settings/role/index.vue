<template>
    <base-index-page
            title="Роли"
            index-route-name="indexRole"
            new-route-name="newRole"
            edit-route-name="editRole"
            new-label="Добавить роль"
            :resource="resource"
            grid="role-grid"
    />
</template>

<script>
  export default {
    name: 'RoleIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('roles{/id}{/action_name}')
      },
    },
  }
</script>
