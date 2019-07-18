<template>
  <div>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>{{title}}</h3>
      <el-dropdown
        v-if="commands.length > 0"
        @command="handleCommand"
        split-button
        type="primary"
        @click="handleCommand(commands[0].command)"
      >
        {{commands[0].label}}
        <el-dropdown-menu slot="dropdown">
          <template v-for="(command, index) in commands">
            <el-dropdown-item
              :key="index.toString()"
              :command="command.command"
              :divided="command.divided"
              :disabled="resolve(command.disabled, command.command)"
            >{{command.label}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="data"
      @selection-change="handleItemsSelectionChange"
      :row-class-name="tableItemsRowClass"
      :summary-method="summaryMethod"
      :show-summary="showSummary"
      :height="height"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <slot/>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "GridInput",
  props: {
    title: {
      required: false,
      type: String
    },
    data: {
      required: true,
      type: Array
    },
    summaryMethod: {
      required: false,
      type: Function
    },
    showSummary: {
      required: false,
      type: Boolean,
      default: false
    },
    commands: {
      required: true,
      type: Array
    },
    commandHandler: {
      required: true,
      type: Function
    },
    diabledCommand: {
      required: false,
      type: Function
    },
    height: {
      required: false,
      type: Number
    }
  },
  data() {
    return {
      selectedItems: []
    };
  },
  computed: {
    hasSelectedItems() {
      return this.selectedItems.length > 0;
    }
  },
  methods: {
    handleItemsSelectionChange(val) {
      this.selectedItems = val;
    },
    handleCommand(command) {
      this.resolve(this.commandHandler, command);
    },
    tableItemsRowClass({ row, rowIndex }) {
      if (row._destroy) return "hidden";
    },
    resolve(arg, command) {
      if (typeof arg === "function") {
        return arg(this, command);
      } else if (arg) {
        return arg;
      }

      return;
    }
  }
};
</script>
