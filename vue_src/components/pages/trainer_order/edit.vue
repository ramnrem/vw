<template>
  <base-edit-page
    :title="title"
    index-route-name="indexTrainerOrder"
    index-label="Заказ-счета на тренеров"
    resource="trainer_orders{/id}{/action_name}"
    form="trainer-order-form"
    @fetch="handleFetch"    
    ref="page"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line
        :model="scope.model"
        states="trainer_order"
        resource="trainer_orders{/id}{/action_name}"
      />
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "TrainerOrderEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = `№ ${model.id}`;
    }
  }
};
</script>
