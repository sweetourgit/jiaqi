<script>
  // const serverSrc="http://api.dayuntong.com"

  const serverSrc="http://192.168.2.81:3017";

  // const jqUrl = 'http://49.4.28.5:3019/h3wf' // 非周边财务工作流
  // const jqUrlZB = 'http://49.4.28.5:3019/h3wf' // 周边工作流

  const jqUrl = 'http://192.168.2.81:3019/h3wf' // 非周边财务工作流
  const jqUrlZB = 'http://192.168.2.81:3019/h3wf' // 周边工作流

  // const serverSrc= "http://web.17lvju.com/app/jialv"

  // const imgUrl="http://test.dayuntong.com";

  const imgUrl ="https://jiaqi-server.obs.myhwclouds.com";//图片预览地址
  //http://test.dayuntong.com/upload/obs/api/picture  图片上传地址
  //const imgUrl="http://192.168.2.65:3024";
  //const imgUrl="http://192.168.2.65:3009";
  //const jqUrl="http://192.168.1.198:6019";
  // const jqUrl="http://192.168.2.6:6019";
  // const jqUrl="http://49.4.10.11:3019"
  // const jqUrl="117.78.20.162:3019"
  // const jqUrl="http://test.dayuntong.com/h3wf";
//  const serverSrcPhp="http://www.around.com";
  const serverSrcPhp="http://zb.dayuntong.com";
  const token="";
  const userId="";
  const hasEnter=false;
  export default {
  serverSrc,//服务器地址
  imgUrl,//图片服务器地址
  jqUrl,//工作流启动地址
  serverSrcPhp,//服务器地址:PHP相关接口
  token,//用户token身份
  userId,//用户id
  hasEnter,//用户登录状态
  jqUrlZB // 周边工作流
  }
</script>
