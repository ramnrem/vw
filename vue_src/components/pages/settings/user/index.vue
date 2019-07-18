<template>
    <base-index-page
            title="Пользователи"
            index-route-name="indexUser"
            new-route-name="newUser"
            edit-route-name="editUser"
            new-label="Добавить пользователя"
            :resource="resource"
            grid="user-grid"
    />
</template>

<script>
  export default {
    name: 'UserIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('users{/id}{/action_name}')
      },
    },
  }
</script>
