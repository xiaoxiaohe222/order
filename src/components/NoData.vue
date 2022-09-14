<template>
    <view class="no-data">
       <image mode="aspectFit" src="@/static/other/kongshuju.jpg"></image>
       <view class="title">暂无数据</view> 
    </view>
</template>
<style scoped lang="scss">
.no-data{
    background-color: #f7f7f7;
    min-height: 100vh;
    image{
        width: 100vw;
    }
    .title{
        text-align: center;
        margin-top: 20rpx;
    }
}
</style>