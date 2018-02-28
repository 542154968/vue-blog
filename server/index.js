
/*配置项*/
var express = require('express');
var app = express();
var fs =require('fs');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty'); //在处理模块中引入第三方解析模块 
var multipartMiddleware = multipart();
var MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({ extended: true, limit:"50mb" }));
app.use(bodyParser.json({limit:"50mb"}));
app.use(express.static('public'))
app.use(multipart({uploadDir:'./public' }));//设置上传文件存放的地址。
//设置跨域访问
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

// var MonUrl = 'http://192.168.4.212:27017/' 
	var MonUrl = 'http://192.168.1.104:27017/' 


//上传博客和分享和评论留言的图片
app.post('/sendImg', multipartMiddleware, function(req, res){
     var base64 = req.body.base64.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
     var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    // console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
     //验证路径是否存在

     //获取文件夹信息
     fs.readdir("public/blogImg", function(err, files){
        if(err){
            res.status(500);
            res.send({"success":"文件读取出错"})
           // console.log("文件读取出错" +err)
        } else {
        	var fileName = getTime(0)+GetRandomNum(1,10);
           	fs.writeFile("public/blogImg/"+fileName+".jpg", dataBuffer, function(err){

                if(err){
                	  console.log(err)
                    res.status(500);
                    res.send({success:"图片上传失败,请重试"})
                } else { 
                    res.send({success: "blogImg/"+fileName+".jpg"})
                }
           	})
        }
    })
})



// 写blog
app.post('/sendBlog', function(req, res){
	
	var data = {
		id: Number(0),
		time: getTime(1),
		title: req.body.title, // 标题
		type: req.body.type, // 文章类型
		description: req.body.description, // 简洁 描述 推荐理由，
		detail: req.body.detail, // markdown语法的原型
		markHtml: req.body.markHtml, // markdown语法的html
		cover: req.body.cover, // 封面图
		view: Number(0),
		like: Number(0),
		comments: Number(0),
		star: parseInt(req.body.star)
	}
	MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
			if(err){
				console.log(err)
			}
			  var myDB = db.db("blog");
			  
			  myDB.collection('blogIdInsert', function(err, idList){
			  	idList.update({name: "user"},  {$inc:{id:1}}, function(err, result){
			  		if(err){
			  			console.log(err+"出错了")
			  			res.status(500)
			  			res.send("获取ID失败")
			  		}else{
			  			idList.find({name: "user"}, function(err, result){
			  				result.toArray(function(err, item){
			  					var Id = item[0].id
			  					/***/
			  					myDB.collection("blogIds", function(err, talks){
		                 talks.insert({
		                 	id: Id,
		                 	time: data.time,
		                 	title: data.title,
		                 	type: data.type,
		                 	description: data.description,
		                 	cover: data.cover,
		                 	view: data.view,
		                 	like: data.like,
		                 	star: data.star,
		                 	comments: data.comments
		                 }, function(err, results){
		                    if(err){
		                        res.status(500);
		                        res.send({success:"对不起，数据保存失败，请重试"})
		                    } else {
		                       myDB.collection("blogList", function(err, lists){
		                       		lists.insert({
		                       			uid: Id,
		                       			markHtml: data.markHtml,
		                       			detail: data.detail
		                       		}, function(err, result){
		                       			 	if(err){
							                        res.status(500);
							                        res.send({success:"对不起，数据保存失败，请重试"})
							                    } else {
							                    	res.status(200)
							                    	res.send("发布成功！")
							                    }
		                       		})
		                       })
		                    }
		                 })
		            
				        	}) 
			  					
			  					/***/
			  				})
			  				
			  			})
			  		}
			  	})
			  })
			  

        
        
        
        
    })
})

