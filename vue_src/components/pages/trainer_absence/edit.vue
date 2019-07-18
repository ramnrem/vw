<template>
  <base-edit-page
    :title="title"
    index-route-name="indexTrainerAbsence"
    index-label="График отсутствий тренера"
    :resource="resource"
    form="trainer-absence-form"
    @fetch="handlerFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="trainer_absence"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "TrainerAbsenceEditPage",
  middleware: "auth",
  computed: {
    resource() {
      return this.$resource("calendar/trainer_absences{/id}{/action_name}");
    }
  },
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handlerFetch(model) {
      this.title = model.label;
    }
  }
};
</script>
