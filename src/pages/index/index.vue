<template>
	<SKIndex  v-if="state.showSku"/>
	<view class="home">
		<!-- 自定义导航栏  采用固定定位 -->
		<view
			:style="{paddingTop: state.paddingTop + 'px',height: state.height + 'px','line-height': state.height + 'px'}"
			class="title">惠康诊所</view>
		<!-- 顶部背景图 -->
		<image style="width: 100vw;" mode="widthFix"
			src="https://diancan-1252107261.cos.accelerate.myqcloud.com/yiliao/nav-yiyu.png" />
		<view class="content">
			<!-- 疫苗预约 -->
			<view class="vaccine">
				<view v-for="(item, index) in vaccineArr" :key="index" @click="vaccineClick(item)" class="vaccine-item">
					<image style="width:60rpx;height: 60rpx;margin-bottom: 25rpx;" :src="item.image"></image>
					<text>{{item.title}}</text>
				</view>
			</view>
			<!-- 挂号和体检 -->
			<view class="reserve">
				<view class="reserve-item" v-for="(item, index) in reserveArr" @click="reserve(item.title)"
					:key="index">
					<view class="reserve-item-title">{{item.title}}</view>
					<view class="reserve-item-desc">{{item.describe}}</view>
					<image class="reserve-img" :src="item.image"></image>
				</view>
			</view>
			<!-- 热门挂号 -->
			<view class="popular">
				<view class="popular-header">
					<view class="popular-title">热门挂号</view>
					<view class="more">
						<text @click="reserve('')">查看更多</text>
						<image src="@/static/other/gengduo.svg"></image>
					</view>
				</view>
				<view class="popular-list">
					<view :style="{background: item.background}" class="popular-item"
						v-for="(item, index) in popularArr" :key="index"
						@click="clickPop(item.dep_id)"
						>
						<text>{{item.title}}</text>
						<image :src="item.image"></image>
					</view>
				</view>
			</view>
			<!-- 健康自测 -->
			<view class="self-test" v-if="self_testArr.length > 0">
				<view class="self-test-title">健康自测</view>
				<!-- 抑郁测评 -->
				<view class="sad" @click="sadTest(self_testArr[0].name)">
					<view class="sad-title">{{self_testArr[0].name}}</view>
					<view class="desc">{{self_testArr[0].describe}}</view>
					<view class="detail">
						<text style="font-size:34rpx;color:#000;">{{self_testArr[0].number_of_people}}</text>
						<text>人测过 /{{self_testArr[0].question}}题 /{{self_testArr[0].minute}}分钟</text>
					</view>
					<image :src="self_testArr[0].image"></image>
				</view>
				<!-- 男性功能测评和失眠程度测评 -->
				<view class="cards">
					<view class="card" 
					v-for="(item, index) in self_testArr.slice(1)" :key="index"
					@click="sadTest(item.name)"
					>
						<view class="card-title">{{item.name}}</view>
						<view class="time">{{item.question}}题 / {{item.minute}}分钟</view>
						<view class="count"><text style="font-size:34rpx;color:#000;">172</text> 人测过</view>
						<image :src="item.image"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { request } from '../../api/request'
import { onMounted, reactive, toRefs } from 'vue';
import { vaccineObj, reserveObj, popularObj, self_testObj } from '../../my-type';
import SkuIndex from '../../Skeleton/SK-index.vue'
import SKIndex from '../../Skeleton/SK-index.vue'
// 状态相关的数据
const state = reactive({
	showSku:true,
	paddingTop: 0,
	height: 0,
	// vaccine疫苗预约 reserve挂号和体检 popular热门挂号 self_test健康自测
	vaccineArr: [] as vaccineObj[],
	reserveArr: [] as reserveObj[],
	popularArr: [] as popularObj[],
	self_testArr: [] as self_testObj[]
})
// 获取首页的全部数据
const getHomeData = async () => {
	const res: any = await request('/frontpage');
	state.showSku = false
	state.vaccineArr = res.data[0].vaccine
	state.reserveArr = res.data[1].reserve
	state.popularArr = res.data[2].popular
	state.self_testArr = res.data[3].self_test
}
// 点击新馆疫苗的点击事件
const vaccineClick = (item: vaccineObj) => {
	if (item.title === '新冠疫苗') {
		uni.navigateTo({
			url: '/pages/xinguan-vaccine/xinguan-vaccine'
		})
	}
	if (item.title === 'HPV疫苗') {
		uni.navigateTo({
			url: '/pages/hpv-vaccine/hpv-vaccine'
		})
	}
	if (item.title === '核酸检测') {
		uni.navigateTo({
			url: '/pages/nucleic-acid/nucleic-acid'
		})
	}
	if (item.title === '图文咨询') {
		uni.navigateTo({
			url: '/pages/graphics/graphics'
		})
	}
}
// 点击预约挂号或者健康体检
const reserve = (title: string) => {
	if (title === '健康体检') {
		uni.navigateTo({
			url: '/pages/phy-exam/phy-exam'
		})
	}else{
		uni.switchTab({
			url: '/pages/registered/registered'
		})
	}
}
// 点击抑郁测评
const sadTest = (title: string) => {
	uni.navigateTo({
		url: '/pages/self-test/topic?title=' + title
	})
}
// 点击热门挂号的item
const clickPop = (dep_id:string)=>{
	uni.navigateTo({
		url: `/pages/doctor/doctor?dep_id=${dep_id}`
	})
}
onMounted(() => {
	// 获取胶囊按钮的位置
	let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
	state.paddingTop = menuButtonInfo.top;
	state.height = menuButtonInfo.height;
	// 获取首页数据
	getHomeData()
})


