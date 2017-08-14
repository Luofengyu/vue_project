<template>
<div>
    <div class="row">
      <div class="col-xs-4">
        <div class="row">
          <label class="col-lg-2 control-label">ID:</label>
          <span>{{qsn_object.id}}</span>
        </div>
        <div class='img_div'>
          <img v-bind:src="qsn_origin.imgUrl" class="contain-img"/>
        </div>
        <div class="ocr_div">
          <span>OCR识别结果</span>
          <textarea class = 'form-control' col="10" rows="5" disabled>
          </textarea>
        </div>
        <div class="position_div">
          <div class="position row">
            <span class='col-xs-3 title'>1.题目:</span>
            <div class="similar col-xs-4">相似度 ：100%</div>
            <button class=' col-xs-5 btn btn-default glyphicon glyphicon-log-out'>一键录入</button>
            <div>放题干的地方</div>
            <span class='title'>答案</span>
            <div>A</div>
            <span class='title'>解析</span>
            <div>写解析的地方</div>
          </div>
        </div>
      </div>
      <!--==================================右边================================-->
      <div class="col-xs-8">
        <div class="row" v-if="pageCtrl.SubjectChoice">
          <div class = 'subject_div row'>
            <span class = 'title col-xs-2' style="padding:0">科目:<span style = 'color:red'>*</span></span>
            <div class="form-group col-xs-5">
              <select class='form-control' v-model="qsn_object.subject">
                <option v-for="subject in subject_list" v-bind:value="subject">{{subject}}</option>
              </select>
            </div>
          </div>
          <div class="btn_entry_div row">
            <button class = 'btn btn-default' v-on:click="inputThisQuestion">录入</button>
            <button class = 'btn btn-default' v-on:click="jumpToNext" v-bind:disabled="!qsn_object.subject||qsn_object.beJumped">跳过</button>
          </div>
        </div>
        <!--=====================================题目录入主题=========================================-->
        <div class="input_context" v-if="pageCtrl.InputPage">
          <div class="title_div">
            <div class="row" style="margin:0 15px;">
              <span class = 'pull-left'>科目：</span>
              <span class="pull-left">{{qsn_object.subject}}</span>
              <a href="javascript:void(0)" v-on:click="jumpToaudit()" class="btn btn-info pull-right" v-if="pageCtrl.InputPage">下一题</a>
            </div>
            <div class="row">
              <span class = 'title'>题干：</span>
              <div class = 'editor_textarea col-xs-10'>
                <textarea id="stem" rows="5" class='form-control' style='resize:none' v-model="qsn_object.stem.text" v-on:blur="get_cursor"></textarea>
              </div>
            </div>
            <br/>
            <div class="row" v-if="!qsn_object.choices&&!qsn_object.subQues">
              <button class="btn btn-primary" v-on:click="stemGetOptions">选项</button>
              <button class="btn btn-primary" v-on:click="stemGetSubQues">小问</button>
            </div>
            <!-- 选项 -->
            <div class = 'option_div col-xs-10' v-for="value,key,$index in qsn_object.choices" v-if="qsn_object.choices">
              <div class="col-xs-2">{{key}}</div>
              <div class='editor_textarea col-xs-10'>
               <textarea v-bind:id="'choices-'+key" rows="3" class='form-control' style='resize:none' v-model="qsn_object.choices[key].text" v-on:blur="get_cursor"></textarea>
                <div class="close_icon">
                  <button class = 'btn btn-default glyphicon glyphicon-remove' v-on:click="removeChoice(key)"></button>
                </div>
              </div>
            </div>
            <!-- 小问 -->
             <div class = 'option_div col-xs-10' v-for="value,key,$index in qsn_object.subQues" v-if="qsn_object.subQues">
              <div class="col-xs-2">{{key}}</div>
              <div class='editor_textarea col-xs-10'>
               <textarea v-bind:id="'subQues-'+key" rows="3" class='form-control' style='resize:none' v-model="qsn_object.subQues[key].text" v-on:blur="get_cursor"></textarea>
                <div class="close_icon">
                  <button class = 'btn btn-default glyphicon glyphicon-remove' v-on:click="removeSubQues(key)"></button>
                </div>
              </div>
            </div>


            <div class = 'add_div row'>
              <div class="col-xs-offset-2 col-xs-7">
                <button class='btn btn-info glyphicon glyphicon-plus' style="width:100%; margin:10px 0;" v-on:click="addOption" v-if="qsn_object.choices"></button>
                <button class='btn btn-info glyphicon glyphicon-plus' style="width:100%; margin:10px 0;" v-on:click="addSubQues" v-if="qsn_object.subQues"></button>
              </div>
            </div>
          </div>

          <!-- 答案 -->
          <div class="answer_div">
            <span class = 'title'>答案：</span>
            <div class = 'editor_textarea'>
              <textarea id="answer" rows="5" class='form-control' style='resize:none' v-on:blur="get_cursor" v-model="qsn_object.answer.text"></textarea>
            </div>
          </div>
          <!-- 解析 -->
          <div class="analysis_div">
            <span class = 'title'>解析：</span>
            <div class = 'editor_textarea'>
              <textarea id="analysis" rows="5" class='form-control' style='resize:none' v-on:blur="get_cursor" v-model="qsn_object.analysis.text"></textarea>
            </div>
          </div>
          
          <div class="btn_save_div">
            <button class = 'btn btn-default' v-on:click='jumpToaudit("否")'>保存</button>
            <button class = 'btn btn-default' v-on:click='jumpToaudit("是")'>提交</button>
          </div>
          <!--==================工具栏================-->
          <div class="editor_icon">
            <ul>
              <ol><button class='btn btn-success glyphicon glyphicon-plus'
              v-on:click="change_formula_div"></button></ol>
              <ol>
                <a href="javascript: void(0);" class="btn btn-success glyphicon glyphicon-picture file">
                  <input type="file" accept="image/*" v-on:change="upload_img_Base64">
                </a>
              </ol>
              <ol><button class='btn btn-success glyphicon glyphicon-th-list' v-on:click="changePreviewDiv"></button></ol>
              <ol><button class='btn btn-success glyphicon glyphicon-remove' v-on:click="closeTools"></button></ol>
            </ul> 
            <div id="math-formula" class="tools" v-if="tools.formula_div">
              <formulaInput v-on:laTexValue="update_formula"></formulaInput>
            </div>
            <div v-if="tools.previewInput" class="tools">
              <div v-html="current_show" class="preview">
              </div>
            </div>
          </div>
          <!--===============工具栏END===============-->
        </div>
        <!--=====================================题目录入主题END=========================================-->
        <!-- 以下是审核编辑页 -->
        <hr>
        <div v-if="pageCtrl.auditPage">
          <div class="btn_audit_div">
            <button class = 'btn btn-default' v-on:click='jumpToEdit' v-if="user.role.edit&&(auditObject.result==='不通过')&&user.subject[qsn_object.subject]">编辑</button>
            <button class = 'btn btn-default' v-on:click='showAuditInput' v-if="user.role.audit&&(auditObject.result==='不通过')&&user.subject[qsn_object.subject]">审核</button>
          </div>
          <div class="title_div">
            <span class = 'title'>题干：</span>
            <p v-html="qsn_for_audit.stem"></p>
            <div v-if="qsn_for_audit.choices">
              <p v-html="auditChoices">
              </p>
            </div>
            <div v-if="qsn_for_audit.subQues">
              <p v-html="auditSubQues">
              </p>
            </div>
            <span class="title">答案</span>
            <p v-html="qsn_for_audit.answer"></p>
            <span class="title">解析</span>
            <p v-html="qsn_for_audit.analysis"></p>

            <span class="title">是否完全录入</span> <span>是</span>
          </div>
