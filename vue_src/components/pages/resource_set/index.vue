<template>
    <base-index-page
            title="Наборы ресурсов"
            index-route-name="indexResourceSet"
            new-route-name="newResourceSet"
            edit-route-name="editResourceSet"
            new-label="Добавить"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'ResourceSetIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resource_sets{/id}{/action_name}')
      },
    },
  }
</script>
