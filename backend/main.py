from flask import request, jsonify, send_from_directory
from config import app, db
from models import Creature
import os

@app.route("/api/creatures", methods=["GET"])
def get_creatures():
    creatures = Creature.query.order_by(Creature.initiative.desc()).all()
    json_creatures = list(map(lambda x: x.to_json(), creatures))
    return jsonify({"creatures": json_creatures})

@app.route("/api/create_creature", methods=["POST"])
def create_creature():
    name = request.json.get("name")
    initiative = request.json.get("initiative")
    hp = request.json.get("hp")
    max_hp = request.json.get("maxHp")
    ac = request.json.get("ac")
    conditions = request.json.get("conditions")

    if not name or not initiative:
        return jsonify({"message": "You must enter at least a name and initiative (other inputs are optional)"}), 400
    
    if not max_hp:
        max_hp = "-"
    
    if not hp:
        hp = max_hp

    if not ac:
        ac = "-"

    if not conditions:
        conditions = "-"
    
    new_creature = Creature(name=name, initiative=initiative, hp=hp, max_hp=max_hp, ac=ac, conditions=conditions)
    try:
        db.session.add(new_creature)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Creature added!"}), 201

@app.route("/api/update_creature/<int:creature_id>", methods=["PATCH"])
def update_creature(creature_id):
    creature = Creature.query.get(creature_id)

    if not creature:
        return jsonify({"message": "Creature not found"}), 404
    
    data = request.json
    creature.name = data.get("name", creature.name)
    creature.initiative = data.get("initiative", creature.initiative)
    creature.hp = data.get("hp", creature.hp)
    creature.max_hp = data.get("maxHp", creature.max_hp)
    creature.ac = data.get("ac", creature.ac)
    creature.conditions = data.get("conditions", creature.conditions)

    if not creature.name or not creature.initiative:
        return jsonify({"message": "You must enter at least a name and initiative (other inputs are optional)"}), 400
    
    if not creature.max_hp:
        creature.max_hp = "-"
    
    if not creature.hp:
        creature.hp = creature.max_hp

    if not creature.ac:
        creature.ac = "-"

    if not creature.conditions:
        creature.conditions = "none"

    db.session.commit()

    return jsonify({"message:": "Creature updated"}), 200

@app.route("/api/delete_creature/<int:creature_id>", methods=["DELETE"])
def delete_creature(creature_id):
    creature = Creature.query.get(creature_id)

    if not creature:
        return jsonify({"message": "Creature not found"}), 404
    
    db.session.delete(creature)
    db.session.commit()

    return jsonify({"message": "Creature deleted"}), 200

@app.route("/api/duplicate_creature/<int:creature_id>", methods=["POST"])
def duplicate_creature(creature_id):
    creature = Creature.query.get(creature_id)

    if not creature:
        return jsonify({"message": "Creature not found"}), 404
    
    new_creature = Creature(
        name=creature.name,
        initiative=creature.initiative,
        hp=creature.hp,
        max_hp=creature.max_hp,
        ac=creature.ac,
        conditions=creature.conditions
    )

    try:
        db.session.add(new_creature)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Creature duplicated!"}), 201

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    if path.startswith('api/'):
        return "Not found", 404
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)