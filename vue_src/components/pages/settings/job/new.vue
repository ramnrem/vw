<template>
  <base-new-page
    title="Новая задача"
    index-route-name="indexJob"
    index-label="Задачи"
    resource="jobs{/id}{/action_name}"
    form="job-form"
  />
</template>

<script>
export default {
  name: "JobNewPage",
  middleware: "auth"
};
</script>
