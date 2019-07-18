<template>
    <base-new-page
            title="Новая пользователь"
            index-route-name="indexUser"
            index-label="Пользователи"
            resource="users{/id}{/action_name}"
            form="user-form"
    />
</template>

<script>
  export default {
    name: 'UserNewPage',
    middleware: 'auth'
  }
</script>
