<template>
    <base-new-page
            title="Новый подписант"
            index-route-name="indexSigner"
            index-label="Подписанты"
            :resource="resource"
            form="signer-form"
    />
</template>

<script>
  export default {
    name: 'SignerNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('signers{/id}{/action_name}')
      },
    },
  }
</script>
