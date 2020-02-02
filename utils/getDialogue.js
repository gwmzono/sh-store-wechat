//处理服务器返回的对话信息
function getDialogue(data){
  const userInfo = wx.getStorageSync('userInfo');
  let list=[];
  let other;
  //为每一条对话添加代码
  for (let i in data) {
    if (data[i].from == userInfo.id) {
      other = data[i].to;
    } else {
      other = data[i].from;
    }
    data[i].code = `zy${data[i].item_id}${other}`;
  }
  //罗列出所有代码
  let temp = [];
  let index = 0;
  for (let i in data) {
    index = temp.indexOf(data[i].code);
    if (index === -1) {
      temp.push(data[i].code);
    }
  }
  //根据罗列的代码将对话分类
  for (let i in data) {
    index = temp.indexOf(data[i].code);
    if (list[index] === undefined) {
      list[index] = [];
    }
    list[index].push(data[i]);
  }
  return list.reverse();
}

module.exports = {
  getDialogue,
}