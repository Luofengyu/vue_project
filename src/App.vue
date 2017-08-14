<template>
  <div id="app">
    <ul class="nav nav-pills">
      <li role="presentation" v-on:click="activeState()"><a href="/">题目录入系统</a></li>
      <li role="presentation" v-on:click="activeState('list')" v-if="user.role.audit||user.role.edit">
      <a href="/#/questionList" v-bind:class="active.list">试题列表</a>
      </li>
      <li role="presentation" v-if="user.role.edit" v-on:click="activeState('input')">
        <a v-bind:class="active.input"  href="/#/inputQuestion">题目录入</a>
      </li>
      <li role="presentation" v-if="user.role.upload" v-on:click="activeState('image')">
        <a v-bind:class="active.image" href="/#/imageUpload">图片上传</a>
      </li>
      <li role="presentation" v-if="user.role.manage" v-on:click="activeState('manage')">
        <a v-bind:class="active.manage" href="/#/userManagement">用户管理</a>
      </li>
      <li role="presentation" class="dropdown pull-right" v-if="user.role.manage||user.role.upload||user.role.audit||user.role.edit">
        <a  class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          <span class="glyphicon glyphicon-user"></span>{{user.name}} <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <li><a href="javascript:void(0)" v-on:click=""><span class="glyphicon glyphicon-menu-hamburger"></span>我的题目</a></li>
          <li><a href="javascript:void(0)" v-on:click="logout"><span class="glyphicon glyphicon-log-out"></span>登出</a></li>
        </ul>
      </li>
      <li v-if="!user.role.manage&&!user.role.upload&&!user.role.audit&&!user.role.edit" class="pull-right">
        <a href="javascript:void(0)" type="button" data-toggle="modal" data-target="#LoginModal" disable="disable">
        <span class="glyphicon glyphicon-user"></span>登陆
        </a>
      </li>
    </ul>
    <div class="jumbotron" v-if="!user.role.manage&&!user.role.upload&&!user.role.audit&&!user.role.edit">
      <h2>Hello, Welcome To Our System!</h2>
      <p>Begin: Login and begin your work</p>
      <p><button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#LoginModal">
        Sign in
      </button>
      </p>
      <p>Use <span class="alert-danger">Chrome</span> as your browser</p>
    </div>
    <router-view v-if="user.role.manage||user.role.upload||user.role.audit||user.role.edit" v-bind:user="user"></router-view>

   <!-- Modal -->
    <div class="modal fade" id="LoginModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <span class="pull-left">登陆</span>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">用户名</label>
                <div class="col-sm-8">
                  <input class="form-control" type="text" name="username" v-model="login.phone">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">密码</label>
                <div class="col-sm-8">
                  <input class="form-control" type="password" v-if="!password_type" name="username" v-model="login.password">
                  <input class="form-control" type="text" v-if="password_type" name="username" v-model="login.password">
                </div>
                <div class="col-sm-2">
                  <div class="checkbox">
                    <label>
                      <input id="mingwen" type="checkbox" v-model="password_type" />明文
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="signIn">Sign in</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal End -->

  </div>
</template>