// 获取分享和博客列表
app.get('/list', function(req, res){
	
	var response = {
		skip: parseInt(req.query.skip),
		limit: parseInt(req.query.limit),
		type: req.query.type,
		sort: req.query.sort
	}
	if(response.skip === ' ' || response.limit === ' ' || response.type === ' ' ){
		res.status(500)
		res.send("缺少查询项")
		return false
	}
	
	if(response.sort == '' || response.sort === undefined ){
		response.sort = 1
	}
	console.log(response.sort)
	MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
		if(err){
			console.log(err)
		}else {
			var myDB = db.db("blog");
			var data = {
				list: null,
				count: null
			}
			myDB.collection("blogIds", function(err, ids){
				ids.count({type: response.type}, function(err, count){
					data.count = count;
					
					ids.find({type: response.type}, {sort:{'_id': Number(response.sort)} ,skip:response.skip, limit:response.limit },  function(err, result){
						if(err){
							res.send("系统出错")
							return false
						}else{
							result.toArray(function(err, item){
								res.status(200)
								data.list = item
								res.send(data)
							})
						}
					})
				})
				
			})
		}
	})
	
})

// 查看详情
app.get('/getBlogDetail', function(req, res){
	console.log(JSON.stringify(req.query))
	var id = req.query.id
	if(id){
		id= Number(id);
		MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
			if(err){
				console.log(err)
			}else {
				 var myDB = db.db("blog");
				 myDB.collection("blogIds", function(err, ids){
				 	ids.find({id: id}, function(err, result){
				 		result.toArray(function(err, item){
				 			if(item.length>0){
				 				var data = {
				 					detail: item,
				 					detailList: [],
				 					count: 0
				 				};
				 				 myDB.collection("blogList", function(err, list){
				 				 	list.find({uid: id}, function(err, resu){
				 				 		resu.toArray(function(err, it){
				 				 			if(it.length>0){
				 				 				data.detail.push(it[0])
			 				 				  myDB.collection("detailList", function(err, dList){
			 				 				  	dList.count({uid: id}, function(err, count){
			 				 				  		data.count = count
			 				 				  		
			 				 				  		dList.find({uid: id}, {skip:0, limit: 5}, function(err, result){
				 				 				 		  result.toArray(function(err, dIt){
				 				 				 		  	if (dIt.length === 0){
																}else {
																	data.detailList = dIt
																}
				 				 				 		  	
				 				 				 		  	ids.update({id: id}, {$inc:{view: 1}}, function(err, result){
								 				 					res.status(200)
								 				 					res.send(data)
								 				 				})
				 				 				 		  })
				 				 				 	  })
			 				 				  	})
			 				 				 	  
				 				 				})
				 				 				
				 				 				
				 				 			}
				 				 		})
				 				 	})
				 				 })
				 			}else {
				 				res.status(500)
								res.send("error")
				 			}
				 			
				 		})
				 	})
				 })
			}
		})
		
	}else {
		res.status(500)
		res.send("error")
	}
})

// 获取分页的留言 
app.get('/detailPages', function(req, res){
	
	var response = {
		id: parseInt(req.query.id),
		page: parseInt(req.query.page),
		limit: parseInt(req.query.limit)
	}
	MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
		if(err){
			console.log(err)
		}else {
			var myDB = db.db("blog");
			myDB.collection("detailList", function(err, ids){
				ids.find({uid: response.id}, {skip:(response.page-1)*response.limit , limit:response.limit },  function(err, result){
					if(err){
						res.send("系统出错")
						return false
					}else{
						result.toArray(function(err, item){
							res.status(200)
							res.send(item)
						})
					}
					
				})
			})
		}
	})
	
})


// 留言板
app.post('/board', function(req, res){
	var data = {
		userName: req.body.userName,
		time: getTime(1),
		email: req.body.email, // 标题
		detail: req.body.detail, // markdown语法的原型
		markHtml: req.body.markHtml, // markdown语法的html
		type: req.body.type,
		id: Number(req.body.id)
	}
	if(data.type === "board" ){
		var List = "boardList"
	}else if(data.type === "detail"){
		var List = "detailList";
	}
	MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
			if(err){
				console.log(err)
			}
			  var myDB = db.db("blog");
        myDB.collection(List, function(err, talks){
            talks.count(function(err, count){
            		if(count == 0){
	            		var Id = 1
	            	}else {
	            		var Id = count++;
	            	}
                 talks.insert({
                 	uid: data.id,
                 	id: Id,
                 	userName: data.userName,
                 	email: data.email,
                 	markHtml: data.markHtml,
                  detail: data.detail,
                  time: data.time
                 }, function(err, results){
                    if(err){
                        res.status(500);
                        res.send({success:"对不起，数据保存失败，请重试"})
                    } else {
                    	if(data.type === "detail"){
                    		myDB.collection("blogIds", function(err, blog){
                    	 		blog.update({id: data.id}, {$inc:{comments: 1}}, function(err, result){
					 				 					res.status(200)
					              		res.send("发布成功！")
					 				 				})
                    	 	})	
                    	}else {
                    		res.status(200)
					              res.send("发布成功！")
                    	}
                    	 	
                    }
                 })
            })
        }) 
    })
})


