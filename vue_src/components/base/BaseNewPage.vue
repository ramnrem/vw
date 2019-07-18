<template>
  <base-page :title="title" :breadcrumbs="breadcrumbs" v-if="model">
    <template slot="content">
      <base-form :model="model" :actions="resolvedActions">
        <template slot-scope="scope">
          <comment :is="form" :model="scope.model"/>
        </template>
      </base-form>
    </template>
  </base-page>
</template>

<script>
import { diff } from "deep-object-diff";

export default {
  name: "BaseNewPage",
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
      type: Array,
      default() {
        return [
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
      }
    },
    back: {
      required: false,
      type: Function
    },
    actions: {
      required: false,
      type: Array
    }
  },
  data() {
    return {
      model: null,
      originalModel: null
    };
  },
  watch: {
    params: {
      handler: "fetch",
      deep: true
    }
  },
  mounted() {
    this.fetch();
  },
  computed: {
    params() {
      return this.$route.params;
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    },
    resolvedActions() {
      return (
        this.actions || [
          {
            label: "Сохранить",
            command: this.create,
            validate: true,
            type: "primary"
          },
          {
            label: "Сохранить и открыть",
            command: this.apply,
            validate: true,
            type: "info"
          },
          {
            label: "Назад",
            command: this.defaultBack
          }
        ]
      );
    }
  },
  methods: {
    fetch() {
      this.resolvedResource
        .get({
          action_name: "new",
          ...this.$route.query
        })
        .then(response => {
          this.model = response.data;

          this.$emit("fetch", this.model);

          return this.model;
        })
        .then(model => {
          this.originalModel = JSON.parse(JSON.stringify(model));

          this.$watch("model", this.observeChanges, {
            deep: true
          });
        });
    },
    observeChanges(model) {
      let diffModel = diff(this.originalModel, model);
      this.$store.dispatch(
        "page/setChanged",
        Object.keys(diffModel).length > 0
      );
      this.$store.dispatch("page/setCallback", this.apply);
    },
    create() {
      return this.resolvedResource.save({}, this.model).then(response => {
        this.$store.dispatch("page/setChanged", false);

        this.defaultBack();
      });
    },
    apply() {
      return this.resolvedResource.save({}, this.model).then(response => {
        this.$store.dispatch("page/setChanged", false);

        this.$router.replace({
          name: `edit${response.data.class}`,
          params: {
            id: response.data.id
          },
          query: {
            redirect: this.$route.query.redirect
          }
        });

        this.$message.info("Документ создан.");
      });
    },
    defaultBack() {
      if (this.$route.query.redirect) {
        this.$router.push({
          path: this.$route.query.redirect
        });
      } else {
        if (typeof this.back === "Function") return this.back();

        return this.$router.back();
      }
    }
  }
};
</script>
