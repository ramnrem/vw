<template>
    <base-index-page
            title="Менеджеры"
            index-route-name="indexManager"
            new-route-name="newManager"
            edit-route-name="editManager"
            new-label="Добавить менеджера"
            :resource="resource"
            grid="manager-grid"
    />
</template>

<script>
  export default {
    name: 'ManagerIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('managers{/id}{/action_name}')
      },
    },
  }
</script>
