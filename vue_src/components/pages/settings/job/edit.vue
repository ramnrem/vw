<template>
  <base-edit-page
    :title="title"
    index-route-name="indexJob"
    index-label="Задачи"
    resource="jobs{/id}{/action_name}"
    form="job-form"
    @fetch="handleFetch"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="job"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "JobEditPage",
  middleware: "auth",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handleFetch(model) {
      this.title = `Задача №${model.id}`;
    }
  }
};
</script>
