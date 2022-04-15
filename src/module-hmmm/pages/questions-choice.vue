<template>
  <div class='app-container'>
    <el-card>
      <QusetionsForm @handleSearch="handleSearch"/>
      <el-alert
          type="info"
          :closable="false"
          show-icon>
          数据一共{{ counts }}条
        </el-alert>
      <QusetionsTable :tableData="tableData">
        <template #check>
          <el-table-column
            prop="chkState"
            label="审核状态"
            width="90"
          >
          {{ setChkType }}
          </el-table-column>
          <el-table-column
            prop="chkRemarks"
            label="审核意见"
            width="90"
          >
          </el-table-column>
          <el-table-column
            prop="chkUser"
            label="审核人"
            width="90"
          >
          </el-table-column>
          <el-table-column
            prop="publishState"
            label="发布状态"
            width="90"
          >
          {{ setPublishType }}
          </el-table-column>
        </template>
        <template #action="{ row }">
          <el-button size="small" type="text" @click="handlePreview(row.id)">
            预览
          </el-button>
          <el-button size="small" type="text" @click="handleChk(row.id, $event)" :disabled="row.chkState !== 1">
            审核
          </el-button>
          <el-button size="small" type="text" @click="handleEdit(row.id)">
            修改
          </el-button>
          <el-button size="small" type="text" v-if="row.publishState === 0" @click="handlePublishState(1, row.id)">
            下架
          </el-button>
          <el-button size="small" type="text" v-else @click="handlePublishState(0, row.id)">
            上架
          </el-button>
          <el-button size="small" type="text" :disabled="row.publishState === 0" @click="handleDel(0, row.id)">
            删除
          </el-button>
        </template>
      </QusetionsTable>
    </el-card>
    <QuestionsPreview :id="form.id" :showQuestionsPreview.sync="showQuestionsPreview"/>
    <el-dialog :visible="showChkDialog" title="题目审核" width="400px" @close="handleClose">
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-radio-group v-model="form.chkState">
            <el-radio :label="2">
              通过
            </el-radio>
            <el-radio :label="3">
              拒绝
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" placeholder="请输入审核意见" v-model="form.chkRemarks"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;margin-top:50px">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button  size="small" type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QusetionsForm from '@/module-hmmm/components/questions-form'
import QusetionsTable from '@/module-hmmm/components/qusetions-table'
import { choice, choiceCheck, choicePublish, choiceAdd } from '@/api/hmmm/questions.js'
import { publishType, chkType } from '@/api/hmmm/constants.js'
import QuestionsPreview from './questions-preview.vue'
export default {
  name: 'QuestionsChoice',
  components: {
    QusetionsForm,
    QusetionsTable,
    QuestionsPreview
  },
  data () {
    return {
      tableData: [],
      counts: null,
      form: {
        id: 0,
        chkState: 2,
        chkRemarks: ''
      },
      showQuestionsPreview: false,
      showChkDialog: false,
      isChkPass: false
    }
  },
  computed: {
    setPublishType () {
      let res = ''
      this.tableData.forEach(item => {
        publishType.forEach(pItem => {
          if (item.publishState === pItem.value) {
            res = pItem.label
          }
        })
      })
      return res
    },
    setChkType () {
      let res = ''
      this.tableData.forEach(item => {
        chkType.forEach(pItem => {
          if (item.chkState === pItem.value) {
            res = pItem.label
          }
        })
      })
      return res
    }
  },
  created () {
    this.getChoiceList()
  },
  methods: {
    async getChoiceList (form) {
      if (!form?.subjectID) {
        form = {
          page: 1,
          pagesize: 10
        }
      }
      const { data: { items, counts } } = await choice(form)
      console.log(items)
      this.tableData = items
      this.counts = counts
    },
    handlePreview (id) {
      this.form.id = id
      this.showQuestionsPreview = true
    },
    // 审核
    handleChk (id, e) {
      this.form.id = id
      this.showChkDialog = true
      console.log(e)
    },
    // 关闭dialog所处理的逻辑
    handleClose () {
      this.showChkDialog = false
      this.form.chkState = 2
    },
    // 处理确认提交的逻辑
    async handleSubmit () {
      if (this.form.chkRemarks === '') {
        return this.$message.warning('请输入审核意见')
      }
      const res = await choiceCheck(this.form)
      console.log(res)
      this.$message.success('审核更新成功')
      this.handleClose()
      this.getChoiceList()
    },
    handleSearch (form) {
      this.getChoiceList(form)
    },
    // 修改
    handleEdit (id) {
      this.$router.push({
        name: 'questions-new',
        params: {
          id
        }
      })
    },
    handlePublishState (publishState, id) {
      const str = publishState === 0 ? '下架' : '上架'
      this.$confirm(`此操作将该试题${str}?`, '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await choicePublish({
          id,
          publishState
        })
        console.log(res)
        this.getChoiceList()
      })
    },
    handleDel (choiceState, id) {
      this.$confirm('此操作将从精选中移出该试题，是否继续?', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await choiceAdd({
          id,
          choiceState
        })
        console.log(res)
        this.getChoiceList()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.el-alert{
  ::v-deep .el-alert__icon.is-big {
  font-size: 18px;
  width: 18px;
  }
}
</style>
