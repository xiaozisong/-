<template>
  <div>
    <el-form :model="form" label-width="120px" ref="form">
          <el-form-item label="学科" prop="subjectID">
            <el-select placeholder="请选择" v-model="form.subjectID" @click.native="getSubjectsSimpleList">
              <el-option v-for="item in subjectList" :key="item.value" :value="item.value" :label="item.label" @click.native="getDirectoryAndTagsList(item.value)"/>
           </el-select>
          </el-form-item>
          <el-form-item label="二级目录">
            <el-select placeholder="请选择" v-model="form.catalogID" >
              <el-option v-for="item in secondDirectory" :key="item.id" :value="item.id" :label="item.directoryName"/>
           </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select placeholder="请选择" v-model="form.tags">
              <el-option v-for="item in tagsList" :key="item.id" :value="item.id" :label="item.tagName"/>
           </el-select>
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input placeholder="根据题干搜索" v-model="form.keyword" />
          </el-form-item>
          <el-form-item label="试题类型" prop="questionType">
            <el-select placeholder="请选择" v-model="form.questionType">
              <el-option v-for="item in questionTypeList" :key="item.id" :value="item.id" :label="item.value"/>
           </el-select>
          </el-form-item>
          <el-form-item label="难度" prop="difficulty">
            <el-select placeholder="请选择" v-model="form.difficulty">
              <el-option v-for="item in difficultyList" :key="item.id" :value="item.id" :label="item.value"/>
           </el-select>
          </el-form-item>
          <el-form-item label="方向" prop="direction">
            <el-select placeholder="请选择" v-model="form.direction">
              <el-option v-for="(item, index) in directionList" :key="index" :value="item" :label="item"/>
           </el-select>
          </el-form-item>
          <el-form-item label="录入人" prop="creatorID">
            <el-select placeholder="请选择" v-model="form.creatorID">
              <el-option v-for="item in userList" :key="item.id" :value="item.id" :label="item.username" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目备注" prop="kemarks">
            <el-input v-model="form.kemarks" />
          </el-form-item>
           <el-form-item label="企业简称" prop="shortName">
            <el-input v-model="form.shortName" />
          </el-form-item>
          <el-form-item label="城市" prop="province">
            <el-select placeholder="请选择" style="width: 105px;margin-right: 10px" v-model="form.province">
              <el-option v-for="item in provinceList" :key="item" :value="item" :label="item" @click.native="getCitys(item)"/>
           </el-select>
          </el-form-item>
          <el-form-item prop="city" style="margin-left: -130px; margin-right: 100px">
           <el-select placeholder="请选择" style="width: 105px" v-model="form.city">
             <el-option v-for="item in cityList" :key="item" :value="item" :label="item"/>
           </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleClear">清除</el-button>
            <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-form>
  </div>
</template>

<script>
import { simple as subjectsSimple } from '@/api/hmmm/subjects.js'
import { list as directorysList } from '@/api/hmmm/directorys.js'
import { list as tagsList } from '@/api/hmmm/tags.js'
// import { list as qusetionsList } from '@/api/hmmm/questions.js'
import { directionList, difficultyList, questionType } from '@/constant'
import { list as userList } from '@/api/base/users.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
export default {
  name: 'QusetionsForm',
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
      subjectList: [],
      secondDirectory: [],
      tagsList: [],
      questionTypeList: [],
      difficultyList: [],
      directionList: [],
      creatorList: [],
      userList: [],
      tableData: [],
      provinceList: [],
      cityList: [],
      counts: '',
      page: 1,
      pagesize: 5
    }
  },
  created () {
    this.getUserList()
    this.getProvinces()
    this.directionList = directionList
    this.difficultyList = difficultyList
    this.questionTypeList = questionType
  },
  methods: {
    // 获取学科简单列表
    async getSubjectsSimpleList () {
      const { data } = await subjectsSimple()
      this.subjectList = data
    },
    // 通过学科获取目录,标签等
    async getDirectoryAndTagsList (id) {
      const { data: directorys } = await directorysList({
        subjectID: id
      })
      console.log(directorys, '@@@@')
      this.secondDirectory = directorys.items
      // 通过学科获取标签
      const { data: tags } = await tagsList({
        subjectID: id
      })
      console.log(tags)
      this.tagsList = tags.items
    },
    // 获取用户列表
    async getUserList () {
      const { data } = await userList()
      this.userList = data.list
    },
    // 搜索
    handleSearch () {
      this.$emit('handleSearch', this.form)
      console.log(1)
    },
    // 清除表单
    handleClear () {
      this.$refs.form.resetFields()
      this.$emit('handleClear')
    },
    async getProvinces () {
      this.provinceList = await provinces()
    },
    async getCitys (pname) {
      this.cityList = await citys(pname)
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
