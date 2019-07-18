<template>
    <base-edit-page
            :title="title"
            index-route-name="indexCourse"
            index-label="Курсы"
            resource="courses{/id}{/action_name}"
            form="course-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="course"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'CourseEditPage',
    middleware: 'auth',
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.name
      }
    },
  }
</script>
