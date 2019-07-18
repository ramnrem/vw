<template>
    <base-index-page
            title="Заказ-счета на тренеров"
            index-route-name="indexTrainerOrder"
            new-route-name="newTrainerOrder"
            edit-route-name="editTrainerOrder"
            new-label="Добавить заказ-счет"
            :resource="resource"
            grid="trainer-order-grid"
            id="trainer-order-index-page"
    />
</template>

<script>
  export default {
    name: 'TrainerOrderIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('trainer_orders{/id}{/action_name}')
      },
    },
  }
</script>
