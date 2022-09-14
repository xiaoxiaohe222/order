<template>
    <view class="exam">
        <!-- tab栏 -->
        <view class="tabs">
            <view class="tab" @click="clickTab(item)" v-for="(item, index) in state.navData" :key="index">
                <view>{{(index === 0 && queryForm.type)? queryForm.type : item.query_val}}</view>
                <image
                    :src="item.query_val === '全部'? '../../static/other/shaixuan-jiantou.png':'../../static/other/shaixuan.png'">
                </image>
            </view>
            <!-- 遮罩层 -->
            <Transition>
                <view class="mask" v-show="state.showMask">
                    <view class="filter" v-if="state.navData.length">
                        <view @click="clickMaskItem(item)" v-for="(item, index) in state.navData[0].filter_val"
                            :key="index" class="filter-item">{{item}}
                        </view>
                    </view>
                </view>
            </Transition>
        </view>
        <!-- 列表 -->
        <view class="cards">
            <view class="card" v-for="(item, index) in state.cardData" @click="clickCard(item._id)" :key="index">
                <view class="title">{{item.title}}</view>
                <view class="info">
                    <image :src="item.image"></image>
                    <view class="detail">
                        <view class="detail-title">{{item.be_suit}}</view>
                        <view class="detail-content">{{item.describe}}</view>
                    </view>
                </view>
                <view class="count">
                    <text>已约 {{item.sales}}</text>
                    <text>¥ {{item.price}}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { request } from '@/api/request';
import { onMounted, reactive } from 'vue';
import { IPhyterm, IPhysget } from '../../my-type';
// 定义状态数据
const state = reactive({
    navData: [] as IPhyterm[],
    cardData: [] as IPhysget[],
    showMask: false
})
// 定义筛选查询参数
const queryForm = reactive({
    type: "",
    sales: "",
    price: ''
})
// 生命周期函数
onMounted(() => {
    getAllData()
})
// 获取页面所有数据
const getAllData = async () => {
    const p1 = await request('/phyterm')
    const p2 = await request('/physget')
    const res: any = await Promise.all([p1, p2])
    state.navData = res[0].data
    state.cardData = res[1].data
    queryForm.sales = res[0].data[1].filter_val[0]
    queryForm.price = res[0].data[2].filter_val[0]
}
// 根据条件获得筛选结果
const getDataByQuery = async () => {
    uni.showLoading({ title: '获取中...', mask: true })
    try {
        const res: any = await request('/phyquery', queryForm, 'POST')
        if (res.msg === 'SUCCESS') {
            state.cardData = res.data
        }
    } catch (e) {

    }
    uni.hideLoading()
}
// 点击mask
const clickMaskItem = (item: string) => {
    state.showMask = false
    queryForm.type = item
    getDataByQuery()

}
//点击每个card
const clickCard = (_id: string) => {
    uni.navigateTo({
        url: '/pages/phy-exam/Detail?_id=' + _id
    })
}
// 点击每个tab
const clickTab = (item: IPhyterm) => {
    if (item.query_val === '全部') {
        state.showMask = !state.showMask
    }
    if (item.query_val === '销量') {
        state.showMask = false
        queryForm.sales = queryForm.sales === 'desc' ? 'asc' : 'desc'
        getDataByQuery()
    }
    if (item.query_val === '价格') {
        state.showMask = false
        queryForm.price = queryForm.price === 'desc' ? 'asc' : 'desc'
        getDataByQuery()
    }
}
</script>
<style>
.v-enter-active,
.v-leave-active {
    transition: all 5s linear;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
<style lang="scss" scoped>
@import '../../static/iconfont.css';

.exam {
    min-height: 100vh;
    background-color: #f7f7f7;
    padding-top: 100rpx;
    box-sizing: border-box;

    .tabs {
        position: fixed;
        width: 100vw;
        left: 0;
        top: 0;
        height: 100rpx;
        background-color: #fff;
        display: flex;
        align-items: center;

        .mask {
            position: fixed;
            top: 100rpx;
            left: 0;
            width: 100vw;
            z-index: 99;
            height: calc(100vh - 100rpx);
            background-color: rgba(0, 0, 0, .6);

            .filter {
                background-color: #fff;

                .filter-item {
                    padding: 20rpx 75rpx;
                    font-size: 28rpx;
                }
            }
        }

        .tab {
            height: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            image {
                margin-left: 10rpx;
                width: 30rpx;
                height: 30rpx;
            }


        }
    }

    .cards {
        padding: 0 20rpx 30rpx;

        .card {
            padding: 15rpx;
            background-color: #fff;
            border-radius: 10rpx;
            margin-top: 20rpx;

            .title {
                font-weight: bold;
                font-size: 36rpx;
            }

            .info {
                display: flex;
                padding: 15rpx 0;

                image {
                    width: 170rpx;
                    height: 170rpx;
                    margin-right: 15rpx;
                }

                .detail {
                    flex: 1;

                    .detail-title {
                        font-weight: bold;
                        font-size: 30rpx;
                    }

                    .detail-content {
                        padding-top: 15rpx;
                        color: #ccc;
                        font-size: 28rpx;
                    }
                }
            }

            .count {
                display: flex;
                justify-content: space-between;
                color: #ef7952;
                font-weight: bold;
                margin-top: 15rpx;
            }
        }
    }
}
</style>