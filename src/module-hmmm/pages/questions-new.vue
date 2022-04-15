<template>
  <div class='app-container'>
   <el-card>
      <div class="title">
      <span>
        试题录入
      </span>
    </div>
    <div class="line">
    </div>
    <el-form :model="form" label-position="right" label-width="120px" :rules="rules" ref="form">
      <el-form-item label="学科:" prop="subjectID">
        <el-select v-model="form.subjectID" @click.native="getSujectList">
          <el-option v-for="item in subjectList" :key="item.value" :value="item.value" :label="item.label" @click.native="getDirectoryAndTagsList(item.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="目录:" prop="catalogID">
        <el-select v-model="form.catalogID">
          <el-option v-for="item in directoryList" :key="item.id" :value="item.id" :label="item.directoryName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="企业:" prop="enterpriseID">
        <el-select v-model="form.enterpriseID">
          <el-option v-for="item in companyList" :key="item.id" :value="item.id" :label="item.company"/>
        </el-select>
      </el-form-item>
      <!-- 城市 -->
      <el-form-item label="城市:" prop="province">
        <el-select style="width: 150px" v-model="form.province">
          <el-option v-for="item in provinceList" :key="item" :value="item" :label="item" @click.native="getCity(item)"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="city">
        <el-select style="width: 150px" v-model="form.city">
          <el-option v-for="item in citysList" :key="item" :value="item" :label="item"/>
        </el-select>
      </el-form-item>
      <!-- 方向 -->
      <el-form-item label="方向:" prop="direction">
        <el-select v-model="form.direction">
          <el-option v-for="item in directionList" :key="item" :value="item" :label="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="题型:" prop="questionType">
        <el-radio-group v-model="form.questionType">
          <el-radio label="1">单选</el-radio>
          <el-radio label="2">多选</el-radio>
          <el-radio label="3">简答</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="难度:" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <el-radio label="1">简单</el-radio>
          <el-radio label="2">一般</el-radio>
          <el-radio label="3">困难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题干:" prop="question">
        <quill-editor
          class="ql-editor"
          v-model="form.question"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
          >
        </quill-editor>
      </el-form-item>
      <el-form-item label="选项:" prop="options" class="radioItem"  v-if="form.questionType === '1'">
        <!-- 单选 -->
        <el-radio-group v-model="options" class="radio" >
          <el-radio v-for="item in radioOptionsList" :key="item.code" :value="item.isRight" @change="handleRadio(item.code, $event)" :label="item.code"> {{ item.code }}: <el-input v-model="item.title" ></el-input></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项:" prop="options" class="checkboxItem" v-if="form.questionType === '2'">
         <!-- 多选 -->
        <el-checkbox-group v-model="checkboxOptions" class="checkbox" >
          <el-checkbox v-for="item in checkboxOptionsList" :key="item.code" @change="handleCheckBox(item.code,$event)" :label="item"> {{item.code }}: <el-input v-model="item.title"></el-input></el-checkbox>
        </el-checkbox-group>
           <el-button type="danger" class="addOptionsAndAnswer" @click="handleAddOptions">添加选项与答案</el-button>

      </el-form-item>
      <el-form-item label="解析视频:" prop="videoURL">
        <el-input style="width: 300px" v-model="form.videoURL"></el-input>
      </el-form-item>
      <el-form-item label="答案解析:" prop="answer">
        <quill-editor
          class="ql-editor"
          v-model="form.answer"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
          @change="onEditorChange($event)">
        </quill-editor>
      </el-form-item>
      <el-form-item label="题目备注:" prop="remarks">
        <el-input type="textarea" style="width: 400px;" rows="4" v-model="form.remarks" />
      </el-form-item>
      <el-form-item label="试题标签:" prop="tags">
        <el-select v-model="form.tags">
          <el-option v-for="item in tagsList" :key="item.id" :value="item.id" :label="item.tagName"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSubmit">
      确认提交
    </el-button>
   </el-card>
  </div>
</template>

<script>
import { simple as sujectList } from '@/api/hmmm/subjects.js'
import { quillEditor } from 'vue-quill-editor'
import { list as directorysList } from '@/api/hmmm/directorys.js'
import { list as tagsList } from '@/api/hmmm/tags.js'
import { list as companyList } from '@/api/hmmm/companys.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { directionList } from '@/constant'
import { add, detail, update } from '@/api/hmmm/questions.js'

