<template>
    <base-edit-page
            :title="title"
            index-route-name="indexEvaluation"
            index-label="Опросы"
            resource="evaluations{/id}{/action_name}"
            form="evaluation-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="evaluation" resource="evaluations{/id}{/action_name}"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'EvaluationEditPage',
    middleware: 'auth',
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = `Оценки №${model.id}`
      }
    },
  }
</script>
