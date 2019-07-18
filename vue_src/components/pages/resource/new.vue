<template>
    <base-new-page
            title="Новый ресурс"
            index-route-name="indexResource"
            index-label="Ресурсы"
            :resource="resource"
            form="resource-form"
    />
</template>

<script>
  export default {
    name: 'ResourceNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('resources{/id}{/action_name}')
      },
    },
  }
</script>
