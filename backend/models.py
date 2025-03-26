from config import db

class Creature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    initiative = db.Column(db.Integer, unique=False, nullable=False)
    hp = db.Column(db.Integer, unique=False, nullable=True)
    max_hp = db.Column(db.Integer, unique=False, nullable=True)
    ac = db.Column(db.Integer, unique=False, nullable=True)
    conditions = db.Column(db.String(120), unique=False, nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "initiative": self.initiative,
            "hp": self.hp,
            "maxHp": self.max_hp,
            "ac": self.ac,
            "conditions": self.conditions
        }
    