<script>
export default {
  name: 'app',
  created: function () {
    if (window.sessionStorage.getItem('user')) {
      // cookie 比较验证
      // let index = window.document.cookie.indexOf('check=')
      // let text = window.document.cookie.substring(index + 6).split(';')[0]
      this.user = JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  data () {
    return {
      user: {
        name: null,
        phone: null,
        role: {
          audit: false,
          edit: false,
          upload: false,
          manage: false
        },
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
        }
      },
      password_type: false,
      login: {
        phone: null,
        password: null
      },
      active: {
        'input': 'nav-active',
        'manage': null,
        'image': null,
        'list': null
      }
    }
  },
  methods: {
    signIn: function () {
      let _vm = this
      var url = '/user/login'
      console.log(_vm.login, url)
      _vm.$ajax({
        method: 'POST',
        url: url,
        data: JSON.stringify(_vm.login),
        dataType: 'json'
      }).then(function (res) {
        let condition = false
        if (condition) {
          let user = res.data
          _vm.user.name = user.name
          _vm.user.phone = user.phone
          let role = user.auth.split('_')
          if (role === '0') {
            _vm.user.role = {
              audit: true,
              edit: true,
              upload: false,
              manage: true
            }
          }
          role.indexOf('1') ? (_vm.user.role.audit = true) : (_vm.user.role.audit = false)
          role.indexOf('2') ? (_vm.user.role.edit = true) : (_vm.user.role.edit = false)
          role.indexOf('3') ? (_vm.user.role.upload = true) : (_vm.user.role.upload = false)
          role.indexOf('4') ? (_vm.user.role.manage = true) : (_vm.user.role.manage = false)
          let subject = user.subject.split('_')
          if (subject === '0') {
            _vm.user.subject = {
              '语文': true,
              '数学': true,
              '英语': true,
              '物理': true,
              '化学': true,
              '生物': true,
              '政治': true,
              '历史': true,
              '地理': true
            }
          }
          subject.indexOf('1') ? (_vm.user.subject['语文'] = true) : (_vm.user.subject['语文'] = false)
          subject.indexOf('2') ? (_vm.user.subject['数学'] = true) : (_vm.user.subject['数学'] = false)
          subject.indexOf('3') ? (_vm.user.subject['英语'] = true) : (_vm.user.subject['英语'] = false)
          subject.indexOf('4') ? (_vm.user.subject['物理'] = true) : (_vm.user.subject['物理'] = false)
          subject.indexOf('5') ? (_vm.user.subject['化学'] = true) : (_vm.user.subject['化学'] = false)
          subject.indexOf('6') ? (_vm.user.subject['生物'] = true) : (_vm.user.subject['生物'] = false)
          subject.indexOf('7') ? (_vm.user.subject['政治'] = true) : (_vm.user.subject['政治'] = false)
          subject.indexOf('8') ? (_vm.user.subject['历史'] = true) : (_vm.user.subject['历史'] = false)
          subject.indexOf('9') ? (_vm.user.subject['地理'] = true) : (_vm.user.subject['地理'] = false)
          window.sessionStorage.setItem('user', JSON.stringify(_vm.user))
          Object.defineProperty(window.sessionStorage, 'user', {
            value: JSON.stringify(_vm.user),
            writable: false,
            configurable: false,
            enumerable: true
          })
        }
        // _vm.user = {
        //   name: 'hahahahha',
        //   username: 'whatwhatwhat',
        //   role: {
        //     audit: true,
        //     edit: true,
        //     upload: false,
        //     manage: true
        //   },
        //   subject: {
        //     '语文': true,
        //     '数学': true,
        //     '英语': false,
        //     '物理': false,
        //     '化学': false,
        //     '生物': false,
        //     '政治': false,
        //     '历史': false,
        //     '地理': false
        //   }
        // }
        // window.sessionStorage.setItem('user', JSON.stringify(_vm.user))
        // Object.defineProperty(window.sessionStorage, 'user', {
        //   value: JSON.stringify(_vm.user),
        //   writable: false,
        //   configurable: false,
        //   enumerable: true
        // })
        _vm.$router.push('/inputQuestion')
      }, function (error) {
        console.log(error)
      })
    },
    activeState: function (key) {
      for (var ele in this.active) {
        this.active[ele] = null
      }
      this.active[key] = 'nav-active'
    },
    logout: function () {
      console.log('logout')
      window.sessionStorage.clear()
      this.user = {
        role: {
          audit: false,
          edit: false,
          upload: false,
          manage: false
        },
        name: null
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
html, body{
  height: 100%
}
a{
  color: #000;
}
a:hover{
  background-color: #2c3e50;
  color: #000;
}
.nav{
  border-bottom: 1px solid #ddd;
}
.nav-active{
  border-bottom: 1px solid #925;
}
.dropdown-menu>li{
  border-bottom: 1px solid #ddd;
}
.dropdown-menu>li a:hover{
  background-color: #444;
  color: #fff;
}
tr,th{
  text-align: center;
  vertical-align: bottom;
  border: 1px #ddd solid;
}
</style>
