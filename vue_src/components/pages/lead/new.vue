<template>
    <base-new-page
            title="Новый лид"
            index-route-name="indexLead"
            index-label="Лиды"
            :resource="resource"
            form="lead-form"
    />
</template>

<script>
  export default {
    name: 'LeadNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('leads{/id}{/action_name}')
      },
    },
  }
</script>
