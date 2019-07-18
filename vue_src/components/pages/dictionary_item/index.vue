<template>
    <base-index-page
            :title="title"
            index-route-name="indexDictionaryItem"
            new-route-name="newDictionaryItem"
            edit-route-name="editDictionaryItem"
            new-label="Добавить"
            :resource="resource"
    />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DictionaryItemIndexPage',
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
