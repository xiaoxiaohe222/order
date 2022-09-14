<template>
    <view class="hpv-vaccine">
        <!-- 图片 -->
        <image src="https://qita-1252107261.cos.ap-chengdu.myqcloud.com/yiliao/gongjinai.jpg"></image>
        <!-- tabs -->
        <view class="tabs">
            <view class="tab-item" :class="{active: currentTabIndex === index}" @click="tabItemClick(index,item.name)"
                v-for="(item, index) in hpv_select" :key="index">
                <text>{{item.name}}</text>
            </view>
        </view>
        <!-- 列表区域 -->
        <view class="list">
            <view class="item" v-for="(item, index) in comList" :key="index">
                <view class="title">{{item.name}}</view>
                <view class="tags">
                    <text class="tag" v-for="(subItem, subIndex) in item.describe" :key="subIndex">{{subItem}}</text>
                </view>
                <view class="price">¥{{item.price[0]}}-¥{{item.price[1]}}</view>
                <view class="btn" @click="toBuy(item)">去预约</view>
            </view>

        </view>
    </view>
</template>
<script setup lang="ts">
import { reactive, toRefs, onMounted,computed } from 'vue';
import { ISelect, IList } from '../../my-type';
import { request } from '@/api/request';
//状态数据
const state = reactive({
    currentTabIndex: 0,
    kw: '', //进行筛选的关键字
    hpv_list: [] as IList[],
    hpv_select: [] as ISelect[]

})
// 点击tab-item的回调
const tabItemClick = (index: number,name:string) => {
    currentTabIndex.value = index
    state.kw = name === '全部' ? '' : name
}
// 点击去预约
const toBuy = (item:IList) =>{
   uni.navigateTo({
    url:'/pages/hpv-vaccine/hpv-buy?item='+JSON.stringify(item)
   })
}
// onMounted
onMounted(() => {
    getData()
})
// 计算属性
const comList = computed(()=>{
   return hpv_list.value.filter(item => item.name.includes(state.kw))
})
// 获取页面数据
const getData = async () => {
    const res: any = await request('/otuhpv', {}, 'GET')
    if (res.msg === 'SUCCESS') {
        state.hpv_list = res.data[0].hpv_list;
        state.hpv_select = res.data[0].hpv_select
    }
}
//界沟数据
const { currentTabIndex, hpv_list, hpv_select } = toRefs(state)
</script>
<style scoped lang="scss">
.hpv-vaccine {
    image {
        display: block;
        width: 100vw;
        height: 380rpx;
    }

    .tabs {
        height: 100rpx;

        display: flex;
        align-items: center;

        .tab-item {
            position: relative;
            flex: 1;
            height: 100%;
            line-height: 100rpx;
            text-align: center;
            font-size: 30rpx;


            &.active {
                &::after {
                    content: ' ';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50rpx;
                    height: 7rpx;
                    background-color: #327ff6;
                }
            }

        }
    }

    .list {
        background-color: #f7f7f7;
        overflow: hidden;
        padding: 0 20rpx;

        .item {
            position: relative;
            box-sizing: border-box;
            padding: 20rpx;
            height: 210rpx;
            background-color: #fff;
            margin-top: 20rpx;
            border-radius: 10rpx;

            .title {
                font-size: 34rpx;
            }

            .tags {
                margin: 17rpx 0;

                .tag {
                    font-size: 26rpx;
                    padding: 5rpx 10rpx;
                    border-radius: 5rpx;
                    background-color: #f7f7f7;
                    margin-right: 10rpx;
                }
            }

            .price {
                color: #ed693e;
                font-weight: bold;
                margin: 10rpx;
                font-size: 32rpx;
            }

            .btn {
                position: absolute;
                right: 15rpx;
                bottom: 15rpx;
                background-color: #327ff6;
                color: #fff;
                height: 70rpx;
                border-radius: 35rpx;
                line-height: 70rpx;
                padding: 5rpx 35rpx;
            }
        }
    }
}
</style>