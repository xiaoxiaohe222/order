// 首页相关的接口
// 疫苗预约接口
export interface vaccineObj {
	image: string,
	title: string
}
// reserve挂号和体检
export interface reserveObj {
	describe: string,
	image: string,
	title: string
}
// popular热门挂号
export interface popularObj {
	background: string,
	dep_id: string,
	image: string,
	title: string
}
// self_test健康自测
export interface self_testObj {
	describe: string,
	image: string,
	minute: number,
	name: string,
	number_of_people: number,
	question: number
}
// 新馆疫苗预约页面接口
export interface IWeek {
	Have: string
	date: string
	day: string
}
export interface ITime {
	end_time: string
	over: number
	start_time: string
	when: number
}
export interface ILasting {
	period: string
	time: ITime[]
}
export interface Inewapptime {
	Hospital?: string
	address?: string
	company?: string[]
	week?: IWeek[]
	lasting?: ILasting[]
}
// 登录接口的参数
export interface ILogin {
	appid: string
	secret: string
	nickName: string
	avatarUrl: string
	code: string
}
// 新冠预约订单的参数
export interface ICoviduserORder {
	name: string
	address: string
	cancel: boolean
	time: string
	company: string
	date: string
	period: string
	_id: string
}
// 宫颈癌预约
export interface ISelect {
	_id: string
	name: string
}
export interface IList {
	_id: string
	describe: string[]
	hpv_id: string
	name: string
	price: string[]
}
// 宫颈癌疫苗提交页面
interface IPackName {
	combo?: string
	combo_id?: string
	time?: string
	time_id?: string

}
export interface IPack {
	_id: string
	name: IPackName[]
	title: string
}
// HPV预约订单的参数
export interface IHpvUserOrder {
	name: string
	combo: string
	ino_time: string
	price: string
	hpv_name: string
	time: string
	address: string
	order_number: string
	cancel: boolean
	_id: string
}
// 核酸检测预约页面
interface INuaDate {
	date: string
	week: string
}
interface INuaStyle {
	title: string
	desc: string[]
}
export interface INua {
	address: string
	boon: string[]
	date: INuaDate[]
	hospital: string
	logo: string
	name: string
	phone: string
	price: number
	style: INuaStyle[]
	_id: string
}
// 核算预约预约订单的参数
export interface INuataUserOrder {
	phy_name: string
	address: string
	name: boolean
	phy_time: string
	time: string
	price: number
	order_number: string
	cancel: boolean
	_id: string
}
// 就诊人信息页面
export interface IPatient {
	name: string
	sex: string
	born: string
	relation: string
	id_card: string
	phone: string
	age: string
	_id: string
}
// 体检预约页面
export interface IPhyterm {
	query_val: string
	filter_val: string[]
}
export interface IPhysget {
	_id: string
	be_suit: string
	describe: string
	image: string
	price: number
	sales: number
	title: string
}
// 体检详情页面
interface ICrowd {
	image: string,
	name: string
}
interface IPhyDetailDate {
	date: string,
	week: string
}
interface IContent {
	thing: string
	details: string
}
interface IProject {
	title: string,
	content: IContent[]
}
export interface IPhyDetail {
	crowd: ICrowd[]
	date: IPhyDetailDate[]
	image: string
	price: number
	project: IProject[]
	sales: number
	title: string
	_id: string
}
// 体检订单页面
export interface IPhyUserOrder {
	address: string
	cancel: boolean
	name: string
	order_number: string
	phy_name: string
	phy_time: string
	price: number
	time: string
	_id: string
}
// 抑郁测试题目页面
interface IDepressionOption {
	son_id: string
	title: string
}
export interface IDepression {
	options: IDepressionOption[]
	topic: string
	_id: string
}
// 测试结果页面
interface IRecom {
	dep_id: string
	dep_name: string
	hospital: string
}
export interface IResult {
	outline: string[]
	recommend: IRecom[]
	result: string
	scope: string
	suggest: string
	_id: string
}
// 视频播放页面
export interface IVideo {
	avatar: string
	controls: boolean
	name: string
	play_but: true
	video_title: string
	video_url: string
	_id: string
}
// 选择医生页面
export interface IDoctorTime{
	date:string
	week:string
	nu_source:number
	dep_id:string
}
export interface IDoctorDoctor{
	_id:string
	avatar:string
	good_at:number
	name:string
	post:string
}