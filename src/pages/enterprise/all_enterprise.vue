<template>
    <section class="panel-main" :style="styles">
        <el-row class="toolbar toolbar-top">
            <div class="f-left">
                <label>认证状态：</label>
                <el-select size="small" v-model="enterprise_status" placeholder="请选择" @change="filterEnterprise">
                    <el-option v-for="(item,index) in enterprise_statuses" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
                <label style="padding-left:10px;">企业角色：</label>
                <el-select size="small" v-model="enterpriseCurType" placeholder="请选择" @change="filterEnterprise">
                    <el-option v-for="(item,index) in enterpriseTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
            </div>
            <div class="f-right">
                <el-input size="small" v-model="filterKeyword" placeholder="请输入关键字" icon="circle-cross" @focus="filterOnfocus = true" @blur="filterOnfocus = false" @click="clearFilter"></el-input>
                <el-button size="small" type="primary" @click="filterEnterprise"><i class="el-icon-search"></i> 查询</el-button>
                <el-button size="small" type="primary" @click="dialogVisibleAddNew = true"><i class="iconfont icon-plus"></i> 新增</el-button>
            </div>
        </el-row>
        <el-row :span="24">
            <el-table :data="list" class="table-list">
                <el-table-column type="index" label="序号" width="90"></el-table-column>
                <el-table-column prop="code" label="企业编号"></el-table-column>
                <el-table-column prop="name" label="企业名称"></el-table-column>
                <el-table-column prop="type" label="企业角色">
                    <template slot-scope="scope">
                        <span>{{entType[scope.row.type] ? entType[scope.row.type] : '未知'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area" label="所属区域"></el-table-column>
                <el-table-column prop="status" label="认证状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 2 ? 'success' : (scope.row.status == 3 ? 'danger':(scope.row.status == 1 ? 'warning':'default'))" close-transition>{{enterpriseStatus[scope.row.status] ? enterpriseStatus[scope.row.status] : '未知'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="140">
                    <span>
                        <span class="table-btn health" @click.stop="checkView(row)">企业详情</span>
                        <span class="table-btn danger" @click.stop="deleteEnterprise(row)">删除</span>
                    </span>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pageTotal > 0" class="toolbar" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-size="pageSize" :total="pageTotal"></el-pagination>
        </el-row>
        <!-- 对话框 -->
        <el-dialog size="tiny" title="新增企业" v-model="dialogVisibleAddNew" @close="cancelAddEnterprise('addForm')" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="90px">
                <el-form-item label="企业角色" prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择企业角色">
                        <el-option v-for="(item,index) in enterpriseTypes" :label="item.label" :value="item.value" :key="index" v-if="item.value !== 0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入企业名称"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" prop="area" v-if="addForm.role === 4">
                    <el-input v-model="addForm.area" placeholder="请输入所属区域"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEnterprise('addForm')" type="primary">确 认</el-button>
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
                enterprise_status:0,
                enterprise_statuses:[
                    {label:'全部',value:0},
                    {label:'创建中',value:1},
                    {label:'已认证',value:2},
                ],
                entType:ABS_TYPE['enterprise'] ? ABS_TYPE['enterprise'] : {},
                enterpriseStatus:ABS_STATUS['enterprise'] ? ABS_STATUS['enterprise'] : {},
                enterpriseCurType:'2,3,4,5,6',
                enterpriseTypes:[
                    {label:'全部',value:'2,3,4,5,6'},
                    {label:'集团公司',value:'2'},
                    {label:'项目公司',value:'4'},
                    {label:'融资客户',value:'3'},
                    {label:'合作方',value:'5,6'}
                ],
                curPage:1,
                pageSize:10,
                pageTotal:0,
                list:[],
                dialogVisibleAddNew:false,
                addForm:{
                    name:'',
                    role:'2',
                    area:'',
                    principal:'',
                    position:''
                },
                rules:{
                    name:[
                        {required:true,message:'企业名称不能为空',trigger: 'change'}
                    ],
                    area:[
                        {required:true,message:'所属区域不能为空',trigger: 'change'}
                    ]
                }
            } 
        },
        mixins:[Common,Enterprise],
        methods: {
            // 列表当前页改变
            pageCurrentChange(val){
                this.curPage = val;
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:this.enterpriseCurType});
            },
            // 列表条数改变
            pageSizeChange(val){
                this.pageSize = val;
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:this.enterpriseCurType});
            },
            // 过滤列表
            filterEnterprise(){
                if(this.curPage === 1){
                    this.getEnterpriseList({status:parseInt(this.enterprise_status),type:this.enterpriseCurType});
                }else{
                    this.curPage = 1;
                    this.getEnterpriseList({status:parseInt(this.enterprise_status),type:this.enterpriseCurType,filter:true});
                }
            },
            // 清空查询
            clearFilter(type){
                this.filterKeyword = '';
                this.getEnterpriseList({status:parseInt(this.enterprise_status),type:this.enterpriseCurType});
            },
            // 查看详情
            checkView(row){
                this.saveStorageState([
                    {attr:'set_menu_type',val:true,type:'boolean'},
                    {attr:'enterpriseId',val:row.id,type:'number'},
                    {attr:'enterpriseType',val:row.type,type:'number'},
                    {attr:'enterpriseName',val:row.name,type:'string'},
                    {attr:'enterpriseIdChange',val:true,type:'boolean'}
                ]);
                this.$router.push({ path: '/pages/all_enterprise/views'});
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
                    val:2,
                    type:'number'
                });
                self.getEnterpriseList({status:parseInt(self.enterprise_status),type:self.enterpriseCurType});
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

