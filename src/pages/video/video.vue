<template>
	<view class="video">
		<view class="item" v-for="(item, index) in state.data" :key="index">
			<view class="title">{{item.video_title}}</view>
			<video @play="play" :id="item._id" objectFit="cover" :src="item.video_url"></video>
			<view class="info">
				<image :src="item.avatar"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view v-if="state.finish" style="padding: 25rpx 0;text-align: center;color: orange;font-weight: bold;">
			无更多数据.....</view>
	</view>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { request } from '@/api/request';
import { IVideo } from '../../my-type';
import { onReachBottom, onShow } from "@dcloudio/uni-app";

// 定义状态数据
const state = reactive({
	page: 0,
	data: [] as IVideo[],
	finish: false,
	videoContext: {} as any,
	vid: ''
})

onMounted(() => {
	getData()
})
// 获取页面数据
const getData = async () => {
	uni.showLoading({ title: '加载中...', mask: true })
	try {
		const res: any = await request('/video_list', { page: state.page }, 'GET')
		uni.hideLoading()
		if (res.data.length === 0) {
			state.finish = true
			return
		}
		state.data = [...state.data, ...res.data]
	} catch (e) {
		uni.hideLoading()
	}
}
// 触底了
onReachBottom(() => {
	state.page++
	getData()
})
// 点击播放的回调
const play = (e: any) => {//视频播放事件
	////这里的vid是视频的id
	let vid = e.currentTarget.id;
	if (state.vid !== vid && Object.keys(state.videoContext).length) {
		////关闭上一个播放的视频
		state.videoContext.stop();
	}
	state.vid = vid;
	//创建控制视频标签的实例对象
	state.videoContext = uni.createVideoContext(state.vid);
}

onShow(() => {
	Object.keys(state.videoContext).length && state.videoContext.stop();
})
</script>

<style scoped lang="scss">
.video {
	min-height: 100vh;
	background-color: #f7f7f7;

	.item {
		background-color: #fff;
		position: relative;

		video {
			width: 100vw;
		}

		.title {
			z-index: 999;
			position: absolute;
			left: 15rpx;
			top: 15rpx;
			right: 15rpx;
			color: #fff;
			font-weight: bold;
		}

		.info {
			display: flex;
			align-items: center;
			background-color: #fff;
			height: 88rpx;
			line-height: 88rpx;
			padding-left: 25rpx;
			font-size: 30rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 25rpx;
			}

		}
	}
}
</style>

