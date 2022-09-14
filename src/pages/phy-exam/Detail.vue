<template>
    <view class="detail">
        <!-- 顶部图片 -->
        <image class="img" :src="detailData.image"></image>
        <!-- 数量 -->
        <view class="money">
            <view class="top">
                <text class="price">¥ {{detailData.price}}</text>
                <text class="count">已约 {{detailData.sales}}</text>
            </view>
            <view class="title">{{detailData.title}}</view>
        </view>
        <!-- 内容区域 -->
        <view class="content">
            <!-- 体检时间选择 -->
            <view class="choose-time">
                <view class="choose-title">体检时间选择</view>
                <scroll-view enable-flex scroll-x class="scroll">
                    <view v-for="(item, index) in detailData.date" :key="index" class="scroll-item"
                        :class="{active: currentIndex === index}" @click="clickScrollItem(index,item.date)">
                        <view class="date">{{item.date}}</view>
                        <view class="week">{{item.week}}</view>
                    </view>
                </scroll-view>
            </view>
            <!-- 适用人群 -->
            <view class="people">
                <text>适用人群</text>
                <view class="items">
                    <view v-for="(item, index) in detailData.crowd" :key="index" class="item">
                        <image :src="item.image"></image>
                        <text>{{item.name}}</text>
                    </view>
                </view>
            </view>
            <!-- 表格区域 -->
            <view class="table">
                <view class="table-title">套餐项目</view>
                <view v-for="(item, index) in detailData.project" :key="index">
                    <view class="top-item">{{item.title}}</view>
                    <view class="content-item" v-for="(subItem, subIndex) in item.content" :key="subIndex">
                        <view class="left-item">{{subItem.thing}}</view>
                        <view class="right-item">{{subItem.details}}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 底部 -->
        <view class="footer">
            <text>检测费用: ¥{{detailData.price}}</text>
            <view class="btn" @click="choose">选择成员</view>
        </view>
        <!-- 弹窗 -->
        <page-container @clickoverlay="state.showMask = false" overlay :show="state.showMask" round>
            <block class="mask">
                <view style="text-align:center;padding: 20rpx 0;font-weight: bold;;" class="title">选择成员</view>
                <view class="info" style="display: flex;align-items: center;margin: 30rpx 0;padding-left: 30rpx;">
                    <image style="width:60rpx;height:60rpx;" src="@/static/other/touxiang.svg"></image>
                    <text v-show="store.currentPatient.name"
                        style="margin:0 180rpx 0 50rpx;">{{store.currentPatient.name}}</text>
                    <text style="color:#3e7bee;margin-left: 90rpx;" @click="select">
                        {{store.currentPatient.name ? '请重新选择':'请选择就诊人'}}</text>
                </view>
                <view class="btn" @click="submit"
                    style="padding: 15rpx;text-align:center;background-color:#3e7bee;color:#fff;margin: 30rpx auto;width: 90%;border-radius: 10rpx;">
                    提交预约
                </view>
            </block>
        </page-container>
    </view>
