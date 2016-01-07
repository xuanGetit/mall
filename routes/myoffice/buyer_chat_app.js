module.exports = function ( app ) {
    app.get('/buyer_chat',function(req,res){
        if(req.session.user){
            res.render('buyer_chat');
        }else{
            res.redirect('login');
        }
    })
    /*获取订单中信息*/
    app.get('/buyer_chat0/:id',function(req,res){
        if(req.session.user){
            var order = global.dbHelper.getModel('order');
            order.find({"_id":req.params.id},function (error, doc) {
                if (error) {
                    console.log(error);
                }else{
                    // console.log(doc);
                    res.json(doc)
                }
            })
        }else{
            res.redirect('login');
        }
    })
    /*获取商品中的信息*/
    app.get('/buyer_chat/:id',function(req,res){
        if(req.session.user){
            var order = global.dbHelper.getModel('order');
            order.find({"_id":req.params.id},function (error, doc) {
                if (error) {
                    console.log(error);
                }else{
                    var role = doc[0].role;
                    if (role == 0) {
                    	var buy_release = global.dbHelper.getModel('buy_release'); 
                    	buy_release.find({"_id":doc[0].goods_id},function (error, doc) {
				            if (error) {
				                console.log(error);
				            }else{
				                res.json(doc);
				                // console.log(doc);
				            }
				        })
                    } else if (role == 1) {
                    	var sell_release = global.dbHelper.getModel('sell_release'); 
                    	sell_release.find({"_id":doc[0].goods_id},function (error, doc) {
				            if (error) {
				                console.log(error);
				            }else{
				                res.json(doc);
				                // console.log(doc);
				            }
				        });
                    }
                }
            })
        }else{
            res.redirect('login');
        }
    })

	/*提交订单最终状态*/
    app.post('/buyer_chatOrder/:id',function(req,res){
    	// console.log(req.body)
        if(req.session.user){
            var order = global.dbHelper.getModel('order');
            order.find({"_id":req.params.id},{"unit_price2":1,"volume2":1,"_id":0},function (error, doc) {
                if (error) {
                    console.log(error);
                }else{
                    // console.log(doc);
                    if ((doc[0].unit_price2 == 0) || (doc[0].volume2 == 0)) {
                    	order.update({"_id":req.params.id},{$set:{"volume1":req.body.volume1,"unit_price1":req.body.unit_price1,"remarks":req.body.remarks}},function (error, doc) {
			                if (error) {
			                    console.log(error);
			                }else{
			                    console.log(doc);
			                    res.json(0);//等待对方确认
			                }
			            })
                    } else if ((doc[0].unit_price2 != req.body.unit_price1) || (doc[0].volume2 != req.body.volume1) ) {
                    	res.json(1);//和对方（卖方）价格不一致
                    }else{
                    	order.update({"_id":req.params.id},{$set:{"volume1":req.body.volume1,"unit_price1":req.body.unit_price1,
                    		"remarks":req.body.remarks,"over":1}},function (error, doc) {
			                if (error) {
			                    console.log(error);
			                }else{
			                    // console.log(doc);
			                    res.json(2);//订单确认成功
			                }
			            })
                    }
                }
            })
            
        }else{
            res.redirect('login');
        }
    })
    
}