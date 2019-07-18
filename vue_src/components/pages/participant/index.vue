<template>
    <base-index-page
            title="Участники"
            index-route-name="indexParticipant"
            new-route-name="newParticipant"
            edit-route-name="editParticipant"
            new-label="Добавить участника"
            :resource="resource"
            grid="participant-grid"
    />
</template>

<script>
  export default {
    name: 'ParticipantIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('participants{/id}{/action_name}')
      },
    },
  }
</script>
