<template>
  <div>
    
    <table class="el-table el-table--info">
      <tbody>
        <tr class="el-table__row">
          <td style="width: 200px;" class="el-table__cell el-table__cell--label">
            Счет:
          </td>
          <td class="el-table__cell el-table__cell--field">
            <el-form-item prop="invoice_id" class="el-form-item--no-label">
              <relation-select-input
                v-model="model.invoice_id"
                resource="invoices{/id}"
                form="invoice-form"
                grid="invoice-grid"
                :readonly="true"
                :preview="true"
              />
            </el-form-item>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Позиция:</td>
          <td class="el-table__cell el-table__cell--field">{{model.number}}</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Услуга:</td>
          <td class="el-table__cell el-table__cell--field">{{model.name}}</td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Сумма с НДС:</td>
          <td class="el-table__cell el-table__cell--field">{{$formatter.formatCurrency(model.sum_with_vat)}}</td>
        </tr>        
      </tbody>
    </table>
    
  </div>
</template>

<script>
export default {
  name: "InvoiceItemForm",
  props: {
    model: {
      required: true,
      type: Object
    }
  }
};
</script>