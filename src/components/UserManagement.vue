<template>
<div>
<!-- ROOT BEGIN-->
<div class="row">
<div class="col-sm-offset-2 col-sm-8">
	<div class="panel panel-info">
		<div class="panel-heading">
			<pagination v-bind:conf="conf" v-on:updateData="getMsg"></pagination>
		</div>
		<div class="panel-body">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-5">
						<label for="user" class = "sr-only">用户名或账号</label>
					<input type="email" class="form-control" id="user" placeholder="请输入用户名或账号">
					</div>  					
				<div class="col-xs-3">
					<button class='margin-right btn btn-info glyphicon glyphicon-search'></button>
					<button class='margin-right btn btn-info glyphicon glyphicon-plus' data-toggle="modal" data-target="#addUser" v-on:click="get_user(null, 'add')"></button>
				</div>	
				</div>
			</form>
			<table class="table table-bordered">
				<thead>
				<th v-for="th in thead_list">{{th}}</th>
				</thead>
				<tbody>
				<tr v-for="tr in dataList">
					<td>{{tr.name}}</td>
					<td>{{tr.username}}</td>
					<td><a class="btn btn-primary" data-toggle="modal" data-target="#addUser" v-on:click="get_user(tr, 'update')">编辑</a> <a v-on:click="get_user(tr, 'delete')" class="btn btn-danger">删除</a></td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
</div>
	

<div class="modal fade bs-example-modal-lg" id="addUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" aria-hidden="true">
<div class="modal-dialog modal-lg">
<div class="modal-content">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">{{manage.type=='add'?'增加用户':'更新用户信息'}}</h4>
    </div>
    <div class="modal-body">
    	<div class="row">
			<form class='form-horizontal'>
				<div class="col-offset-xs-1 col-xs-10">
    				<div class="form-group">
    					<label for="" class='col-xs-2 control-label'>姓名：</label>
    					<div class="col-xs-10">
    						<input type="text" class='form-control' v-model="manage.name" v-if="manage.type=='add'"/>
    						<input type="text" class='form-control' disabled="disabled" v-model="manage.name" v-if="manage.type!='add'"/>
    					</div>
    				</div>
    				<div class='form-group'>	
    					<label for="" class='col-xs-2 control-label'>账号：</label>
    					<div class="col-xs-10">
    						<input type="text" class='form-control' v-model="manage.username" v-if="manage.type=='add'"/>
    						<input type="text" class='form-control' disabled="disabled" v-model="manage.username" v-if="manage.type!='add'"/>
    					</div>	
    				</div>
				</div>
				<div class="col-offset-xs-1 col-xs-10">
    				<h5 class="text-left">学科</h5>
    				<div class="text-left">
    					<label class="checkbox-inline">
						  	<input type="checkbox" v-bind:checked="getSubjectAllCheck" v-on:click="check_all(manage.subject, 'subject')">全选
						</label>
	            		<label class="checkbox-inline" v-for="subject in subject_list">
						  	<input type="checkbox" v-model="manage.subject[subject]">{{subject}}
						</label>
					</div>

					<h5 class="text-left">权限</h5>
					<div class="text-left">
						<label class="checkbox-inline">
						  	<input type="checkbox" v-bind:checked="getRoleAllCheck" v-on:click="check_all(manage.role, 'role')">全选
						</label>
						<label class="checkbox-inline" v-for="role in authority_list">
							<input type="checkbox" id="" v-model="manage.role[role]"> {{role}}
						</label>
					</div>
				</div>
			</form>	
    	</div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="backChange">关闭</button>
        <button type="button" class="btn btn-info" v-on:click="save_change(manage.type)">保存</button>
    </div>
</div><!-- /.modal-content -->
</div><!-- /.modal -->
</div>

<!-- ROOT END-->
</div>
</template>

