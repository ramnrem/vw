<template>
  <div v-if="data">
    <el-pagination
      v-if="data.meta"
      background
      layout="total, prev, pager, next, sizes"
      :page-size="data.meta.pagination.per_page"
      :page-sizes="[5,10,20,50,100]"
      :total="data.meta.pagination.total"
      :current-page="data.meta.pagination.current_page"
      @size-change="handleChangePageSize"
      @current-change="handleChangePageNumber"
      class="el-pagination--top"
    />
    <el-table
      stripe
      :data="data.items"
      @row-dblclick="handleRowDblClick"
      @sort-change="handleChangeSort"
      v-loading="loading"
      element-loading-text="Загрузка..."
      @selection-change="handleChangeSelection"
      :row-style="rowStyle"
      :cell-style="rowStyle"
    >
      <el-table-column fixed="left" type="selection" width="35" v-if="multiselect"/>
      <el-table-column fixed="left" width="60" v-if="contextMenu && contextMenu.length > 0">
        <template slot-scope="scope">
          <el-menu :collapse="true" class="el-menu--table">
            <el-submenu index="1" class="el-submenu--table">
              <template slot="title">
                <font-awesome-icon icon="bars"/>
              </template>
              <template v-for="item in contextMenu">
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
      layout="total, prev, pager, next, sizes"
      :page-size="data.meta.pagination.per_page"
      :page-sizes="[5,10,20,50,100]"
      :total="data.meta.pagination.total"
      :current-page="data.meta.pagination.current_page"
      @size-change="handleChangePageSize"
      @current-change="handleChangePageNumber"
    />
    <div class="el-table-footer"></div>
  </div>
  <div v-else>
    <el-container style="min-height: 300px;" v-loading="loading" element-loading-text="Загрузка"></el-container>
  </div>
</template>

<script>
export default {
  name: "BaseGrid",
  props: {
    contextMenu: {
      required: false,
      type: [Array],
      default: null
    },
    resource: {
      required: true,
      type: [Object, String]
    },
    term: {
      required: false,
      type: String
    },
    filterQuery: {
      required: false,
      type: Object
    },
    remoteSortable: {
      required: false,
      type: Boolean,
      default: true
    },
    filtrable: {
      required: false,
      type: Boolean,
      default: false
    },
    multiselect: {
      required: false,
      type: Boolean,
      default: false
    },
    showDeleted: {
      required: false,
      type: Boolean,
      default: false
    },
    rowStyle: {
      required: false,
      type: Function
    },
    route: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      data: null,
      items: [],
      page: {
        number: null,
        size: null
      },
      sort: "",
      currentTerm: null,
      currentQuery: null,
      grid: {},
      config: {},
      loading: true,
      selectedItems: [],
      defaultPageParams: { number: 1, size: 20 }
    };
  },
  computed: {
    params() {
      return {
        page: this.page,
        sort: this.sort,
        term: this.currentTerm,
        query: this.currentQuery,
        grid_id: this.id
      };
    },
    routeQuery() {
      return this.route ? this.route.query : {};
    },
    setting() {
      return this.data.setting;
    },
    resolvedResource() {
      if (typeof this.resource === "string")
        return this.$resource(this.resource);

      return this.resource;
    }
  },
  created() {
    this.retrieveParams();
  },
  watch: {
    term: "handleChangeTerm",
    filterQuery: "handleChangeQuery",
    sort: {
      handler: function() {
        this.query(this.params);
      }
    },
    showDeleted: "refresh",
    currentTerm: "refresh",
    currentQuery: "refresh",
    page: {
      handler: function() {
        this.query(this.params);
      },
      deep: true
    },
    routeQuery: {
      handler: "retrieveParams",
      deep: true
    },
    resource: "retrieveParams"
  },
  methods: {
    refresh() {
      this.page.number = 1;
      this.query(this.params);
    },
    query(params) {
      this.storeParams(params);
      this.loading = true;
      params.show_deleted = this.showDeleted;
      this.resolvedResource
        .query(params)
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
    handleRowDblClick(row) {
      this.contextMenu.forEach(action => {
        if (action.primary) {
          action.command(row);
        }
      });
    },
    handleChangeSort({ prop, order }) {
      if (!this.remoteSortable) return;

      this.sort = prop ? (order === "descending" ? "-" : "") + prop : "";
    },
    handleChangePageSize(size) {
      this.page.size = size;
    },
    handleChangePageNumber(number) {
      this.page.number = number;
    },
    handleMenuCommand(command) {
      this.$router.push(command);
    },
    storeParams(params) {
      if (this.route) {
        this.$router.replace({
          name: this.route.name,
          query: {
            page_number: this.page.number,
            page_size: this.page.size,
            sort: this.sort
          }
        });
      }
    },
    retrieveParams() {
      if (this.route) {
        this.page.number =
          this.route.query.page_number || this.defaultPageParams.number;
        this.page.size =
          this.route.query.page_size || this.defaultPageParams.size;
        this.sort = this.route.query.sort;
      } else {
        this.page = Object.assign({}, this.page, this.defaultPageParams);
      }
    },
    handleChangeTerm(term) {
      this.currentTerm = term;
    },
    handleChangeQuery(query) {
      this.currentQuery = Object.assign({}, query);
    },
    handleChangeSelection(val) {
      this.selectedItems = val;

      this.$emit("selection-change", val);
    },
    exportToExcel() {
      this.resolvedResource
        .get({ format: "excel", ...this.params })
        .then(response => {
          window.open(response.data.link, "_blank");
        });
    }
  }
};
</script>