// 结构state里面的数据
const { vaccineArr, reserveArr, popularArr, self_testArr } = toRefs(state)
</script>

<style scoped lang="scss">
.home {
	.title {
		position: fixed;
		padding-left: 20rpx;
		color: #fff;
		// line-height: 64rpx;

	}

	.content {
		padding: 0 10rpx;

		.vaccine {
			height: 200rpx;
			display: flex;
			align-items: center;

			.vaccine-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 28rpx;
			}
		}

		.reserve {
			height: 216rpx;
			display: flex;
			justify-content: space-between;

			.reserve-item {
				position: relative;
				box-sizing: border-box;
				padding: 0 20rpx;
				width: 48%;
				height: 100%;
				border-radius: 20rpx;

				.reserve-item-title {
					margin: 15rpx 0;
					font-size: 38rpx;
				}

				.reserve-item-desc {
					color: #fff;
					font-size: 28rpx;
				}

				.reserve-img {
					position: absolute;
					right: 20rpx;
					bottom: 0;
					width: 150rpx;
					height: 120rpx;
				}

				&:nth-child(1) {
					background-image: linear-gradient(to right, #d8defc, #6da3f8);
					color: #064cf5;
				}

				&:nth-child(2) {
					background-image: linear-gradient(to right, #fadcb9, #f7c87f);
					color: #ce6828;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.popular {
			.popular-header {
				font-size: 32rpx;
				font-weight: bold;
				height: 120rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.more {
					height: 100%;
					display: flex;
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
					}
				}
			}

			.popular-list {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.popular-item {
					border-radius: 10rpx;
					margin-bottom: 15rpx;
					width: 32%;
					height: 116rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					font-size: 26rpx;

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}

		.self-test {
			background-color: #f9f9f9;

			.self-test-title {
				background-color: #fff;
				font-size: 32rpx;
				height: 120rpx;
				line-height: 120rpx;
				font-weight: bold;
			}

			.sad {
				box-sizing: border-box;
				padding-top: 30rpx;
				padding-left: 15rpx;
				position: relative;
				margin-top: 5rpx;
				background-color: #fff;
				height: 266rpx;

				image {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 200rpx;
					height: 250rpx;
				}

				.sad-title {
					font-size: 30rpx;
				}

				.desc {
					font-size: 28rpx;
					color: rgb(141, 136, 136);
					margin: 20rpx 0;
				}

				.detail {
					margin-top: 30rpx;
					font-size: 26rpx;
					color: rgb(141, 136, 136);
				}

			}

			.cards {
				margin-top: 15rpx;
				display: flex;
				height: 266rpx;
				justify-content: space-between;

				.card {
					box-sizing: border-box;
					padding-top: 30rpx;
					padding-left: 15rpx;
					position: relative;
					border-radius: 10rpx;
					height: 100%;
					width: 48%;
					background-color: #fff;

					image {
						position: absolute;
						right: 10rpx;
						bottom: 0;
						width: 150rpx;
						height: 170rpx;
					}

					.card-title {
						font-size: 30rpx;
					}

					.time {
						font-size: 28rpx;
						color: rgb(141, 136, 136);
						margin: 20rpx 0;
					}

					.count {
						margin-top: 20rpx;
						font-size: 26rpx;
						color: rgb(141, 136, 136);
					}
				}
			}
		}
	}
}
</style>
