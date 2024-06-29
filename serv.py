from flask import Flask, request
import telebot
import mysql.connector
import os
import base64
import face_recognition
import cv2
bot_token = 'BotToken'
bot = telebot.TeleBot(bot_token)
app = Flask(__name__)
config = {
    'user': 'root',
    'password': 'root',
    'host': '127.0.0.1',
    'port': '3306',
    'database': 'croc'
}
def face_crop(file_path):
    img = cv2.imread(file_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    if len(faces) > 0:
        for i, (x,y,w,h) in enumerate(faces):
            cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,255),2)
            face = img[y:y+h, x:x+w]
            cv2.imwrite(f'{file_path}', face)

@app.route('/check_role/<username>', methods=['GET'])
def check_role(username):
    
    query_string = f"SELECT Position FROM new_table WHERE Name = '{username}'"
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(query_string)
        role = cursor.fetchone()
        cursor.close()
        conn.close()
        if role:
            print(username)
            return {'role': role[0], 'name' : username}, 200
        else:
            return {'error': 'User not found'}, 404
    except mysql.connector.Error as error:
        print(error)
        return {'error': str(error)}, 400

@app.route('/upload', methods=['POST'])
def upload():
    data = request.json
    image_base64 = data['image']
    with(open('saved/image.jpg', 'wb')) as file:
        file.write(base64.b64decode(image_base64))
    face_crop('saved/image.jpg')
    KNOWN_FACES_DIR= "faces"
    for filename in os.listdir("faces"):
        current_image = face_recognition.load_image_file(f"saved/image.jpg")
        base_image = face_recognition.load_image_file(f"faces/{filename}")
        current_image_encoding = face_recognition.face_encodings(current_image)[0]
        base_image_encoding = face_recognition.face_encodings(base_image)[0]
        results = face_recognition.compare_faces([base_image_encoding], current_image_encoding)
        print(filename)
        if results[0]:
            print("success")
            return filename.split(".")[0], 200
            
            
    return "Fail", 200


@app.route('/telegram/<name>', methods=['POST'])
def Send_Message_Telegram(name): 
    print(name)
    message_text = f"Работник {name} воше в офис"
    if message_text:
        try:
            bot.send_message(chat_id=1239398217 , text=message_text)
            return {'status': 'Message sent'}, 200
        except Exception as e:
            return {'status': 'Failed to send message', 'error': str(e)}, 500
    else:
        return {'status': 'No message provided'}, 400

@app.route('/get_data/<query_string>')
def get_data(query_string):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(query_string)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return str(rows)
    except mysql.connector.Error as error:
        print(error)
        return 400


@app.route('/query/<query_string>')
def insert_data(query_string):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(query_string)
        conn.commit()
        cursor.close()
        conn.close()
        return 200
    except mysql.connector.Error as error:
        print(error)
        return 400


@app.route('/change_data/<query_string>')
def change_data(query_string):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(query_string)
        conn.commit()
        cursor.close()
        conn.close()
        return 200
    except mysql.connector.Error as error:
        print(error)
        return 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
