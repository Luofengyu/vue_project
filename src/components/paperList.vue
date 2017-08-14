<template>
<div class="container">
  <div class="panel panel-info">
    <div class="panel-heading">
      <div class="row">
        <div class="col-xs-2">
          <p class= 'form-control-static'>科目</p>
          <select name="" id="" class = 'form-control' v-model="search_model.subject">
            <option v-for="subject in subject_list" v-bind:value="subject">{{subject}}</option>
          </select>
        </div>
        <div class="col-xs-3">
          <p class= 'form-control-static'>录入情况</p>
          <select name="" id="" class = 'form-control' v-model="search_model.input_state">
            <option v-for="state in input_state" v-bind:value="state">{{state}}</option>
          </select>
        </div>
        <div class="col-xs-3">
          <p class= 'form-control-static'>题目来源</p>
          <select name="" id="" class = 'form-control' v-model="search_model.source">
            <option v-for="source in source_list" v-bind:value="source">{{source}}</option>
          </select>
        </div>
        <div class="col-xs-4">
          <p class= 'form-control-static'>操作人</p>
          <select name="" id="" class = 'form-control' v-model="search_model.operator">
            <option v-for="operator in operator_list" v-bind:value="operator">{{operator}}</option>
          </select>
        </div>
      </div>
      <div class = 'row'> 
        <div class="col-xs-2">
          <p class= 'form-control-static'>审核人</p>
          <select name="" id="" class = 'form-control' v-model="search_model.auditor">
            <option v-for="auditor in auditor_list" v-bind:value="auditor">{{auditor}}</option>
          </select>
        </div>
        <div class="col-xs-3">
          <p class= 'form-control-static'>状态</p>
          <select name="" id="" class = 'form-control' v-model="search_model.state">
            <option v-for="state in state_list" v-bind:value="state">{{state}}</option>
          </select>
        </div>
        <div class="col-xs-3">
          <p class= 'form-control-static'>时间</p>
          <input type="date" class="form-control" v-model="search_model.time">
        </div>
        <div class="col-xs-4">
          <p class='form-control-static'>题目ID</p>
          <div class="row">
          <div class="col-xs-9">
            <input type="text" placeholder="请输入题目ID" class ='form-control'  v-model="search_model.question_id"> 
          </div>
          <div class="col-xs-3">
            <button class="btn btn-warning" v-on:click="search_data">搜索</button>
          </div> 
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <pagination v-bind:conf="conf" v-on:updateData="updateListData"></pagination>
      <table class="table table-bordered">
        <thead>
          <th><input type="checkbox" name=""></th>
          <th v-for="th in thead_list">{{th}}</th>
        </thead>
        <tbody>
          <tr><!--v-for="tr in dataList"-->
            <td><input type="checkbox"></td>
            <td>id</td>
            <td>subject</td>
            <td>complete</td>
            <td>source</td>
            <td>operator</td>
            <td>auditor</td>
            <td>operation_time</td>
            <td>state</td>
            <td>operation</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import pagination from '@/components/pagination'
export default{
  name: 'paperList',
  created: function () {
    this.getData({})
  },
  data () {
    return {
      thead_list: ['题目ID', '科目', '完全录入', '题目来源', '操作人', '审核人', '操作时间', '状态', '操作'],
      operator_list: ['郭晶晶', '杨连炯', '白建国'],
      auditor_list: ['郭晶晶', '杨连炯', '白建国'],
      state_list: ['待处理', '处理中', '待审核', '审核中', '审核不通过'],
      source_list: ['后台上传', '小程序', '智康APP', '其他'],
      input_state: ['全部', '是', '否'],
      subject_list: ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
      search_model: {
        'subject': null,
        'input_state': null,
        'source': null,
        'operator': null,
        'auditor': null,
        'state': null,
        'time': null,
        'question_id': null
      },
      conf: {
        current_page: 1,
        show_pages: 5,
        per_page: 10,
        page_num: 10,
        data_num: 100
      }
    }
  },
  // filters: {
  //   addone: function (value) {
  //     if (!value) {
  //       return
  //     } else {
  //       return String(value) + 'one'
  //     }
  //   }
  // },
  components: {
    pagination
  },
  methods: {
    getData: function (filter) {
      this.$ajax({
        url: '',
        type: 'GET',
        data: filter
      }).then(function (res) {
        console.log(filter)
      }, function (res) {
        console.log(res)
      })
    },
    search_data: function () {
      this.getData(this.search_model)
    },
    updateListData: function () {
      let filter = this.search_model
      for (let ele in this.conf) {
        filter[ele] = this.conf[ele]
      }
      this.getData(filter)
    }
  }
}
</script>
<style scoped="scoped">
  p.form-control-static{
    display: inline-block;
  }
</style>