// 获取留言板和内容
app.get('/boardList', function(req, res){
	
	var response = {
		page: parseInt(req.query.page),
		limit: parseInt(req.query.limit),
		type: req.query.type,
		sort: req.query.sort
	}
	if(response.skip === ' ' || response.limit === ' ' || response.type === ' ' ){
		res.status(500)
		res.send("缺少查询项")
		return false
	}
	
	if(response.sort == '' || response.sort === undefined ){
		response.sort = 1
	}
	console.log(response.sort)
	MongoClient.connect("mongodb://542154968:li19941217@localhost:27017/admin", function(err, db){
		if(err){
			console.log(err)
		}else {
			var myDB = db.db("blog");
			myDB.collection("boardList", function(err, ids){
				ids.count({}, function(err, count){
					
					var count = count;
					ids.find({}, {sort:{'_id': parseInt(response.sort)} ,skip:(response.page-1)*response.limit, limit:response.limit },  function(err, result){
						if(err){
							res.send("系统出错")
							return false
						}else{
							result.toArray(function(err, item){
								res.status(200)
								res.send({"item": item, "count": count})
							})
						}
					})
				})
				
				
				
				
				
			})
		}
	})
	
})


/**/
app.get('/register', function(req, res){
	
    var response = {
        name:req.query.name,
        phone:req.query.phone,
        pass:req.query.pass,
        sex:req.query.sex
    }
   // console.log(JSON.stringify(response))
    if(response.name.length<2 || !response.name){
        res.status(500)
        res.send({success:"请输入正确格式的姓名"})
        return false;
    }
    if(response.pass.length<6 || !response.pass){
        res.status(500)
        res.send({success:"请输入不小于6位数的密码"})
        return false;
    }
    if(response.sex == '' || !response.sex){
        res.status(500)
        res.send({success:"请输入性别"})
        return false;
    }
    var reg = new RegExp("^[0-9]*$");
    if(!reg.test(response.phone) || response.phone.length < 11 ||response.phone.length > 14){
        res.status(500)
        res.send({success:'请输入正确格式的手机号'})
        return false;
    }
   // console.log(JSON.stringify(req.query))
    MongoClient.connect('mongodb://dbadmin:li19941217@localhost:27017/', function(err, db){
        var myDB = db.db('ergou');
        //相同手机号验证
        myDB.collection('users', function(err, users){
            users.count({phone:response.phone}, function(err, count){
               // console.log(count)
                if(count>0){
                    res.status(500)
                    res.send({success:'对不起，已经有相同手机号注册了，请您重新尝试...'})
                    return false;
                   
                }
                //相同用户名验证
                users.count({name:response.name}, function(err, count){
               // console.log(count)
                if(count>0){
                    res.status(500)
                    res.send({success:'对不起，已经有相同用户名注册了，请您重新尝试...'})
                    return false;
                    
                }})
                //增加用户ID
                users.count(function(err, count){
                	//console.log(count)
                	users.insert({name:response.name, phone:response.phone, pass:response.pass, sex:response.sex, userId:count++ , loginStatus:false, headerImg:false}, function(err, result){
                        if(err){
                            res.status(500);
                            res.send({success:"对比起，服务器出岔子了，请重试!"})
                            
                        } else{
                           // console.log(result)
                            res.status(200)
                            users.find({phone:response.phone}, function(err, items){
                            	if(err){
                            		res.status(500);
                            		res.send('读取用户信息出错，请重试')
                            		
                            	} else {
                            		items.toArray(function(err, item){
                            			res.status(200);
                            			res.send(item);
                            			///console.log(item)
                            			
                            		})
                            	}
                            })
                           
                        }
                    })
                })
                      
            })//3123
        })
    });
})


