
<template>
  <div class='app-container'>
    <el-card>
      <el-form :model="form">
        <el-form-item label="关键字" label-width="50%" >
          <el-input  v-model="form.keyword" style="width: 200px" placeholder="根据编号搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleClear">
            清除
          </el-button>
          <el-button type="primary" size="small" @click="handleSearch">
            搜索
          </el-button>
        </el-form-item>
      </el-form>

        <el-alert
          type="info"
          :closable="false"
          show-icon>
          数据一共{{ counts }}条
        </el-alert>
        <el-table
          :data="tableData"
          stripe
          fixed
          >
          <el-table-column
            prop="id"
            label="编号"
           >
          </el-table-column>
          <el-table-column
            prop="questionType"
            label="题型"
           >
           {{ setQuestionType }}
          </el-table-column>
          <el-table-column
            prop="questionIDs"
            label="题目编号"
            style="height: 150px;"
            width="200"
          >
            <template #default="{ row }">
              <span v-for="item in row.questionIDs" :key="item.number" class="questions-ids" @click="handlePreview(item.id)"> {{ item.number}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="录入时间">
          </el-table-column>
          <el-table-column
            prop="totalSeconds"
            label="答题时间(s)">
          </el-table-column>
          <el-table-column
            prop="accuracyRate"
            label="正确率(%)">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="录入人">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
          <template #default="{row }">
            <el-button type="danger" size="small" circle plain @click="handleDel(row.id)">
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
          </el-table-column>
        </el-table>
        <div style="text-align:right; margin-top: 20px">
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[1, 3, 5, 7]"
          :page-size="form.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="counts">
        </el-pagination>
        </div>
    </el-card>
    <QuestionsPreview :showQuestionsPreview.sync="showQuestionsPreview" :id="id"/>
  </div>
</template>

<script>
import { randoms, removeRandoms } from '@/api/hmmm/questions.js'
import QuestionsPreview from './questions-preview.vue'
import { questionType } from '@/api/hmmm/constants.js'
export default {
  name: 'QuestionsRandoms',
  components: {
    QuestionsPreview
  },
  data () {
    return {
      counts: 1,
      tableData: [],
      form: {
        page: 1,
        pagesize: 5,
        keyword: ''
      },
      showQuestionsPreview: false,
      id: 0
    }
  },
  computed: {
    setQuestionType () {
      let str = ''
      this.tableData.forEach(item => {
        questionType.forEach(qItem => {
          if (+item.questionType === qItem.value) {
            str = qItem.label
          }
        })
      })
      return str
    }
  },
  created () {
    this.getRandomsList()
  },
  methods: {
    async getRandomsList () {
      const { data } = await randoms({
        ...this.form
      })
      console.log(data)
      this.tableData = data.items
      this.counts = data.counts
    },
    // 清除表单
    handleClear () {
      this.form.keyword = ''
      this.getRandomsList()
    },
    handleSearch () {
      this.getRandomsList()
    },
    // 删除
    handleDel (id) {
      this.$confirm('此操作将永久删除该题组, 是否继续?', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await removeRandoms({ id })
        console.log(res)
        this.$message.success('删除题组成功')
        this.getRandomsList()
      })
    },
    handlePreview (id) {
      this.id = id
      this.showQuestionsPreview = true
    },
    handleSizeChange (val) {
      this.form.pagesize = val
      this.page = 1
      this.getRandomsList()
    },
    handleCurrentChange (val) {
      this.form.page = val
      this.getRandomsList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-form {
  display: flex;
  justify-content: space-between;
}
.el-alert{
  ::v-deep .el-alert__icon.is-big {
    font-size: 18px;
    width: 18px;
   ::v-deep .el-alert__description{
    }
  }
}
.questions-ids {
  color: #0099ff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
</style>
