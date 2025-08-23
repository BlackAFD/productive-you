from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {"id": 1, "title": "Buy books", "description": "Order textbooks online", "due": "2025-08-25", "categories": ["urgent", "important"], "completed": False},
    {"id": 2, "title": "Apply for club", "description": "Write and submit application", "due": "2025-08-23", "categories": ["not urgent", "important"], "completed": False},
]

def get_next_id():
    return max((t["id"] for t in tasks), default=0) + 1

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

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

# Stub for future AI categorization endpoint
@app.route('/api/ai/categorize', methods=['POST'])
def ai_categorize():
    # For now, simply returns categories based on keywords in title/desc
    data = request.json
    title = data.get("title", "").lower()
    desc = data.get("description", "").lower()
    cats = []
    if "urgent" in title or "urgent" in desc:
        cats.append("urgent")
    if "important" in title or "important" in desc:
        cats.append("important")
    if not cats:
        cats = ["not urgent", "not important"]
    return jsonify({"categories": cats})

if __name__ == '__main__':
    app.run(debug=True)
