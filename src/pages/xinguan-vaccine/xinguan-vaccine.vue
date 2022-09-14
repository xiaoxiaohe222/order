<template>
    <view class="vaccine">
        <!-- 表单区域 -->
        <form>
            <view class="form-item">
                <text>姓名</text>
                <input v-model="form.name" placeholder-class="pla" placeholder="请输入姓名" />
            </view>
            <view class="form-item">
                <text>身份证</text>
                <input v-model="form.id_card" type="number" placeholder-class="pla" placeholder="请输入身份证" />
            </view>
            <view class="form-item">
                <text>手机号</text>
                <input v-model="form.phone" placeholder-class="pla" placeholder="请输入手机号" />
            </view>
            <view class="form-item">
                <text>现居地址</text>
                <picker mode="region" @change="bindAddrChange">
                    <view class="detail">
                        <text>{{form.address ? form.address: '请选择现居地址'}}</text>
                        <image src="@/static/other/gengduo.svg"></image>
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>现居详细地址</text>
                <input v-model="form.de_address" placeholder-class="pla" placeholder="请输入现居详细地址" />
            </view>
            <view class="form-item">
                <text>疫苗人群分类</text>
                <picker mode='selector' :range="cateData" @change="bindCateChange">
                    <view class="category">
                        <text>{{form.crowd_sort ? form.crowd_sort: '请选择疫苗人群分类'}}</text>
                        <image src="@/static/other/gengduo.svg"></image>
                    </view>
                </picker>
            </view>
            <!-- 按钮 -->
            <view class="btns">
                <button class="btn" @click="cancel">取消</button>
                <button class="btn" @click.prevent="submit">提交预约</button>
            </view>
        </form>
        <!-- 内容区域 -->
        <view class="content">
            <!-- 诊所信息 -->
            <view class="info">
                <view class="title">{{newapptime.Hospital}}</view>
                <view class="address">{{newapptime.address}}</view>
                <view class="tags">
                    <view class="tag" v-for="(item, index) in newapptime.company" :key="index">{{item}}</view>
                </view>
            </view>
            <!-- 周几有号 -->
            <view class="weekend">
                <view class="weekend-item" :class="{active:currentWeekIndex === index }"
                    v-for="(item, index) in newapptime.week" :key="index" @click="weekClick(item,index)">
                    <view>{{item.day}}</view>
                    <view>{{item.date}}</view>
                    <view>{{item.Have}}</view>
                </view>
            </view>
            <!-- 上午时段 -->
            <view class="morning card" v-for="(item, index) in newapptime.lasting" :key="index">
                <view class="title">{{item.period}}</view>
                <view class="morning-list">
                    <view class="morning-item"
                        :class="{active:currentPeriodIndex === subIndex && currentPeriod ===  item.period}"
                        @click="periodClick(item,subIndex)" v-for="(subItem, subIndex) in item.time" :key="subIndex">
                        <view>{{subItem.start_time}}-{{subItem.end_time}}</view>
                        <view>剩余{{subItem.over}}</view>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue';
import { request } from '@/api/request';
import { Inewapptime, ITime, IWeek, ILasting } from '@/my-type'
// 定义表单数据
const form = reactive({
    name: '',
    id_card: '',
    phone: '',
    address: '',
    de_address: '',
    crowd_sort: '',
    date: '',
    period: '',
    reserve_time: '',
    when: 0
})
// 请求返回的页面数据
const state = reactive<{
    newapptime: Inewapptime,
    currentWeekIndex: number,
    currentPeriod: string
    currentPeriodIndex: number
}>({
    newapptime: {},
    currentWeekIndex: -1,
    currentPeriod: '',
    currentPeriodIndex: -1
})
// 疫苗人群分类数据
const cateData = reactive(['医疗卫生人员', '卫生系统内工作的人员', '对外劳务派遣人员', '留学生', '教育工作者', '其他人员'])

