<template>
    <base-edit-page
            :title="title"
            index-route-name="indexParticipant"
            index-label="Участники"
            :resource="resource"
            form="participant-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="participant"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ParticipantEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('participants{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.name
      }
    },
  }
</script>
