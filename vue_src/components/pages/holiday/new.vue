<template>
    <base-new-page
            title="Новый день"
            index-route-name="indexHoliday"
            index-label="Праздничные дни"
            :resource="resource"
            form="holiday-form"
    />
</template>

<script>
  export default {
    name: 'HolidayNewPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('calendar/holidays{/id}{/action_name}')
      },
    },
  }
</script>
