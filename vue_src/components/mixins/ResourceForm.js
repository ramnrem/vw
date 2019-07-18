import {
  diff
} from 'deep-object-diff';

export default ({
  props: {
    id: {
      required: false,
      type: [String, Number]
    },
    resource: {
      required: true,
      type: [Object, String]
    },
    modifier: {
      required: false,
      type: String,
      default: 'default'
    },
    closeHandler: {
      required: false,
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      originalModel: null,
      model: null
    }
  },
  computed: {
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    },
    form() {
      return this.$refs.form;
    }
  },
  watch: {
    params: {
      handler: "fetch",
      deep: true
    },
    id: {
      handler: "fetch"
    },
    model: {
      handler: "observeChanges",
      deep: true
    }
  },
  mounted() {
    this.fetch();
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
      var id = this.id ? this.id : 'new'
      this.loading = true;
      this.resolvedResource
        .get({
          id: id
        })
        .then(response => {
          this.assignModel(response.data);

          this.loading = false;
        }).catch(error => {
          this.loading = false;

          throw error;
        });
    },
    save() {
      this.apply(this.close)
    },
    apply(afterCallback) {
      if (this.id) {
        this.handleCommand(
          this.resolvedResource.update({
            id: this.id
          }, this.model),
          afterCallback
        )
      } else {
        this.handleCommand(this.resolvedResource.save(this.model), (response) => {
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
        })
      }
    },
    close() {
      if (this.closeHandler) {
        this.closeHandler()
      } else {
        this.back();
      }
    },
    handleCommand(action, afterCallback) {
      this.$refs.form.clearValidate();
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          action.then(response => {
            this.assignModel(response.data);
            this.loading = false;
            if (afterCallback) afterCallback(response);
          }).catch(response => {
            if (response.status === 422) {
              this.$message.error({
                dangerouslyUseHTMLString: true,
                message: response.data.full_messages.join("<br/>"),
                duration: 6000
              });
            } else {
              this.$message.error({
                dangerouslyUseHTMLString: true,
                message: response.data.message || response.statusText
              });
            }
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    assignModel(model) {
      this.model = model;

      this.resetChangedState();

      this.$emit("fetch", this.model);
    },
    back() {
      if (this.$route.query.redirect) {
        this.$router.push({
          path: this.$route.query.redirect
        });
      } else {
        return this.$router.back();
      }
    },
    resetChangedState() {
      this.$store.dispatch("page/setChanged", false);

      this.originalModel = JSON.parse(JSON.stringify(this.model));
    }
  }
})