app.get('/login', function(req, res){
	var response = {
		phone : req.query.name,
		pass : req.query.password
	}
	//console.log(JSON.stringify(response))
	//验证
	var reg = new RegExp("^[0-9]*$");
    if(!reg.test(response.phone) || response.phone.length < 11 ||response.phone.length > 14){
        res.status(500)
        res.send({success:'请输入正确格式的手机号'})
        return false;
    }
    if(response.pass.length<6 || !response.pass){
        res.status(500)
        res.send({success:"请输入不小于6位数的密码"})
        return false;
    }
    //登录数据库
    MongoClient.connect('mongodb://dbadmin:li19941217@localhost:27017/', function(err, db){
    	var userDB = db.db("ergou");
    	userDB.collection("users", function(err, users){
    		//有无用户验证
    		users.count({phone:response.phone}, function(err, count){
               // console.log("查出的数量"+count)
                if(count <= 0){
                    res.status(500)
                    res.send({success:'对不起，没有该用户'})
                    return false;
                   
                } else {
                	users.find({phone:response.phone}, function(err, items){
                		items.toArray(function(err, item){
                			//console.log(item[0].pass)
                			//console.log(item)
                			if(item[0].pass == response.pass){
                				res.status(200)
                				res.send(item)
                			} else{
                				res.status(500);
                				res.send({success:"用户名或者密码错误"})
                			}
                		})
                	})
                }
            })
    	})
    	//
    })

})


//头像上传
app.post('/userImg', multipartMiddleware, function(req, res){
       // console.log(req.body.name)
       // var parseInt()
     var base64 = req.body.base64.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
     var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    // console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
     //验证路径是否存在

        fs.exists("public/img/userImg/"+ req.body.name + "/", function(exits){
            if(exits == true) {
               // console.log("路径存在")
                fs.writeFile("public/img/userImg/"+ req.body.name + "/" + "userHeaderImg.jpg", dataBuffer, function(err){
                    if(err){
                        res.status(500)
                        res.send({success:"上传图片失败，路径覆盖出错"})
                    } else {
                        MongoClient.connect('mongodb://dbadmin:li19941217@localhost:27017/', function(err, db){
                            var userDB = db.db("ergou");
                           

                             userDB.collection("users", function(err, users){

                            //     console.log("查找" +{userId:req.body.name} )
                            //     console.log(typeof 0)
                            //     console.log(typeof parseInt(req.body.name))
                            //      users.find({userId: parseInt(req.body.name) }, function(err, items){
                            //     items.toArray(function(err, item){
                            //         console.log(item)
                            //     })
                            // })
                             /*记住数字的查询要变成数字  不能是字符串  因为在mongo里会当成 ‘0’*/
                                users.update({userId: parseInt(req.body.name)}, {$set:{headerImg:true}}, function(err, results){
                                  //  console.log(results)
                                    if(err){
                                        res.status(500)
                                        res.send({success:"保存到数据库的过程中出错了，请重试"})
                                    } else {
                                        res.status(200)
                                        res.send({success:"图片上传成功"})
                                    }
                                })
                            })
                        })
                        
                    }
                    
                })
            } else { //如果路径不存在  建立路径 并且写入图
                fs.mkdir("public/img/userImg/"+   req.body.name , function(err){
                    if(err) {
                       //console.log("创建目录失败")
                        res.status(500);
                        res.send({success:"保存图片到服务器的过程失败了"})
                    } else {
                        fs.writeFile("public/img/userImg/"+   req.body.name +"/"+  "userHeaderImg.jpg", dataBuffer, function(err){
                             MongoClient.connect('mongodb://dbadmin:li19941217@localhost:27017/', function(err, db){
                                var userDB = db.db("ergou");
                                userDB.collection("users", function(err, users){

                            //     users.find({userId:req.body.name}, function(err, items){
                            //     items.toArray(function(err, item){
                            //         console.log(item)
                            //     })
                            // })

                                users.update({userId: parseInt(req.body.name)}, {$set:{headerImg:true}}, function(err, results){//$set 有酒更新 没有就创建
                                   // console.log(results)
                                    if(err){
                                        res.status(500)
                                        res.send({success:"保存到数据库的过程中出错了，请重试"})
                                    } else {
                                        res.status(200)
                                        res.send({success:"图片上传成功"})
                                    }
                                })
                            })
                        })
                         })
                    }
                }) 
            } //else 结束
        })//路径的验证结束
     
  
     //console.log(req.body.base64)
     
})





