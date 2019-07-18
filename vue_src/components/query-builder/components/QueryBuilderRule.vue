<template>
    <el-row type="flex" :gutter="15" class="qb-rule" align="middle">
        <el-col :span="4">{{rule.label}}</el-col>
        <el-col :span="20">
            <el-row type="flex" justify="space-between" align="middle">
                <div style="margin-right: 15px; width: 150px;">
                    <el-select v-if="rule.operators && rule.operators.length > 0 && rule.values.length === 0" v-model="query.operator"
                               :size="size"
                               style="width: 100%">
                        <el-option v-for="operator in rule.operators"
                                   :value="operator.id"
                                   :key="operator.id"
                                   :label="operator.label"
                        />
                    </el-select>
                </div>
                <div v-if="rule.values.length > 0" style="margin-right: 15px; width: 100%;">
                    <el-select v-model="query.value" :size="size" style="width: 100%" @change="handleSelectChangeLabel">
                        <el-option v-for="value in rule.values"
                                   :key="value.id"
                                   :value="value.id"
                                   :label="value.value"

                        />
                    </el-select>
                </div>
                <template v-else>
                    <div v-if="['numeric'].indexOf(rule.type) !== -1"
                         style="margin-right: 15px; width: 100%;">
                        <el-input type="text" v-model="query.value"
                                  placeholder="Укажите значение" :size="size"
                                  style="width: 100%">
                        </el-input>
                    </div>
                    <div v-if="['decimal'].indexOf(rule.type) !== -1"
                         style="margin-right: 15px; width: 100%;">
                        <el-input type="text" v-model="query.value"
                                  placeholder="Укажите значение" :size="size"
                                  style="width: 100%">
                        </el-input>
                    </div>
                    <div v-if="['text'].indexOf(rule.type) !== -1"
                         style="margin-right: 15px; width: 100%;">
                        <el-input type="text" v-model="query.value" placeholder="Укажите значение" :size="size"
                                  style="width: 100%">
                        </el-input>
                    </div>
                    <div v-if="['date'].indexOf(rule.type) !== -1" style="margin-right: 15px; width: 100%;">
                        <el-date-picker :picker-options="{firstDayOfWeek:1}"  v-model="query.value"
                                        placeholder="Укажите значение"
                                        format="dd.MM.yyyy"
                                        value-format="yyyy-MM-dd"
                                        :size="size"/>
                    </div>
                    <div v-if="['boolean'].indexOf(rule.type) !== -1" style="margin-right: 15px; width: 100%;">
                        <el-switch v-model="query.value" :size="size" active-text="Да" inactive-text="Нет"/>
                    </div>                    
                    <div v-if="['belongs_to'].indexOf(rule.type) !== -1" style="margin-right: 15px; width: 100%;">
                        <autocomplete v-model="query.value"
                                      :resource="rule.resource + '{/id}'"
                                      :value-label="rule.resource_field"

                                      @change-label="handleAutocompleteChangeLabel"
                        />
                    </div>
                </template>
                <el-button @click="remove" :size="size" type="danger" icon="el-icon-close"/>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
  import utils from '../utilities.js'

  export default {
    name: 'query-builder-rule',

    props: ['query', 'index', 'rule', 'labels', 'size', 'operator'],

    beforeMount () {

    },
    methods: {
      remove: function () {
        this.$emit('child-deletion-requested', this.index)
      },
      updateQuery (value) {
        let updated_query = utils.deepClone(this.query)
        updated_query.value = value
        this.$emit('update:query', updated_query)
      },
      handleAutocompleteChangeLabel(label) {
        Object.assign(this.query, { label: label })
      },
      handleSelectChangeLabel(value) {
        Object.assign(this.query, { label: this.rule.values.find(v => v.id === value).value })
      },
    },
  }
</script>
