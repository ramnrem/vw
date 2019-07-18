<template>
    <el-card class="el-card--bx">
        <div slot="header">
            <el-row type="flex" justify="space-between">
                <span class="el-card__title">{{currentTitle}}</span>
            </el-row>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 18px 18px">
            <el-breadcrumb-item :to="{ path: '/' }">Старт</el-breadcrumb-item>
            <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :to="breadcrumb.path" :key="breadcrumb.label">
                {{breadcrumb.label}}
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-table :data="items" v-loading="loading" @row-dblclick="openDictionary">
            <el-table-column fixed="left" width="60">
                <template slot-scope="scope">
                    <el-menu :collapse="true" class="el-menu--table">
                        <el-submenu index="1" class="el-submenu--table">
                            <template slot="title">                                
                                <font-awesome-icon icon="bars"/>
                            </template>
                            <el-menu-item index="1-1" @click.native.prevent="openDictionary(scope.row)"
                                          class="el-menu-item--table">
                                Открыть
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </template>
            </el-table-column>
            <el-table-column sortable prop="id" label="Код" width="150"/>
            <el-table-column sortable prop="name" label="Название"/>
        </el-table>
        <div class="el-table-footer"></div>

    </el-card>
</template>

<script>
  export default {
    name: 'DictionaryPage',
    metaInfo () {
      return {
        title: this.currentTitle,
      }
    },
    data () {
      return {
        title: 'Справочники',
        subTitle: 'EnumerationCard',
        items: [],
        currentTitle: null,
        breadcrumbs: [],
        loading: false
      }
    },
    created () {
      this.loading = true
      this.currentTitle = this.subTitle ? `${this.title} (${this.subTitle})` : this.title
      this.breadcrumbs = [{ label: this.title, path: this.resourcesRoute }]
      this.$resource('dictionaries').query().then((response) => {
        this.items = Object.values(response.data)
        this.loading = false
      }).catch((error) => {
        console.log(error)

        this.loading = false
        this.$message.error(error.response.data.message || error.message)
      })
    },
    methods: {
      openDictionary (row) {
        this.$router.push({ name: 'indexDictionaryItem', params: { type: row.id } })
      },
    },
  }
</script>
