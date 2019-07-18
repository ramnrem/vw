<template>
  <base-edit-page
    :title="title"
    index-route-name="indexConstant"
    index-label="Константы"
    resource="constants{/id}{/action_name}"
    form="constant-form"
    @fetch="handlerFetch"
    :model="model"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line :model="scope.model" states="account"/>
    </template>
  </base-edit-page>
</template>

<script>
export default {
  name: "ConstantEditPage",
  middleware: "auth",
  data() {
    return {
      title: "",
      model: {}
    };
  },
  methods: {
    handlerFetch(model) {
      this.title = model.label;
    }
  }
};
</script>