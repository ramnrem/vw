<template>
    <base-edit-page
            :title="title"
            index-route-name="indexSigner"
            index-label="Подписанты"
            :resource="resource"
            form="signer-form"
            @fetch="handleFetch">
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="signer"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'SignerEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('signers{/id}{/action_name}')
      },
    },
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
