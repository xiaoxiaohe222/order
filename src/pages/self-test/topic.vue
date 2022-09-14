<template>
    <view class="topic">
        <!-- 测评进度 -->
        <view class="progress">
            <text>测评进度</text>
            <view class="bar">
                <view class="inner" :style="{width: per}"></view>
            </view>
            <text>{{currentIndex}}/{{data.length}}</text>
        </view>
        <!-- title -->
        <view class="title" v-if="data[currentIndex]?.topic">{{data[currentIndex].topic}}</view>
        <!-- 单选题 -->
        <view class="radio">
            <view class="name">单选题</view>
            <block v-if="data[currentIndex] && data[currentIndex].options">
                <view hover-class="active" :hover-stay-time="200" class="item" @click="clickItem(item.son_id)" v-for="(item, index) in data[currentIndex].options"
                    :key="index">{{item.title}}
                </view>
            </block>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, toRefs, computed } from "vue";
import { request } from "@/api/request";
import { IDepression } from '../../my-type';
// 定义状态数据
const state = reactive({
    percent: '50%',
    data: [] as IDepression[],
    currentIndex: 0,
    title: ''
})
// 计算属性
const per = computed(() => {
    return (state.currentIndex / state.data.length) * 100 + '%'
})
// 提交的参数
const params = reactive<string[]>([])
onLoad((option) => {
    uni.setNavigationBarTitle({
        title: option.title as string
    });
    state.title = option.title as string;
    let url;
    if (option.title?.includes('抑郁')) { url = '/depression_topics' }
    if (option.title?.includes('男性')) { url = '/premature_topics' }
    if (option.title?.includes('失眠')) { url = '/insomnia_topics' }
    getData(url as string)
})
// 点击单选题
const clickItem = (id: string) => {
    params.push(id)
    state.currentIndex++
    if (state.currentIndex >= state.data.length) {
        uni.showLoading({
            title: '生成结果中....'
        })
        setTimeout(() => {
            uni.hideLoading()
            let resUrl: string = '';
            if (state.title.includes('抑郁')) { resUrl = '/depression' }
            if (state.title.includes('男性')) { resUrl = '/premature' }
            if (state.title.includes('失眠')) { resUrl = '/insomnia' }
            // 此处可能出现未登录状态所以我们需要提前存储参数
            // if(!uni.getStorageSync('token')){
            //     uni.setStorageSync('value',JSON.stringify(params))
            //     uni.setStorageSync('resUrl',resUrl)
            // }
            uni.redirectTo({
                url: '/pages/self-test/result?value=' + JSON.stringify(params)+'&resUrl='+ resUrl
            })
        }, 500);
    }
}
// 获取页面数据
const getData = async (url: string) => {
    try {
        const res: any = await request(url)
        //console.log(res)
        state.data = res.data
    } catch (e) {

    }

}
// 解构数据
const { data, currentIndex } = toRefs(state)
</script>
<style scoped lang="scss">
.topic {
    min-height: 100vh;
    background-image: linear-gradient(to bottom, #d9e8fd, #f3f6f8);
    padding: 15rpx;

    .progress {
        display: flex;
        align-items: center;
        font-size: 30rpx;

        .bar {
            position: relative;
            flex: 1;
            background-color: #eee;
            height: 16rpx;
            margin: 0 40rpx;
            border-radius: 8rpx;
            overflow: hidden;

            .inner {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                background-color: #3c77ed;
                z-index: 99;
            }
        }
    }

    .title {
        margin: 30rpx 0;
        padding: 20rpx 15rpx;
        background-color: #fff;
        border-radius: 10rpx;
        font-size: 30rpx;
    }

    .radio {
        padding: 15rpx;
        margin-top: 20rpx;
        background-color: #f4f8fe;

        .name {
            position: relative;
            font-size: 32rpx;
            padding-left: 20rpx;

            &::before {
                content: ' ';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 6rpx;
                height: 60%;
                background-color: #327ff6;
            }
        }

        .item {
            border-radius: 10rpx;
            background-color: #fff;
            padding: 30rpx 10rpx;
            margin: 20rpx 0;
            font-size: 30rpx;
            &.active{
                background-color: #dce7fb;
                color: #327ff6;
            }
        }
    }
}
</style>