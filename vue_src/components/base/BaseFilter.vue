<template>
  <div>
    <el-input
      placeholder="Поиск..."
      suffix-icon="el-icon-search"
      v-model="currentTerm"
      style="width: 100%"
    >
      <template slot="append">
        <el-button @click="openQueryBuilder" :type="buttonType">
          <font-awesome-icon icon="filter"/>
        </el-button>
      </template>
    </el-input>
    <el-dialog
      title="Фильтр"
      :visible="queryBuilderDialogVisible"
      :before-close="closeQueryBuilder"
      width="80%"
      append-to-body
    >
      <query-builder
        ref="queryBuilder"
        :rules="rules"
        :initial-query="currentQuery"
        @query-updated="updatedQuery"        
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeQueryBuilder">Закрыть</el-button>
        <el-button type="primary" @click="apply">Применить</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BaseFilter",
  props: {
    grid: {
      required: true,
      type: Object
    },
    query: {
      required: false,
      type: Object
    },
    term: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      currentTerm: "",
      currentQuery: {},
      queryBuilderDialogVisible: false,
      readableQueryValue: "",
      buttonType: "default",
      timerId: null,
      logicals: {
        AND: "И",
        OR: "ИЛИ"
      }
    };
  },
  watch: {
    currentTerm: "changedTerm",
    grid: "updateState"
  },
  mounted() {
    this.currentTerm = this.term;
    this.initQuery();
  },
  computed: {
    rules() {
      return this.grid.filters;
    }
  },
  methods: {
    initQuery(){
      if (!this.query) return;
      
      this.currentQuery = JSON.parse(JSON.stringify(this.query));
      this.updateState();
    },
    openQueryBuilder() {
      this.queryBuilderDialogVisible = true;
    },
    closeQueryBuilder() {
      this.queryBuilderDialogVisible = false;
    },
    apply() {      
      this.$emit("apply-filter", this.currentQuery);
      this.updateState();
      this.closeQueryBuilder();
    },
    updateState(){
      if (Object.keys(this.currentQuery).length > 0) {
        this.buttonType = "primary";
        this.readableQueryValue = this.buildReadableQueryValue(this.currentQuery);
        this.$emit("change-display-filter-query", this.readableQueryValue);  
      } else {
        this.buttonType = "default";
        this.readableQueryValue = "";
        this.$emit("change-display-filter-query", "");
      }
    },
    changedTerm(term) {
      if (this.timerId) clearTimeout(this.timerId);

      this.timerId = setTimeout(() => { this.$emit("change-term", term);      }, 500); },
    updatedQuery(query) {
      this.currentQuery = query;
    },    
    clear() {            
      this.currentQuery = {};
      this.apply();
    },
    buildReadableQueryValue(query) {
      if (this.rules == undefined) return;

      let values = [];
      if (query.children) {
        query.children.forEach(child => {
          if (child.type === "query-builder-rule") {
            let rule = this.ruleById(this.rules, child.query.rule);
            let operator_rule = rule.operators.find(
              o => o.id === child.query.operator
            );
            let label = rule.label;

            let value = child.query.label || child.query.value;

            let operator = operator_rule
              ? operator_rule.label.toLowerCase()
              : "=";

            values.push("(" + [label, operator, value].join(" ") + ")");
          } else if (child.type === "query-builder-group") {
            values.push(`(${this.buildReadableQueryValue(child.query)})`);
          }
        });
      }

      return values.join(` ${this.logicals[query.logical]} `);
    },
    ruleById(rules, ruleId) {
      for (let i = 0; i < rules.length; i++) {
        const value = rules[i];
        if (value.type === "group") {
          let rule = this.ruleById(value.rules, ruleId);

          if (rule) return rule;
        } else {
          if (value.id === ruleId) return value;
        }
      }
    }
  }
};
</script>
