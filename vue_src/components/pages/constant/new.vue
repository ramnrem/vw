<template>
  <base-new-page
    title="Новая константа"
    index-route-name="indexConstant"
    index-label="Константы"
    resource="constants{/id}{/action_name}"
    form="constant-form"
  />
</template>

<script>
export default {
  name: "ConstantNewPage",
  middleware: "auth"
};
</script>
