from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/db_name'
db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{'id': expense.id, 'description': expense.description, 'amount': expense.amount} for expense in expenses])

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json
    new_expense = Expense(description=data['description'], amount=data['amount'])
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({'id': new_expense.id, 'description': new_expense.description, 'amount': new_expense.amount})

@app.route('/expenses/<int:expense_id>', methods=['PUT'])
def edit_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    data = request.json
    expense.description = data['description']
    expense.amount = data['amount']
    db.session.commit()
    return jsonify({'id': expense.id, 'description': expense.description, 'amount': expense.amount})

@app.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
