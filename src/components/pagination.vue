<template>
<div class="pagination-component">
	<div class="pagination-info ">
		<select class="pagination_select" v-model="conf.per_page" v-if="display_element.select">
			<option v-for="num in num_list" v-bind:value="num" v-bind:selected="conf.per_page==num?'selected':false">{{num}}</option v-on:click="sendMsg">
		</select>
		<span v-if="display_element.total_nums">
			{{conf.current_page}}/共{{get_page_num}}页,&nbsp&nbsp&nbsp&nbsp共{{conf.data_num}}条
		</span>
	</div>
	<ul class="pagination">
		<li>
		  <a class="btn" v-on:click="change_page(conf.current_page-1)" aria-label="Previous">
		  <span aria-hidden="true">&laquo;</span>
		 </a>
		</li>
		<li v-for="page in get_page_list"><a v-bind:class="page==conf.current_page?'btn active':'btn'" v-on:click="change_page(page)">{{page}}</a></li>
		<li>
		 <a class="btn" v-on:click="change_page(conf.current_page+1)" aria-label="Next">
		   <span aria-hidden="true">&raquo;</span>
		 </a>
		</li>
	</ul>
</div>


</template>
<script>
export default {
  name: 'pagination',
  data () {
    return {
      num_list: [10, 20, 30, 50, 100],
      firstData: (this.conf.current_page - 1) * this.conf.per_page + 1
    }
  },
  props: {
    conf: {
      type: Object,
      default () {
        return {
          current_page: 1,
          show_pages: 5,
          per_page: 10,
          page_num: 10,
          data_num: 100
        }
      }
    },
    display_element: {
      type: Object,
      default () {
        return {
          select: true,
          total_nums: true,
          pages: true
        }
      }
    }
  },
  methods: {
    change_page: function (num) {
      if (num > this.conf.page_num) {
        this.conf.current_page = this.conf.page_num
      } else if (num < 1) {
        this.conf.current_page = 1
      } else {
        this.conf.current_page = num
      }
      this.firstData = (this.conf.current_page - 1) * this.conf.per_page + 1
      this.sendMsg()
    },
    sendMsg: function () {
      this.$emit('updateData', 'lalalalal')
    }
  },
  computed: {
    get_page_list: function () {
      let startNum = this.conf.current_page
      let maxNum = this.conf.page_num
      let pageShowNum = this.conf.show_pages
      let returnArray = []
      if (maxNum <= pageShowNum) {
        for (let i = 1; i < maxNum + 1; i++) {
          returnArray.push(i)
        }
      } else if ((maxNum - startNum) <= (pageShowNum - 1)) {
        startNum = maxNum - (pageShowNum - 1)
        for (let i = 0; i < pageShowNum; i++) {
          returnArray.push(startNum + i)
        }
      } else {
        for (let i = 0; i < pageShowNum; i++) {
          returnArray.push(startNum + i)
        }
      }
      return returnArray
    },
    get_page_num: function () {
      let pageNum = Math.ceil(this.conf.data_num / this.conf.per_page)
      this.conf.page_num = pageNum
      let currentPage = Math.ceil(this.firstData / this.conf.per_page)
      this.conf.current_page = currentPage
      return pageNum
    }
  }
}
</script>
<style scoped="scoped">
	.pagination_select{
		width: 75px;
		height: 25px;
		font-size: 16px;
		margin: 5px 5px;
	}
	.pagination-component{
		padding: 5px 0;
		margin: 0;
		height: 50px;
	}
	.pagination{
		float: right;
	}
	.pagination-info{
		float: left;
	}
	ul{
		margin: 0;
	}
	.margin-right{
		margin-right: 30px; 
	}
	a.btn:hover{
		background-color: #ddd;
	}
	.active{
		background-color: #ddd;
		opacity: 0.7;
	}

</style>