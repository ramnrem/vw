<template>
  <base-page :title="title" :menu="menu || defaultMenu" :breadcrumbs="breadcrumbs">
    <template slot="filter">
      <base-filter
        :grid="grid"
        :config="config"
        :term="params.term"
        :query="params.query"
        @change-term="changedTerm"
        @apply-filter="applyedFilter"
        @change-display-filter-query="changedDisplayFilterQuery"
        ref="filter"
      />
    </template>
    <template slot="action">
      <el-row type="flex" justify="end" align="middle">
        <el-checkbox
          v-model="params.show_deleted"
          style="margin-right: 10px"
        >Показать удаленные документы</el-checkbox>
        <el-button size="small" plain type="info" @click="refresh" :loading="loading">
          <font-awesome-icon icon="sync" v-if="!loading" />
        </el-button>
        <el-button
          size="small"          
          style="margin-right: 10px"
          plain
          type="info"
          :loading="exportToExcelLoading"
          @click="exportToExcel"
        >
        <font-awesome-icon icon="download"/>
        </el-button>
        <grid-columns :id="id" :grid="grid" :config="config" @change="changedSetting"/>
      </el-row>
    </template>
    <template slot="content">
      <div v-if="readableFilterValue" class="grid-filter">
        Текущий фильтр: {{readableFilterValue}} &nbsp;
        <el-button
          size="mini"
          type="text"          
          title="Сбросить фильтр"
          @click="$refs.filter.clear()"
        >
          <font-awesome-icon icon="times"/>
        </el-button>
      </div>

      <div v-if="data">
        <el-pagination
          v-if="data.meta"
          background
          layout="total, prev, pager, next, slot"
          :page-size="data.meta.pagination.per_page"
          :page-sizes="[5,10,20,50,100,1000000]"
          :total="data.meta.pagination.total"
          :current-page="data.meta.pagination.current_page"
          @size-change="changedPageSize"
          @current-change="changedPageNumber"
          class="el-pagination--top"
        >
          <div class="el-pagination__sizes">
            <el-select v-model="params.page.size" size="mini">
              <el-option v-for="size in pageSizes" :key="size.lable" :value="size.value.toString()" :label="size.label" />
            </el-select>
          </div>
        </el-pagination>
        <el-table
          stripe
          :data="data.items"
          @row-dblclick="rowDblClick"
          @sort-change="changedSort"
          v-loading="loading"
          element-loading-text="Загрузка..."
          :row-style="rowStyle"
          :cell-style="rowStyle"
        >
          <el-table-column
            fixed="left"
            width="60"
            v-if="currentContextMenu && currentContextMenu.length > 0"
          >
            <template slot-scope="scope">
              <el-menu :collapse="true" class="el-menu--table">
                <el-submenu index="1" class="el-submenu--table">
                  <template slot="title">
                    <font-awesome-icon icon="bars"/>
                  </template>
                  <template v-for="item in currentContextMenu">
                    <el-menu-item
                      :key="item.label"
                      :index="item.label"
                      @click.native.prevent="item.command(scope.row)"
                      class="el-menu-item--table"
                      v-if="!(item.hidden && item.hidden(scope.row))"
                    >{{item.label}}</el-menu-item>
                  </template>
                </el-submenu>
              </el-menu>
            </template>
          </el-table-column>
          <template v-for="column in data.meta.config.columns">
            <base-column :column="column" :grid="data.meta.grid" :key="column.name"/>
          </template>
        </el-table>
        <el-pagination
           v-if="data.meta"
          background
          layout="total, prev, pager, next, slot"
          :page-size="data.meta.pagination.per_page"
          :page-sizes="[5,10,20,50,100,1000000]"
          :total="data.meta.pagination.total"
          :current-page="data.meta.pagination.current_page"
          @size-change="changedPageSize"
          @current-change="changedPageNumber"
        >
          <div class="el-pagination__sizes">
            <el-select v-model="params.page.size" size="mini">
              <el-option v-for="size in pageSizes" :key="size.lable" :value="size.value.toString()" :label="size.label" />
            </el-select>
          </div>
        </el-pagination>
        <div class="el-table-footer"></div>
      </div>
      <div v-else>
        <el-container
          style="min-height: 300px;"
          v-loading="loading"
          element-loading-text="Загрузка"
        ></el-container>
      </div>
    </template>
  </base-page>
</template>

