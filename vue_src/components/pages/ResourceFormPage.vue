<template>
  <el-card class="el-card--bx" v-loading.body="loading" element-loading-text="Загрузка...">
    <div slot="header">
      <el-row type="flex" justify="space-between">
        <span class="el-card__title">
          <el-badge is-dot :hidden="!changed">{{title}}</el-badge>
          <resource-status-badge :store-namespace="storeNamespace"/>
        </span>
        <template v-if="menu.length > 0">
          <el-dropdown @command="handleMenuCommand">
            <el-button type="primary">
              Действия
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, index) in menu">
                <el-dropdown-item
                  divided
                  :key="item.label + index.toString()"
                  v-if="item.label === '-'"
                />
                <el-dropdown-item
                  :key="item.label + index.toString()"
                  :command="item.command"
                  v-else
                >{{item.label}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-row>
    </div>
    <el-row type="flex" align="middle" class="el-card__breadcrumb">
      <el-col>
        <el-breadcrumb v-if="breadcrumbs.length > 0" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">{{$t('home')}}</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="breadcrumb in breadcrumbs"
            :to="breadcrumb.command"
            :key="breadcrumb.label"
          >{{breadcrumb.label}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <component
      :is="form"
      :id="id"
      :params="params"
      :resource="storeNamespace"
      @save="handleSave"
      @apply="handleApply"
      @close="handleClose"
      ref="form"
    />
  </el-card>
</template>

<script>
export default {
  name: "ResourceFormPage",
  props: {
    storeNamespace: {
      required: true,
      type: String
    }
  },
  metaInfo() {
    return {
      title: this.title
    };
  },
  data() {
    return {
      menu: []
    };
  },
  computed: {
    resourceId() {
      return this.storeNamespace.replace("/", ".") + ".form";
    },
    form() {
      return this.$store.state[this.storeNamespace].name + "Form";
    },
    title() {
      return (
        this.$store.getters["page/title"] || this.t(".title")
      );
    },
    changed() {
      return this.$store.getters[this.storeNamespace + "/changed"];
    },
    loading() {
      return this.$store.getters[this.storeNamespace + "/loading"];
    },
    breadcrumbs() {
      return [
        {
          label: this.$t(this.storeNamespace.replace("/", ".") + ".list.title"),
          command: {
            name: `index${this.$store.state[this.storeNamespace].name}`
          }
        }
      ];
    },
    id() {
      return this.$route.params.id;
    },
    params() {
      return this.$route.query;
    }
  },
  watch: {
    changed: {
      handler: function(value) {
        this.$store.dispatch("page/setCallback", this.$refs.form.apply);
        this.$store.dispatch("page/setChanged", value);
      }
    }
  },
  methods: {
    t(key) {
      return this.$t(this.resourceId + key);
    },
    handleSave() {
      this.handleClose();
    },
    handleApply(payload) {
      this.$router.push({
        name: `edit${this.$store.state[this.storeNamespace].name}`,
        params: { id: payload.id, redirect: this.$route.query.redirect }
      });
    },
    handleClose() {
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      } else {
        this.$router.push({
          name: `index${this.$store.state[this.storeNamespace].name}`
        });
      }
    },
    handleContextMenu(menu) {
      this.menu = menu;
    },
    handleMenuCommand(command) {
      if (typeof command === "function") {
        command();
      } else {
        this.$router.push(command);
      }
    }
  }
};
</script>
