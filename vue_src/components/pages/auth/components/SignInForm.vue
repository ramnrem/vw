<template>
  <el-card>
    <template v-if="errorMessage">
      <el-alert
        :title="errorMessage"
        type="error"
        :closable="false"
      />
      <br>
    </template>
    <el-form
      ref="form"
      :model="credential"
      status-icon
      :rules="rules"
      label-position="top"
    >
      <el-form-item
        :label="t('username')"
        prop="username"
      >
        <el-input
          v-model="credential.username"                    
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item
        :label="t('password')"
        prop="password"
      >
        <el-input
          v-model="credential.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          native-type="submit"
          @click="submitForm"
        >
          {{ t(`submit_${loading}`) }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SignInForm',
  data () {
    return {
      errorMessage: null,
      credential: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('auth', {
      loading: 'loading'
    })
  },
  methods: {
    ...mapActions('auth', {
      signIn: 'signIn'
    }),
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.signIn(this.credential).then((_) => {
            this.$router.push({ name: 'home' })
          }).catch(this.handleError)

          return true
        }

        return false
      })
    },
    handleError (response) {      
      if (Object.keys(response.data.errors).length > 0) {
        const { errors } = response.data

        Object.keys(errors).forEach((key) => {
          const field = this.$refs.form.fields.find(field => field.prop === key)
          const errorMessage = errors[key][0]

          if (field) {
            field.validateMessage = errorMessage
            field.validateState = 'error'
          } else {
            this.$notify.error({
              title: this.t('error'),
              message: errorMessage
            })
          }
        })
      } else {
        this.$notify.error({
          title: this.t('error'),
          message: response.data.message
        })
      }
    }
  }
}
</script>
