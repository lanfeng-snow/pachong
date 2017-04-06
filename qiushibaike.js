//加载模块 
var http=require('http');
var express=require('express');
var app=express();
var fs=require('fs');//fs 文件 读写模块 文件系统
var cheerio=require('cheerio');//为服务器特别定制的，快速、灵活、实施的jQuery核心实现.
var request=require('request');//文件流 请求
var i=0; //加载数量
var url='http://www.qiushibaike.com/';//指定网页

function fetchPage(x){ //函数封装 外壳
  startRequest(x)
}
function startRequest(x){ //主函数
  // request.get(x,function(err,res,body){
  http.get(x,function(res){ //http请求X网站  回调函数带res返回参数
    var html=''; 
    var titles=[];
    res.setEncoding('utf-8');//设置utf-8格式  防止乱码
    res.on('data',function(chunk){//请求 返回数据
      html+=chunk;
      // console.log(html)
    });
    res.on('end',function(){//
      $=cheerio.load(html);//把html内容赋值给$
      

      // console.log($('#nextPage').attr('href'))
      var news_title='haha';
      i++;
      savedContent($,news_title);//调用内容存储函数
      var nextLink="http://www.qiushibaike.com"+$('#nextPage').attr('href');//下一个文章的地址
      str1=nextLink.split('-');//去掉a链接中的-
      str=encodeURI(str1[0]);//字符串转码url
      console.log(str)
      if(i<300){//控制i  来设置 循环次数
        fetchPage(str);//再次调用
      }
    }).on('error',function(err){
      console.log(err);
    })
  })
}


function savedContent($,news_title){//内容存储函数
  // console.log(1)
  $('.content-text').each(function(index,item){//循环p标签
    var x=$(this).children('a').children('div').children('span').text().trim();//this指向为p标签  p标签中的内容
    var y=x.substring(0,2).trim();//substring() 方法用于提取字符串中介于两个指定下标之间的字符。

    if(y==''){//当y为空

    }else{
       x=x+'\n';//加一个换行符号
       fs.appendFile('./data/'+news_title+'.txt',x,'utf-8',function(err){
        if(err){
          console.log(err)
        }
      })
    }
  })
}


function savedImg($,news_title){//图片存储函数
  $('.article-content img').each(function(index,item){//获取图片并且  遍历
    var img_title=$(this).parent().next().text().trim();// title名字
    if(img_title.length>35||img_title==""){//如果  名字长度大于35 或者名字长度为空  则设置名字为null
      img_title="Null";
    }
    var img_filename=img_title+'.jpg';//名字加后缀

    var img_src='http://www.ss.pku.edu.cn'+$(this).attr('src');//定义 图片的src地址
    request.head(img_src,function(err,res,body){//请求 图片地址
      if(err){console.log(err)};
    });
    //request的pipe方法很方便的获取图片的文件流
    request(img_src).pipe(fs.createWriteStream('./image/'+news_title+'---'+img_filename))
  })
}






fetchPage(url);//调用 函数


app.listen(3000,function(){
  console.log("开启")
})