<template>
    <base-edit-page
            :title="title"
            index-route-name="indexRoom"
            index-label="Аудитории"
            :resource="resource"
            form="room-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="room"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'RoomEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('rooms{/id}{/action_name}')
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