//首页轮播图
app.get("/indexCenter", function(req, res){
    //res.send("hello")
    fs.readdir("public/img/indexCenter", function(err, files){
        if(err){
            res.status(500);
            res.send({"success":"文件读取出错"})
           // console.log("文件读取出错" +err)
        } else {
           // for(var i=0 ; i<files.length; i++){
           //  console.log(files[i])
           
           // }
           res.status(200);
           res.send(files)
        }
    })
})



//修改密码
app.get('/passWord', function(req, res){
	var response = {
		phone : req.query.phone,
		pass : req.query.pass
	}
	//console.log(JSON.stringify(response))
	MongoClient.connect("mongodb://dbadmin:li19941217@localhost:27017/admin", function(err, db){
		var myDB = db.db('ergou');
		myDB.collection("users", function(err, users){
			users.update({phone: response.phone}, {$set:{pass:response.pass}}, function(err, results){//$set 有酒更新 没有就创建
		       // console.log(results)
		        if(err){
		            res.status(500)
		            res.send({success:"密码修改失败，请重试"})
		        } else {
		            res.status(200)
		            res.send({success:"密码修改成功！"})
		        }
		    })
		})
	})
	
})



//发表
app.post("/newTalk", multipartMiddleware, function(req, res){
    response = {
        name :req.body.name,
        userID:req.body.userID,
        headerImg:req.body.headerImg,
        title : req.body.title,
        contain : req.body.contain,
        view: req.body.view,
        talk: req.body.talk,
        zan : req.body.zan,
        date :req.body.date,
        img1 : req.body.img1,
        img2 : req.body.img2,
        img3 : req.body.img3,

    }
   // console.log(JSON.stringify(req.body))
    if(!response.name){
        res.status(500),
        res.send({success : "数据丢失，请重新上传"})
        return false;
    }
    if (response.title.length < 3 || response.title.length > 15){
        res.status(500),
        res.send({success : "标题字数在3~15之间"})
        return false;
    }
    if (response.contain.length < 5 || response.title.length > 255){
        res.status(500),
        res.send({success : "标题字数在5~255之间"})
        return false;
    }
    MongoClient.connect("mongodb://dbadmin:li19941217@localhost:27017/admin", function(err, db){
        var myDB = db.db("ergou");
        myDB.collection("talk", function(err, talks){
            talks.count(function(err, count){
                 talks.insert({name:response.name,userID:response.userID, headerImg:response.headerImg, title:response.title, contain:response.contain, view:parseInt(0), talk:parseInt(0), zan:parseInt(0), bishi:parseInt(0), date:response.date, uid:count++, img1:response.img1, img2:response.img2, img3:response.img3}, function(err, results){
                    if(err){
                        res.status(500);
                        res.send({success:"对不起，数据保存失败，请重试"})
                    } else {
                        myDB.collection("users")
                       // console.log(results);
                        res.status(200);
                        res.send({success:count++})
                    }
                 })
            })
           
        })
    })

})





//删除图片
app.get("/delImg", function(req, res){
	var imgID = req.query.delImg;
	fs.unlink("public/img/talk/" + imgID, function(err){
		if(err){
			res.status(500);
			res.send({success : "删除失败，请重试"})
		} else {
			res.status(200);
			res.send({success: "删除成功！"})
		}
	})
})




