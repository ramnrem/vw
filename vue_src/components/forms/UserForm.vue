<template>
  <div>
    <el-form-item label="ФИО" prop="name">
      <el-input v-model="model.name"/>
    </el-form-item>
    <el-form-item label="E-mail" prop="email">
      <el-input v-model="model.email"/>
    </el-form-item>
    <el-form-item label="Синхронизировать календарь" prop="sync_calendar">
      <el-checkbox v-model="model.sync_calendar"/>
    </el-form-item>
    <el-form-item label="Группы" prop="group_ids" v-if="model.id > 0">
      <el-checkbox-group v-model="group_labels">
        <el-checkbox v-for="group in groups" :key="group.id" :label="group.name"/>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Подписки на уведомления" prop="subscriptions" v-if="model.id > 0">
      <el-checkbox-group v-model="model.subscriptions">
        <el-checkbox
          v-for="subscription in subscriptions"
          :key="subscription.id"
          :label="subscription.id"
        >{{subscription.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "UserForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      groups: [],
      group_labels: [],
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  mounted() {
    this.$resource("groups")
      .query()
      .then(response => {
        this.groups = response.data.items;
        this.model.group_ids.forEach(id => {
          let group = this.groups.find(e => e.id === id);

          if (group) this.group_labels.push(group.name);
        });
      });
  },
  computed: {
    subscriptions(){
      return [
        {
          id: 'cost_price_disbaled',
          label: 'Удален/Отменен кост-прайс'
        }
      ]
    }
  },
  watch: {
    group_labels: "assignGroupIds"
  },
  methods: {
    assignGroupIds() {
      let group_ids = [];
      this.group_labels.forEach(name => {
        group_ids.push(this.groups.find(e => e.name === name).id);
      });

      Object.assign(this.model, {
        group_ids: group_ids
      });
    }
  }
};
</script>
