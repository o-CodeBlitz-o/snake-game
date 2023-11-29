from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

#file path
score_file = "snake game/static/highscore.txt"


@app.route('/')
def home():
    return render_template('index.html')

#sending the Highscore value
@app.route('/GetHighScore', methods=['GET'])
def GetHighScore():
    with open(score_file, 'r') as file:
        content = file.read()

    data_dict = {"data": content}
    return jsonify(data_dict)

#receiving highscore data from game
@app.route('/HighScore', methods=['POST'])
def HighScore():
    json_data = request.get_json()
    highscore_value = json_data.get('highscore')

    with open(score_file, 'r') as file:
        content = file.read()
        
    if content < highscore_value:  #compare the previous highscore with current score
        with open(score_file, 'w') as file:
            file.write(str(highscore_value))

    return "done"


if __name__ == "__main__":
    app.run(debug=True) #run at local host