</template>
<script lang="ts" setup>
import { request } from "@/api/request";
import { onLoad } from "@dcloudio/uni-app";
import { reactive, toRefs } from "vue";
import { IPhyDetail } from '../../my-type';
import { usePatientStore } from "../../store/patientStore";
const store = usePatientStore();
// 状态数据
const state = reactive({
    detailData: {} as IPhyDetail,
    currentIndex: -1,
    showMask: false
})
// 提交的表单数据
const form = reactive({
    phy_name: '',
    phy_time: '',
    patient_id: ''
})
onLoad((option) => {
    getDetail(option._id as string)
})
// 根据id获取数据
const getDetail = async (id: string) => {
    const res: any = await request('/phydateil?id=' + id)
    state.detailData = res.data[0]
}
// 点击scroll-item
const clickScrollItem = (index: number, date: string) => {
    state.currentIndex = index
    form.phy_time = date
}
// 点击选择成员
const choose = () => {
    state.showMask = true
}
// 遮罩层选择成员
const select = () => {
    uni.navigateTo({
        url: '/pages/my-service/my-patient/my-patient'
    })
}
// 提交预约
const submit = async () => {
    form.phy_name = detailData.value.title
    form.patient_id = store.currentPatient._id
    uni.showLoading({
        title: '提交中....'
    })
    try {
        const res: any = await request('/resphy', form, 'POST')
        if (res.msg === "提交成功") {
            uni.showToast({
                title: '预约成功',
                icon: 'success'
            })
            // 跳转到预约成功的页面
            setTimeout(() => {
                uni.redirectTo({
                    url: '/pages/my-service/phy-exam/phy-exam'
                })
            }, 500);
        }
        uni.hideLoading()
    } catch (e) {
        uni.hideLoading()
    }
}
// 解构数据
const { detailData, currentIndex } = toRefs(state)
</script>
<style scoped lang="scss">
.detail {
    .img {
        display: block;
        width: 100vw;
        height: 300rpx;
    }

    .money {
        height: 130rpx;
        background-color: #fff;
        padding: 15rpx;

        .top {
            display: flex;
            justify-content: space-between;

            .price {
                color: #ef7952;
                font-weight: bold;
            }
        }

        .title {
            margin-top: 20rpx;
            font-weight: bold;
            font-size: 32rpx;
        }
    }

    .content {
        background-color: #f7f7f7;
        padding: 15rpx 15rpx 150rpx;

        .choose-time {
            background-color: #fff;
            padding: 15rpx;
            height: 200rpx;
            box-sizing: border-box;

            .choose-title {
                font-weight: bold;
                font-size: 30rpx;
                height: 40rpx
            }

            .scroll {
                box-sizing: border-box;
                margin-top: 20rpx;
                width: 100%;
                height: 140rpx;
                background-color: #fff;
                display: flex;
                white-space: nowrap;
                flex-wrap: nowrap;

                .scroll-item {
                    margin-right: 15rpx;
                    // background-color: pink;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100rpx;
                    padding: 0 40rpx;

                    &.active {
                        background-color: #3e7bee;
                        color: #fff;
                    }
                }
            }
        }

        .people {
            margin-top: 40rpx;
            height: 230rpx;
            background-color: #fff;

            text {
                line-height: 40rpx;
                font-weight: bold;
                margin-left: 35rpx;

            }

            .items {
                display: flex;
                align-items: center;

                .item {
                    margin-top: 40rpx;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;


                    image {
                        width: 80rpx;
                        height: 80rpx;
                    }

                    text {
                        font-weight: normal;
                        font-size: 28rpx;
                        margin-top: 15rpx;
                        margin-left: 0;
                    }

                }
            }
        }

        .table {
            margin-top: 20rpx;
            background: #fff;
            padding: 15rpx;

            .table-title {
                font-weight: bold;

            }

            .top-item {
                height: 80rpx;
                background-color: #f0f2f7;
                line-height: 80rpx;
                text-align: center;
                margin: 15rpx 0;
                border-radius: 10rpx;
            }

            .content-item {
                display: flex;
                margin-bottom: 15rpx;

                .left-item {
                    width: 30%;
                    background-color: #f0f2f7;
                    margin-right: 15rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10rpx;
                }

                .right-item {
                    border-radius: 10rpx;
                    width: 70%;
                    background-color: #f0f2f7;
                    padding: 10rpx;
                    font-size: 28rpx;
                }
            }
        }
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100vw;
        height: 130rpx;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: 0 15rpx;
        align-items: center;

        text {
            color: #ef7952;
            font-weight: bold;
        }

        .btn {
            background-color: #2c79f6;
            color: #fff;
            padding: 15rpx 45rpx;
            border-radius: 10rpx;
            margin-right: 40rpx;
        }
    }

    .mask {
        .title {
            text-align: center;
            font-weight: bold;
        }

        .info {
            display: flex;

            image {
                width: 20rpx;
                height: 20rpx;
            }
        }
    }
}
</style>