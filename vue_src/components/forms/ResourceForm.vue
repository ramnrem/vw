<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название" prop="name" :rules="rules.required">
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
      <el-col>
        <el-form-item label="Поставщик" prop="supplier_id">
          <autocomplete v-model="model.supplier_id" resource="suppliers{/id}"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Департамент" prop="department_id">
          <enumeration v-model="model.department_id" code="department" :clearable="true"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Цена" prop="price">
          <el-input v-model="model.price"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Код" prop="code">
          <el-input v-model="model.code"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Вид" prop="kind">
          <select-constant v-model="model.kind" code="resource_kind"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Ед. изм." prop="unit">
          <el-input v-model="model.unit"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item prop="cost_direction" label="Направление затрат">
          <select-constant v-model="model.cost_direction" code="cost_direction"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Описание" prop="note">
      <el-input type="textarea" v-model="model.note"/>
    </el-form-item>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item prop="count_participants" label="Расчитывать на каждого участника">
          <el-switch v-model="model.count_participants" active-text="Да"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item prop="count_days" label="Расчитывать на каждый день">
          <el-switch v-model="model.count_days" active-text="Да"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item prop="business_simulation" label="Бизнес-симуляция">
          <el-switch v-model="model.business_simulation" active-text="Да"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col>
        <el-form-item prop="is_royalty" label="Роялти">
          <el-switch v-model="model.is_royalty" active-text="Да"/>
        </el-form-item>
      </el-col>
       <el-col>
        <el-form-item prop="royalty_unit" label="Ед. изм. роялти">
          <el-select v-model="model.royalty_unit">
            <el-option
              v-for="unit in model.royalty_units"
              :value="unit.symbol"
              :label="unit.label"
              :key="unit.symbol"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item prop="royalty_currency" label="Валюта роялти">
          <el-select v-model="model.royalty_currency">
            <el-option
              v-for="currency in model.currencies"
              :value="currency.symbol"
              :label="currency.symbol"
              :key="currency.symbol"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <grid-input
      title="Роялти"
      :data="model.resource_prices_attributes"
      :commands="priceCommands"
      :command-handler="priceCommandHandler"
    >
      <el-table-column prop="price" label="Цена" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"/>
        </template>
      </el-table-column>

      <el-table-column prop="min_qty" label="Минимум" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.min_qty"/>
        </template>
      </el-table-column>
      <el-table-column prop="max_qty" label="Максимум" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.max_qty"/>
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </grid-input>
  </div>
</template>

<script>
export default {
  name: "ResourceForm",
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
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  computed: {
    priceCommands() {
      return [
        {
          label: "Добавить",
          command: "add",
          disabled: false
        },
        {
          divided: true
        },
        {
          label: "Удалить",
          command: "remove",
          disabled: this.isCommandDisabled
        }
      ];
    }
  },
  methods: {
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    priceCommandHandler(context, command) {
      if (command === "add") {
        let currency = this.model.currencies.find(c => c.default);

        this.model.resource_prices_attributes.push({
          _destroy: false,
          unit: "day",
          currency: currency.symbol,
          period: []
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    }
  }
};
</script>
