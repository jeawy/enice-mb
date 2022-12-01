<template>
	<view class="ticket-add">
		<uni-forms :label-width="90" ref="form" :modelValue="formData" :rules="rules">
			<uni-forms-item label="名称" name="name">
				<input class="input" v-model="formData.email" type="text" placeholder="请输入名称"
					@input="binddata('name',$event.detail.value)" />
			</uni-forms-item>
			<uni-forms-item label="适用范围" name="range">
				<uni-data-checkbox mode="tag" v-model="formData.range" :localdata="ranges"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item label="适用商品">
				<text class="native-link">请选择</text>
			</uni-forms-item>
			<uni-forms-item label="类型" name="type">
				<uni-data-checkbox mode="tag" v-model="formData.type" :localdata="types"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item label="优惠力度" name="email">
				<view class="group-item">
					满<input class="input" type="number" v-model="formData.email" placeholder=""
						@input="binddata('email',$event.detail.value)" />
					元
				</view>
				<view class="group-item">
					减
					<input class="input" v-model="formData.email" type="number" placeholder=""
						@input="binddata('email',$event.detail.value)" />元
				</view>
			</uni-forms-item>
			<uni-forms-item label="有效时间" name="time">
				<uni-datetime-picker v-model="formData.time" :border="false" type="daterange" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="使用说明" name="reamrk" auto-height>
				<textarea v-model="formData.reamrk" />
			</uni-forms-item>
			<button @click="submit" type='primary'>提交</button>
		</uni-forms>

	</view>
</template>

<script>
	


	export default {
		data() {
			return {
				// 表单数据
				formData: {},
				types: [{
					text: '满减',
					value: 0
				}, {
					text: '折扣',
					value: 1
				}],
				ranges: [{
					text: '指定商品',
					value: 0
				}, {
					text: '通用',
					value: 1
				}],
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入姓名',
							},
							{
								minLength: 3,
								maxLength: 5,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					// 对email字段进行必填验证
					email: {
						rules: [{
							format: 'email',
							errorMessage: '请输入正确的邮箱地址',
						}]
					}
				}
			}
		},
		methods: {
			/**
			 * 复写 binddata 方法，如果只是为了校验，无复杂自定义操作，可忽略此方法
			 * @param {String} name 字段名称
			 * @param {String} value 表单域的值
			 */
			// binddata(name,value){
			// 通过 input 事件设置表单指定 name 的值
			//   this.$refs.form.setValue(name, value)
			// },
			// 触发提交表单
			submit() {
				this.$refs.form.validate().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.uni-forms-item__label {
			padding: 0 30upx;
		}

		.uni-forms-item__content {
			display: flex;
			align-items: center;
			padding-right: 30upx;
		}W

		.uni-data-checklist {
			margin: 0 !important;
		}

		uni-textarea {
			width: 100%;
			height: 120upx;
			padding: 18upx 0;
		}

	}



	.ticket-add {
		.native-link {
			color: #007aff;
		}

		.group-item {
			display: flex;
			align-items: center;

			&:first-of-type {
				padding-right: 15upx;
			}

			&:last-of-type {
				left: 15upx;
			}

			input {
				border: 1px solid #ddd;
				margin: 0 16upx;
			}

		}


	}
</style>
