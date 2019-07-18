<template>
    <base-edit-page
            :title="title"
            index-route-name="indexHoliday"
            index-label="Праздничные дни"
            :resource="resource"
            form="holiday-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="holiday"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'HolidayEditPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('calendar/holidays{/id}{/action_name}')
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
