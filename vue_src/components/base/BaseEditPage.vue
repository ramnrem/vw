<template>
  <base-page :title="title" :breadcrumbs="currentBreadcrumbs" :menu="menu" :model="model" v-if="model">
    <template slot="filter">
      <slot name="filter" :model="model"/>
    </template>
    <template slot="content">
      <el-row v-loading="loading">
        <base-form :model="model" :actions="actions || defaultActions">
          <component :is="form" :model="model" :original-model="originalModel" ref="form"/>
        </base-form>
      </el-row>
    </template>
  </base-page>
</template>

<script>
import {
  diff
} from 'deep-object-diff';


export default {
  name: "BaseEditPage",
  props: {
    form: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    indexLabel: {
      required: false,
      type: String
    },
    indexRouteName: {
      required: false,
      type: String
    },
    resource: {
      required: true,
      type: [Object, String]
    },
    breadcrumbs: {
      required: false,
      type: Array
    },
    menu: {
      required: false,
      type: Object
    },
    back: {
      required: false,
      type: Function,
      default: null
    },
    actions: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      model: null,
      originalModel: null,
      loading: true
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    defaultActions() {
      return [
        {
          label: "Сохранить",
          command: this.update,
          validate: true,
          type: "primary"
        },
        {
          label: "Применить",
          command: this.apply,
          validate: true,
          type: "info"
        },
        {
          label: "Назад",
          command: this.defaultBack
        }
      ];
    },
    currentBreadcrumbs() {
      return this.breadcrumbs
        ? this.breadcrumbs
        : [
            {
              label: this.indexLabel,
              command: {
                name: this.indexRouteName
              }
            },
            {
              label: this.title
            }
          ];
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    }
  },
  watch: {
    id: "fetch",
    model: {
      handler: "observeChanges",
      deep: true
    }
  },
  methods: {
    observeChanges(model) {
      let diffModel = diff(this.originalModel, model)
      this.$store.dispatch(
        "page/setChanged",
        Object.keys(diffModel).length > 0
      );
      this.$store.dispatch("page/setCallback", this.apply);
    },
    fetch() {
      this.loading = true;
      this.resolvedResource
        .get({
          id: this.id
        })
        .then(response => {
          this.assignModel(response.data);

          this.loading = false;
        });
    },
    update() {
      return this.resolvedResource
        .update(
          {
            id: this.id
          },
          this.model
        )
        .then(response => {
          this.assignModel(response.data);
          this.defaultBack();

          return Promise.resolve(response)
        })
        .catch(error => {
          this.loading = false;

          return Promise.reject(error)
        });
    },
    apply() {
      return this.resolvedResource
        .update(
          {
            id: this.id
          },
          this.model
        )
        .then(response => {
          this.assignModel(response.data);
          this.$message.info("Документ обновлен.");
        })
        .catch(error => {
          this.loading = false;

          throw error;
        });
    },
    assignModel(model) {
      this.model = model;

      this.resetChangedState();

      this.$emit("fetch", this.model);
    },
    defaultBack() {
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      } else {
        return this.back || this.$router.back();
      }
    },    
    resetChangedState() {
      this.$store.dispatch("page/setChanged", false);
      this.originalModel = JSON.parse(JSON.stringify(this.model));
    }
  }
};
</script>
