<template>
    <view class="login">
        <button @click="getUserProfile">授权登录</button>
        <label class="radio">
            <radio color="#507bd2" checked style="transform: scale(.6)" value="" />我已阅读并同意 <text
                style="color: #507bd2;">用户协议隐私政策</text>
        </label>
    </view>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import {ILogin} from '@/my-type';
import { request } from '@/api/request';
// 登录需要提交的用户信息
const userInfo = reactive<ILogin>({
    appid:'wx7602e2887ca19ff4',
    secret:'32f44c04b68244220bef02432db2be17',
    nickName: '',
    avatarUrl: '',
    code: ''
})
// 获取用户头像信息
const getUserProfile = () => {
    uni.getUserProfile({
        desc: '用户登录',
        success: (res) => {
            userInfo.nickName = res.userInfo.nickName;
            userInfo.avatarUrl = res.userInfo.avatarUrl;
            uni.showLoading({title: '登陆中....',mask:true})
            uni.login({
                success: (res1) => {
                    if (res1.code) {
                        userInfo.code = res1.code
                        // 此时可以发起登录请求
                        loginApi()
                    } else {
                        uni.showToast({
                            title: '登录发生未知错误'
                        })
                    }
                }
            })
        },
        fail:(err)=>{
            uni.showToast({title:'登录失败',icon:'none'})
        }
    })
}
// 登录后台
const loginApi = async()=>{
    const res:any = await request('/wx_login',userInfo,'POST')
    if(res.msg = 'SUCCESS'){
        uni.setStorageSync('token',res.data.user_Token)
        uni.setStorageSync('nickName',res.data.nickName)
        uni.setStorageSync('avatarUrl',res.data.avatarUrl)
        uni.navigateBack()
    }else{
        uni.showToast({
            title: '登录失败',
            icon:'none'
        })
    }
    uni.hideLoading();
}
</script>
<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    background-image: url('https://diancan-1252107261.cos.accelerate.myqcloud.com/yiliao/denglu-yemian.jpg');
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
        width: 248rpx;
        height: 66rpx;
        background-color: #4679d9;
        color: #fff;
        font-size: 28rpx;
        line-height: 66rpx;
    }

    .radio {
        margin-top: 30rpx;
        font-size: 25rpx;
    }
}
</style>