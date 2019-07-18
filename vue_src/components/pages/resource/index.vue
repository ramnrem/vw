<template>
    <base-index-page
            title="Ресурсы"
            index-route-name="indexResource"
            new-route-name="newResource"
            edit-route-name="editResource"
            new-label="Добавить ресурс"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'ResourceIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resources{/id}{/action_name}')
      },
    },
  }
</script>
