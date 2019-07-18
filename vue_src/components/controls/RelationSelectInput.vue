<template>
  <span>
    <template v-if="value > 0">
      <a
        :href="`#/${(model && model.link) ? model.link : ''}`"
        @click.prevent="previewResource"
        v-if="!loading"
      >{{label}}</a>
      <a v-else>Загрузка...</a>
      <el-tooltip class="item" effect="light" content="Поиск" placement="right" v-if="!readonly">
        <el-button
          type="text"         
          size="mini"
          @click="searchResource"
          :loading="loading"
        >
          <font-awesome-icon icon="search"/>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        content="Удалить"
        placement="right"
        v-if="!loading && !readonly"
      >
        <el-button type="text" size="mini" @click="removeResource">
          <font-awesome-icon icon="times"/>
        </el-button>
      </el-tooltip>
    </template>
    <template v-else>
      <template v-if="readonly">Не указан</template>
      <a href="#" @click.prevent="searchResource" v-else>{{label}}</a>
    </template>
    <el-dialog
      :visible.sync="previewDialogVisible"
      width="90%"
      append-to-body
      custom-class="el-dialog--relation-input"
    >
      <el-row type="flex" class="el-dialog__title-container">
        <el-col :span="18">
          <h1 class="el-dialog__title">{{label}}</h1>
        </el-col>
        <el-col align="right" :span="6">
          <div>
            <print :model="model" :resource="resource"/>
            <history :model="model"/>
          </div>
        </el-col>
      </el-row>
      <base-form :model="model" :actions="primaryActions">
        <template slot-scope="scope">
          <div class="el-spacer el-spacer--line"/>
          <component
            :is="form"
            :model="scope.model"
            :original-model="originalModel"
            v-if="scope.model"
          />
        </template>
      </base-form>
    </el-dialog>
    <search-dialog
      ref="searchDialog"
      :resource="resource"
      :grid="grid"
      :form="form"
      :createable="createable"
      :create-btn-label="createLabel"
      @select="handleSelect"
      :query="query"
      :multiselect="false"
    />
  </span>
</template>

<script>
export default {
  name: "RelationSelectInput",
  props: {
    resource: {
      required: true,
      type: [Object, String]
    },
    value: {
      required: true
    },
    initModel: {
      required: false,
      type: Object
    },
    grid: {
      required: true,
      type: String
    },
    form: {
      required: true,
      type: String
    },
    valueLabel: {
      required: false,
      type: [String, Function],
      default: "label"
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    },
    preview: {
      required: false,
      type: Boolean,
      default: false
    },
    createable: {
      required: false,
      type: Boolean,
      default: false
    },
    createLabel: {
      required: false,
      type: String
    },
    titleLabel: {
      required: false,
      type: String,
      default: "Новый"
    },
    params: {
      required: false,
      type: Object,
      default() {
        return {};
      }
    },
    query: {
      required: false,
      type: [Object, Function]
    }
  },
  data() {
    return {
      label: "Выбрать",
      model: null,
      originalModel: null,
      loading: false,
      previewDialogVisible: false,
      preloaded: false
    };
  },
  watch: {
    model: "assignModel",
    query: "assignQuery"
  },
  computed: {
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    },
    resolvedQuery() {
      if (typeof this.query === "function") return this.query();

      return this.query;
    },
    primaryActions() {
      if (this.preview) {
        return [
          {
            label: "Закрыть",
            command: this.close
          }
        ];
      }

      return [
        {
          label: "Сохранить",
          command: this.save,
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
          label: "Закрыть",
          command: this.close
        }
      ];
    }
  },
  mounted() {
    if (this.initModel) {
      this.model = this.initModel;
    } else if (this.value > 0) {
      this.fetch();
    }
    this.$watch("value", function(value) {
      this.model = null;

      if (!value) return;

      this.loading = true;
      this.resolvedResource.get({ id: value }).then(response => {
        this.model = response.data;

        this.$emit("change", this.model);

        this.loading = false;
      });
    });
    this.label = this.readonly ? "Не указан" : "Выбрать";
  },
  methods: {
    fetch() {
      this.loading = true;

      return this.resolvedResource.get({ id: this.value }).then(response => {
        this.originalModel = JSON.parse(JSON.stringify(response.data));
        this.model = response.data;
        this.loading = false;
      });
    },
    searchResource() {
      this.$refs.searchDialog.open();
    },
    removeResource() {
      this.$emit("input", null);
    },
    previewResource() {
      if (!this.preloaded) {
        this.preloaded = true;
        this.fetch().then(_ => (this.previewDialogVisible = true));
      } else {
        this.previewDialogVisible = true;
      }
    },
    handleSelect(ids) {
      this.$emit("input", ids[0]);
    },
    assignModel(model) {
      this.updateLabel(model);

      this.$emit("change-model", model);
    },
    updateLabel(model) {
      if (!this.value) {
        this.label = this.readonly ? "Не установлен" : "Выбрать";
      } else if (model && typeof this.valueLabel === "function") {
        this.label = this.valueLabel(model);
      } else if (model && typeof this.valueLabel === "string") {
        this.label = model[this.valueLabel];
      }
      if (this.label === "" || this.label === null) {
        this.label = "ВНИМАНИЕ! Необходимо заполнить данные.";
      }
    },
    save() {
      return this.resolvedResource
        .update({ id: this.model.id }, this.model)
        .then(response => {
          this.assignModel(response.data);
          this.close();
        })
        .catch(error => {
          this.loading = false;

          throw error;
        });
    },
    apply() {
      return this.resolvedResource
        .update({ id: this.model.id }, this.model)
        .then(response => {
          this.assignModel(response.data);
        })
        .catch(error => {
          this.loading = false;

          throw error;
        });
    },
    close() {
      this.previewDialogVisible = false;
    },
    assignQuery(query) {
      this.currentQuery = query;
    }
  }
};
</script>
