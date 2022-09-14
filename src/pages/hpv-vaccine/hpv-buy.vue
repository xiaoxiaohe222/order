<template>
    <view class="hpv_buy">
        <!-- 信息展示 -->
        <view class="info" v-if="item.name">
            <view class="name">{{item.name}}</view>
            <view class="price">¥{{item.price[0]}}-¥{{item.price[1]}}</view>
            <view class="tags">
                <view class="tag" v-for="(item1, index) in item.describe" :key="index">{{item1}}</view>
            </view>
        </view>
        <!-- 表单部分 -->
        <view class="form">
            <view class="form-item">
                <text>真实姓名</text>
                <input v-model="form.name" placeholder-class="plc" placeholder="请输入真实姓名" />
            </view>
            <view class="form-item">
                <text>身份证</text>
                <input v-model="form.id_card" placeholder-class="plc" placeholder="请输入身份证" />
            </view>
            <view class="form-item">
                <text>性别</text>
                <picker class="choose" mode="selector" @change="bindGenderChange" :range='state.genderArr'>
                    <view v-if="!form.gender">
                        <text>请选择性别&nbsp;</text>
                        <image style="width:40rpx;height:40rpx;" src="@/static/other/gengduo.svg"></image>
                    </view>
                    <view>
                        {{form.gender}}
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>出生日期</text>
                <picker class="choose" mode="date" @change="bindDateChange">
                    <view v-if="!form.born_date">
                        <text>请选择出生日期&nbsp;</text>
                        <image style="width:40rpx;height:40rpx;" src="@/static/other/gengduo.svg"></image>
                    </view>
                    <view v-else>
                        {{form.born_date}}
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>手机号</text>
                <input type="number" v-model="form.phone" placeholder-class="plc" placeholder="请输入手机号" />
            </view>
        </view>
        <!-- 条目选择 -->
        <view class="choose-list" v-if="hpv_pack.length">
            <view class="choose-item">
                <view class="title">{{hpv_pack[0].title}}</view>
                <view class="choose-tags">
                    <view class="choose-tag" :class="{active: comboIndex === subIndex}"
                        @click="comboClick(subIndex,subItem.combo_id as string,subItem.combo as string)"
                        v-for="(subItem, subIndex) in hpv_pack[0].name" :key="subIndex">
                        {{subItem.combo}}</view>
                </view>
            </view>
            <view class="choose-item">
                <view class="title">{{hpv_pack[1].title}}</view>
                <view class="choose-tags">
                    <view class="choose-tag" :class="{active: timeIndex === subIndex}"
                        @click="timeClick(subIndex,subItem.time_id as string,subItem.time as string)"
                        v-for="(subItem, subIndex) in hpv_pack[1].name" :key="subIndex">
                        {{subItem.time}}</view>
                </view>
            </view>
        </view>
        <!-- 底部按钮 -->
        <view class="footer">
            <text>合计： ¥ {{state.price}}</text>
            <view class="sub-btn" @click="submit">提交</view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { IList, IPack } from "@/my-type";
