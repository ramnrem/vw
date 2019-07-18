<template>
    <base-index-page
            title="Мои дела"
            index-route-name="indexActivity"
            new-route-name="newActivity"
            edit-route-name="editActivity"
            new-label="Добавить дело"
            :resource="resource"
            grid="account-grid"
            id="activity-index-page"
            :menu="menu"
            ref="grid"
    />
</template>

<script>
  export default {
    name: 'ActivityIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('activities{/id}{/action_name}')
      },
      menu () {
        return {
          label: 'Добавить',
          items: [
            { label: 'Встречу', command: { name: 'newActivity', query: { type: 'meeting' } } },
            { label: 'Входящий звонок', command: { name: 'newActivity', query: { type: 'incoming_call' } } },
            { label: 'Исходящий звонок', command: { name: 'newActivity', query: { type: 'outgoing_call' } } },
          ],
        }
      },
    },
  }
</script>
