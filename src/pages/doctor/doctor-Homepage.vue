<template>
    <view class="home">
        <!-- 个人简介 -->
        <view class="info">
            <view class="header">
                <image src="@/static/logo.png"></image>
                <view class="detail">
                    <view><text style="font-weight:bold;font-size: 30rpx;">刘爱玲</text> 主任医师</view>
                    <view>云南省第一人民医院</view>
                </view>
            </view>
            <view class="desc">
                擅长儿童神经系统疾病及高位而生发育监测
            </view>
        </view>
        <!-- 预约挂号 -->
        <view class="card">
            <view class="title">预约挂号</view>
            <view class="table">
                <view class="left">
                    <view>日期</view>
                    <view>上午</view>
                    <view>下午</view>
                </view>
                <scroll-view class="scroll" scroll-x enable-flex>
                    <view class="scroll-item" v-for="(item, index) in 8" :key="index">
                        <view class="inner-item">
                            <view>今天</view>
                            <view>09-05</view>
                        </view>
                        <view class="inner-item order" @click="clickItem">预约</view>
                        <view class="inner-item order" @click="clickItem">预约</view>
                    </view>
                </scroll-view>
            </view>
        </view>
        <!-- 提示 -->
        <view class="tips">
            <view class="tip-title">重要提示:</view>
            <view class="tip-item">
                1.本次计算机贷款纠纷降低房价低就快来讲述的落脚点祭祀等飞机的肌肤i级大风记得减肥i极乐世界的肌肤i绝地反击
            </view>
            <view class="tip-item">
                2.本次计算机贷款纠纷降低房价低就快来讲述的落脚点祭祀等飞机的肌肤i级大风记得减肥i极乐世界的肌肤i绝地反击
            </view>
        </view>
        <!-- 弹出层 -->
        <page-container @clickoverlay="clickMask" :show="state.show" class="mask">
            <view class="choose-title">请选择预约时间段</view>
            <view class="time-card">
                <view class="time active">09:00-10:00</view>
                <view class="time">10:00-12:00</view>
            </view>
            <view class="choose-patient">选择成员</view>
            <view class="info">
                <image src="@/static/logo.png"></image>
                <text class="name">章三</text>
                <text class="re-choose">选择成员</text>
            </view>
            <view class="btn">提交预约</view>
        </page-container>
    </view>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { request } from '@/api/request';
import { onLoad } from '@dcloudio/uni-app';

// 定义状态数据
const state = reactive({
    show: false,
    _id: '1fe427876314d7ee000077bd1c17c91f'
})

onLoad(() => {
    // getData()
})
// 获取页面数据
const getData = async () => {
    const res = await request('/doctorhome', { _id: state._id })
    console.log(res)
}
// 点击预约的item
const clickItem = () => {
    state.show = true
}
// 点击遮罩层
const clickMask = () => {
    state.show = false
}
</script>
<style scoped lang="scss">
.home {
    min-height: 100vh;
    background-image: linear-gradient(to bottom, #eaf5fe, #f3f6f8);
    padding: 15rpx;

    .info {
        padding: 15rpx;
        font-size: 28rpx;
        background-color: #fff;

        .header {
            display: flex;

            image {
                width: 110rpx;
                height: 110rpx;
                border-radius: 5rpx;
                margin-right: 20rpx;
            }

            .detail {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        }

        .desc {
            font-size: 26rpx;
            padding-top: 20rpx;
        }
    }

    .card {
        margin-top: 20rpx;
        padding: 15rpx;
        background-color: #fff;
        border-radius: 5rpx;

        .title {
            font-size: 30rpx;
            padding-bottom: 20rpx;
        }

        .table {
            box-sizing: border-box;
            border-left: 1rpx solid #ccc;
            border-top: 1rpx solid #ccc;
            border-right: 1rpx solid #ccc;
            display: flex;
            height: 400rpx;
            // background-color: #def;

            .left {
                box-sizing: border-box;
                border-right: 1rpx solid #ccc;
                width: 100rpx;
                // background-color: pink;
                height: 100%;

                view {
                    box-sizing: border-box;
                    border-bottom: 1rpx solid #ccc;
                    height: 33.33%;
                    text-align: center;
                    line-height: 133.33rpx;
                    font-size: 28rpx;
                }
            }

            .scroll {
                width: calc(100% - 100rpx);
                height: 100%;
                display: flex;
                white-space: nowrap;

                .scroll-item {
                    flex-shrink: 0;
                    box-sizing: border-box;
                    border-right: 1rpx solid #ccc;
                    height: 100%;
                    width: 130rpx;
                    &:last-child{
                        border-right: none;
                    }

                    .inner-item {
                        box-sizing: border-box;
                        border-bottom: 1rpx solid #ccc;
                        box-sizing: border-box;
                        height: 33.33%;
                        text-align: center;
                        font-size: 24rpx;
                        line-height: 133.33rpx;

                        &.order {
                            background-color: #3c78ec;
                            color: #fff;
                            font-size: 26rpx;
                        }

                        &:nth-child(1) {
                            padding-top: 20rpx;
                            line-height: 36rpx;
                        }
                    }
                }
            }
        }
    }

    .tips {
        padding-top: 20rpx;
        font-size: 24rpx;
        color: rgb(73, 69, 69);

        .tip-item {
            padding: 15rpx 0;
        }
    }

    .mask {
        .choose-title {
            font-weight: bold;
            padding: 20rpx 0;
            text-align: center;
        }

        .time-card {
            padding-left: 15rpx;
            display: flex;
            height: 50rpx;

            .time {
                height: 100%;
                padding: 10rpx 20rpx;
                line-height: 50rpx;
                font-size: 24rpx;
                background-color: #fff;
                color: #3c78ec;
                border: 1rpx solid #ccc;

                &.active {
                    background-color: #3c78ec;
                    color: #fff;
                    border: 1rpx solid transparent;
                }
            }
        }

        .choose-patient {
            font-weight: bold;
            padding: 40rpx 0 20rpx;
            text-align: center;
        }

        .info {
            display: flex;
            align-items: center;

            image {
                width: 70rpx;
                height: 70rpx;
                border-radius: 50%;
            }

            .name {
                margin: 0 50rpx;
            }

            .re-choose {
                margin-left: 80rpx;
                color: #3c78ec;
            }
        }

        .btn {
            width: 80%;
            background-color: #3c78ec;
            color: #fff;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            margin: 20rpx auto 35rpx;
            border-radius: 6rpx;
        }

    }
}
</style>