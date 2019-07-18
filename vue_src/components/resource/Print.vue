<template>
  <el-dropdown
    v-if="display"
    split-button
    type="primary"
    @command="handleCommand"
    @click="handleCommand(model.print_forms[0].id)"
  >
    <i class="el-icon-loading" v-if="loading"/>    
    <font-awesome-icon icon="print" v-if="!loading"/>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="print_form in model.print_forms"
        :command="print_form.id"
        :key="print_form.id.toString()"
      >{{print_form.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Print",
  props: {
    model: {
      required: true,
      type: Object
    },
    resource: {
      type: [String, Object]
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    display() {
      return (
        this.resource &&
        this.model.print_forms &&
        this.model.print_forms.length > 0
      );
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    }
  },
  methods: {
    handleCommand(id) {
      this.loading = true;
      this.resolvedResource
        .get({
          id: this.model.id,
          format: "excel",
          print_form_id: id,
          ...this.params
        })
        .then(response => {
          this.loading = false;
          window.open(response.data.link, "_blank");
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>
