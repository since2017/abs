<template>
    <section class="panel-main" :style="styles">
        <el-row class="toolbar toolbar-top">
            <div class="f-left">
                <label>企业状态：</label>
                <el-select size="small" v-model="enterprise_status" placeholder="请选择" @change="filterEnterprise">
                    <el-option v-for="(item,index) in enterprise_statuses" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
            </div>
            <div class="f-right">
                <el-input size="small" v-model="filterKeyword" placeholder="请输入关键字" icon="circle-cross" @focus="filterOnfocus = true" @blur="filterOnfocus = false" @click="clearFilter"></el-input>
                <el-button size="small" type="primary" @click="filterEnterprise"><i class="el-icon-search"></i> 查询</el-button>
                <el-button size="small" type="primary" @click="dialogVisibleAddNew = true" v-if="enterprise_type === 1"><i class="iconfont icon-plus"></i> 新增</el-button>
            </div>
        </el-row>
        <el-row :span="24">
            <el-table :data="list" class="table-list">
                <el-table-column type="index" label="序号" width="90"></el-table-column>
                <el-table-column prop="code" label="企业编号"></el-table-column>
                <el-table-column prop="name" label="企业名称"></el-table-column>
                <el-table-column prop="status" label="认证状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 2 ? 'success' : (scope.row.status == 3 ? 'danger':(scope.row.status == 1 ? 'warning':'default'))" close-transition>{{enterpriseStatus[scope.row.status] ? enterpriseStatus[scope.row.status] : '未知'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="140">
                    <span>
                        <span class="table-btn health" @click.stop="checkView(row)">企业详情</span>
                        <span class="table-btn danger" v-if="enterprise_type === 1" @click.stop="deleteEnterprise(row)">删除</span>
                    </span>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pageTotal > 0" class="toolbar" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-size="pageSize" :total="pageTotal"></el-pagination>
        </el-row>
        <!-- 对话框 -->
        <el-dialog size="tiny" title="新增供应商" v-model="dialogVisibleAddNew" @close="cancelAddEnterprise('addForm')" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="90px">
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入企业名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="addEnterprise('addForm')">确 认</el-button>
                <el-button @click="cancelAddEnterprise('addForm')">取 消</el-button>
            </div>
            <vs-loading :isShow="innerLoading" className="vs-inner-loading"></vs-loading>
        </el-dialog>
    </section>
</template>
<script>
    import Common from '@/mixins/common.js'
    import Enterprise from '@/api/enterprise/enterprise.js'
    export default {
        data() {
            return {
                filterOnfocus:false,
                filterKeyword:'',
                enterpriseStatus:ABS_STATUS['enterprise'] ? ABS_STATUS['enterprise'] : {},
                enterprise_status:0,
                enterprise_statuses:[
                    {label:'全部',value:0},
                    {label:'创建中',value:1},
                    {label:'已认证',value:2},
                ],
                enterpriseCurType:'3',
                curPage:1,
                pageSize:10,
                pageTotal:0,
                list:[],
                dialogVisibleAddNew:false,
                enterpriseCurType:'3',
                addForm:{
                    name:'',
                    role:3,
                },
                rules:{
                    name:[
                        {required:true,message:'企业名称不能为空',trigger: 'change'}
                    ]
                }
            } 
        },
        mixins:[Common,Enterprise],
        methods: {
            // 列表当前页改变
            pageCurrentChange(val){
                this.curPage = val;
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:'3'});
            },
            // 列表条数改变
            pageSizeChange(val){
                this.pageSize = val;
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:'3'});
            },
            // 过滤列表
            filterEnterprise(){
                if(this.curPage === 1){
                    this.getEnterpriseList({status:parseInt(this.enterprise_status),type:'3'});
                }else{
                    this.curPage = 1;
                    this.getEnterpriseList({status:parseInt(this.enterprise_status),type:'3',filter:true});
                }
            },
            // 清空查询
            clearFilter(type){
                this.filterKeyword = '';
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:'3'});
            },
            checkView(row){
                this.saveStorageState([
                    {attr:'set_menu_type',val:true,type:'boolean'},
                    {attr:'enterpriseId',val:row.id,type:'number'},
                    {attr:'enterpriseType',val:row.type,type:'number'},
                    {attr:'enterpriseName',val:row.name,type:'string'},
                    {attr:'enterpriseIdChange',val:true,type:'boolean'}
                ]);
                this.$router.push({ path: '/pages/supplier/views' });
            },
            cancelAddEnterprise(formName){
                this.$refs[formName].resetFields();
                this.dialogVisibleAddNew = false;
            },
            enterKeyup(e){
                const self = this;
                const ev = e || window.event;
                if(ev.keyCode == 13){
                    if(self.dialogVisibleAddNew){
                        self.addEnterprise('addForm');
                    }else if(self.filterOnfocus){
                        self.filterEnterprise();
                    }
                }
            }
        },
        mounted() {
            const self = this;
            self.$nextTick(()=>{
                self.saveStorageState({
                    attr:'nav_menu_type',
                    val:4,
                    type:'number'
                });
                self.filterEnterprise({status:parseInt(this.enterprise_status),type:'3',filter:true});
                document.addEventListener("keyup", self.enterKeyup, false);
            });
        },
        watch:{
            
        },
        destroyed() {
            document.removeEventListener("keyup", self.enterKeyup, false);
        }
    }
</script>

