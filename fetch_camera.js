//初期設定
var select_country = $('#select_country option:selected').val();
var select_category = $('#select_category option:selected').val();
var unix_times1 = []; //現地時間取得用
var unix_times2 = []; //現地時間取得用
var unix_times3 = []; //現地時間取得用

//最初の画面立ち上げ時
fetch_urls();

//国変更用
$(function() {
  //セレクトボックスが切り替わったら発動
  $('#select_country').change(function() {
    //選択したvalue値を変数に格納
    select_country = $(this).val();
    fetch_urls();
  });
});

//カテゴリ変更用
$(function() {
  //セレクトボックスが切り替わったら発動
  $('#select_category').change(function() {
    //選択したvalue値を変数に格納
    select_category = $(this).val();
    fetch_urls();
  });

});

//画像1〜3の画像をまとめて取得する関数
function fetch_urls(){

  //画像の初期化
  $('#parent1').empty();
  $('#parent2').empty();
  $('#parent3').empty();

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://webcamstravel.p.rapidapi.com/webcams/list/orderby=random/ country="+select_country+"/category="+select_category+"?lang=en&show=webcams%3Aimage%2Clocation%2Cplayer",
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "YOUR-API-KEY",
      "x-rapidapi-host": "webcamstravel.p.rapidapi.com"
    }
  };

  $.ajax(settings).done(function (response) {
    var player1_url = response['result']['webcams'][0]['player']['day']['embed'];
    var player2_url = response['result']['webcams'][1]['player']['day']['embed'];
    var player3_url = response['result']['webcams'][2]['player']['day']['embed'];
    fetch1_url(player1_url);
    fetch2_url(player2_url);
    fetch3_url(player3_url);
  });
}


//playerページから画像を取得するスクリプト
function fetch1_url(url) {
  // Ajax通信を開始
     $(function(){
        $.ajax({
        url: url,    // 表示させたいコンテンツがあるページURL
        cache: false,
        datatype: 'text',
        success: function(html) {
          //まずはテキストをDOMパーサーにかける
          // html要素を持つ文字列
      // DOMParserクラスを作成
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      var script = doc.getElementsByTagName('script')[1]; //DOMオブジェクト
      var script_text = script.innerHTML; //文字列
      words = script_text.split('\'');
      img_num1 = 0; //一日の画像の数
      urls1 = [];
      unix_times1 = [];

      for (let i=0; i<words.length; i++) {
         if (words[i].startsWith('http') && words[i].match(/preview/) && words[i].match(/day/)) {
          //URLからgmt時間を取得
           const unix_time1 = words[i].match(/@(.*)\.jpg/);
           unix_times1.push(unix_time1[1]);

           $('#parent1').append('<img class="image0'+String(img_num1)+'" height="300" src="'+words[i]+'"/>');
           urls1.push(words[i]);
           img_num1++;
         }
      }
        }
      });
    });
}


function fetch2_url(url) {
  // Ajax通信を開始
     $(function(){
        $.ajax({
        //url: 'https://webcams.windy.com/webcams/public/embed/player/1199276178/day',    // 表示させたいコンテンツがあるページURL
        url: url,    // 表示させたいコンテンツがあるページURL
        cache: false,
        datatype: 'text',
        success: function(html) {
          //まずはテキストをDOMパーサーにかける
          // html要素を持つ文字列
      // DOMParserクラスを作成
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      var script = doc.getElementsByTagName('script')[1]; //DOMオブジェクト
      var script_text = script.innerHTML; //文字列
      words = script_text.split('\'');
      img_num2 = 0; //一日の画像の数
      urls2 = [];
      unix_times2 = [];

      for (let i=0; i<words.length; i++) {
         if (words[i].startsWith('http') && words[i].match(/preview/) && words[i].match(/day/)) {
          //URLからgmt時間を取得
           const unix_time2 = words[i].match(/@(.*)\.jpg/);
           unix_times2.push(unix_time2[1]);

           $('#parent2').append('<img class="image1'+String(img_num2)+'" height="300" src="'+words[i]+'"/>');
           urls2.push(words[i]);
           img_num2++;
         }
      }
        }
      });
    });
}


function fetch3_url(url) {
  // Ajax通信を開始
     $(function(){
        $.ajax({
        url: url,    // 表示させたいコンテンツがあるページURL
        cache: false,
        datatype: 'text',
        success: function(html) {
          //まずはテキストをDOMパーサーにかける
          // html要素を持つ文字列
      // DOMParserクラスを作成
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      var script = doc.getElementsByTagName('script')[1]; //DOMオブジェクト
      var script_text = script.innerHTML; //文字列
      words = script_text.split('\'');
      img_num3 = 0; //一日の画像の数
      urls3 = [];
      unix_times3 = [];

      for (let i=0; i<words.length; i++) {
         if (words[i].startsWith('http') && words[i].match(/preview/) && words[i].match(/day/)) {
          //URLからgmt時間を取得
           const unix_time3 = words[i].match(/@(.*)\.jpg/);
           unix_times3.push(unix_time3[1]);

           $('#parent3').append('<img class="image2'+String(img_num3)+'" height="300" src="'+words[i]+'"/>');
           urls3.push(words[i]);
           img_num3++;
         }
      }
        }
      });
    });
}
