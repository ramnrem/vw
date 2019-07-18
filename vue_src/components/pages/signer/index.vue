<template>
    <base-index-page
            title="Подписанты"
            index-route-name="indexSigner"
            new-route-name="newSigner"
            edit-route-name="editSigner"
            new-label="Добавить подписанта"
            :resource="resource"
    />
</template>

<script>
  export default {
    name: 'SignerIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('signers{/id}{/action_name}')
      },
    },
  }
</script>
