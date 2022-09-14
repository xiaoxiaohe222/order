<template>
    <view class="my-patient" v-if="state.patientList.length">
        <view @click="choosePatient(item.name,item._id)" v-for="(item, index) in state.patientList" :key="index"
            class="patient-item">
            <view class="top">
                <text>{{item.name}}</text>
                <text>{{item.relation}}</text>
            </view>
            <view class="bottom">
                <text>{{item.sex}}</text>
                <text>{{item.age}}岁</text>
                <text>{{item.phone}}</text>
            </view>
        </view>
    </view>
    <NoData v-else />
    <view class="footer">
        <view class="item" @click="cancel">取消</view>
        <view class="item" @click="addPatient">添加就诊人</view>
    </view>
</template>
<script setup lang="ts">
import { initCustomFormatter, reactive, } from 'vue';
import { onShow } from "@dcloudio/uni-app";
import NoData from '@/components/NoData.vue';
import { request } from '@/api/request';
import { IPatient } from '../../../my-type';
import { usePatientStore } from "../../../store/patientStore";
const store = usePatientStore();
// 定义状态数据
const state = reactive({
    patientList: [] as IPatient[]
})
// 生命周期函数
onShow(async () => {
    const res: any = await request('/get_patient')
    if (res.msg === 'SUCCESS') {
        state.patientList = res.data
    }
})
// 点击添加就诊人
const addPatient = () => {
    uni.navigateTo({
        url: '/pages/my-service/my-patient/add-patient'
    })
}
// 点击取消
const cancel = () => {
    uni.navigateBack()
}
// 选择就诊人
const choosePatient = (name: string, _id: string) => {
    store.savePatient({name,_id})
    setTimeout(() => {
        uni.navigateBack()
    }, 500);
}
</script>
<style scoped lang="scss">
.my-patient {
    min-height: 100vh;
    background-color: #f7f7f7;
    padding: 20rpx 20rpx 160rpx 20rpx;

    .patient-item {
        margin-bottom: 20rpx;
        box-sizing: border-box;
        padding: 15rpx;
        height: 150rpx;
        background-color: #fff;
        border-radius: 10rpx;

        .top {
            text:nth-child(1) {
                font-weight: bold;
                font-weight: 26rpx;
                margin-right: 20rpx;
            }

            text:nth-child(2) {
                background-color: #def1f9;
                font-size: 24rpx;
                padding: 5rpx 15rpx;
                color: #115a79;

            }
        }

        .bottom {
            font-size: 26rpx;
            color: grey;
            margin-top: 25rpx;

            text {
                margin-right: 15rpx;
            }
        }

    }


}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 150rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-evenly;


    .item {
        margin-top: 20rpx;
        font-size: 28rpx;
        width: 250rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        background-color: #eaf2fd;
        color: #3d79e7;
        border-radius: 10rpx;

        &:nth-child(2) {
            background-color: #3d79e7;
            color: #fff;
        }
    }
}
</style>