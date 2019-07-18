<template>
    <base-new-page
            title="Новый участник"
            index-route-name="indexParticipant"
            index-label="Участники"
            :resource="resource"
            form="participant-form"
    />
</template>

<script>
  export default {
    name: 'ParticipantNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('participants{/id}{/action_name}')
      },
    },
  }
</script>
