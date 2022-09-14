<template>
    <view class="acid">
        <!-- 头部 -->
        <view class="header">
            <view class="header-top">
                <image :src="NuaData.logo"></image>
                <view>
                    <view class="title">{{NuaData.name}}</view>
                    <view class="price">¥{{NuaData.price}}</view>
                </view>
            </view>
            <view class="tabs">
                <view class="tab" v-for="(item, index) in NuaData.boon" :key="index">
                    <radio style="transform:scale(0.6)" checked></radio>
                    <text>{{item}}</text>
                </view>
            </view>
        </view>
        <!-- 内容区域 -->
        <view class="content">
            <!-- 信息 -->
            <view class="info">
                <view class="info-l">
                    <view class="name">{{NuaData.hospital}}</view>
                    <view class="address">{{NuaData.address}}</view>
                </view>
                <view class="info-r" @click="makePhone(NuaData.phone)">
                    <image style="width:45rpx;height:45rpx;" src="@/static/other/dianhua.svg"></image>
                    <text>电话</text>
                </view>
            </view>
            <!-- 表单 -->
            <view class="form">
                <view class="form-item">
                    <text>真实姓名</text>
                    <input v-model="form.name" placeholder-class="plc" placeholder="请输入真实姓名" />
                </view>
                <view class="form-item">
                    <text>手机号</text>
                    <input v-model="form.phone" type="number" placeholder-class="plc" placeholder="请输入手机号" />
                </view>
                <view class="form-item">
                    <text>身份证</text>
                    <input v-model="form.id_card" type="number" placeholder-class="plc" placeholder="请输入身份证" />
                </view>
            </view>
            <!-- 选择预约时段 -->
            <view class="period">
                <view class="title">选择预约时段</view>
                <scroll-view class="scroll" scroll-x enable-flex>
                    <view class="scroll-item" :class="{active: currentIndex === index}"
                        @click="scrollItemClick(index,item.date)" v-for="(item, index) in NuaData.date" :key="index">
                        <view class="date">{{item.date}}</view>
                        <view class="weekend">{{item.week}}</view>
                    </view>
                </scroll-view>
            </view>
            <!-- 详细描述 -->
            <view class="detail">
                <view class="detail-header-title">银十字采样反噬</view>
                <view class="detail-item" v-for="(item, index) in NuaData.style" :key="index">
                    <text class="detail-title">{{item.title}}</text>
                    <view class="detail-content" v-for="(item1, index1) in item.desc" :key="index1">
                        {{item1}}
                    </view>
                </view>
            </view>
            <!-- 底部 -->
            <view class="footer">
                <text class="fee">检测费用： ¥{{NuaData.price}}</text>
                <text class="btn" @click="submit">提交</text>
            </view>
        </view>

    </view>
