<template>
    <base-index-page
            title="Услуги"
            index-route-name="indexService"
            new-route-name="newService"
            edit-route-name="editService"
            new-label="Добавить услугу"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'ServiceIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('services{/id}{/action_name}')
      },
    },
  }
</script>
