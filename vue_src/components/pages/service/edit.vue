<template>
    <base-edit-page
            :title="title"
            index-route-name="indexService"
            index-label="Услуги"
            :resource="resource"
            form="service-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="service"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ServiceEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('services{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