<!--           <div class="btn_close_div" v-if = 'is_audit_btn'>
            <a href='' class='btn btn-default'>关闭</a>
          </div> -->

          <div v-if='pageCtrl.auditInput'>
            <span class= 'title'>审核</span>
            <div class="radio">
              <label>
                  <input type="radio" name="optionsRadios" id="optionsRadios1" value="通过" v-on:click='hideReasonText' v-model="auditObject.result">
                  通过
                </label>
              <label>
                  <input type="radio" name="optionsRadios" id="optionsRadios1" value="不通过" v-on:click='showReasonText' v-model="auditObject.result">
                  不通过
                </label>
            </div>
            <textarea rows="2" class='form-control' style="resize:none" placeholder='请输入不通过的原因'
             v-if='pageCtrl.reasonText' v-model='auditObject.reason'></textarea>


            <div class="btn_close_div">
              <a href="javascript:void(0)" class='btn btn-default' v-on:click='auditResultSubmit'>提交</a>
              <a href ='javascript:void(0)' class='btn btn-default' v-on:click="CloseAuditInput">关闭</a>
            </div>
          </div>

          

          <div class="audit_pass" v-if='pageCtrl.auditResultPage'>
            <p>
              <span>审核结果：</span>
              <span>{{ auditObject.result }}</span>
            </p>
            <p v-if="auditObject.result==='不通过'"><span>原因：</span><span>{{auditObject.reason}}</span></p>
            <p><span>审核人：</span><span>{{ auditObject.userName }}</span></p>

            <div class="btn_close_div">
              <a href="javascript:void(0)" class='btn btn-default' v-on:click='jumpToEdit' v-if="(auditObject.result=='不通过')&&user.role.edit&&user.subject[qsn_object.subject]">编辑</a>
              <a href='javascript:void(0)' class='btn btn-default'>关闭</a>
            </div>
          </div>


        </div><!--审核页面-->
      </div><!--右边-->
    </div>
