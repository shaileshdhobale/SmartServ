var express = require('express');
var router = express.Router();	

var expenseController = require('../controllers/expenseController.js');


router.post('/expense', expenseController.addExpense);
router.get('/expense', expenseController.getExpense);
router.put('/expense', expenseController.editExpense);
router.delete('/expense/:expenseId', expenseController.deleteExpense);

module.exports = router;