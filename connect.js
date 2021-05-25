//--------------------------------------------------
//Global変数
//--------------------------------------------------
//BlueJellyのインスタンス生成
const ble = new BlueJelly();
var original_angle = 0; //キャリブレーション用
var values = []; //移動平均用

//--------------------------------------------------
//ロード時の処理
//--------------------------------------------------
window.onload = function () {
  //UUIDの設定
  ble.setUUID("UUID1", BlueJelly.IOT_GLOBE_SERVICE, BlueJelly.IOT_GLOBE_CHARACTERISTIC);
}


//--------------------------------------------------
//Scan後の処理
//--------------------------------------------------
ble.onScan = function (deviceName) {
  document.getElementById('device_name').innerHTML = deviceName;
  document.getElementById('status').innerHTML = "found device!";
}


//--------------------------------------------------
//ConnectGATT後の処理
//--------------------------------------------------
ble.onConnectGATT = function (uuid) {
  console.log('> connected GATT!');

  document.getElementById('uuid_name').innerHTML = uuid;
  document.getElementById('status').innerHTML = "connected GATT!";
}

//--------------------------------------------------
//キャリブレーション処理：プッシュされたらその時点をGMT0時間とする
//--------------------------------------------------
function calibration() {
  document.getElementById('gmt').innerHTML = 'Calibration Done!'
  original_angle = value_global //キャリブレーションした角度を覚えておく

  console.log(original_angle);
};

//--------------------------------------------------
//Read後の処理：得られたデータの表示など行う
//--------------------------------------------------
var value_global = 0;
var values = [];

