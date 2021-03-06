export default {
    data(){
        return{}
    },
    methods: {
        //应付单据列表
        getAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });
            let params = {
                curPage:self.currentPage,
                pageSize:self.pageNum,                
            };

            if(self.state > 0){
                params.state = self.state
            }

            if(options&&options.productCompanyName){
                params.productCompanyName = options.productCompanyName;
            }
            if(options&&options.state){
                params.state = options.state
            }
            self.onHttp({
                method:'GET',
                path:'/orderReceipts/list',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    self.list = response.data.list;
                    self.pageTotal = response.data.total;
                    self.pages = response.data.pages;
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //获取发票
        getReceipts(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageNum
            }
            if(options&&options.orderReceiptsId){
                params.orderReceiptsId = options.orderReceiptsId
            }
            self.onHttp({
                method:'GET',
                path:'/invoice/list',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    self.list.forEach((val,index)=>{
                        self.$set(val,'fp_list',response.data.list);
                        let fp_sum = 0;
                        val.fp_list.forEach(val=>{
                            fp_sum += val.money;
                        })
                        self.$set(val,'fp_sum',fp_sum);
                    })                    
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //确认融资
        confirmFinancing(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });
            self.onHttp({
                method:'POST',
                path:'/orderReceipts/financing',
                params:{
                    orderReceiptsIds:options.orderReceiptsIds?options.orderReceiptsIds:'',
                }
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    self.$message.success('融资成功');
                    self.getAssetsList();
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //台账列表
        getStandingBookList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){
                if(options.loanBeginTime){
                    params.loanBeginTime = options.loanBeginTime
                }

                if(options.loanEndTime){
                    params.loanEndTime = options.loanEndTime
                }

                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }

                if(options.publishBeginTime){
                    params.publishBeginTime = options.publishBeginTime
                }

                if(options.publishEndTime){
                    params.publishEndTime = options.publishEndTime
                }

                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }
                if(options.status === ''){
                    params.status = 0
                }else{
                    params.status = options.status
                }
            }
                
            self.onHttp({
                method:'GET',
                path:'/assets/list',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },
        //待审核资产列表
        factorMayVerifyAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){
                
                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }
                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }
            }
                
            self.onHttp({
                method:'GET',
                path:'/assets/factorMayVerifyAssetsList',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //待分配资产列表
        factorMayFenPeiAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){                

                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }

                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }
            }
            self.onHttp({
                method:'GET',
                path:'/assets/factorMayFenPeiAssetsList',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //待放款资产列表
        factorMayFangKuanAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){                

                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }

                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }
            }
                
            self.onHttp({
                method:'GET',
                path:'/assets/factorMayFangKuanAssetsList',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //待发行资产列表
        factorMayFaXingAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){               

                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }                

                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }
            }
                
            self.onHttp({
                method:'GET',
                path:'/assets/factorMayFaXingAssetsList',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //待放款资产列表SPV
        spvMayFangKuanAssetsList(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });

            let params = {
                curPage:self.currentPage,
                pageSize:self.pageSize
            }

            if(options){
                
                if(options.receiveableMoneyBeginTime){
                    params.receiveableMoneyBeginTime = options.receiveableMoneyBeginTime
                }

                if(options.receiveableMoneyEndTime){
                    params.receiveableMoneyEndTime = options.receiveableMoneyEndTime
                }              

                if(options.submitBeginTime){
                    params.submitBeginTime = options.submitBeginTime
                }
                if(options.submitEndTime){
                    params.submitEndTime = options.submitEndTime
                }
                
                if(options.keyword){
                    params.keyword = options.keyword
                }                
            }
                
            self.onHttp({
                method:'GET',
                path:'/assets/spvMayFangKuanAssetsList',
                params:params
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    if(data){
                        if(Util.isArray(data.list)){
                            self.propertyList = data.list;
                            self.pageTotal = data.total;
                            self.pages = data.pages;
                        }
                    }           
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //应付单据确认
        orderReceiptsMakeSure(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/orderReceipts/makeSure',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已确认成功');
                    self.getAssetsList();       
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产审核
        assetsVerify(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/factorCheckAndGenProtocol',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已通过审核');
                    self.factorMayVerifyAssetsList(self.params);      
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产分配 
        assetsDistribute(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            

            self.onHttp({
                method:'POST',
                path:'/assets/factorDistributeAssets',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已分配');
                    self.factorMayFenPeiAssetsList(self.params);    
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产发行
        assetsPublish(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/factorPublishAssets',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已发行');
                    self.factorMayFaXingAssetsList(self.params);      
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产审核 => 保理商
        factorCheckAssets(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/factorCheckAssets',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已通过审核');
                    self.factorMayVerifyAssetsList(self.params);     
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产审核 => spv
        spvCheckAssets(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/spvCheckAssets',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已通过审核');
                    self.factorMayVerifyAssetsList(self.params);      
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //确认放款 => 保理商
        capitalLoan(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/capitalLoan',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已放款成功');
                    // self.spvMayFangKuanAssetsList(self.params); 
                    self.factorMayFenPeiAssetsList(self.params)     
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //确认放款 => SPV
        spvLoan(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });            
                
            self.onHttp({
                method:'POST',
                path:'/assets/spvLoan',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                    self.$message.success('已放款成功');
                    self.spvMayFangKuanAssetsList(self.params);        
                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        },

        //资产详情
        getAssetsDetail(options){
            const self = this;
            self.$nprogress.start();

            self.setState({
                attr:'onLoading',
                val:true
            });          
                
            self.onHttp({
                method:'GET',
                path:'/assets/detail',
                params:options
            },(response)=>{
                self.$nprogress.done();
                self.setState({
                    attr:'onLoading',
                    val:false
                });
                if(response.code > 0){
                    const data = response.data;
                   

                    switch(options.type){
                        case 1:
                            self.list = [];
                            self.list.push(data.orderReceipts);
                            break;
                        case 2:
                            self.list = [];
                            self.list.push(data.assets)  

                            self.list.forEach(val=>{
                                let date1 = new Date(val.receiveableMoneyEndTime)
                                let date2 = new Date(val.submitTime)
                                let date3 = new Date(val.loanTime)
                                let date4 = new Date(val.publishTime)
                                val.receiveableMoneyEndTime = date1.Format('yyyy-MM-dd hh:mm:ss');     
                                val.submitTime = date2.Format('yyyy-MM-dd hh:mm:ss'); 
                                val.loanTime = date3.Format('yyyy-MM-dd hh:mm:ss'); 
                                val.publishTime = date4.Format('yyyy-MM-dd hh:mm:ss'); 
                            })                                 

                            break;
                        case 3:
                            self.list = data.orderReceiptsList;
                            break;
                        case 4:
                            let obj = {};
                            let list = [];
                            list = data.protocolList;
                            list.forEach((val,index)=>{
                                obj[val.protocolName] = val;
                            })
                            console.log(obj)
                            break;
                        default:
                            break;
                    }

                }else{
                    self.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            });
        }

    }
}