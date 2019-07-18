<template>
    <base-edit-page
            :title="title"
            index-route-name="indexDictionaryItem"
            :index-label="indexTitle"
            :resource="resource"
            form="dictionary-item-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="room"/>
        </template>
    </base-edit-page>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DictionaryItemEditPage',
    middleware: 'auth',
    computed: {
      type () {
        return this.$route.params.type
      },
      resource () {
        return this.$resource('dictionaries{/type}/items{/id}{/action_name}', { type: this.type })
      },
      ...mapGetters({
        list: 'dictionary/list',
      }),
      indexTitle () {
        return this.list[this.type].name
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.value
      }
    },
  }
</script>
