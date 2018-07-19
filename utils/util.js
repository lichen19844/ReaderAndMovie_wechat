// 专门存放公共方法，这个js文件被引用之后，里面就可以使用相应的变量了，如movies.js中的实参subject.rating.stars，这里的stars是它的形参
// 把星星的分值35或50这样的数字转化成有5个数字的数组，用[1, 1, 1, 1, 1]和[1, 1, 1, 0, 0]等形式来做星星
function converToStarsArray(stars){
  // toString()方法是转为字符串，substring方法是从第1个字符开始，一共只要1个字符
  var num = stars.toString().substring(0, 1);
  var array = [];
  for(var i = 1; i <= 5; i++){
    // 思路：把num在外部设置好，然后引入到for循环里做判断用，判断完将我们想要的值放入数组array
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



// var stars = 47;

// var num = stars.toString().substring(0, 1);

// var array = [];
// for (var i = 1; i <= 5; i++) {
//   if (i <= num) {
//     array.push(1);
//   }
//   else {
//     array.push(0);
//   }
// }
