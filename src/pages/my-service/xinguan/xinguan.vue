<template>
    <view class="order">
        <view v-if="coviduserOrder.length" class="card" v-for="(item, index) in coviduserOrder" :key="index">
            <view class="name">{{item.name}}</view>
            <view class="address">接种地点:{{item.address}}</view>
            <view class="company">疫苗厂商: {{item.company}}</view>
            <view class="time">接种时间: {{item.time}} {{item.period}}</view>
            <view @click="cancel(item)" v-if="item.cancel" class="btn can-btn">取消预约</view>
            <view v-else class="btn has-btn">已取消预约</view>
        </view>
        <NoData v-else />
    </view>
</template>
<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import { request } from "@/api/request";
import { ICoviduserORder } from '../../../my-type'
import { reactive, toRefs } from "vue";
import NoData from "@/components/NoData.vue";
const state = reactive({
    coviduserOrder: [] as ICoviduserORder[]
})
onShow(() => {
    getData()
})
// 获取订单数据
const getData = async () => {
    const res: any = await request('/coviduser_order', {}, 'GET')
    if (res.msg === 'SUCCESS') {
        state.coviduserOrder = res.data
    }
}
// 取消预约
const cancel = async (item: ICoviduserORder) => {
    const res:any = await request('/covidcancel?_id=' + item._id, {}, 'GET')
    if (res.msg === 'SUCCESS') {
        item.cancel = !item.cancel
    }
    
}
// 解构数据
const { coviduserOrder } = toRefs(state)
</script>
<style scoped lang="scss">
.order {
    min-height: 100vh;
    background-color: #ddd;
    padding: 20rpx;

    .card {
        margin-bottom: 30rpx;
        position: relative;
        box-sizing: border-box;
        padding: 10rpx;
        height: 340rpx;
        border-radius: 10rpx;
        background-color: #fff;

        .name {
            font-size: 28rpx;
            font-weight: bold;
            padding: 13rpx 0;
            border-bottom: 1rpx solid #eee;
        }

        .address {
            padding: 10rpx 0;
            font-size: 28rpx;
        }

        .company {
            padding: 10rpx 0;
            font-size: 28rpx;
        }

        .time {
            padding: 10rpx 0;
            font-size: 28rpx;
        }

        .btn {
            font-size: 26rpx;
            padding: 10rpx 20rpx;
            position: absolute;
            right: 30rpx;
            bottom: 20rpx;
            border: 1rpx solid #4679d9;
            color: #4679d9;
            border-radius: 15rpx;

            &.has-btn {
                color: #ccc;
                border: 1rpx solid #ccc;
            }
        }
    }
}
</style>