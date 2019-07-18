<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название" prop="name" :rules="rules.name">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Название, EN" prop="name_en">
          <el-input v-model="model.name_en"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Код" prop="code" :rules="rules.code">
          <el-input v-model="model.code"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Аккаунт" prop="account_id" :rules="rules.account_id">
          <relation-select-input
            v-model="model.account_id"
            :init-model="model.account"
            resource="accounts{/id}{/action_name}"
            grid="account-grid"
            form="account-form"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Адрес" prop="address">
          <el-input v-model="model.address"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Телефон" prop="phone">
          <el-input v-model="model.phone"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Факс" prop="fax">
          <el-input v-model="model.fax"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="По умолчанию" prop="default">
          <el-switch v-model="model.default" active-text="Да"/>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Реквизиты</h3>
    </div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Юридическое Название" prop="legal_name" :rules="rules.legal_name">
          <el-input v-model="model.legal_name"/>
        </el-form-item>
        <el-form-item label="Юридический Адрес" prop="legal_address">
          <el-input v-model="model.legal_address"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Юридическое Название, EN" prop="legal_name_en">
          <el-input v-model="model.legal_name_en"/>
        </el-form-item>
        <el-form-item label="Юридический Адрес, EN" prop="legal_address_en">
          <el-input v-model="model.legal_address_en"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="ИНН" prop="inn">
          <el-input v-model="model.inn"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="КПП" prop="kpp">
          <el-input v-model="model.kpp"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Банк" prop="bank_name">
          <el-input v-model="model.bank_name"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="БИК" prop="bik">
          <el-input v-model="model.bik"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col :span="6">
        <el-form-item label="Расчётный счёт" prop="rs">
          <el-input v-model="model.rs"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Корреспондентский счёт" prop="cs">
          <el-input v-model="model.cs"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="note" label="Комментарии">
      <el-input type="textarea" v-model="model.note"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "CustomerForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        name: {
          required: true,
          message: "не может быть пустым"
        },
        code: {
          required: true,
          message: "не может быть пустым"
        },
        account_id: {
          required: true,
          message: "не может быть пустым"
        },
        legal_name: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  }
};
</script>
