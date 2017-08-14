import Vue from 'vue'
import Router from 'vue-router'
import InputQuestion from '@/components/InputQuestion'
import UserManagement from '@/components/UserManagement'
import paperList from '@/components/paperList'
import ImageClip from '@/components/ImageClip'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/inputQuestion',
      name: 'InputQuestion',
      component: InputQuestion
    },
    {
      path: '/userManagement',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/imageUpload',
      name: 'ImageUpload',
      component: ImageClip
    },
    {
      path: '/questionList',
      name: 'questionList',
      component: paperList
    }
  ]
})
