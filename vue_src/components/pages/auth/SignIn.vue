<template>
  <div class="sign-in">
    <div class="container">
      <h1 class="sign-in-title">
        {{ t('header') }}
      </h1>

      <SignInForm />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import SignInForm from './components/SignInForm'

export default {
  name: 'SignInPage',
  middleware: ['guest'],
  layout: 'auth',
  metaInfo () {
    return { title: this.t('title') }
  },
  components: { SignInForm }  
}
</script>

<style lang="scss" scoped>
.sign-in {
  margin: 100px auto;
  padding-top: 32px;
  padding-bottom: 32px;
  max-width: 450px;

  &-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    padding: 0 0 16px;
    text-align: center;
  }
}
</style>