import { reactive, toRefs, watchEffect } from "vue";
import { request } from "@/api/request";
import { fromBase64 } from "js-base64";
// 定义状态数据
const state = reactive({
    item: {} as IList, //上个页面携带过来的数据
    hpv_pack: [] as IPack[], //本页面的数据
    comboIndex: -1, //套餐名称的索引
    timeIndex: -1,   // 接种时间的索引
    combo_id: '',
    time_id: '',
    price: 0,
    genderArr: ["男", "女"]
})
// 需要提交的表单数据
const form = reactive({
    name: '',
    id_card: '',
    gender: '',
    born_date: '',
    phone: '',
    combo: '',
    ino_time: '',
    price: 0,
    hpv_name: '',
})
onLoad((option) => {
    state.item = JSON.parse(option.item as string);
    form.hpv_name = state.item.name
    console.log(state.item)
    getData()
})
// 获取页面数据
const getData = async () => {
    const res: any = await request('/hpv_pack')
    if (res.msg === 'SUCCESS') {
        console.log(res)
        state.hpv_pack = res.data
    }
}
// 点击疫苗名称的回调
const comboClick = (index: number, combo_id: string, combo: string) => {
    state.comboIndex = index;
    state.combo_id = combo_id
    form.combo = combo
}
// 点击疫苗时间的回调
const timeClick = (index: number, time_id: string, time: string) => {
    state.timeIndex = index;
    state.time_id = time_id
    form.ino_time = time
}
// picker的回调
const bindGenderChange = (e: any) => {
    form.gender = state.genderArr[e.detail.value]
}
const bindDateChange = (e: any) => {
    form.born_date = e.detail.value
}
// 提交
const submit = async () => {
    uni.showLoading({ title: '提交中..', mask: true })
    try {
        const res: any = await request('/reshpv', form, 'POST')
        if (res.msg === '提交成功') {
            uni.redirectTo({
                url: '/pages/my-service/hpv-view/hpv-view'
            })
        }
        uni.hideLoading()
    } catch (e) {
        uni.hideLoading()
    }

}
// 根据点击的疫苗名称和时间请求拿到价格
watchEffect(async () => {
    const data = {
        hpv_id: state.item._id,
        combo_id: state.combo_id,
        time_id: state.time_id
    }
    if (state.combo_id && state.time_id) {
        uni.showLoading({ title: '获价中...', mask: true })
        const res: any = await request('/hpv_price', data, 'POST')
        // console.log(111, res)
        state.price = res.data[0].price
        form.price = res.data[0].price
        uni.hideLoading()
    }
})
// 解构数据
const { hpv_pack, item, comboIndex, timeIndex } = toRefs(state)
</script>
<style scoped lang="scss">
.hpv_buy {
    padding-bottom: 160rpx;
    min-height: 100vh;
    background-color: #f7f7f7;

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100vw;
        height: 160rpx;
        background-color: #fff;
        box-sizing: border-box;
        padding: 40rpx 20rpx;
        display: flex;
        justify-content: space-between;

        text {
            color: #ed693e;
            font-weight: bold;
        }

        .sub-btn {
            background-color: #2c79f6;
            color: #fff;
            padding: 20rpx 50rpx;
            margin-right: 20rpx;
            border-radius: 10rpx;
        }
    }

    .info {
        margin-bottom: 30rpx;
        background-color: #fff;
        position: relative;
        box-sizing: border-box;
        height: 160rpx;
        padding: 20rpx;

        .name {
            font-weight: bold;
            font-size: 34rpx;
        }

        .price {
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #ed693e;
            font-size: 30rpx;
            font-weight: bold;
        }

        .tags {
            margin-top: 15rpx;
            display: flex;

            .tag {
                background-color: #f7f7f7;
                padding: 10rpx;
                margin-right: 10rpx;
                font-size: 24rpx;
            }
        }
    }

    .form {
        background-color: #fff;

        .form-item {
            padding: 0 15rpx;
            display: flex;
            align-items: center;
            height: 120rpx;
            box-sizing: border-box;
            border-bottom: 1rpx solid #eee;

            input {
                flex: 1;
                text-align: right;
            }

            ::v-deep.plc {
                color: #ddd;
            }

            .choose {
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                view {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
            }
        }
    }

    .choose-list {
        padding: 15rpx;
        margin-top: 20rpx;
        background-color: #fff;

        .choose-item {
            margin-bottom: 20rpx;



            .title {
                font-weight: bold;
            }

            .choose-tags {
                display: flex;
                margin-top: 25rpx;
                flex-wrap: wrap;

                .choose-tag {
                    padding: 15rpx 25rpx;
                    background-color: #f7f7f7;
                    margin-right: 15rpx;
                    font-size: 30rpx;

                    &.active {
                        background-color: #2c79f6;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>