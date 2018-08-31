<template>
	<div class="addPage">
		<div class="header">
			<h4 style="text-indent: 2em;line-height: 60px;">修改信息</h4>
		</div>
		<div class="write-info">
			<div style="text-align: center;" v-if="headImgShow" @click="selectFile()">
				<Avatar icon="person" size="large" />
			</div>
			<div style="text-align: center;" v-else @click="selectFile()">
				<Avatar :src="headImg" size="large" />
			</div>
			<input type="file" id="file" @change="getFilePath($event)" style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;"/> 
			<Form ref="formValidate" :model="memberInfo" :rules="ruleValidate" :label-width="80" style="padding: 20px;">
				<FormItem label="用户名称:" prop="memberName">
					<Input placeholder="输入用户名称" v-model="memberInfo.memberName"></Input>
				</FormItem>
				<FormItem label="手机号码" prop="phoneNumber">
					<Input placeholder="输入手机号码" v-model="memberInfo.phoneNumber"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>

<script>
	import Qs from 'qs'
	export default{
		data(){
			return{
				memberInfo:{
					memberName:		'',
					phoneNumber:	''
				},
				ruleValidate:{
					memberName:[{
						required: true, message: '成员名称不能为空', trigger: 'blur'
					}],
					phoneNumber:[
						{required: true, message: '手机号码', trigger: 'blur'},
	                    { pattern: /^1[34578]\d{9}$/, message: '您的手机号码输入错误', trigger: 'blur'}
                    ]
				},
				headImgShow:true,
				headImg:'',
				photoUrl:''
			}
		},
		mounted(){
			axios({
				method:'get',
				url:server+'sys/user/userInfo?token='+localStorage.getItem('token'),
			}).then(res=>{
				if (res.data.code == 0) {
					this.memberInfo.memberName = res.data.data.username
					this.memberInfo.phoneNumber = res.data.data.mobile
					if (res.data.data.photoUrl == null || res.data.data.photoUrl == '' ) {
						this.headImgShow = true
					} else{
						this.headImgShow = false
						this.headImg = res.data.data.photoUrl
					}
				} else{
					$Message.error(res.data.msg)
				}
			})
		},
		methods:{
			selectFile(){
				$("#file").trigger("click");
			},
			getFilePath(event){
				
				let formdata = new FormData();
				
   				formdata.append('file',event.target.files[0]);
   				
   				formdata.append('token',localStorage.getItem('token'))
   				
   				axios({
   					method:'post',
   					url:'http://192.168.46.92:7010/upload/sysUserAvatar',
   					data:formdata,
   					headers:{
   						'Content-Type': 'multipart/form-data'
   					}
   				}).then(res=>{
   					if (res.data.code == 0) {
   						this.headImg = res.data.fileUrl
   						console.log(this.headImg)
   						this.photoUrl = res.data.filePath
   					}
   				})
				
				this.headImgShow = false
			},
			handleSubmit(name){
				var th = this
				this.$refs[name].validate((valid) => {
					if (valid) {
                    	axios({
                    		method:'post',
                    		url:server+'sys/user/updateUserInfo',
                    		data:Qs.stringify({
                    			name:		th.memberInfo.memberName,
                    			mobile:		th.memberInfo.phoneNumber,
                    			photoUrl:	th.photo_url
                    		}),
                    		headers:{
                    			"Content-Type":"application/x-www-form-urlencoded",
                    			"token":localStorage.getItem('token')
                    		}
                    	}).then(res=>{
                    		if (res.data.code == 0) {
                    			this.$Message.success('修改成功')
                    			//this.$router.push({path:'/signin'})
                    		} else{
                    			this.$Message.error(res.data.msg)
                    		}
                    	})
                    } else {
                        this.$Message.error('信息填写错误');
                    }
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.addPage {
		width: 100%;
		height: auto;
		border: 1px solid rgb(243, 243, 243);
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		background-color: white;
	}
	
	.addPage .header {
		width: 100%;
		height: 60px;
		line-height: 60px;
		background-color: rgb(243, 243, 243);
	}
	
	.addPage .write-info {
		width: 50%;
		margin: 20px 20%;
		height: auto;
		margin-bottom: 25px;
	}
	label{
		margin-bottom: 0px;
	}
</style>