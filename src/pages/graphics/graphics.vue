<template>
    <view class="graphics">
        <!-- 头部 -->
        <view class="header">
            <view class="title">请详细描述你的病情</view>
            <textarea v-model="form.illness" :maxlength="-1" placeholder-class="plc"
                placeholder="为了更好获得医生帮助，请尽可能详细秒描述病情" />
        </view>
        <!-- 是否需要 -->
        <view class="need">
            <checkbox-group @change="checkboxClick">
                <checkbox style="transform:scale(0.7)" />
            </checkbox-group>
            <text>需要医生知道用药</text>
        </view>
        <!-- 上传照片 -->
        <view class="upload">
            <view class="title">上传检查报告或患者照片</view>
            <view>
                <view v-for="(item, index) in imgList" :key="index">
                    <image :src="item"></image>
                    <image @click="delImg(item)" class="del" src="@/static/other/shanchu-goods.svg"></image>
                </view>
                <view class="upload-img" @click="uploadImg"></view>
            </view>
        </view>
        <!-- 选择就诊人 -->
        <view class="choose">
            <view class="choose-title">选择就诊人</view>
            <view class="choose-content">
                <image src="@/static/other/touxiang.svg"></image>
                <text class="patient">{{state.name}}</text>
                <text @click="choosePatient">{{state.name ? '重新选择就诊人' : '选择就诊人'}}</text>

            </view>
        </view>
        <!-- footer -->
        <view class="footer">
            <view class="item" @click="cancel">取消</view>
            <view class="item" @click="submit">提交</view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import { request } from '@/api/request';
import { onShow } from "@dcloudio/uni-app";
import { usePatientStore } from "../../store/patientStore";
const store = usePatientStore();
// 定义状态数据
const state = reactive({
    imgList: [] as string[],
    name: ''
})
// 提交的表单数据
const form = reactive({
    illness: '',
    guide: false,
    ins_report: [] as string[],
    patient_id: ''
})
// 复选框的点击事件
const checkboxClick = (e: any) => {
    form.guide = e.detail.value.length === 1 ? true : false
}
// 图片上传
const uploadImg = () => {
    uni.chooseMedia({
        count: 1,
        success: async (res: any) => {
            // 上传后台
            uni.showLoading({ title: '上传中...', mask: true })
            uni.uploadFile({
                url: 'https://meituan.thexxdd.cn/api/upload_picture',
                filePath: res.tempFiles[0].tempFilePath,
                name: 'file',
                formData: {

                },
                success: (res222: any) => {
                    if (res222.statusCode === 200) {
                        state.imgList.push(JSON.parse(res222.data).data)
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
// 删除图片
const delImg = (item1: string) => {
    state.imgList = state.imgList.filter(item => item !== item1)
}
// 选择就诊人
const choosePatient = () => {
    uni.navigateTo({
        url: '/pages/my-service/my-patient/my-patient'
    })
}
// 点击取消
const cancel = () => {
    uni.navigateBack()
}
// 提交事件
const submit = async () => {
    form.ins_report = state.imgList
    uni.showLoading({ title: '提交中..', mask: true })
    try {
        const res: any = await request('/graphics', form, 'POST')
        if (res.msg === '提交成功') {
            uni.showToast({
                title:'提交成功'
            })
            setTimeout(()=>{
                uni.navigateBack()
            },500)
        }
        uni.hideLoading()
    } catch (e) {
        uni.hideLoading()
    }
}
// 生命周期
onShow(() => {
    form.patient_id = store.currentPatient._id
    state.name = store.currentPatient.name
})
// 解构数据
const { imgList } = toRefs(state)
</script>
<style scoped lang="scss">
.graphics {
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #f7f7f7;
    padding: 0 10rpx 160rpx 10rpx;

    .header {
        box-sizing: border-box;
        padding: 15rpx;
        height: 300rpx;
        background-color: #fff;

        .title {
            font-weight: bold;
            // padding: 10rpx 0;
            height: 70rpx;
        }

        textarea {
            height: 230rpx;
            // background-color: #fed;
            width: 100%;
            white-space: normal;
            overflow-y: scroll;
            font-size: 26rpx;
        }

        ::v-deep.plc {
            color: #00c8c8;
            font-size: 28rpx;
        }
    }

    .need {
        margin-top: 25rpx;
        height: 100rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        font-size: 28rpx;
    }

    .upload {
        box-sizing: border-box;
        padding: 15rpx;
        margin: 20rpx 0;
        background: #fff;

        // height: 300rpx;
        .title {
            font-weight: bold;
        }

        view {
            margin: 15rpx 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            view {
                position: relative;

                image {
                    display: block;
                    height: 180rpx;
                    width: 180rpx;
                    margin-right: 20rpx;
                }

                .del {
                    position: absolute;
                    right: 3rpx;
                    top: 3rpx;
                    width: 35rpx;
                    height: 35rpx;

                }
            }

            .upload-img {
                position: relative;
                height: 180rpx;
                width: 180rpx;
                background-color: #eee;

                // margin-top: 15rpx;
                &::before,
                &::after {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    content: ' ';
                    width: 80rpx;
                    height: 6rpx;
                    background-color: #ccc;
                }

                &::after {
                    width: 6rpx;
                    height: 80rpx;
                }
            }
        }

    }

    .choose {
        box-sizing: border-box;
        padding: 15rpx;
        margin: 20rpx 0;
        background: #fff;
        height: 190rpx;

        .choose-title {
            font-weight: bold;
        }

        .choose-content {
            padding: 25rpx 25rpx 0;
            display: flex;
            align-items: center;
            position: relative;

            image {
                width: 100rpx;
                height: 100rpx;
            }

            .patient {
                margin: 0 50rpx 0 5rpx;
                color: #000;
            }

            text {
                font-size: 28rpx;
                color: #3d79e7;

                &:nth-child(2) {
                    margin-left: 50rpx;
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
        align-items: center;

        .item {
            width: 280rpx;
            height: 80rpx;
            line-height: 80rpx;
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
}
</style>