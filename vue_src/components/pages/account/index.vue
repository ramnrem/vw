<template>
    <base-index-page
            title="Аккаунты"
            index-route-name="indexAccount"
            new-route-name="newAccount"
            edit-route-name="editAccount"
            new-label="Добавить аккаунт"
            resource="accounts{/id}{/action_name}"
            grid="account-grid"
            id="account-index-page"
    />
</template>

<script>
  export default {
    name: 'AccountIndexPage',
    middleware: 'auth'
  }
</script>
