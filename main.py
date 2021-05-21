from time import sleep_ms
from machine import Pin, UART, I2C
import math
from mpu9250 import MPU9250 #地磁気センサ用ライブラリ
 
#初期設定
uart = UART(1,115200) #ここではUART1使用
sleep_ms(1000)
led = machine.Pin(25, machine.Pin.OUT)
 
sda = Pin(16)
scl = Pin(17)
i2c = I2C(0,sda=sda, scl=scl, freq=115200)
sensor = MPU9250(i2c)

while True:
    
    ########################################################
    # 地磁気センサのデータを0〜360度に変換
    ########################################################
    #磁気の生値 単位：マイクロテスラ
    #マニュアルでのキャリブレーション
    #x = sensor.magnetic[0] - 3
    #y = sensor.magnetic[1] - 43
    x = sensor.magnetic[0] +20
    y = sensor.magnetic[1] -35
 
    #if not y == 0:
    if x >= 0 and y >= 0: #第一象限
        heading=math.degrees(math.atan(y/x))
    elif x < 0 and y >= 0: #第二象限
        heading=math.degrees(math.atan(-x/y)) + 90
    elif x < 0 and y < 0: #第三象限
        heading=math.degrees(math.atan(-y/-x)) + 180
    else: #第四象限
        heading=math.degrees(math.atan(x/-y)) + 270
    heading = math.floor(heading) #小数点以下は不要なので切り捨て
    print(heading)
    
    ########################################################
    # 時間をBLEでセントラルに送信
    ########################################################    
 
    #角度データで送る場合
    num16 = '{:04x}'.format(heading) #10進数をffffのフォーマットに変換。このフォーマットにしないとBLE受け取り先でエラーが出る
    
    uart.write('SHW,000E,'+num16+'\n')
 
    sleep_ms(100)