// 获取页面数据
const getNewapptime = async () => {
    const res: any = await request('/newapptime')
    state.newapptime = res.data[0]
}
onMounted(() => {
    getNewapptime()
})
// 取消按钮点击
const cancel = () => {
    uni.navigateBack()
}
// 选择仙居地址的picker
const bindAddrChange = (e: any) => {
    form.address = e.detail.value.join(' ')
}
// 选择疫苗人群的picker
const bindCateChange = (e: any) => {
    form.crowd_sort = cateData[e.detail.value * 1]
}
// 点击周几预约的回调
const weekClick = (item: IWeek, index: number) => {
    form.date = item.date
    currentWeekIndex.value = index
}
// 点击时段的回调
const periodClick = (item: ILasting, subIndex: number) => {
    currentPeriodIndex.value = subIndex
    currentPeriod.value = item.period
    form.period = item.period
    form.reserve_time = item.time[subIndex].start_time + '-' + item.time[subIndex].end_time
    form.when = item.time[subIndex].when
}
// 提交预约
const submit = async () => {
    uni.showLoading({
        title:'提交中....'
    })
    try {
        const res: any = await request('/rescovid', form, 'POST')
        if (res.msg === "提交成功") {
            uni.showToast({
                title: '预约成功',
                icon: 'success'
            })
            // 跳转到预约成功的页面
            uni.navigateTo({
                url: '/pages/my-service/xinguan/xinguan'
            })
        }
        uni.hideLoading()
    } catch (e) {
        uni.hideLoading()
    }
}
// 解构state的数据
const { newapptime, currentPeriod, currentWeekIndex, currentPeriodIndex } = toRefs(state)
</script>
<style scoped lang="scss">
.card {
    height: 220rpx;
    background: #fff;
    margin: 15rpx;
    border-radius: 10rpx;
}

.vaccine {
    .form-item {
        padding: 0 20rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100rpx;
        border-bottom: 1rpx solid #eee;

        input {
            flex: 1;
            text-align: right;
        }

        ::v-deep.pla {
            text-align: right;
            color: #ddd;
        }

        .detail,
        .category {
            display: flex;
            align-items: center;

            image {
                width: 30rpx;
                height: 30rpx;
            }
        }
    }

    .btns {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 180rpx;
        background-color: #fff;
        display: flex;
        align-items: center;

        .btn {
            border: none;
            outline: none;
            height: 88rpx;
            width: 320rpx;

            &:nth-child(1) {
                background-color: #eaf2fd;
                color: #3d79e7;
            }

            &:nth-child(2) {
                background-color: #3d79e7;
                color: #fff;
            }
        }
    }

    .content {
        background-color: #eee;
        overflow: hidden;
        padding-bottom: 180rpx;

        .info {
            height: 220rpx;
            padding: 10rpx;
            border-radius: 10rpx;
            margin: 15rpx;
            background-color: #fff;

            .title {
                font-size: 32rpx;
                padding: 10rpx 0;
                font-weight: bold;
            }

            .address {
                font-size: 30rpx;
                margin: 20rpx 0;
            }

            .tags {
                padding-top: 10rpx;
                display: flex;

                .tag {
                    padding: 5rpx 10rpx;
                    background-color: #f7f7f7;
                    margin-right: 10rpx;
                    font-size: 24rpx;
                }
            }
        }

        .weekend {
            height: 220rpx;
            background: #fff;
            margin: 15rpx;
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .weekend-item {
                margin-right: 20rpx;
                font-size: 30rpx;
                box-sizing: border-box;
                padding: 15rpx 25rpx;
                background-color: #f7f7f7;
                height: 80%;
                margin-left: 15rpx;
                text-align: center;

                view:nth-child(2) {
                    margin: 7rpx 0;
                }

                &.active {
                    background-color: #3d79e7;
                    color: #fff;
                }
            }
        }

        .morning {
            padding: 15rpx;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                margin-bottom: 15rpx;
                overflow: hidden;
            }

            .morning-list {
                padding-top: 20rpx;
                display: flex;

                .morning-item {
                    margin-right: 20rpx;
                    background-color: #f7f7f7;
                    padding: 20rpx 25rpx;
                    border-radius: 10rpx;

                    view:nth-child(2) {
                        margin-top: 10rpx;
                    }

                    &.active {
                        background-color: #3d79e7;
                        color: #fff;
                    }
                }
            }
        }
    }


}
</style>