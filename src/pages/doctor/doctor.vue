<template>
    <view class="doctor">
        <view class="header">
            <view class="all" :class="{active:state.currentIndex === -1}" @click="clickAll">全部</view>
            <scroll-view enable-flex class="scroll" scroll-x>
                <view class="scroll-item" v-for="(item, index) in state.timeData" :key="index"
                    @click="clickItem(index,item.date)">
                    <text>{{item.date}}</text>
                    <text :class="{active: state.currentIndex === index}" style="margin: 10rpx 0"
                        class="week">{{item.week}}</text>
                    <text>{{item.nu_source === 1 ? '可约' :'无号'}}</text>
                </view>
            </scroll-view>
        </view>
        <!-- 列表区域 -->
        <view class="doctor-list" v-if="state.doctorData.length">
            <view class="doctor-item">
                <image src="@/static/logo.png"></image>
                <view class="info">
                    <text class="name">刘爱玲</text>
                    <text class="job">主任医师</text>
                    <view class="desc">擅长儿童神经系统疾系统疾病系统疾病病及高位并</view>
                </view>
                <view class="btn">预约</view>
            </view>
        </view>
        <NoData v-else />
    </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import { IDoctorTime, IDoctorDoctor } from '../../my-type';
import { request } from '@/api/request';
import NoData from '@/components/NoData.vue';
// 定义状态数据
const state = reactive({
    timeData: [] as IDoctorTime[],
    doctorData: [] as IDoctorDoctor[],
    currentIndex: -1,
    dep_id: ''
})

onLoad((option) => {
    console.log(option.dep_id)
    state.dep_id = option.dep_id as string
    // 获取页面所有数据
    getAllData(option.dep_id as string)
})
// 获取全部数据
const getAllData = async (dep_id: string) => {
    const p1 = request('/timesele', { dep_id })
    const p2 = request('/alldlist', { dep_id })
    const res: any = await Promise.all([p1, p2])
    state.timeData = res[0].data
    state.doctorData = res[1].data
}
// 点击全部两个字
const clickAll = async () => {
    state.currentIndex = -1
    const res:any = await request('/alldlist', { dep_id:state.dep_id })
    if (res.msg === 'SUCCESS') {
        state.doctorData = res.data
    }
}
// 点击item
const clickItem = async (index: number, date: string) => {
    state.currentIndex = index
    console.log(date)
    const res: any = await request('/everydlist', { dep_id: state.dep_id, week: date })
    console.log(res)
    if (res.msg === 'SUCCESS') {
        state.doctorData = res.data
    }

}
</script>
<style scoped lang="scss">
.doctor {
    .header {
        height: 150rpx;
        // background-color: beige;
        display: flex;

        .all {
            width: 130rpx;
            line-height: 150rpx;
            // background-color: pink;
            text-align: center;

            &.active {
                color: #4d86c9;
            }
        }

        .scroll {
            width: calc(100vw - 130rpx);
            height: 100%;
            white-space: nowrap;
            display: flex;

            .scroll-item {
                flex-shrink: 0;
                height: 100%;
                width: 150rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                // background-color: #bfa;
                font-size: 28rpx;

                .week {
                    &.active {
                        color: #4d86c9;
                    }
                }
            }

        }
    }

    .doctor-list {
        margin-top: 20rpx;
        min-height: calc(100vh - 170rpx);
        background-color: #f7f7f7;

        .doctor-item {
            background-color: #fff;
            display: flex;
            align-items: center;
            padding: 20rpx;

            image {
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
            }

            .info {
                box-sizing: border-box;
                margin: 0 10rpx;
                width: calc(100vw - 310rpx);
                display: flex;
                flex-direction: column;

                .job {
                    color: #ccc;
                    font-size: 28rpx;
                }

                .desc {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #ccc;
                    font-size: 28rpx;
                }

            }

            .btn {
                width: 150rpx;
                height: 70rpx;
                border-radius: 35rpx;
                text-align: center;
                line-height: 70rpx;
                color: #4d86c9;
                border: 1rpx solid #4d86c9;
            }
        }
    }
}
</style>