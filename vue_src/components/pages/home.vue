<template>
    <el-row>
        <el-col>
            <el-card class="el-card--bx">
                <div slot="header">
                    <el-row type="flex" justify="space-between">
                        <span class="el-card__title">Рабочий стол</span>
                    </el-row>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    middleware: 'auth',
    metaInfo: {
      title: 'Рабочий стол'
    },
  }
</script>