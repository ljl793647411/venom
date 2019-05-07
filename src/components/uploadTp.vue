<template>
	<div>
		<a-spin :spinning="spinning">
			<a-modal
				title="上传预览"
				v-model="visible"
				:closable="false"
				:keyboard="false"
				width="90%"
				style="top: 0"
				:destroyOnClose="true"
				:footer="null"
			>
				<div class="upload-button-box">
					<a-button type="primary" @click="closeUpdateBox">取消</a-button>
					<a-button type="primary" @click="importMsg">确认上传</a-button>
				</div>
				<a-table :columns="columns" :dataSource="tpList" bordered :pagination="false">
					<template v-for="col in ['ldName','bedNo','arrivalTrainNo','arrivalTrainDt','intervalTime','trainNo','remindDt','trainDt','waitDriveType','ticket1']" :slot="col" slot-scope="text, record, index">
						<div :key="col">
							<a-input
								v-if="record.editState"
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChange(e.target.value, index, col)"
							/>
							<template v-else>{{text}}</template>
						</div>
					</template>
					<template slot="update" slot-scope="text, record, index">
						<div class='editable-row-operations'>
							<span v-if="record.editState">
								<a style="margin-right: 20px;" @click="save(index)">保存</a>
								<a-popconfirm title='确定取消编辑么？' @confirm="cancel(index)">
									<a>取消</a>
								</a-popconfirm>
							</span>
							<span v-else>
								<a @click="edit(index)">编辑</a>
							</span>
						</div>
					</template>
				</a-table>
			</a-modal>
    </a-spin>
	</div>
</template>

<script>
	import config from '../assets/config'
	const columns = [{
    title: '序号',
    dataIndex: 'rownum',
		key: 'rownum',
		width: 80,
    align: 'center'
  },
  {
    title: '待乘室名称',
    dataIndex: 'restName',
		width: 150,
    key: 'restName',
    align: 'center' 
  },
  {
    title: '待乘室代码',
    dataIndex: 'restCode',
		width: 150,
    key: 'restCode',
    align: 'center' 
  },
  {
    title: '机务段',
    dataIndex: 'ldName',
		width: 100,
    key: 'ldName',
    scopedSlots: { customRender: 'ldName' },
    align: 'center' 
  },
  {
    title: '铺位号',
    dataIndex: 'bedNo',
		width: 110,
    key: 'bedNo',
    scopedSlots: { customRender: 'bedNo' },
    align: 'center'
  },
  {
		width: 140,
    title: '到达车次', 
    dataIndex: 'arrivalTrainNo',
    key: 'arrivalTrainNo',
    scopedSlots: { customRender: 'arrivalTrainNo' },
    align: 'center'
  },
  {
		width: 140,
    title: '到达时刻', 
    dataIndex: 'arrivalTrainDt',
    key: 'arrivalTrainDt',
    scopedSlots: { customRender: 'arrivalTrainDt' },
    align: 'center'
  },
  {
		width: 140,
    title: '到开间隔', 
    dataIndex: 'intervalTime',
    key: 'intervalTime',
    scopedSlots: { customRender: 'intervalTime' },
    align: 'center'
  },
  {
		width: 140,
    title: '出发车次', 
    dataIndex: 'trainNo',
    key: 'trainNo',
    scopedSlots: { customRender: 'trainNo' },
    align: 'center'
  },
  {
		width: 140,
    title: '叫班时刻', 
    dataIndex: 'remindDt',
    key: 'remindDt',
    scopedSlots: { customRender: 'remindDt' },
    align: 'center'
  },
  {
		width: 140,
    title: '开车时刻', 
    dataIndex: 'trainDt',
    key: 'trainDt',
    scopedSlots: { customRender: 'trainDt' },
    align: 'center'
  },
  {
		width: 100,
    title: '待乘类型', 
    dataIndex: 'waitDriveType',
    key: 'waitDriveType',
    scopedSlots: { customRender: 'waitDriveType' },
    align: 'center'
  },
  {
    title: '餐券', 
    dataIndex: 'ticket1',
		key: 'ticket1',
		width: 80,
    scopedSlots: { customRender: 'ticket1' },
		align: 'center'
  },
  {
    title: '操作', 
    key: 'update',
    scopedSlots: { customRender: 'update' },
    align: 'center',
    width: 250
  }]
	export default {
	  name: 'trainPlan',
	  data () {
	  	return {
				columns,
				formLabelWidth: '120px',
				tpList: [],
				visible: true,
				cacheTpList: [],
				spinning: false
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
				for (let i in this.uploadList) {
					this.$set(this.uploadList[i], 'editState', false)
					this.tpList.push(JSON.parse(JSON.stringify(this.uploadList[i])))
				}
	    });
	  },
	  components: {
			config,
		},
		props: ['uploadList'],

	  methods: {
			handleChange (value, index, attr) {
				this.tpList[index][attr] = value
			},
			edit (index) {
				this.tpList[index].editState = true
			},
			save (index) {
				this.tpList[index].editState = false
			},
			cancel (index) {
				this.tpList[index].editState = false
				this.$set(this.tpList, index, this.uploadList[index])
			},
			uploadSuccess () {
				// let hide = this.$message.loading('正在上传中..', 1);
				this.spinning = true
	  	  this.axios({
	  	  	method: 'post',
	  	  	url: '/api/venom-train/plan/import',
	  	  	data: this.tpList,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
	  	  	var data = response.data
	  	  	if (data.type == 1) {
						this.spinning = false	
						this.$message.success('上传成功')
						this.$emit('uploadSuccess')
	  	  	} else {
						this.$message.error(data.msg, 5)
					}
	  	  }).catch( (error) => {
	  	  })
			},
			closeUpdateBox() {
				let self = this
				this.$confirm({
					title: '是否放弃上传',
					onOk () {
						self.$emit('uploadSuccess')
						self.$message.success('上传取消')
					},
					class: 'test',
				});
			},
			importMsg () {
				let self = this
				this.$confirm({
					title: '本次上传会清除当前全部计划，是否继续',
					onOk () {
						self.$emit('uploadSuccess')
					},
					class: 'test',
				});
			},
	  }
	}
</script>

<style scoped>
	.upload-button-box {
		width: 200px;
		position: fixed;
		top: 20px;
		right: 10%;
		display: flex;
		justify-content: space-around;
		z-index: 99999;
	}
</style>