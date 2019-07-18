<template>
    <base-new-page
            title="Новый тренер"
            index-route-name="indexTrainer"
            index-label="Тренеры"
            :resource="resource"
            form="trainer-form"
    />
</template>

<script>
  export default {
    name: 'TrainerNewPage',
    middleware: 'auth',
    data () {
      return {
        model: { prices_attributes: [] },
      }
    },
    computed: {
      resource () {
        return this.$resource('trainers{/id}{/action_name}')
      },
    },
  }
</script>
