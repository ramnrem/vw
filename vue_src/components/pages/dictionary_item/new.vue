<template>
    <base-new-page
            title="Новое значение"
            index-route-name="indexDictionaryItem"
            :index-label="title"
            :resource="resource"
            form="dictionary-item-form"
    />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DictionaryItemNewPage',
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
      title () {
        return this.list[this.type].name
      },
    },
  }
</script>
