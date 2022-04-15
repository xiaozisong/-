<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="number"
        label="试题编号"
        width="100"
        fixed
        >
      </el-table-column>
      <el-table-column
        prop="subject"
        label="学科"
        width="70">
      </el-table-column>
      <el-table-column
        prop="catalog"
        label="目录"
        width="70">
      </el-table-column>
      <el-table-column
        prop="questionType"
        label="题型"
        width="70">
        {{ setQuestionType }}
      </el-table-column>
       <el-table-column
        prop="question"
        label="题干"
        >
        {{ setQestion | html2Text}}
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间"
        width="100"
        >
        {{ setAddDate | parseTimeByString }}
      </el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度"
        width="70"
        >
        {{ setDifficulty }}
      </el-table-column>
      <el-table-column
        prop="creator"
        label="录入人"
        width="70"
        >
      </el-table-column>
        <slot name="check"/>
      <el-table-column
        label="操作"
        fixed="right"
      >
      <template #default="{ row }">
        <slot name="action" :row="row" />
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { questionType as qt, difficultyList } from '@/constant'
import { parseTimeByString, html2Text } from '@/filters'
export default {
  name: 'QusetionsTable',
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  filters: {
    parseTimeByString,
    html2Text
  },
  computed: {
    // 设置题型
    setQuestionType () {
      let res = ''
      this.tableData.forEach(item => {
        qt.forEach(qItem => {
          if (item.questionType === qItem.id) {
            res = qItem.value
          }
        })
      })
      return res
    },
    // 设置题干
    setQestion () {
      let str = ''
      this.tableData.forEach(item => {
        str = item.question
      })
      return str
    },
    // 设置录入时间
    setAddDate () {
      let str = ''
      this.tableData.forEach(item => {
        str = item.addDate
      })
      return str
    },
    // 设置难度
    setDifficulty () {
      let str = ''
      this.tableData.forEach(item => {
        difficultyList.forEach(dItem => {
          if (item.difficulty === dItem.id) {
            str = dItem.value
          }
        })
      })
      return str
    }
  }
}
</script>

<style>

</style>
