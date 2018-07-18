// 专门存放公共方法
function converToStarsArray(stars){
  // toString()方法是转为字符串，substring方法是从第1个字符开始，一共只要1个字符
  var num = stars.toString().substring(0, 1);
  var array = [];
  for(var i = 1; i <= 5; i++){
    if(i<=num){
      array.push(1);
    }
    else{
      array.push(0);
    }
  }
  return array;
}

module.exports = {
  converToStarsArray: converToStarsArray
}