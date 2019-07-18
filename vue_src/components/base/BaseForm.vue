<template>
  <el-row v-loading="loading">
    <el-form :model="model" ref="form" label-position="top">
      <slot :model="model"/>
    </el-form>
    <el-row class="el-form-actions" v-if="actions.length > 0">
      <el-button
        v-for="action in actions"
        :key="action.label"
        :type="action.type"
        @click="handleCommand(action.command, action.validate)"
        class="el-button--bx"
      >{{action.label}}</el-button>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: "BaseForm",
  props: {
    model: {
      required: true,
      type: Object
    },
    actions: {
      required: false,
      type: Array,
      default: function() {
        return [];
      }
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    currentReadonly() {
      if (this.model && this.model.readonly !== undefined)
        return this.model.readonly;

      return this.readonly;
    }
  },
  methods: {
    handleCommand(command, validate) {
      if (validate) {
        this.handleValidateCommand(command);
      } else {
        command();
      }
    },
    handleValidateCommand(command) {
      this.$refs.form.clearValidate();
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          command()
            .catch(this.handleError)
            .then(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    
    handleError (response) {
      this.loading = false;

      if (Object.keys(response.data.errors).length > 0) {
        const { errors } = response.data

        Object.keys(errors).forEach((key, index) => {
          const field = this.$refs.form.fields.find(field => field.prop === key)
          const errorMessage = errors[key][0]

          if (field) {
            field.validateMessage = errorMessage
            field.validateState = 'error'
          } 

            this.$notify.error({
              title: 'Ошибка',
              message: errorMessage,
              offset: 70 * index
            })
          
        })
      } else {
        this.$notify.error({
          title: 'Ошибка',
          message: response.data.message
        })
      }
    },
  }
};
</script>
