<template>
    <el-row>
        <el-col>
            <el-card class="el-card--bx">
                <div slot="header">
                    <el-row type="flex" justify="space-between">
                        <span class="el-card__title">Требуется авторизация!</span>
                    </el-row>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    name: 'Login',
    middleware: 'guest',
    metaInfo: {
      title: 'Требуется авторизация!'
    },
  }
</script>