<template>
  <div class='container'>
    <div class="app-container">
      <el-card>
        <div class="title">
          说明：目前支持学科和关键字条件筛选
          <el-button type="success" size="small" style="margin-bottom: 20px;" @click="$router.push('/questions/new')">
            <i class="el-icon-edit"></i>
            新增试题
          </el-button>
        </div>
        <QusetionsForm @handleSearch="handleSearch" @handleClear="handleClear"/>
        <el-alert
          type="info"
          :closable="false"
          show-icon>
          数据一共{{ counts }}条
        </el-alert>
        <QusetionsTable :tableData="tableData">
          <template #action="{ row }">
            <el-button size="mini" circle type="primary" plain @click="handlePreview(row.id)">
              <i class="el-icon-view"></i>
            </el-button>
            <el-button size="mini" circle type="success" plain @click="handleEdit(row.id)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size="mini" circle type="danger" plain @click="handleDel(row.id)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button size="mini" circle type="warning" plain @click="handleChoice(1,row.id)">
              <i class="el-icon-check"></i>
            </el-button>
          </template>
        </QusetionsTable>
         <div style="text-align: right;margin-top: 10px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              background
              :page-sizes="[1, 3, 5, 7]"
              :page-size="pagesize"
              layout="prev, pager, next, sizes, jumper"
              :total="+counts">
            </el-pagination>
         </div>
      </el-card>
      <QuestionsPreview :showQuestionsPreview.sync="showQuestionsPreview" :previewData="previewData"  :id="id"/>
    </div>

  </div>
</template>

<script>
import { list as qusetionsList, remove, choiceAdd } from '@/api/hmmm/questions.js'
import QusetionsTable from '@/module-hmmm/components/qusetions-table'
import QusetionsForm from '@/module-hmmm/components/questions-form'
import QuestionsPreview from './questions-preview.vue'
export default {
  name: 'Qusetions',
  components: {
    QusetionsTable,
    QusetionsForm,
    QuestionsPreview
  },
  data () {
    return {
      form: {
        subjectID: '', // 学科
        difficulty: '', // 难度
        questionType: '', // 试题类型
        tags: '', // 标签名称
        province: '', // 企业所在地省份
        city: '', // 企业所在城市
        keyword: '', // 关键字
        kemarks: '', // 题目备注
        shortName: '', // 企业简称
        direction: '', // 方向
        creatorID: '', // 录入人
        catalogID: '' // 目录
      },
      tableData: [],
      counts: '',
      page: 1,
      pagesize: 5,
      showQuestionsPreview: false,
      previewData: {},
      id: 0
    }
  },
  created () {
    this.getQuestionsList()
  },
  methods: {
    async getQuestionsList (form) {
      const { data } = await qusetionsList({
        ...form,
        page: this.page,
        pagesize: this.pagesize
      })
      console.log(data)
      this.counts = data.counts
      this.tableData = data.items || []
    },
    // 设置每页条数
    handleSizeChange (val) {
      this.pagesize = val
      this.page = 1
      this.getQuestionsList({
        page: this.page,
        pagesize: this.pagesize
      })
    },
    // 设置页码
    handleCurrentChange (val) {
      this.page = val
      this.getQuestionsList({
        page: this.page,
        pagesize: this.pagesize
      })
    },
    handleSearch (form) {
      this.getQuestionsList(form)
    },
    handleClear () {
      this.getQuestionsList()
    },
    // 删除
    handleDel (id) {
      this.$confirm('此操作将永久删除该试题?', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await remove({ id })
        console.log(res)
        this.$message.success('删除成功')
        this.getQuestionsList()
      })
    },
    // 预览
    handlePreview (id) {
      this.showQuestionsPreview = true
      this.id = id
    },
    // 编辑
    handleEdit (id) {
      this.$router.push({
        name: 'questions-new',
        params: {
          id
        }
      })
    },
    // 加入精选
    handleChoice (choiceState, id) {
      this.$confirm('此操作将该试题加入精选，是否继续?', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await choiceAdd({
          id,
          choiceState
        })
        console.log(res)
        this.getQuestionsList()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.title{
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #ffc0cb;
}
.el-form {
  display: flex;
  flex-wrap: wrap;

    .el-input {
      width: 222px;
    }
}
.el-alert{
  ::v-deep .el-alert__icon.is-big {
  font-size: 18px;
  width: 18px;
  }
}
</style>
