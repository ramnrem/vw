<template>
    <base-edit-page
            :title="title"
            index-route-name="indexOwnFirm"
            index-label="Организации"
            :resource="resource"
            form="own-firm-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="room"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'OwnFirmEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('own_firms{/id}{/action_name}')
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
