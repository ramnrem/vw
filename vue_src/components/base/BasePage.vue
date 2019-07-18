<template>
  <el-card class="el-card--bx" shadow="never">
    <div slot="header">
      <el-row type="flex" justify="space-between">
        <span class="el-card__title">
          <el-badge is-dot :hidden="!changed">{{title}}</el-badge>
        </span>
        <div class="l-input-search">
          <slot name="filter"/>
        </div>
        <template v-if="menu">
          <template v-if="Array.isArray(menu)">
            <el-button v-for="(item, index) in menu" :key="index" :class="item.class" @click="handleMenuCommand(item.command)">              
              <font-awesome-icon :icon="item.icon" v-if="item.icon"/>
              {{item.label}}
            </el-button>
          </template>
          <template v-else-if="menu.label">
          <el-button
            type="primary"
            @click="handleMenuCommand(menu.command)"
            v-if="!menu.items"
          >{{menu.label}}</el-button>
          <el-dropdown v-if="menu.items" @command="handleMenuCommand">
            <el-button type="primary">
              {{menu.label}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, index) in menu.items">
                <el-dropdown-item
                  divided
                  :key="item.label + index.toString()"
                  v-if="item.label === '-'"
                />
                <el-dropdown-item
                  :key="item.label + index.toString()"
                  :command="item.command"
                  v-else-if="!menuCommandHidden(item)"
                >{{item.label}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
            </template>
        </template>
      </el-row>
    </div>
    <el-row type="flex" align="middle" class="el-card__breadcrumb">
      <el-col>
        <el-breadcrumb v-if="breadcrumbs.length > 0" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">Старт</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="breadcrumb in breadcrumbs"
            :to="breadcrumb.command"
            :key="breadcrumb.label"
          >{{breadcrumb.label}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col align="right" :span="4">
        <slot name="action"/>
      </el-col>
    </el-row>
    <slot name="content"/>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BasePage",
  props: {
    title: {
      required: true,
      type: String
    },
    subTitle: {
      required: false,
      type: String,
      default: null
    },
    menu: {
      required: false,
      type: [Object, Array],
      default: null
    },
    breadcrumbs: {
      required: false,
      type: Array,
      default: function() {
        return [];
      }
    },
    model: {
      required: false,
      type: Object,
      default: null
    },
  },
  metaInfo() {
    return {
      title: this.title
    };
  },
  computed: {
    ...mapGetters({
      changed: "page/changed"
    })
  },
  methods: {
    handleMenuCommand(command) {
      if (typeof command === "function") {
        command();
      } else {
        this.$router.push(command);
      }
    },
    menuCommandHidden(item) {      
      if (typeof item.hidden === "function") {
        return item.hidden(this.model);
      }

      return item.hidden;
    }
  }
};
</script>
