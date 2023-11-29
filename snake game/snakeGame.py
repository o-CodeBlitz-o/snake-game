from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


score_file = "snake game/static/highscore.txt"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/GetHighScore', methods=['GET'])
def GetHighScore():
    # Read the high score value from 'highscore.txt'
    with open(score_file, 'r') as file:
        content = file.read()

    data_dict = {"data": content}
    return jsonify(data_dict)


@app.route('/HighScore', methods=['POST'])
def HighScore():
    # Get the JSON data from the request
    json_data = request.get_json()
    highscore_value = json_data.get('highscore')

    with open(score_file, 'r') as file:
        content = file.read()
    if content < highscore_value:
        with open(score_file, 'w') as file:
            file.write(str(highscore_value))

    return "done"


if __name__ == "__main__":
    app.run(debug=True) //run at local host
