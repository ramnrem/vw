<template>
    <base-new-page
            title="Новая услуга"
            index-route-name="indexService"
            index-label="Услуги"
            :resource="resource"
            form="service-form"
    />
</template>

<script>
  export default {
    name: 'ServiceNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('services{/id}{/action_name}')
      },
    },
  }
</script>