<script>
export default {
  name: "BaseIndexPage",
  props: {
    title: {
      required: true,
      type: String
    },
    newLabel: {
      required: false,
      type: String,
      default: "Добавить"
    },
    indexRouteName: {
      required: true,
      type: String
    },
    newRouteName: {
      required: true,
      type: String
    },
    editRouteName: {
      required: true,
      type: String
    },
    resource: {
      required: true,
      type: [Object, String]
    },
    contextMenu: {
      required: false,
      type: Array,
      default() {
        return this.defaultContextMenu;
      }
    },
    menu: {
      required: false,
      type: Object,
      default: null
    },
    rowStyle: {
      required: false,
      type: Function
    }
  },
  data() {
    return {
      params: {
        page: { number: 1, size: 20 },
        term: null,
        query: {},
        show_deleted: false
      },
      pageSizes: [        
        { value: 5, label: 5},
        { value: 10, label: 10},
        { value: 20, label: 20},
        { value: 50, label: 50},
        { value: 100, label: 100},
        { value: 1000000, label: 'Все'},
      ],
      readableFilterValue: null,
      loading: false,
      data: null,
      grid: {},
      config: {},
      currentContextMenu: [],
      exportToExcelLoading: false
    };
  },
  created() {
    this.currentContextMenu = this.contextMenu || this.defaultContextMenu;
    this.initParams();
    this.refresh();
    this.$watch("params", this.changedParams, { deep: true });
  },
  computed: {
    id() {
      let tag = this.$options.parent.$vnode.tag.split("-");

      return "grid-" + tag[tag.length - 1];
    },
    defaultMenu() {
      return {
        label: this.newLabel,
        command: { name: this.newRouteName }
      };
    },
    breadcrumbs() {
      return [{ label: this.title, command: { name: this.indexRouteName } }];
    },
    defaultContextMenu() {
      return [
        { label: "Редактировать", command: this.edit, primary: true },
        {
          label: "Восстановить",
          command: this.remove,
          hidden: this.hideRestoreMenuItem
        },
        {
          label: "Удалить",
          command: this.remove,
          hidden: this.hideRemoveMenuItem
        }
      ];
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    },
    routeQuery() {
      return this.$route.query;
    }
  },
  methods: {
    initParams() {
      this.params = Object.assign(
        {},
        {
          term: this.$route.query.term,
          sort: this.$route.query.sort,
          query: this.$route.query.query
            ? JSON.parse(this.$route.query.query)
            : {},
          show_deleted: this.$route.query.show_deleted
            ? this.$route.query.show_deleted.toString() == "true"
            : false,
          page: {
            number: this.$route.query.page_number || 1,
            size: this.$route.query.page_size || 20
          }
        }
      );
    },
    saveParams() {
      this.$router.replace({
        name: this.$route.name,
        query: {
          page_number: this.params.page.number,
          page_size: this.params.page.size,
          sort: this.params.sort,
          query: JSON.stringify(this.params.query),
          term: this.params.term,
          show_deleted: this.params.show_deleted
        }
      });
    },
    refresh() {
      this.loading = true;
      this.resolvedResource
        .query(this.params)
        .then(response => {
          this.data = response.data;
          this.grid = this.data.meta.grid;
          this.config = Object.assign({}, this.config, this.data.meta.config);

          this.$emit("fetch", this.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    changedParams() {
      this.saveParams();
      this.refresh();
    },
    changedPageSize(pageSize) {
      this.params.page.size = pageSize;
    },
    changedPageNumber(pageNumber) {
      this.params.page.number = pageNumber;
    },
    changedSort({ prop, order }) {
      this.params.sort = prop ? (order === "descending" ? "-" : "") + prop : "";
    },
    changedTerm(term) {
      this.params.term = term;
    },
    applyedFilter(query) {
      this.params.query = Object.assign({}, query);
    },
    changedDisplayFilterQuery(value) {
      this.readableFilterValue = value;
    },
    changedSetting(config) {
      this.$resource("user_grid_settings{/id}")
        .update({ id: this.id }, { value: config })
        .then(() => this.refresh());
    },
    rowDblClick(row) {
      this.currentContextMenu.forEach(action => {
        if (action.primary) {
          action.command(row);
        }
      });
    },
    exportToExcel() {
      this.exportToExcelLoading = true;
      this.resolvedResource
        .get({ format: "excel", ...this.params })
        .then(response => {
          this.exportToExcelLoading = false;
          window.open(response.data.link, "_blank");
        })
        .catch(error => {
          this.exportToExcelLoading = true;

          return error;
        });
    },
    edit(context) {
      this.$router.push({
        name: this.editRouteName,
        params: { id: context.id },
        query: {
          redirect: this.$route.fullPath
        }
      });
    },
    remove(context) {
      this.resolvedResource
        .remove({ id: context.id })
        .then(() => {
          this.refresh();
        })
        .catch(response => {
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
    },
    hideRemoveMenuItem(context) {
      if (!context.aasm_state) return true;

      return context.aasm_state.id === "deleted";
    },
    hideRestoreMenuItem(context) {
      if (!context.aasm_state) return true;

      return context.aasm_state.id !== "deleted";
    }
  }
};
</script>
