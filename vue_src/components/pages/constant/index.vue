<template>
  <base-index-page
    title="Константы"
    index-route-name="indexConstant"
    new-route-name="newConstant"
    edit-route-name="editConstant"
    new-label="Добавить константу"
    resource="constants{/id}{/action_name}"
    grid="constant-grid"
    id="constant-index-page"
  />
</template>

<script>
export default {
  name: "ConstantIndexPage",
  middleware: "auth"
};
</script>
