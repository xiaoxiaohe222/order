<template>
	<SkuRegister v-if="state.showSku"/> 
	<view class="register">
		<!-- 左边 -->
		<scroll-view class="scroll-left" scroll-y>
			<view :class="{active: state.leftIndex === index}" class="left-item" v-for="(item, index) in state.leftData"
				:key="index" @click="clickLeftItem(index,item._id)">{{item.dep_ment}}</view>
		</scroll-view>
		<!-- 右边 -->
		<view class="right">
			<view class="right-item" v-for="(item, index) in state.rightData.dep_ment_list" :key="index"
			@click="clickRightItem(item.dep_id)"
			>
				{{item.dep_name}}</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { request } from '@/api/request';
import SkuRegister from '../../Skeleton/SK-registered.vue'
interface IDepart {
	_id: string
	dep_ment: string
}
interface IList {
	dep_id: string
	dep_name: string
}
interface IDepartList {
	_id: string
	dep_ment: string
	dep_ment_list: IList[]
}
// 定义状态数据
const state = reactive({
	showSku:true,
	leftIndex: 0,
	leftData: [] as IDepart[],
	rightData: {} as IDepartList
})
onMounted(() => {
	getLeftData()
})
// 获取左侧数据
const getLeftData = async () => {
	const res: any = await request('/department')
	if (res.msg === 'SUCCESS') {
		state.leftData = res.data
		getRightData(res.data[0]._id)
		state.showSku = false
	}
}
// 获取右侧数据
const getRightData = async (id: string) => {
	const res: any = await request('/reglist', { id })
	if (res.msg === 'SUCCESS') {
		state.rightData = res.data[0]
	}
}
// 点击左边item
const clickLeftItem = (index: number, id: string) => {
	state.leftIndex = index
	getRightData(id)

}
// 点击右侧的item
const clickRightItem = (id:string)=>{
	uni.navigateTo({
		url: `/pages/doctor/doctor?dep_id=${id}`
	})
}
</script>

<style scoped lang="scss">
.register {
	height: 100vh;
	background-color: #eee;
	display: flex;

	.scroll-left {
		width: 200rpx;
		background-color: #eee;
		height: 100%;

		.left-item {
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			font-size: 28rpx;

			&.active {
				background-color: #fff;
				color: #2b5ee1;
			}
		}
	}


	.right {
		flex: 1;
		background-color: #fff;
		height: 100%;
		padding: 25rpx;

		.right-item {
			padding: 25rpx 0;
			font-size: 28rpx;
		}
	}
}
</style>
