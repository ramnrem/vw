<template>
    <base-index-page
            title="Праздничные дни"
            index-route-name="indexHoliday"
            new-route-name="newHoliday"
            edit-route-name="editHoliday"
            new-label="Добавить день"
            :resource="resource"
            grid="holiday-grid"
    />
</template>

<script>
  export default {
    name: 'HolidayIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('calendar/holidays{/id}{/action_name}')
      },
    },
  }
</script>
