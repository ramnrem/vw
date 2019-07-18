<template>
    <base-index-page
            title="Тренеры"
            index-route-name="indexTrainer"
            new-route-name="newTrainer"
            edit-route-name="editTrainer"
            new-label="Добавить тренера"
            :resource="resource"
            grid="trainer-grid"
    />
</template>

<script>
  export default {
    name: 'TrainerIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('trainers{/id}{/action_name}')
      },
    },
  }
</script>
