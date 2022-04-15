<template>
  <div class='container'>
    <el-dialog
    title="收货地址"
    :visible="showQuestionsPreview"
    @close="closeQuestionsPreview"
    @open="getQuestionsPreview"
    width="900px"
    >
    <div v-loading="loading">
      <el-row >
        <el-col :span="6"><div class="grid-content bg-purple">【题型】:{{questionTypeText}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【编号】:{{previewData.id}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【难度】:{{difficultyText}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【标签】:{{previewData.tags}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【学科】:{{previewData.subjectName}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【目录】:{{previewData.directoryName}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">【方向】:{{previewData.direction}}</div></el-col>
      </el-row>
      <hr>
      【题干】：
      <div style="color:blue">
        <p v-html="previewData.question"></p>

        <!-- <p>{{}}</p> -->
      </div>
      <div style="margin-bottom: 20px">
        <span style="margin-right: 20px">单选题 选项:</span><span>(以下选中的选项为正确答案)</span>
      </div>
        <el-radio-group v-model="radioCheck" fill="#409EFF" disabled>
          <el-radio v-for="item in previewData.options"  :key="item.id" :label="item.code">
            {{ item.title }}
          </el-radio>
        </el-radio-group>
       <hr>
      【参考答案】：
      <video style="display:none" ref="video" width="320" height="240" controls>
        <source :src="previewData.videoURL" type="video/mp4">
      </video>
      <el-button type="danger" @click="handleVideo">视频答案预览</el-button>
      <hr>
      【答案解析】：
      <div style="display:inline-block">
        <p v-html="previewData.answer"></p>
      </div>
      <hr>
      【题目备注】：
      <div style="display:inline-block">
        <p>{{previewData.remarks}}</p>
      </div>
      <div class="el-message-box__btns">
        <el-button size="small" type="primary" @click="closeQuestionsPreview">关闭</el-button>
      </div>
       </div>
    </el-dialog>

  </div>
</template>

<script>
import { detail } from '../../api/hmmm/questions'
import { questionType, difficulty } from '@/api/hmmm/constants.js'
export default {
  props: {
    showQuestionsPreview: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      previewData: {},
      radioCheck: '',
      questionTypeText: '',
      difficultyText: '',
      loading: false
    }
  },
  methods: {
    // 向父组件申请关闭预览组件
    closeQuestionsPreview () {
      this.$emit('update:showQuestionsPreview', false)
      this.previewData = {}
    },
    async getQuestionsPreview () {
      this.loading = true
      const id = this.id
      const res = await detail({ id })
      this.previewData = res.data
      console.log(this.previewData)
      const result = this.previewData.options.find(item => item.isRight)
      this.radioCheck = result?.code
      this.setQuestionType()
      this.setDifficulty()
      this.loading = false
    },
    handleVideo () {
      this.$refs.video.style.display = 'block'
    },
    // 设置题型
    setQuestionType () {
      const res = questionType.find(item => item.value === +this.previewData.questionType)
      this.questionTypeText = res?.label
    },
    // 设置难度
    setDifficulty () {
      const res = difficulty.find(item => item.value === +this.previewData.difficulty)
      this.difficultyText = res?.label
    }
  }
}
</script>

<style scoped lang='scss'>
.el-col.el-col-6 {
  height: 36px;
}
.el-radio-group {
  display: flex;
  flex-direction: column;
  .el-radio{
    margin-bottom: 20px;
  }
}
</style>
