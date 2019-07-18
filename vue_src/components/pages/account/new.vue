<template>
    <base-new-page
            title="Новый аккаунт"
            index-route-name="indexAccount"
            index-label="Аккаунты"
            resource="accounts{/id}{/action_name}"
            form="account-form"
    />
</template>

<script>
  export default {
    name: 'AccountNewPage',
    middleware: 'auth'
  }
</script>
