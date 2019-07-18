<template>
    <base-new-page
            title="Новый опросник"
            index-route-name="indexQuestionnaire"
            index-label="Опросники"
            :resource="resource"
            form="questionnaire-form"
            :model="model"
    />
</template>

<script>
  export default {
    name: 'QuestionnaireNewPage',
    middleware: 'auth',
    data () {
      return {
        model: {
          items_attributes: []
        },
      }
    },
    computed: {
      resource () {
        return this.$resource('questionnaires{/id}{/action_name}')
      },
    },
  }
</script>
