<template>
    <base-new-page
            title="Новый курс"
            index-route-name="indexCourse"
            index-label="Курсы"
            resource="courses{/id}{/action_name}"
            form="course-form"
    />
</template>

<script>
  export default {
    name: 'CourseNewPage',
    middleware: 'auth'
  }
</script>
