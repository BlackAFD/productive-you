from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {"id": 1, "title": "Finish DA2", "description": "Complete assignment 2", "due": "2025-09-01", "categories": ["urgent", "important"], "completed": False},
    {"id": 2, "title": "Review and Submit DAI", "description": "Homework DAI submission", "due": "2025-08-28", "categories": ["not urgent", "important"], "completed": True},
]

def get_next_id():
    return max((task["id"] for task in tasks), default=0) + 1

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = {
        "id": get_next_id(),
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "due": data.get("due", ""),
        "categories": data.get("categories", []),
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task.update(request.json)
            return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
