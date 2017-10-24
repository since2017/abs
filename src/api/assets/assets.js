export default {
    data(){
        return{}
    },
    methods: {
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
            if(options&&options.orderReceiptsIds){
                params.orderReceiptsIds = options.orderReceiptsIds
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
                        self.$set(val,'fp_list',response.data.list)
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
                    console.log('response:',response)                  
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