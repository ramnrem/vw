<template>
    <base-edit-page
            :title="title"
            index-route-name="indexQuestionnaire"
            index-label="Опросники"
            :resource="resource"
            form="questionnaire-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="questionnaire"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'QuestionnaireEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('questionnaires{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.caption
      }
    },
  }
</script>
