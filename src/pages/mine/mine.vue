<template>
	<view class="mine">
		<view class="header">
			<image class="avatar" :src="state.avatarUrl ? state.avatarUrl : '../../static/other/touxiang.svg'"></image>
			<view class="name" @click="login">{{state.nickName ? state.nickName : '点击登录'}}</view>
			<view class="tabs">
				<view class="tab">
					<view class="count">5</view>
					<view class="tab-name">健康分</view>
				</view>
				<view class="tab">
					<view class="count">5</view>
					<view class="tab-name">优惠券</view>
				</view>
				<view class="tab">
					<view class="count">8</view>
					<view class="tab-name">消息</view>
				</view>
			</view>
		</view>
		<!-- card -->
		<view class="content">
			<view class="card">
				<view class="card-item" v-for="(item, index) in state.cardData" :key="index">
					<image :src="`../../static/mine/${item.img}.svg`"></image>
					<view class="card-item-title">{{item.title}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive } from 'vue';
// 定义状态数据
const state = reactive({
	nickName: '',
	avatarUrl: '',
	paddingTop: '0px',
	cardData: [
		{ img: 'jiuzhenren', title: '就诊人管理' },
		{ img: 'guahao', title: '我的挂号' },
		{ img: 'xinguanyimiao', title: '新馆疫苗' },
		{ img: 'hpvyimiao', title: 'HPV疫苗' },
		{ img: 'hesuan', title: '核酸检测' },
		{ img: 'tijianbaogao', title: '我的体检' },
	]
})
onLoad(() => {
	// 获取胶囊按钮的位置
	let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
	state.paddingTop = menuButtonInfo.top + menuButtonInfo.height + 'px';
})
onShow(() => {
    state.nickName = uni.getStorageSync('nickName')
    state.avatarUrl = uni.getStorageSync('avatarUrl')
})
// 点击登录
const login = ()=>{
	if(state.nickName)return
	uni.navigateTo({
		url: '/pages/login/login'
	})
}
</script>

<style scoped lang="scss">
.mine {
	.header {
		box-sizing: border-box;
		height: 600rpx;
		background-color: #e3f0fa;
		padding-top: v-bind('state.paddingTop');
		text-align: center;

		.avatar {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}

		.name {
			font-weight: bold;
			padding: 15rpx 30rpx;
		}

		.tabs {
			display: flex;
			margin-top: 50rpx;
			font-size: 26rpx;
			font-weight: bold;

			.tab {
				flex: 1;

				.tab-name {
					margin-top: 15rpx;
				}
			}
		}
	}

	.content {
		padding: 0 20rpx;
		min-height: calc(100vh - 600rpx);
		background-color: #f7f7f7;

		.card {
			transform: translateY(-90rpx);
			font-size: 28rpx;
			padding: 15rpx;
			border-radius: 15rpx;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;

			.card-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 15rpx;

				image {
					width: 50rpx;
					height: 50rpx;
					padding: 15rpx 0;
				}

			}
		}
	}

}
</style>