// 工具栏配置项
const toolbarOptions = [
  // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['bold', 'italic', 'underline', 'strike'],
  // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ list: 'ordered' }, { list: 'bullet' }],
  // 引用  代码块-----['blockquote', 'code-block']
  ['blockquote', 'code-block'],
  // 链接、图片、视频-----['link', 'image', 'video']
  ['image', 'link']
]
export default {
  name: 'questions-new',
  components: {
    quillEditor
  },
  data () {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
        // Some Quill optiosn...
      },
      form: {
        subjectID: '',
        catalogID: '',
        enterpriseID: '',
        province: '',
        city: '',
        direction: '',
        questionType: '1',
        difficulty: '1',
        question: '',
        videoURL: '',
        answer: '',
        remarks: '',
        tags: ''
      },
      rules: {
        subjectID: [{ required: true, message: '请选择学科', trigger: ['change', 'blur'] }],
        catalogID: [{ required: true, message: '请选择目录', trigger: ['change', 'blur'] }],
        enterpriseID: [{ required: true, message: '请选择企业', trigger: ['change', 'blur'] }],
        province: [{ required: true, message: '请选择城市', trigger: ['change', 'blur'] }],
        city: [{ required: true, message: '请选择地区', trigger: ['change', 'blur'] }],
        direction: [{ required: true, message: '请选择方向', trigger: ['change', 'blur'] }],
        questionType: [{ required: true, message: '请选择题型', trigger: ['change', 'blur'] }],
        difficulty: [{ required: true, message: '请选择难度', trigger: ['change', 'blur'] }],
        question: [{ required: true, message: '请输入题干', trigger: ['change', 'blur'] }],
        answer: [{ required: true, message: '请输入答案解析', trigger: ['change', 'blur'] }]
      },
      subjectList: [],
      directoryList: [],
      tagsList: [],
      companyList: [],
      provinceList: [],
      citysList: [],
      directionList: [],
      options: 'A',
      checkboxOptions: [],
      radioOptionsList: [
        {
          code: 'A',
          title: '',
          img: '',
          isRight: true
        },
        {
          code: 'B',
          title: '',
          img: '',
          isRight: false
        },
        {
          code: 'C',
          title: '',
          img: '',
          isRight: false
        },
        {
          code: 'D',
          title: '',
          img: '',
          isRight: false
        }
      ],
      checkboxOptionsList: [
        {
          code: 'A',
          title: '',
          img: '',
          isRight: false
        },
        {
          code: 'B',
          title: '',
          img: '',
          isRight: false
        },
        {
          code: 'C',
          title: '',
          img: '',
          isRight: false
        },
        {
          code: 'D',
          title: '',
          img: '',
          isRight: false
        }
      ],
      num: 68
    }
  },
  created () {
    this.getCompanyList()
    this.getProvince()
    this.directionList = directionList
    this.getQuestionDetail()
  },
  methods: {
    onEditorBlur (e) {
      console.log(e, '失去焦点事件')
    },
    onEditorFocus (e) {
      console.log(e, '获得焦点事件')
    },
    onEditorChange (e) {
      console.log(e, '内容改变事件')
    },
    // 获取学科简单列表
    async getSujectList () {
      const { data } = await sujectList()
      this.subjectList = data
    },
    // 通过学科获取目录,标签等
    async getDirectoryAndTagsList (id) {
      const { data: directorys } = await directorysList({
        subjectID: id
      })
      console.log(directorys, '@@@@')
      this.directoryList = directorys.items
      // 通过学科获取标签
      const { data: tags } = await tagsList({
        subjectID: id
      })
      console.log(tags, 'tags')
      this.tagsList = tags.items
    },
    // 获取企业列表
    async getCompanyList () {
      const { data: { items } } = await companyList()
      this.companyList = items
    },
    // 获取城市
    getProvince () {
      this.provinceList = provinces()
    },
    // 获取城市下的区
    getCity (pname) {
      this.citysList = citys(pname)
    },
    handleAddOptions () {
      this.checkboxOptionsList.push({
        code: String.fromCharCode(this.num += 1),
        title: '',
        img: '',
        isRight: false
      })
    },
    // 添加题组
    handleSubmit () {
      this.$refs.form.validate(async boo => {
        if (!boo) {
          return
        }
        if (this.form.id) {
          const res = await update({
            ...this.form
          })
          console.log(res)
          this.$message.success('更新试题成功')
        } else {
          let options = []
          if (this.form.questionType === '1') {
            options = [
              ...this.radioOptionsList
            ]
          } else {
            options = [
              ...this.checkboxOptionsList
            ]
          }
          const res = await add({
            ...this.form,
            options
          })
          console.log(res)
          this.$message.success('添加题库成功')
        }

        this.$router.push('/questions/list')
      })
    },
    handleCheckBox (code, e) {
      this.checkboxOptionsList.find(item => item.code === code).isRight = e
    },
    handleRadio (code, e) {
      const radioItem = this.radioOptionsList.find(item => item.code === code)
      if (radioItem.code === e) {
        this.radioOptionsList.forEach(item => {
          item.isRight = false
        })
        radioItem.isRight = true
      }
    },
    // 根据id获取试题详情
    async getQuestionDetail () {
      console.log(this.$route)
      if (this.$route.params.id === undefined) {
        return
      }
      const id = this.$route.params?.id
      const res = await detail({ id })
      console.log(res)
      this.form = {
        ...res.data
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.title{
  margin-left: 30px;
    margin-bottom: 20px;
}
.line {

  border-bottom: 1px solid #ccc;
}
.el-card{
  ::v-deep .el-card__body{
    padding: 20px 0 50px 0 ;
  }
}
.el-form{
  margin-top: 30px;
  padding-right: 15px;
}
.el-select {
  width: 300px;
}
.quill-editor {
  margin-top: -20px;
  padding: 0;
  ::v-deep .ql-container {
    height: 200px;
  }
}
.el-button {
  margin-left: 120px;
}
.radio {
  display: flex;
  flex-direction: column;
  .el-radio{
    margin-bottom: 30px;
    .el-input{
      width: 255px;
    }
  }
}
.checkbox {
  display: flex;
  flex-direction: column;
  .el-checkbox{
    margin-bottom: 30px;
    .el-input{
      width: 255px;
    }
  }
}
.radioItem {
  width: 200px;
}
.addOptionsAndAnswer {
  margin-left: 2px;

}
</style>