app.get('/talkDetail', function(req, res){
   // console.log("xxx"+ req.query.id)
	var uid = parseInt(req.query.id);
	//console.log(uid == 0)
    //console.log(req.query.id)
	if(uid == 'undefined'){
		res.status(500);
		res.send({success:"获取失败，返回上一页重试..."})
        //console.log("error1")
		return false

	}

	MongoClient.connect("mongodb://dbadmin:li19941217@localhost:27017/admin", function(err, db){
		var myDB = db.db("ergou");
		myDB.collection("talk", function(err, talks){
			talks.find({uid:uid}, {pinglun:0, bishi:0}, function(err, items){
				if(err){
					//console.log(err)
					res.status(500);
					res.send({success:"获取失败，返回上一页重试...1"})
				} else {
					items.toArray(function(err, item){
						if(!item || item == [] ){
                           // console.log("error2")
							res.status(500);
							res.send({success:"获取失败，返回上一页重试...2"})
						} else {
                          //  console.log("error3")
                          console.log(item)
							res.status(200)
							res.send(item)
						}
					})
				}
			})
		})
	})
})


//增加浏览量
app.get('/addView', function(req, res){
	//console.log(req.query.uid)
	var Uid = parseInt(req.query.uid)
	MongoClient.connect("mongodb://dbadmin:li19941217@localhost:27017/admin", function(err, db){
		var myDB = db.db("ergou");
		myDB.collection("talk", function(err, talks){
			talks.update({uid:Uid}, {$inc:{view:1}}, function(){
                if(err){
                    res.status(500);
                    res.send({success:"浏览量增加失败，请重试"})
                } else {
                    res.status(200)
                    res.send({success:"浏览量增加成功"})
                   // console.log("success")
                }
            })
		})
	})
})


//detail评论
app.get("/pinglun", function(req, res){
    console.log(JSON.stringify(req.query))
    var response = {
        name:req.query.name,
        headerImg:req.query.img,
        userId:parseInt(req.query.userId),
        date:req.query.date,
        pinglun:req.query.pinglun
    }
    MongoClient.connect("mongodb://dbadmin:li19941217@localhost:27017/admin", function(err, db){
        console.log("shujukulianjie")
        if(err){
            console.log(err)
        }
        var myDB  = db.db("ergou");
        myDB.collection("pinglun", function(err, pinglun){
            pinglun.count(function(err, count){
                pinglun.insert({ID:count++, uid:parseInt(req.query.uid), date:response.date, name:response.name, userId:response.userId, headerImg:response.headerImg, pinglun:response.pinglun}, function(err, results){
                    if(err){
                        res.status(500);
                        res.send({success:"评论失败"})
                    } else {
                        myDB.collection("talk", function(err, talks){
                            talks.update({uid:parseInt(req.query.uid)}, {$inc :{talk:1}}, function(err, results){
                                    res.status(200);
                                    res.send({success:"评论成功！"})
                                })
                        })
                    }
                         
                              
            })
                           
           }) 
        })
    })
})



//首页
app.get('/', function(req, res){
	res.send({sayHello:'hello'})
})

//db.talk.find({'talk' : { $type : 2 }}).forEach(function(x) {x.talk = Number(x.talk);db.talk.save(x);})

function getTime(type){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	if(month<10){
		month = '0'+month
	}
	if(day<10){
		day = '0'+day
	}
	if(hour<10){
		hour = '0'+hour
	}
	if(minute<10){
		minute= '0'+minute
	}
	if(second<10){
		second= '0'+second
	}
	var time = year+"-"+month +"-"+ day + "   " + hour  + ":" + minute  + ":" + second
	if(type == 1){
		return time;		
	}else if(type == 0) {
		return Date.parse(new Date());
	}

}

function GetRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
} 

function login(option){
	var option = {}
			option.dbPath = option.dbPath || "mongodb://dbadmin:li19941217@localhost:27017/admin";
			option.db = option.db || "blog"
			option.collection = option.collection || "logList"
			option.callback = option.callback || '';
			
	    MongoClient.connect(option.dbPath, function(err, db){
        if(err){
            console.log(err)
        }
        var myDB  = db.db(option.db);
        myDB.collection(option.collection, function(err, pinglun){
        	if(option.callback != ''){
        		option.callback(err, collec)
        	}else {
        		console.error("请传入进去集合后的操作")
        	}
        })
    })
}

/*服务器端口*/
app.listen(8868)
console.log('Listening on port 8868..'); 