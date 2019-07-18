<template>
    <base-index-page
            title="Курсы"
            index-route-name="indexCourse"
            new-route-name="newCourse"
            edit-route-name="editCourse"
            new-label="Добавить курс"
            resource="courses{/id}{/action_name}"
            grid="course-grid"
    />
</template>

<script>
  export default {
    name: 'CourseIndexPage',
    middleware: 'auth'
  }
</script>
