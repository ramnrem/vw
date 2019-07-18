<template>
    <base-new-page
            title="Новый заказ-счет"
            index-route-name="indexTrainerOrder"
            index-label="Заказ-счета на тренеров"
            :resource="resource"
            form="trainer-order-form"
            :model="model"
    />
</template>

<script>
  export default {
    name: 'TrainerOrderNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('trainer_orders{/id}{/action_name}')
      },
    },
    data () {
      return {
        model: {},
      }
    },
    created () {
      this.resource.get({action_name: 'new', ...this.$route.query}).then(response => {
        this.model = Object.assign({}, this.model,  response.data)
      })
    },
  }
</script>
