module.exports = function ( app ) {
    app.get('/seller_attention',function(req,res){
        if(req.session.user){
            res.render('seller_attention');
        }else{
            res.redirect('login');
        }
    });

    /*将新关注的信息id发送到数据库*/
    app.get('/seller_attention/:id',function(req,res){
        if(req.session.user){
            var sell_attention = global.dbHelper.getModel('sell_attention');
            sell_attention.findOne({"uid":req.session.user._id,"sell_id": req.params.id}, function (error, doc) {
                if (error) {
                    // res.json('网络异常错误！');
                    console.log(error);
                    // console.log(0);
                } else if (doc) {
                    // res.json('关注信息已存在！');
                    res.json(1)
                    // console.log(1);
                } else {
                    sell_attention.create({
                        sell_id: req.params.id,
                        uid: req.session.user._id,
                        createDate:new Date()
                    }, function (error, doc) {
                        if (error) {
                            console.log(error);
                            // console.log(2);
                        } else {
                            res.json(3);
                            // console.log(3);
                        }
                    })
                }
            })
        }else{
            res.redirect('login');
        }
        
    });

    /*计算数据库有多少商品信息*/
    app.get('/seller_attention_count',function(req,res){
        if(req.session.user){
            var sell_attention = global.dbHelper.getModel('sell_attention');
            sell_attention.count({"uid":req.session.user._id},function (err,doc) {
                if (err) {
                    console.log(err);
                } else{
                    // console.log(doc);
                    res.json(doc);
                }
            })
        }else{
            res.redirect('login');
        }
    })

    /*页面加载时，数据返回*/
    app.get('/seller_attention_data',function(req,res){
        if(req.session.user){
            var sell_attention = global.dbHelper.getModel('sell_attention');
            var buy_release = global.dbHelper.getModel('buy_release');
            sell_attention.find({"uid":req.session.user._id},{"sell_id":1,"_id":0},function (err,doc) {
                if (err) {
                    console.log(err);
                } else{
                    var arr = [];
                    for (var i = 0; i < doc.length; i++) {
                        arr[i] = doc[i].sell_id;
                    }
                    // console.log(arr);
                    buy_release.find({"_id":{"$in":arr}},{"brand":1,"kind":1,"needVolume":1,"hasBuy":1,"min_deal":1,
                    "unit_price":1,"unit":1,"jiaohuo_start":1,"jiaohuo_end":1,"address":1},{sort:{date:-1},limit:2},function (error, doc) {
                        if (error) {
                            console.log(error);
                            // console.log(0);
                        }else{
                            res.json(doc);
                            // console.log(doc);
                        }
                    });
                }
            })
        }else{
            res.redirect('login');
        }
        
    });

    /*查询数据分页显示*/
    app.get('/seller_attention_page/:page',function(req,res){
        if(req.session.user){
            var page = parseInt(req.params.page);
            var sell_attention = global.dbHelper.getModel('sell_attention');
            var buy_release = global.dbHelper.getModel('buy_release');
            sell_attention.find({"uid":req.session.user._id},{"sell_id":1,"_id":0},function (err,doc) {
                if (err) {
                    console.log(err);
                } else{
                    var arr = [];
                    for (var i = 0; i < doc.length; i++) {
                        arr[i] = doc[i].sell_id;
                    }
                    buy_release.find({"_id":{"$in":arr}},{"brand":1,"kind":1,"needVolume":1,"hasBuy":1,"min_deal":1,
                    "unit_price":1,"unit":1,"jiaohuo_start":1,"jiaohuo_end":1,"address":1},{sort:{date:-1},limit:2,skip:2*(page-1)},function (error, doc) {
                        if (error) {
                            console.log(error);
                            // console.log(0);
                        }else{
                            res.json(doc);
                            // console.log(doc);
                        }
                    });
                }
            })
        }else{
            res.redirect('login');
        }
        
    });

    app.get("/seller_attention_delete/:id",function(req,res){
        if(req.session.user){
            var sell_attention = global.dbHelper.getModel('sell_attention');
            sell_attention.remove({"uid":req.session.user._id,"sell_id":req.params.id},function (err,doc) {
                if (err) {
                    console.log(err);
                } else{
                    // console.log(doc);
                    res.json(0);
                };
            })
        }else{
            res.redirect('login');
        }
        
    });
    


}