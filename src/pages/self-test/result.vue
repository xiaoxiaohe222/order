<template>
    <SkuResult v-if="state.showSku" />
    <view v-else class="result">
        <view class="title">结果分析</view>
        <view class="desc">本测试结果有AI得出，仅供参考，不能作为诊断及治疗的依据</view>
        <view class="card">
            <view class="card-tile">{{data.scope}}: {{data.result}}</view>
            <view class="card-desc">{{data.suggest}}</view>
            <view class="card-info">
                <view class="card-info-tile">测评结果概述:</view>
                <view class="item" v-for="(item, index) in data.outline" :key="index">{{index+1}}.{{item}}</view>
            </view>
            <view class="recomm">
                <view class="recomm-title">AI为你推荐以下科室:</view>
                <view class="recomm-item" v-for="(item, index) in data.recommend" :key="index">
                    <view class="cat">{{item.dep_name}}</view>
                    <view class="hospital">{{item.hospital}}</view>
                    <view class="btn" @click="toGuahao">去挂号</view>
                </view>
            </view>
        </view>
        <!-- footer -->
        <view class="footer">
            <button style="height: 80rpx;font-size: 32rpx;" class="footer-item" open-type="share">邀请朋友测一测</button>
            <view class="footer-item" @click="reTry">再测一次</view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import SkuResult from '../../Skeleton/SK-self-test-result.vue'
import { request } from "@/api/request";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive, toRefs } from "vue";
import { IResult } from '../../my-type';
// 状态数据
const state = reactive({
    showSku: true,
    data: {} as IResult,
    url: '',
    value: [] as string[],
    resUrl: ''
})
onLoad((option) => {
    state.url = option.resUrl as string
    state.value = JSON.parse(option.value as string)
    getResult(JSON.parse(option.value as string), option.resUrl as string)

})
onShow(() => {
    if (state.data.scope) return
    getResult(state.value,state.url)
})
// 获取查询结果
const getResult = async (value: string[], url: string) => {
    try {
        const res: any = await request(`${url}`, { value: value }, 'GET')
        console.log(res.data[0])
        state.showSku = false
        state.data = res.data[0]
    } catch (e) { }
}
// 点击再测一次
const reTry = () => {
    let title = ''
    if (state.url === '/depression') title = '抑郁评测专业版'
    if (state.url === '/premature') title = '男性功能测评'
    if (state.url === '/insomnia') title = '失眠程度测评'
    uni.redirectTo({
        url: '/pages/self-test/topic?title=' + title
    })
}
// 点击去挂号
const toGuahao = () => {
    uni.switchTab({
        url: '/pages/registered/registered'
    })
}
// 解构数据
const { data } = toRefs(state)
</script>
<style scoped lang="scss">
.result {
    min-height: 100vh;
    background-image: linear-gradient(to bottom, #d9e8fd, #f3f6f8);
    padding: 15rpx 15rpx 150rpx;
    box-sizing: border-box;

    .title {
        font-size: 32rpx;
        font-weight: bold;
        padding: 20rpx 0;
    }

    .desc {
        font-size: 26rpx;
    }

    .card {
        padding: 15rpx;
        background-color: #fff;
        margin-top: 40rpx;
        border-radius: 10rpx;

        .card-tile {
            color: #3c72c8;
            font-weight: bold;
        }

        .card-desc {
            color: #3c72c8;
            font-size: 26rpx;
            padding: 20rpx 0;
        }

        .card-info {
            .card-info-tile {
                font-weight: bold;
                font-size: 26rpx;
            }

            .item {
                padding-top: 20rpx;
                font-size: 26rpx;
            }
        }

        .recomm {
            margin-top: 20rpx;


            .recomm-title {
                font-weight: bold;
                font-size: 26rpx;
            }

            .recomm-item {
                position: relative;
                margin-top: 25rpx;
                background-color: #f7fafb;
                padding: 25rpx;
                border-radius: 10rpx;

                .cat {
                    font-weight: bold;
                    font-size: 26rpx;
                }

                .hospital {
                    font-size: 28rpx;
                    color: #ccc;
                }

                .btn {
                    position: absolute;
                    right: 10rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 5rpx;
                    background-color: #4679d9;
                    color: #fff;
                    padding: 10rpx 20rpx;
                    font-size: 26rpx;
                }
            }
        }
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 150rpx;
        width: 100vw;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .footer-item {
            padding: 10rpx 15rpx;
            background-color: #ebf3fd;
            color: #4678d9;
            width: 290rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            border-radius: 8rpx;

            &:nth-child(2) {
                background-color: #4678d9;
                color: #fff;
                margin-right: 25rpx;
            }
        }


    }
}
</style>