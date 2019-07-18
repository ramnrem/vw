<template>
  <base-new-page
    title="Новая роль"
    index-route-name="indexRole"
    index-label="Роли"
    :resource="resource"
    form="role-form"
    :model="model"
  />
</template>

<script>
export default {
  name: "RoleNewPage",
  middleware: "auth",
  data() {
    return {
      model: { access_rules_attributes: [] }
    };
  },
  computed: {
    resource() {
      return this.$resource("roles{/id}{/action_name}");
    }
  },
  created() {
    this.$resource("roles/new")
      .get()
      .then(response => {
        this.model = Object.assign({}, this.model, response.data);
      });
  }
};
</script>