ble.onRead = function (data, uuid){
  //フォーマットに従って値を取得
  var value = data.getUint16(0); //0〜360度の角度データが入っている
  value = 360 - value; //回転角度が地球の向きに対して逆のため
  value_global = value;
  
  //ばらつきが大きいので、値を平均化する３
  values[0] = values[1];
  values[1] = values[2];
  values[2] = value;
  value = (values[0] + values[1] + values[2]) / 3;


  //HTMLにデータを表示
    document.getElementById('data_text').innerHTML = value;
    document.getElementById('uuid_name').innerHTML = uuid;
    document.getElementById('status').innerHTML = "read data"

    //まずはキャリブレーションした値に正規化
    new_angle = value - original_angle;
    //マイナスになった場合は360度から引く
    if (new_angle < 0) {
      new_angle = value - original_angle + 360;
    }

    //地軸の角度をUNIXTIMEに変換する
    // Dateオブジェクトを作成
    var date = new Date() ;
    var now_unixtime_ms = date.getTime() ;
    var now_unixtime = Math.floor( now_unixtime_ms / 1000 ); //現在のUNIX時間(秒単位)
    var angle_factor = 240; //単位秒。90°で6時間進むため(6時間=90°=6*3600sec → 240/1°)
    var delta_global_unixtime = new_angle * angle_factor; //角度をUNIXTIMEに変換 (日本基準の時間)
    var global_unixtime = now_unixtime - delta_global_unixtime;

    //表示する画像番号
    var idx1 = 0;
    var idx2 = 0;
    var idx3 = 0;

    //画像の切り替えを判断するフラグ
    var stepover_flag1 = 0;
    var stepover_flag2 = 0;
    var stepover_flag3 = 0;

    //1日分しか保存してないのでその領域を外れたら1周させる
    if (global_unixtime < unix_times1[0]) {
      global_unixtime = global_unixtime + 24 * 3600
    }else if (global_unixtime >= unix_times1[img_num1]){
      global_unixtime = global_unixtime - 24 * 3600        
    }

    if (global_unixtime < unix_times2[0]) {
      global_unixtime = global_unixtime + 24 * 3600
    }else if (global_unixtime >= unix_times2[img_num2]){
      global_unixtime = global_unixtime - 24 * 3600        
    }

    if (global_unixtime < unix_times3[0]) {
      global_unixtime = global_unixtime + 24 * 3600
    }else if (global_unixtime >= unix_times3[img_num3]){
      global_unixtime = global_unixtime - 24 * 3600        
    }

    //表示する画像を指定
    for (i=0; i<img_num1; i++){
      //
      if (stepover_flag1 == 0 && global_unixtime < unix_times1[i]) {
        idx1 = i
        stepover_flag1 = 1;
      }
    }

    for (i=0; i<img_num2; i++){
      if (stepover_flag2 == 0 && global_unixtime < unix_times2[i]) {
        idx2 = i //しきい値をまたいだ瞬間にループを抜ける
        stepover_flag2 = 1; //フラグを1度立てたらここには入らなくなる
      }
    }

    for (i=0; i<img_num3; i++){
      if (stepover_flag3 == 0 && global_unixtime < unix_times3[i]) {
        idx3 = i //しきい値をまたいだ瞬間にループを抜ける
        stepover_flag3 = 1; //フラグを1度立てたらここには入らなくなる
      }
    }


    var gap;

    //時差の設定
    if (select_country == 'JP'){
      gap = 0;
    }else if (select_country == 'US'){
      gap = 14;
    }else if (select_country == 'BR'){
      gap = 12;
    }else if (select_country == 'AU'){
      gap = 23;
    }else if (select_country == 'CH'){
      gap = 8;
    }

    //現地時間を表示
    //Dateはミリ秒表示なので1000倍しておく
    let dateTime1 = new Date(unix_times1[idx1] * 1000);
    document.getElementById('gmt_time1').innerHTML = dateTime1.toString();
    let localTime1 = new Date(unix_times1[idx1] * 1000 - gap * 3600 * 1000);
    document.getElementById('local_time1').innerHTML = localTime1.toString().replace("GMT+0900 (日本標準時)", "");
    let dateTime2 = new Date(unix_times2[idx2] * 1000);
    document.getElementById('gmt_time2').innerHTML = dateTime2.toString();
    let localTime2 = new Date(unix_times2[idx2] * 1000 - gap * 3600 * 1000);
    document.getElementById('local_time2').innerHTML = localTime2.toString().replace("GMT+0900 (日本標準時)", "");
    let dateTime3 = new Date(unix_times3[idx3] * 1000);
    document.getElementById('gmt_time3').innerHTML = dateTime3.toString();
    let localTime3 = new Date(unix_times3[idx3] * 1000 - gap * 3600 * 1000);
    document.getElementById('local_time3').innerHTML = localTime3.toString().replace("GMT+0900 (日本標準時)", "");

    //次に画像の指定
      for(let i=0; i<img_num1; i++) {
        if(i==idx1){;
          document.getElementsByClassName(`image0${i}`)[0].classList.remove('off');
          document.getElementsByClassName(`image0${i}`)[0].classList.add('on');
        }else{
          document.getElementsByClassName(`image0${i}`)[0].classList.add('off');
          document.getElementsByClassName(`image0${i}`)[0].classList.remove('on');
        }
      }

      for(let i=0; i<img_num2; i++) {
        if(i==idx2){
          document.getElementsByClassName(`image1${i}`)[0].classList.remove('off');
          document.getElementsByClassName(`image1${i}`)[0].classList.add('on');
        }else{
          document.getElementsByClassName(`image1${i}`)[0].classList.add('off');
          document.getElementsByClassName(`image1${i}`)[0].classList.remove('on');
        }
      }

      for(let i=0; i<img_num3; i++) {
        if(i==idx3){
          document.getElementsByClassName(`image2${i}`)[0].classList.remove('off');
          document.getElementsByClassName(`image2${i}`)[0].classList.add('on');
        }else{
          document.getElementsByClassName(`image2${i}`)[0].classList.add('off');
          document.getElementsByClassName(`image2${i}`)[0].classList.remove('on');
        }
      }

}

//--------------------------------------------------
//Start Notify後の処理
//--------------------------------------------------
ble.onStartNotify = function(uuid){
  console.log('> Start Notify!');

  document.getElementById('uuid_name').innerHTML = uuid;
  document.getElementById('status').innerHTML = "started Notify";
}

//--------------------------------------------------
//Stop Notify後の処理
//--------------------------------------------------
ble.onStopNotify = function(uuid){
  console.log('> Stop Notify!');

  document.getElementById('uuid_name').innerHTML = uuid;
  document.getElementById('status').innerHTML = "stopped Notify";
}

//-------------------------------------------------
//ボタンが押された時のイベント登録
//--------------------------------------------------
document.getElementById('startNotifications').addEventListener('click', function() {
      ble.startNotify('UUID1');
});

document.getElementById('stopNotifications').addEventListener('click', function() {
      ble.stopNotify('UUID1');
});

document.getElementById('calibration').addEventListener('click', function() {
  calibration();
});

