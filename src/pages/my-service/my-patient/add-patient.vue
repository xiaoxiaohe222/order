<template>
    <view class="add-patient">
        <!--智能识别 -->
        <view class="id-card" @click="uploadImg">
            <image src="@/static/other/AI-shibie.svg"></image>
            <text>身份证智能识别</text>
        </view>
        <!-- 表单区域 -->
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
                <picker class="choose" mode="selector" @change="bindGenderChange" :range='state.sexArr'>
                    <view v-if="!form.sex">
                        <text>请选择性别&nbsp;</text>
                        <image style="width:40rpx;height:40rpx;" src="@/static/other/gengduo.svg"></image>
                    </view>
                    <view>
                        {{form.sex}}
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>出生日期</text>
                <picker class="choose" mode="date" @change="bindBornChange">
                    <view v-if="!form.born">
                        <text>请选择出生日期&nbsp;</text>
                        <image style="width:40rpx;height:40rpx;" src="@/static/other/gengduo.svg"></image>
                    </view>
                    <view v-else>
                        {{form.born}}
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>成员关系</text>
                <picker class="choose" mode="selector" @change="bindRelationChange" :range='state.relationArr'>
                    <view v-if="!form.relation">
                        <text>请选择与成员关系&nbsp;</text>
                        <image style="width:40rpx;height:40rpx;" src="@/static/other/gengduo.svg"></image>
                    </view>
                    <view>
                        {{form.relation}}
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <text>手机号</text>
                <input type="number" v-model="form.phone" placeholder-class="plc" placeholder="请输入手机号" />
            </view>
        </view>
    </view>
    <view class="footer">
        <view class="item" @click="cancel">取消</view>
        <view class="item" @click="submit">添加就诊人</view>
    </view>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { request } from '@/api/request';
// 定义状态数据
const state = reactive({
    sexArr: ['男', '女'],
    relationArr: ['自己', '父母', '其他']
})
// 定义表单数据
const form = reactive({
    name: '',
    sex: '',
    born: '',
    relation: '',
    id_card: '',
    phone: ''
})
// picker的选择回调
const bindBornChange = (e: any) => {
    form.born = e.detail.value
}
const bindGenderChange = (e: any) => {
    form.sex = state.sexArr[e.detail.value]
}
const bindRelationChange = (e: any) => {
    form.relation = state.relationArr[e.detail.value]
}
// 身份证AI识别
// 图片上传
const uploadImg = () => {
    uni.chooseMedia({
        count: 1,
        success: async (res: any) => {
            // 上传后台
            uni.showLoading({ title: '识别中...', mask: true })
            uni.uploadFile({
                url: 'https://meituan.thexxdd.cn/api/ai_card',
                filePath: res.tempFiles[0].tempFilePath,
                name: 'file',
                formData: {

                },
                success: (res222: any) => {
                    if (res222.statusCode === 200) {
                        if (JSON.parse(res222.data).msg === 'fail') {
                            uni.showToast({ title: '识别失败', icon: 'none' })
                            uni.hideLoading()
                            return
                        }

                        const result = JSON.parse(res222.data).data;
                        form.name = result.name
                        form.sex = result.sex
                        form.born = result.born.replace(/^(\d{4})(\d{2})(\d{2})$/, (a: string, b: string, c: string, d: string) => {
                            return `${b}-${c}-${d}`
                        })
                        form.id_card = result.id_card

                    }
                    uni.hideLoading()
                },
                fail: () => {
                    uni.showToast({ title: '未知错误', icon: 'none' })
                    uni.hideLoading()
                }
            })

        }
    })
}
// 提交按钮事件
const submit = async () => {
    try {
        uni.showLoading({ title: '提交中...', mask: true })
        const res: any = await request('/patient_res', form, 'POST')
        if (res.msg === '提交成功') {
            uni.navigateBack()
        }
        uni.hideLoading()
    } catch (e) {
        uni.hideLoading()
    }

}
// 点击取消
const cancel = () => {
    uni.navigateBack()
}
</script>
<style scoped lang="scss">
.add-patient {
    min-height: 100vh;
    padding: 10rpx 0 160rpx 0;
    background-color: #f7f7f7;

    .id-card {
        height: 120rpx;
        border-radius: 10rpx;
        width: 90%;
        margin: 10rpx auto;
        background-color: #fff;
        display: flex;
        align-items: center;

        image {
            width: 80rpx;
            height: 80rpx;
            margin: 0 15rpx;
        }
    }

    .form {
        background-color: #fff;
        margin-top: 25rpx;

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
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 150rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-evenly;


    .item {
        margin-top: 20rpx;
        font-size: 28rpx;
        width: 250rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        background-color: #eaf2fd;
        color: #3d79e7;
        border-radius: 10rpx;

        &:nth-child(2) {
            background-color: #3d79e7;
            color: #fff;
        }
    }
}
</style>