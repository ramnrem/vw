<template>
    <div class="qb-group" :class="classObject">
        <el-row type="flex" :gutter="15" class="qb-group__type">
            <el-col>
                <el-radio-group v-model="query.logical" :size="size">
                    <el-radio-button v-for="(label, key) in logicals" :label="key" :key="key">{{label}}</el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col style="text-align: right">
                <el-button v-if="this.depth < this.maxDepth" @click="addGroup" :size="size" icon="el-icon-plus"
                           type="primary"/>
                <el-button type="danger" v-if="this.depth > 1" @click="remove" icon="el-icon-close" :size="size"/>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="15">
            <el-col>
                <el-select v-model="selectedRule" :size="size" style="width: 100%" filterable>
                    <template v-for="rule in rules">
                        <el-option :key="rule.id" :value="rule.id"
                                   :label="rule.label"
                                   v-if="rule.type != 'group'"
                        />
                        <el-option-group :key="rule.id" :value="rule.id" :label="rule.label" v-else>
                            <el-option v-for="group_rule in rule.rules"
                                       :key="group_rule.id"
                                       :value="group_rule.id"
                                       :label="group_rule.label"/>
                        </el-option-group>
                    </template>
                </el-select>
            </el-col>
            <el-col>
                <el-button @click="addRule" :size="size" type="primary" icon="el-icon-plus" v-if="selectedRule"/>
            </el-col>
        </el-row>
        <div class="qb-children">
            <component
                    v-for="(child, index) in query.children"
                    :key="index"
                    :is="child.type"
                    :type="child.type"
                    :query.sync="child.query"
                    :rules="rules"
                    :rule="ruleById(rules, child.query.rule)"
                    :index="index"
                    :maxDepth="maxDepth"
                    :depth="depth + 1"
                    :size="size"
                    :logicals = "logicals"
                    v-on:child-deletion-requested="removeChild">
            </component>
        </div>
    </div>
</template>

<script>
  import QueryBuilderRule from './QueryBuilderRule.vue'
  import deepClone from '../utilities.js'

  export default {
    name: 'query-builder-group',

    components: {
      QueryBuilderRule,
    },

    props: ['type', 'query', 'rules', 'size', 'index', 'maxDepth', 'depth', 'labels', 'logicals'],

    methods: {
      ruleById (rules, ruleId) {
        for (let i = 0; i < rules.length; i++) {
          const value = rules[i]
          if (value.type === 'group') {
            let rule = this.ruleById(value.rules, ruleId)

            if (rule) return rule
          } else {
            if (value.id === ruleId) return value
          }
        }
      },
      addRule () {
        let updated_query = deepClone(this.query)
        let rule = this.ruleById(this.rules, this.selectedRule)
        let operator = rule.operators[0]

        let child = {
          type: 'query-builder-rule',
          query: {
            rule: this.selectedRule,
            operator: operator ? operator.id: null,
            value: null,
          },
        }

        updated_query.children.push(child)

        this.$emit('update:query', updated_query)
      },

      addGroup () {
        let updated_query = deepClone(this.query)
        if (this.depth < this.maxDepth) {
          updated_query.children.push({
            type: 'query-builder-group',
            query: {
              logical: 'AND',
              children: [],
            },
          })
          this.$emit('update:query', updated_query)
        }
      },

      remove () {
        this.$emit('child-deletion-requested', this.index)
      },

      removeChild (index) {
        let updated_query = deepClone(this.query)
        updated_query.children.splice(index, 1)
        this.$emit('update:query', updated_query)
      },
    },

    data () {
      return {
        selectedRule: null,
      }
    },
    computed: {
      classObject () {
        return 'qb-group_depth-' + this.depth.toString()
      },
    },
  }
</script>