<script>
import pagination from './pagination'
export default{
  name: 'UserManagement',
  created: function () {
    this.getData(this.conf)
  },
  data () {
    return {
      thead_list: ['姓名', '账号', '操作'],
      subject_list: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
      authority_list: ['题目录入', '审核', '图片上传', '用户管理'],
      dataList: {
        type: Array(Object)
      },
      manage: {
        name: null,
        username: null,
        subject: {
          '语文': false,
          '数学': false,
          '英语': false,
          '物理': false,
          '化学': false,
          '生物': false,
          '政治': false,
          '历史': false,
          '地理': false
        },
        role: {
          '题目录入': false,
          '审核': false,
          '图片上传': false,
          '用户管理': false
        },
        type: 'update'
      },
      before_manage: {},
      conf: {
        current_page: 1,
        show_pages: 5,
        per_page: 10,
        page_num: 10,
        data_num: 100
      }
    }
  },
  components: {
    pagination
  },
  methods: {
    get_user: function (user = null, type) {
      let _vm = this
      if (type === 'delete') {
        var index = _vm.dataList.indexOf(user)
        _vm.dataList.splice(index, 1)
      }
      if (type === 'add') {
        _vm.manage = {
          name: null,
          username: null,
          subject: {
            '语文': false,
            '数学': false,
            '英语': false,
            '物理': false,
            '化学': false,
            '生物': false,
            '政治': false,
            '历史': false,
            '地理': false
          },
          role: {
            '题目录入': false,
            '审核': false,
            '图片上传': false,
            '用户管理': false
          },
          type: 'add'
        }
      }
      if (type === 'update' && user) {
        _vm.manage.name = user.name
        _vm.manage.username = user.username
        _vm.manage.subject = user.subject
        _vm.manage.role = user.role
        _vm.before_manage = {
          name: _vm.manage.name,
          username: _vm.manage.username,
          subject: _vm.manage.subject,
          role: _vm.manage.role
        }
      }
      _vm.manage.type = type
    },
    check_all: function (obj, name) {
      if ((this.getSubjectAllCheck && name === 'subject') || (this.getRoleAllCheck && name === 'role')) {
        for (let key in obj) {
          obj[key] = false
        }
        return
      }
      for (let key in obj) {
        obj[key] = true
      }
    },
    getMsg: function (data) {
      this.getData(this.conf)
    },
    getData: function (data) {
      var _vm = this
      console.log(data)
      _vm.$ajax({
        url: '/',
        type: 'GET',
        data: data
      }).then(function (res) {
        _vm.dataList = [{
          name: '郭晶晶',
          username: '12345678900',
          subject: {
            '语文': true,
            '数学': false,
            '英语': true,
            '物理': true,
            '化学': false,
            '生物': true,
            '政治': true,
            '历史': false,
            '地理': true
          },
          role: {
            '题目录入': true,
            '审核': true,
            '图片上传': false,
            '用户管理': false
          }
        },
        {
          name: '郭晶晶2',
          username: '12345678900',
          subject: {
            '语文': true,
            '数学': false,
            '英语': true,
            '物理': true,
            '化学': false,
            '生物': true,
            '政治': true,
            '历史': false,
            '地理': true
          },
          role: {
            '题目录入': true,
            '审核': true,
            '图片上传': false,
            '用户管理': false
          }
        },
        {
          name: '郭晶晶3',
          username: '12345678900',
          subject: {
            '语文': true,
            '数学': false,
            '英语': true,
            '物理': true,
            '化学': false,
            '生物': true,
            '政治': true,
            '历史': false,
            '地理': true
          },
          role: {
            '题目录入': true,
            '审核': true,
            '图片上传': false,
            '用户管理': false
          }
        }]
      }, function (res) {
        console.log(res)
      })
    },
    save_change: function (type) {
      let _vm = this
      _vm.$ajax({
        url: '/',
        type: 'POST',
        data: _vm.manage
      }).then(function (res) {
        console.log(res)
      }, function (res) {
        console.log(res)
      })
    },
    backChange: function () {
      let _vm = this
      _vm.manage = {
        name: _vm.before_manage.name,
        username: _vm.before_manage.username,
        subject: _vm.before_manage.subject,
        role: _vm.before_manage.role
      }
    }
  },
  computed: {
    getSubjectAllCheck: function () {
      for (let ele in this.manage.subject) {
        if (this.manage.subject[ele] === false) {
          return false
        }
      }
      return true
    },
    getRoleAllCheck: function () {
      for (let ele in this.manage.role) {
        if (this.manage.role[ele] === false) {
          return false
        }
      }
      return true
    }
  }
}
</script>