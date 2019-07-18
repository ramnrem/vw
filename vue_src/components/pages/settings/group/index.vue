<template>
    <base-index-page
            title="Группы"
            index-route-name="indexGroup"
            new-route-name="newGroup"
            edit-route-name="editGroup"
            new-label="Добавить роль"
            :resource="resource"
            grid="group-grid"
    />
</template>

<script>
  export default {
    name: 'GroupIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('groups{/id}{/action_name}')
      },
    },
  }
</script>
