<template>
    <div>
        <el-form-item label="Название" prop="name" :rules="rules.required">
            <el-input v-model="model.name"/>
        </el-form-item>

        <el-form-item label="Роли" prop="role_ids">
            <el-checkbox-group v-model="role_labels">
                <el-checkbox v-for="role in roles"
                             :key="role.id"
                             :label="role.name"/>
            </el-checkbox-group>
        </el-form-item>
    </div>
</template>

<script>
  export default {
    name: 'GroupForm',
    props: {
      model: {
        required: false,
        type: Object,
        default: {},
      },
    },
    created () {
      this.$resource('roles').query().then(response => {
        this.roles = response.data.items
        this.model.role_ids.forEach(id => {
          this.role_labels.push(this.roles.find(e => e.id === id).name)
        })
      })
    },
    data () {
      return {
        roles: [],
        role_labels: [],
        rules: {
          required: {
            required: true, message: 'не может быть пустым',
          },
        },
      }
    },
    watch: {
      role_labels: 'assignRoleIds',
    },
    methods: {
      assignRoleIds () {
        let role_ids = []
        this.role_labels.forEach(name => {
          role_ids.push(this.roles.find(e => e.name === name).id)
        })

        Object.assign(this.model,  { role_ids: role_ids })
      },
    },
  }
</script>
