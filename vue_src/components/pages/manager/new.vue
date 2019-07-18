<template>
    <base-new-page
            title="Новый менеджер"
            index-route-name="indexManager"
            index-label="Менеджеры"
            :resource="resource"
            form="manager-form"
            :model="model"
    />
</template>

<script>
  export default {
    name: 'ManagerNewPage',
    middleware: 'auth',
    data () {
      return {
        model: {
          kpis_attributes: [],
          assistants_attributes: [],
          manager_tariffs_attributes: [],
        },
      }
    },
    computed: {
      resource () {
        return this.$resource('managers{/id}{/action_name}')
      },
    },
  }
</script>
