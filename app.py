from flask import Flask, render_template, request, send_file
from graph_main import generate_plot
import io

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/plot', methods=['POST'])
def plot():
    # Retrieve user input from the form
    user_input = {
        "Initial_KS2_Karmic_Balance": float(request.form.get("initial_ks2_balance", 0)),
        "Quality": float(request.form.get("quality", 0)),
        "Timing": float(request.form.get("timing", 0)),
        "Logistics": float(request.form.get("logistics", 0)),
        "Quantity": float(request.form.get("quantity", 1)),
    }

    # Generate the plot
    img = generate_plot(user_input)
    return send_file(img, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)
