<template>
  <div class="vue-query-builder">
    <query-builder-group
      :index="0"
      :query.sync="query"
      :rules="rules"
      :maxDepth="maxDepth"
      :depth="depth"
      :size="size"
      :logicals="logicals"
      type="query-builder-group"
    ></query-builder-group>
  </div>
</template>

<script>
import QueryBuilderGroup from "./components/QueryBuilderGroup.vue";
import deepClone from "./utilities.js";

export default {
  name: "QueryBuilder",
  components: {
    QueryBuilderGroup
  },

  props: {
    size: {
      type: String,
      default: "large"
    },
    rules: Array,
    maxDepth: {
      type: Number,
      default: 4,
      validator: function(value) {
        return value >= 1;
      }
    },
    initialQuery: Object
  },

  data() {
    return {
      depth: 1,
      logicals: {
        AND: "И",
        OR: "ИЛИ"
      },
      query: {
        logical: "AND",
        children: []
      }
    };
  },
  mounted() {
    this.$emit("query-updated", deepClone(this.query));

    this.$watch(
      "query",
      function(newQuery) {
        this.$emit("query-updated", deepClone(newQuery));
      },
      {
        deep: true
      }
    );

    this.initQuery();
  },
  methods: {
    initQuery() {
      if (
        typeof this.$options.propsData.initialQuery !== "undefined" &&
        Object.keys(this.$options.propsData.initialQuery).length > 0
      ) {
        this.query = deepClone(this.$options.propsData.initialQuery);
      }
    },
    displayValue(query) {
      if (this.rules == undefined) return;
      let values = [];

      query.children.forEach(child => {
        if (child.type === "query-builder-rule") {
          let rule = this.ruleById(this.rules, child.query.rule);
          let operator_rule = rule.operators.find(
            o => o.id === child.query.operator
          );
          let label = rule.label;

          let value = child.query.label || child.query.value;

          console.log(child.query);

          let operator = operator_rule
            ? operator_rule.label.toLowerCase()
            : "=";

          values.push("(" + [label, operator, value].join(" ") + ")");
        } else if (child.type === "query-builder-group") {
          values.push(`(${this.displayValue(child.query)})`);
        }
      });

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
