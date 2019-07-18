<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="Аудитория" name="first">
            <el-row type="flex" :gutter="18">
                <el-col>
                    <el-form-item label="Название" prop="name" :rules="rules.name">
                        <el-input v-model="model.name"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Название, EN" prop="name_en" :rules="rules.name_en">
                        <el-input v-model="model.name_en"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" :gutter="18">
                <el-col>
                    <el-form-item label="Расположение" prop="location_id" :rules="rules.location_id">
                        <Enumeration v-model="model.location_id" code="location"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Адрес" prop="address" :rules="rules.address">
                        <el-input v-model="model.address"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Владелец" prop="holder" :rules="rules.holder">
                        <el-input v-model="model.holder"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-row type="flex" :gutter="18">
                    <el-col>
                        <el-switch v-model="model.exist_lan" active-text="LAN"/>
                    </el-col>
                    <el-col>
                        <el-switch v-model="model.exist_lcd" active-text="LCD"/>
                    </el-col>
                    <el-col>
                        <el-switch v-model="model.exist_tvvcr" active-text="TV, VCR"/>
                    </el-col>
                    <el-col>
                        <el-switch v-model="model.exist_printer_lan" active-text="LAN Printer"/>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="Дополнительное оборудования" prop="additional_equipment">
                <el-input v-model="model.additional_equipment"/>
            </el-form-item>
            <el-row type="flex" :gutter="18">
                <el-col>
                    <el-form-item label="Тип" prop="room_type_id" :rules="rules.room_type_id">
                        <Enumeration v-model="model.room_type_id" code="room_type"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Вместимость" prop="capacity" :rules="rules.capacity">
                        <el-input v-model="model.capacity"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Затраты" prop="cost">
                        <el-input v-model="model.cost"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="Цена" prop="price" :rules="rules.price">
                        <el-input v-model="model.price"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="Примечание" prop="note">
                <el-input type="textarea" v-model="model.note"/>
            </el-form-item>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
  export default {
    name: 'RoomForm',
    props: {
      model: {
        required: false,
        type: Object,
        default: {},
      },
    },
    data () {
      return {
        activeName: 'first',
        rules: {
          name: {
            required: true, message: 'не может быть пустым',
          },
          name_en: {
            required: true, message: 'не может быть пустым',
          },
          address: {
            required: true, message: 'не может быть пустым',
          },
          location_id: {
            required: true, message: 'не может быть пустым',
          },
          holder: {
            required: true, message: 'не может быть пустым',
          },
          capacity: {
            required: true, message: 'не может быть пустым',
          },
          price: {
            required: true, message: 'не может быть пустым',
          },
          room_type_id: {
            required: true, message: 'не может быть пустым',
          },
        }
      }
    },
    created () {
      this.retrieveTab()
    },
    watch: {
      activeName: 'storeTab'
    },
    computed: {
      idForm () {
        return `${this.$options.name}|${this.$route.path}|${this.$parent.name}`
      },
    },
    methods: {
      storeTab (tab) {
        localStorage.setItem(this.idForm, tab)
      },
      retrieveTab () {
        this.activeName = localStorage.getItem(this.idForm) || 'first'
      }
    }
  }
</script>
