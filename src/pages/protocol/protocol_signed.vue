<template>
    <section class="panel-main" :style="styles">
        <el-row class="toolbar toolbar-top">
            <div class="f-left">
                <label>签署日期：</label>
                <el-date-picker
                    v-model="signDate"
                    type="daterange" size='small' class='date-picker'
                    placeholder="选择日期范围"
                    @change='dateChange'>
                </el-date-picker>
            </div>
            <div class="f-right">
                <el-input size="small" v-model="filter_name" placeholder="请输入关键字" icon="circle-cross" @keyup.native.enter='search(filter_name)' @click="clearFilter"></el-input>
                <el-button size="small" type="primary" @click="search(filter_name)"><i class="el-icon-search"></i> 查询</el-button>
            </div>
        </el-row>
        <div class="panel-protocol">
            <el-row :span="24">
                <el-table :data="list" class="table-list">
                    <el-table-column label="序号" width="90">
                        <template slot-scope='scope'>
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="protocolCode" label="协议编号"></el-table-column>
                    <el-table-column prop="protocolName" label="协议名称"></el-table-column>
                    <el-table-column prop="protocolEnterpriseName" label="协议签署方"></el-table-column>
                    <el-table-column prop="protocolAnotherEnterpriseName" label="协议签署对方"></el-table-column>
                    <el-table-column prop="" label="协议接收方"></el-table-column>
                    <el-table-column prop="signTime" label="签署日期"></el-table-column>
                    <el-table-column inline-template :context="_self" label="操作" width="140" align='center'>
                        <span>
                            <span class="table-btn health" @click.stop="checkView(row)">预览</span>
                        </span>
                    </el-table-column>
                </el-table>
                <el-pagination v-if='pageTotal > 0' class="toolbar" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-sizes="[10, 20,50,100]" :page-size="pageSize" :total="pageTotal"></el-pagination>
            </el-row>
        </div>

        <el-dialog size="tiny" title="新增协议" v-model="dialog_add_client" @close="cancelAddClient('add_form')" :close-on-click-modal="false">
            <el-form :model="add_form" :rules="rules" ref="add_form" label-width="90px">
                <el-form-item label="协议类型" prop="role">
                    <el-select v-model="add_form.type" placeholder="请选择协议类型">
                        <el-option v-for="(item,index) in protocolType" :label="item.label" :value="item.value" :key="index" v-if="item.value !== 0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议名称" prop="name">
                    <el-input v-model="add_form.name" placeholder="请输入协议名称"></el-input>
                </el-form-item>
                <el-form-item label='协议签署方' prop="principal">
                    <el-input v-model="add_form.signatory" placeholder="请输入协议签署方"></el-input>
                </el-form-item>
                <el-form-item label="签约日期" prop="position">
                    <el-date-picker
                        v-model="signDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合同到期日" prop="position">
                    <el-date-picker
                        v-model="deadline"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary">确 认</el-button>
                <el-button @click="cancelAddClient('add_form')">取 消</el-button>
            </div>
            <vs-loading :isShow="innerLoading" className="vs-inner-loading"></vs-loading>
        </el-dialog>
    </section>
</template>
<script>
    import Common from '@/mixins/common.js'
    import Protocol from '@/api/protocol/protocol.js'
    export default {
        data() {
            return {
                currentStatus:'',
                pageTotal:0,
                pages:0,
                currentType:0,
                currentPage:1,
                pageSize:10,
                filter_name:'',
                signDate:'',
                protocolStatus:{},
                deadline:'',
                dialog_add_client:false,
                list:[],
                protocolType:[
                    {label:'全部',value:0},
                    {label:'主合同',value:1},
                    {label:'附件',value:2},
                ],
                add_form:{},
                rules:{},
                pickerOptions0: {
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                },
                pickerOptions1: {
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                },
            }
        },
        methods: {
            clientsSizeChange(){

            },
            clientsCurrentChange(){

            },
            checkView(row){
                const self = this;
                sessionStorage.setItem('assetsId',row.assetsId);
                self.$router.push({path:'/pages/protocol_signed/views'});
            },
            clearFilter(type){
                const self = this;
            },
            getclient(){

            },
            cancelAddClient(){
                this.dialog_add_client = false;
            },
            dateChange(e){
                const self = this;
                e = e.replace(/ /g,'');
                let begin = e.substring(0,10);
                let end = e.substring(11,e.length);
                self.getProtocolList({status:2,begin:begin,end:end})
            },
            search(){
                const self = this;
                self.getProtocolList({status:2,keyword:self.filter_name})
            },
            pageSizeChange(e){
                this.pageSize = e;
                this.currentPage = 1;
                this.getProtocolList({status:2});
            },
            pageCurrentChange(e){
                this.currentPage = e;
                this.getProtocolList({status:2});
            },
        },
        watch: {
            
        },
        mixins:[Common,Protocol],
        mounted() {
            const self = this;
            self.getProtocolList({status:2});
            // self.protocolStatus = STATUS.protocolStatus;
        },
        computed: {
            
        },
        components:{
           
        }
    }
</script>
<style>
    .toolbar-top .date-picker.el-input{width: 230px;font-size: 13px;color: #666;text-align: center;}    
</style>