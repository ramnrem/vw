<template>
    <base-index-page
            title="Опросы"
            index-route-name="indexEvaluation"
            new-route-name="newEvaluation"
            edit-route-name="editEvaluation"
            new-label="Добавить опрос"
            resource="evaluations{/id}{/action_name}"
            grid="evaluation-grid"
    />
</template>

<script>
  export default {
    name: 'EvaluationIndexPage',
    middleware: 'auth'
  }
</script>
