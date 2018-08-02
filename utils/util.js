// 专门存放公共方法，这个js文件被引用之后，里面就可以使用相应的变量了，如movies.js中的实参subject.rating.stars，这里的stars是它的形参
// 把星星的分值35或50这样的数字转化成有5个数字的数组，用[1, 1, 1, 1, 1]和[1, 1, 1, 0, 0]等形式来做星星
function converToStarsArray(stars) {
  // toString()方法是转为字符串，substring方法是从第1个字符开始，一共只要1个字符
  var num = stars.toString().substring(0, 1);
  var array = [];
  //i <= 5 代表了 5颗星
  for (var i = 1; i <= 5; i++) {
    // 思路：把num在外部设置好，然后引入到for循环里做判断用，判断完将我们想要的值放入数组array
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

//小插曲，可以把下面的method作为参数写到http(url, callBack, method)中，通过method参数把'GET'或'POST'等传过来
function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
      console.log("util callback res is ", res)
    },
    fail: function (error) {
      console.log(error);
    },
  })
}

function convertToCastString (casts) {
  var castsjoin = "";
  for(var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  };
  return castsjoin.substring(0, castsjoin.length-2);
}

module.exports = {
  convertToCastString: convertToCastString,
  converToStarsArray: converToStarsArray,
  http: http,
}

//实例演练
// var stars = 37;
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


// 半星的做法1：
// var array = [];
// for (var i = 1; i <= 5; i++) {
//   if (stars >= 10) {
//     array.push(1);
//     stars -= 10;
//   } else if (stars >= 5) {
//     array.push(0.5);
//     stars -= 5;
//   } else {
//     array.push(0);
//   }
// }

// 半星的做法2：
// var num1 = stars.toString().substring(0, 1);
// var num2 = stars.toString().substring(1, 1);
// var array = [];
// // j为记录退出循环的i值
// var j = 0;
// for (var i = 1; i <= 5; i++) {
//   if (i <= num1) {
//     array.push(1);
//     j = i;
//   }
//   else {
//     if (num2 > 5) {
//       array.push(0.5);
//     }
//     else {
//       array.push(0);
//     }
//     j = i;
//     break;   //这个break很重要 
//   }
// }
// //不足5位的补0
// if (j <= 5) {
//   for (var i = j; i < 5; i++) {
//     array.push(0);
//   }
// }
// return array;

// 小知识点：
// var num = 37;

// var m = parseInt(num / 10)
// m
// 输出为 3

// var n = num % 10
// n
// 输出为 7