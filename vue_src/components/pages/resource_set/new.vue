<template>
    <base-new-page
            title="Новый набор ресурсов"
            index-route-name="indexResourceSet"
            index-label="Наборы ресурсов"
            :resource="resource"
            form="resource-set-form"
    />
</template>

<script>
  export default {
    name: 'ResourceSetNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resource_sets{/id}{/action_name}')
      },
    },
  }
</script>
