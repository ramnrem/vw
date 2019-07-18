<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    :multiple="multiple"
    clearable
    placeholder="Поиск..."
    :remote-method="search"
    :loading="loading"
    @change="handleChange"
    style="width: 100%;"
  >
    <el-option v-for="item in items" :key="item.id" :label="resolveLabel(item)" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "Autocomplete",
  props: {
    value: {
      required: true
    },
    resource: {
      type: [Object, String],
      required: true
    },
    valueLabel: {
      required: false,
      type: [String, Function],
      default: "name"
    },
    multiple: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      currentValue: [],
      items: []
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    }
  },
  mounted() {
    this.currentValue = this.value;

    if (this.value) {
      if (Array.isArray(this.value)) {        
        this.value.forEach(id => this.loadItem(id));
      } else {
        this.loadItem(this.value);
      }
    }
  },
  methods: {
    search(query) {
      if (query !== "") {
        this.loading = true;
        this.resolvedResource
          .query({ term: query })
          .then(response => {
            this.items = response.data.items;

            this.loading = false;
          })
          .catch(error => {
            this.loading = false;

            throw error;
          });
      } else {
        this.items = [];
      }
    },
    handleChange(value) {
      let item = this.items.find(i => i.id === value);

      this.$emit("input", value);
      this.$emit("change", value);

      if (item) this.$emit("change-label", this.resolveLabel(item));
    },
    resolveLabel(value) {
      if (typeof this.valueLabel === "function") {
        return this.valueLabel(value);
      } else if (typeof this.valueLabel === "string") {
        return value[this.valueLabel];
      }
    },
    loadItem(id) {      
      this.resolvedResource
        .get({ id: id })
        .then(response => this.items.push(response.data));
    }
  }
};
</script>