</template>
<script lang="ts" setup>
import { reactive, onMounted, toRefs } from 'vue';
import { request } from '@/api/request';
import { INua } from '../../my-type';
// 状态数据
const state = reactive({
    NuaData: {} as INua,
    currentIndex: -1
})
// 需要提交表单数据
const form = reactive({
    name: '',
    phone: '',
    id_card: '',
    time: ''
})
onMounted(() => {
    getData()
})
// 拨打电话
const makePhone = (phone: string) => {
    uni.makePhoneCall({
        phoneNumber: phone
    })
}
// 点击scroll item的回调
const scrollItemClick = (index: number, date: string) => {
    state.currentIndex = index
    form.time = date
}
// 点击提交
const submit = async () => {
    uni.showLoading({ title: '提交中...', mask: true })
    try {
        const res:any = await request('/resnuata', form, 'POST')
        uni.hideLoading()
        uni.navigateTo({
            url: '/pages/my-service/nucleic-acid/nucleic-acid'
        })
    } catch (e) {
        uni.hideLoading()
    }
}
// 获取页面数据
const getData = async () => {
    const res: any = await request('/nuataget', {}, 'GET')
    if (res.msg === 'SUCCESS') {
        state.NuaData = res.data[0]
    }
}
// 解构数据
const { NuaData, currentIndex } = toRefs(state)
</script>
<style scoped lang="scss">
.acid {
    min-height: 100vh;
    background-color: #f7f7f7;

    .header {
        box-sizing: border-box;
        height: 230rpx;
        background-color: #fff;

        .header-top {
            height: 150rpx;
            display: flex;
            align-items: center;

            image {
                padding-left: 25rpx;
                display: block;
                width: 100rpx;
                height: 100rpx;
                margin-right: 15rpx;
            }

            view {
                height: 100rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                    font-size: 34rpx;

                }

                .price {
                    // padding: 20rpx 0 20rpx 150rpx;
                    color: #ed693e;
                    font-weight: bold;
                }
            }
        }


        .tabs {
            font-size: 28rpx;
            display: flex;
            align-items: center;

            .tab {
                text-align: center;
                flex: 1;
            }
        }
    }

    .content {
        padding: 20rpx 20rpx 180rpx;

        .footer {
            box-sizing: border-box;
            padding: 40rpx;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 160rpx;
            background-color: #fff;
            display: flex;
            justify-content: space-between;

            .fee {
                font-weight: bold;
                color: #ed693e;
            }

            .btn {
                box-sizing: border-box;
                padding: 10rpx 55rpx;
                background-color: #2c79f6;
                color: #fff;
                height: 70rpx;
                line-height: 50rpx;
                text-align: center;
                margin-right: 20rpx;
                border-radius: 10rpx;
            }
        }

        .info {
            box-sizing: border-box;
            padding: 15rpx;
            height: 146rpx;
            background-color: #fff;
            border-radius: 12rpx;
            display: flex;
            justify-content: space-between;

            .info-l {
                .name {
                    margin: 10rpx 0;
                }

                .address {
                    font-size: 26rpx;
                    padding-top: 10rpx;
                }
            }

            .info-r {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;

                image {
                    margin: 10rpx 0;
                }

                text {
                    font-size: 26rpx;
                    padding-top: 10rpx;
                }
            }
        }

        .form {
            margin-top: 20rpx;
            background-color: #fff;

            .form-item {
                padding: 0 15rpx;
                height: 120rpx;
                border-bottom: 1rpx solid #eee;
                display: flex;
                font-size: 26rpx;
                align-items: center;

                input {
                    flex: 1;
                    text-align: right;
                }

                ::v-deep .plc {
                    color: #ddd;
                }
            }
        }

        .period {
            border-radius: 10rpx;
            box-sizing: border-box;
            padding: 15rpx;
            margin-top: 20rpx;
            height: 220rpx;
            background-color: #fff;

            .title {
                font-weight: bold;
            }

            .scroll {
                display: flex;
                margin-top: 30rpx;
                width: 100vw;
                white-space: nowrap;
                height: 220rpx;

                .scroll-item {
                    padding: 10px 20rpx 0;
                    height: 110rpx;

                    &.active {
                        background-color: #2c79f6;
                        color: #fff;
                    }

                    .weekend {
                        margin-top: 5rpx;
                    }
                }
            }
        }

        .detail {
            border-radius: 10rpx;
            box-sizing: border-box;
            padding: 15rpx;
            margin-top: 20rpx;
            background-color: #fff;

            .detail-header-title {
                font-weight: bold;
                margin-bottom: 10rpx;
            }

            .detail-item {
                margin: 20rpx 0;
                padding-top: 20rpx;

                .detail-title {
                    font-weight: bold;
                    background-color: #2c79f6;
                    color: #fff;
                    padding: 10rpx 20rpx;
                    border-radius: 15rpx;
                    margin-top: 30rpx;
                }

                .detail-content {
                    padding-top: 30rpx;
                    font-size: 28rpx;
                    line-height: 50rpx;
                }
            }
        }
    }
}
</style>