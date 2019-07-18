<template>
    <base-new-page
            title="Новый опрос"
            index-route-name="indexEvaluation"
            index-label="Опросы"
            resource="evaluations{/id}{/action_name}"
            form="evaluation-form"
    />
</template>

<script>
  export default {
    name: 'EvaluationNewPage',
    middleware: 'auth'
  }
</script>
