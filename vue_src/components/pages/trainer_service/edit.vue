<template>
  <base-edit-page
    :title="title"
    index-route-name="indexTrainerService"
    index-label="Услуги тренера"
    :resource="resource"
    form="trainer-service-form"
    @fetch="handlerFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="trainer_service"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "TrainerServiceEditPage",
  middleware: "auth",
  computed: {
    resource() {
      return this.$resource("trainer_services{/id}{/action_name}");
    }
  },
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handlerFetch(model) {
      this.title = model.name;
    }
  }
};
</script>
