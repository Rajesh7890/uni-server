const Expense = require("../models/expense");

const ExpenseController = {
  getAllExpenses(req, res){
    Expense.getAll().then(expenses => {
      res.json({ success: true, message: 'All expenses', data: expenses });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error getting expenses', error: err });
    });
  },

  getExpenseById(req, res){
    const id = req.params.id;

    Expense.get(id).then(expense => {
      res.json({ success: true, message: 'Expense found', data: expense });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error getting expense', error: err });
    });
  },

  createExpense(req, res){
    const expense = req.body;

    Expense.create(expense).then(data => {
      res.json({ success: true, message: 'Expense created', data });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error creating expense', error: err });
    });
  },

  updateExpense(req, res){
    const id = req.params.id;
    const expense = req.body;

    Expense.update({ ...expense, id }).then(data => {
      res.json({ success: true, message: 'Expense updated', data });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error updating expense', error: err });
    });
  },

  deleteExpense(req, res){
    const id = req.params.id;

    Expense.delete(id).then(response => {
      if (!response){
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }

      res.json({ success: true, message: 'Expense deleted' });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error deleting expense', error: err });
    });
  }
};

module.exports = ExpenseController;
