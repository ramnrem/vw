<template>
  <div>
    <el-button v-if="!btnHidden" :type="btnType" @click="open" :loading="loading">{{btnLabel}}</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :title="title"
      v-loading="loading"
      append-to-body
    >
      <base-form :model="model" :actions="actions">
        <template slot-scope="scope">
          <component :is="form" :model="scope.model"/>
        </template>
      </base-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CreateDialog",
  props: {
    btnType: {
      required: false,
      type: String,
      default: "primary"
    },
    btnHidden: {
      required: false,
      type: Boolean,
      default: false
    },
    resource: {
      required: true,
      type: [Object, String]
    },
    btnLabel: {
      required: true
    },
    title: {
      required: true
    },
    form: {
      required: true,
      type: String
    },
    params: {
      required: false,
      type: Object,
      default() {
        return {};
      }
    }
  },
  inject: {
    elForm: {
      default: ""
    },
    elFormItem: {
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      model: {}
    };
  },
  computed: {
    actions() {
      return [
        { label: "Сохранить", command: this.create, validate: true, type: "primary" },
        { label: "Закрыть", command: this.close }
      ];
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    }
  },
  methods: {
    open() {      
      this.dialogVisible = true;
      this.loading = true;
      this.resolvedResource
        .get({ action_name: "new", ...this.$route.query, ...this.params })
        .then(response => {
          this.model = response.data;

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close() {
      this.dialogVisible = false;
    },
    create() {
      return this.resolvedResource.save({}, this.model).then(response => {
        this.$emit("create", response.data.id);
        this.close();
      });
    }
  }
};
</script>