</div>
</template>

<script>
import formulaInput from './formulaInput'
export default {
  name: 'InputQuestion',
  beforeCreate: function () {
    // this.$ajax({
    //   url: '',
    //   type: 'GET'
    // }).then(function (res) {
    //   console.log(res)
    // }, function (res) {
    //   console.log(res)
    // })
    this.qsn_object = {
      subject: null,
      id: 0,
      user_id: null,
      beJumped: true,
      jumpUserID: null,
      stem: {
        image: [],
        formula: [],
        text: ''
      },
      choices: null,
      subQues: null,
      answer: {
        image: [],
        formula: [],
        text: ''
      },
      analysis: {
        image: [],
        formula: [],
        text: ''
      },
      state: '否',
      auditResult: '不通过',
      auditUserID: null
    }
    this.auditObject = {
      result: '不通过',
      reason: 'null',
      userName: 'null'
    }
  },
  beforeMount: function () {
    let _vm = this
    _vm.pageCtrl.SubjectChoice = _vm.user.role.edit && (!_vm.qsn_object.subject)
    _vm.pageCtrl.InputPage = _vm.user.role.edit && _vm.user.subject[_vm.qsn_object.subject] && (_vm.qsn_object.state !== '是')
    _vm.pageCtrl.auditPage = _vm.user.role.audit && (_vm.qsn_object.state === '是') && _vm.user.subject[_vm.qsn_object.subject]
    _vm.pageCtrl.auditResultPage = (_vm.qsn_object.auditResult) && (_vm.user.role.audit || _vm.user.role.edit) && _vm.user.subject[_vm.qsn_object.subject]
  },
  data () {
    return {
      subject_list: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
      choices_key: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      subQues_key: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
      tools: {
        formula_div: false,
        previewInput: true
      },
      pageCtrl: {
        SubjectChoice: true,
        InputPage: false,
        auditPage: false,
        auditInput: false,
        auditResultPage: false,
        reasonText: true
      },
      qsn_origin: {
        imgUrl: '/static/img/test.png'
      },
      current_target: {
        id: 'stem',
        index: 0
      },
      qsn_for_audit: {
        stem: null,
        choices: null,
        subQues: null,
        answer: null,
        analysis: null,
        state: null
      }
    }
  },
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    formulaInput
  },
  computed: {
    auditChoices: function () {
      let obj = this.qsn_for_audit.choices
      let text = ''
      for (let choice in obj) {
        text += `<p style="width: 90%;margin:auto;border: 1px solid #bbb;"><span class="pull-left">${choice}:</span>${obj[choice]}</p>`
      }
      return text
    },
    auditSubQues: function () {
      let obj = this.qsn_for_audit.subQues
      let text = ''
      for (let choice in obj) {
        text += `<p style="width: 90%;margin:auto;border: 1px solid #bbb;"><span class="pull-left">${choice}:</span>${obj[choice]}</p>`
      }
      return text
    },
    current_show: function () {
      let _vm = this
      let text = ''
      let target = _vm.current_target.id
      if (target.match('choices') || target.match('subQues')) {
        text = _vm.display_results(_vm.qsn_object[target.split('-')[0]][target.split('-')[1]])
      } else {
        text = _vm.display_results(_vm.qsn_object[target])
      }
      return text
    }
  },
  methods: {
    submitQuse: function () {
      let _vm = this
      let data = _vm.checkForSubmit()
      console.log(data)
      _vm.$ajax({
        url: '',
        type: 'POST',
        data: JSON.stringify(data)
      }).then(function (res) {
        console.log(res)
      }, function (error) {
        console.log(error)
      })
    },
    inputThisQuestion: function () {
      let _vm = this
      if (_vm.qsn_object.subject) {
        if (_vm.user.subject[_vm.qsn_object.subject] && _vm.user.role.edit) {
          _vm.pageCtrl.InputPage = true
          _vm.pageCtrl.SubjectChoice = false
        } else {
          window.alert('您无录入此类科目权限,进入下一题')
          _vm.jumpToNext()
        }
      }
    },
    jumpToNext: function () {
      if (this.qsn_object.subject) {
        this.$ajax({
          url: '',
          type: 'GET'
        }).then(function (res) {
          console.log(res)
        }, function (res) {
          console.log(res)
        })
      } else {
        window.alert('缺少科目')
      }
    },
    upload_img_Base64: function (e) {
      let _vm = this
      let target = _vm.current_target.id
      let index = _vm.current_target.index
      let file = e.target.files[0]
      let reader = new FileReader()
      let img = {}
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        img['imgUrl'] = this.result
        img['position'] = index
        img['origin_file'] = file
        img['showText'] = `<img src="${img.imgUrl}">`
        if (target.match('choices') || target.match('subQues')) {
          _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].image.push(img)
          let text = _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].text
          _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].text = text.substr(0, index) + '|image|' + text.substr(index)
        } else {
          _vm.qsn_object[target].image.push(img)
          let text = _vm.qsn_object[target].text
          _vm.qsn_object[target].text = text.substr(0, index) + '|image|' + text.substr(index)
        }
      }
      _vm.current_target.index += 7
    },
    update_formula: function (latex) {
      let _vm = this
      let target = _vm.current_target.id
      let index = _vm.current_target.index
      let formula = {}
      formula['laTex'] = latex
      formula['index'] = index
      if (target.match('choices') || target.match('subQues')) {
        _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].formula.push(formula)
        let text = _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].text
        // _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].formatText = text.substr(0, index) + '<formula>' + text.substr(index)
        _vm.qsn_object[target.split('-')[0]][target.split('-')[1]].text = text.substr(0, index) + latex + ' ' + text.substr(index)
      } else {
        _vm.qsn_object[target].formula.push(formula)
        let text = _vm.qsn_object[target].text
        // _vm.qsn_object[target].formatText = text.substr(0, index) + '<formula>' + text.substr(index)
        _vm.qsn_object[target].text = text.substr(0, index) + latex + ' ' + text.substr(index)
      }
    },
    get_cursor: function (e) {
      let _vm = this
      _vm.current_target.id = e.target.id
      _vm.current_target.index = e.target.selectionStart
    },
    stemGetOptions: function () {
      this.qsn_object['choices'] = {}
      for (let i = 0; i < 4; i++) {
        this.addOption()
      }
    },
    addOption: function () {
      let _vm = this
      let key = _vm.choices_key.shift()
      _vm.$set(_vm.qsn_object.choices, key, {
        image: [],
        formula: [],
        text: '',
        showHTML: ''
      })
    },
    removeChoice: function (key) {
      this.$delete(this.qsn_object['choices'], key)
    },
    stemGetSubQues: function () {
      this.qsn_object['subQues'] = {}
      for (let i = 0; i < 2; i++) {
        this.addSubQues()
      }
    },
    addSubQues: function () {
      let key = this.subQues_key.shift()
      this.$set(this.qsn_object['subQues'], key, {
        image: [],
        formula: [],
        text: '',
        showHTML: ''
      })
    },
    removeSubQues: function (key) {
      this.$delete(this.qsn_object['subQues'], key)
    },
    display_results: function (obj) {
      let _vm = this
      let text = obj.text
      if (obj.image.length) {
        _vm.SortImages(obj.image)
        let textImgNum = text.match(/\|image\|/g).length
        for (let i = 0; i < textImgNum; i++) {
          text = text.replace(/\|image\|/, '\\]' + obj.image[i].showText + '\\[')
        }
      }
      return '\\[' + text + '\\]'
    },
    SortImages: function (image) {
      if (image.length) {
        for (let i = 0; i < image.length; i++) {
          for (let j = 1; j < image.length; j++) {
            if (image[j].index < image[i].index) {
              let temp = image[i]
              image[i] = image[j]
              image[j] = temp
            }
          }
        }
      }
      return image
    },
    createAuditObject: function () {
      let _vm = this
      _vm.qsn_for_audit = {
        stem: _vm.display_results(_vm.qsn_object.stem),
        answer: _vm.display_results(_vm.qsn_object.answer),
        analysis: _vm.display_results(_vm.qsn_object.analysis),
        state: _vm.qsn_object.state
      }
      if (_vm.qsn_object.choices) {
        _vm.qsn_for_audit.choices = {}
        for (let choice in _vm.qsn_object.choices) {
          _vm.qsn_for_audit['choices'][choice] = _vm.display_results(_vm.qsn_object.choices[choice])
        }
      }
      if (_vm.qsn_object.subQues) {
        _vm.qsn_for_audit.subQues = {}
        for (let ques in _vm.qsn_object.subQues) {
          _vm.qsn_for_audit['subQues'][ques] = _vm.display_results(_vm.qsn_object.subQues[ques])
        }
      }
    },
    // =================================================
    jumpToaudit: function (state) {
      let _vm = this
      if (!_vm.qsn_object.stem.text) {
        window.alert('缺少题干')
      } else if (!_vm.qsn_object.answer.text) {
        window.alert('缺少答案')
      } else if (!_vm.qsn_object.analysis.text) {
        window.alert('缺少解析')
      } else {
        _vm.submitQuse()
        if (state === '否') {
          _vm.qsn_object.state = state
          return
        }
        if (_vm.user.role.audit && state === '是') {
          _vm.pageCtrl.InputPage = false
          _vm.pageCtrl.auditPage = true
          _vm.qsn_object.state = state
          _vm.createAuditObject()
        } else {
          _vm.jumpToNext()
        }
      }
    },
    jumpToEdit: function () {
      this.pageCtrl = {
        SubjectChoice: false,
        InputPage: true,
        auditPage: false,
        auditInput: false,
        auditResultPage: false,
        reasonText: false
      }
    },
    showAuditInput: function () {
      this.pageCtrl.auditInput = true
      this.pageCtrl.auditResultPage = false
    },
    CloseAuditInput: function () {
      this.pageCtrl.auditInput = false
    },
    showReasonText: function () {
      this.pageCtrl.reasonText = true
    },
    hideReasonText: function () {
      this.pageCtrl.reasonText = false
    },
    auditResultSubmit: function () {
      let _vm = this
      if ((_vm.auditObject.result === false) && (!_vm.auditObject.reason)) {
        window.alert('请输入不通过原因')
      } else {
        _vm.auditObject.userName = _vm.user.name
        _vm.$ajax({
          url: '/',
          type: 'GET',
          data: _vm.auditObject
        }).then(function (res) {
          _vm.pageCtrl.auditResultPage = true
          _vm.pageCtrl.auditInput = false
        }, function (error) {
          console.log(error)
        })
      }
    },
    change_formula_div: function () {
      this.tools.previewInput = false
      this.tools.formula_div = true
    },
    changePreviewDiv: function () {
      this.tools.previewInput = true
      this.tools.formula_div = false
    },
    closeTools: function () {
      this.tools.previewInput = false
      this.tools.formula_div = false
    },
    checkForSubmit: function () {
      let _vm = this
      let obj = _vm.qsn_object
      for (let key in obj) {
        if (key === ('stem' || 'answer' || 'analysis')) {
          let text = obj[key]['text']
          console.log(obj[key])
          let imageList = _vm.SortImages(obj[key]['image'])
          for (let img of imageList) {
            if (!text.match(/\|image\|/)) {
              break
            }
            let index = text.match(/\|image\|/).index
            img['position'] = index
            text.replace(/\|image\|/, '')
          }
          obj[key]['image'] = imageList
        } else if (key === ('choices' || 'subQues')) {
          if (obj[key]) {
            for (let subkey in obj[key]) {
              let text = obj[key][subkey]['text']
              let imageList = _vm.SortImages(obj[key][subkey]['image'])
              for (let img of imageList) {
                if (!text.match(/\|image\|/)) {
                  break
                }
                let index = text.match(/\|image\|/).index
                img['position'] = index
                text.replace(/\|image\|/, '')
              }
              obj[key][subkey]['image'] = imageList
            }
          }
        }
      }
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
  
  a{
    color: #000;
  }
  .col-xs-4{
    border-right: 1px solid #ddd;
  }
  .ocr_div{
    margin-top: 25px;
    margin-bottom:10px;
    padding-bottom: 17px;
    padding-top:10px; 
    border-top: 1px solid #ddd;
    border-bottom: 1px dashed #ddd;
  }
  .title{
    padding: 5px 0px 5px 25px;
    color: #00BCD4;
    text-align: left;
    display: block;
  }
  .position_div .position .similar{
    padding: 5px 0;
    border:1px solid #ddd;
    border-radius:5px;
  }
  .position_div .position button,.position_div .position button:hover,
  .close_icon button,.close_icon button:hover{
    background: #FFF;
    border:none;
  }
  .close_icon{
    position: absolute;
    right: -25px;
  }
  .subject_div{
    margin-top: 50px;
    padding-left: 50px;
  }
  .btn_entry_div,.btn_audit_div{
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 50px;
  }
  .btn_save_div{
    text-align: center;
  }
  .btn_entry_div button,.btn_save_div button,.btn_audit_div button{
    margin-right: 110px;
  }
  .title_div,.answer_div,.analysis_div{
    margin-left: 34px;
    margin-bottom:15px;
    clear: both;
  }
  .editor_textarea{
    position: relative;
  }
  .editor_icon{
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .editor_icon>ul, .editor_icon ol{
    padding: 0;
  }
  .editor_icon .tools{
    position: absolute;
    top:0;
    height: 100%;
    right: 100%;
    width: 800px;
    overflow-y: scroll; 
    background: rgba(0,0,0,0.4);
  }
  .close_icon{
    position: absolute;
    top: 9px;
    right: -38px;
  }
  .add_div{
    margin-bottom:20px;
  }
  .btn_close_div{
    text-align: right;
  }
  .contain-img{
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
  .img_div{
     width: 100%;
  }
  .option_div{
    margin-top: 10px; 
  }
  .audit_pass{
    text-align: left
  }
  .file input {
    position: absolute;
    width: 50px;
    height: 30px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .preview{
    background: #ddd;
    width: 90%;
    margin: auto;
  }
  p.audit_sub{
    width: 90%;
    margin:auto;
    border: 1px solid #bbb;
  }
</style>
