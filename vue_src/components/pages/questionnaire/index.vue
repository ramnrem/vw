<template>
    <base-index-page
            title="Опросники"
            index-route-name="indexQuestionnaire"
            new-route-name="newQuestionnaire"
            edit-route-name="editQuestionnaire"
            new-label="Добавить опросники"
            :resource="resource"
            grid="questionnaire-grid"
    />
</template>

<script>
  export default {
    name: 'ManagerIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('questionnaires{/id}{/action_name}')
      },
    },
  }
</script>
