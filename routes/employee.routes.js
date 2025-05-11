const employeeController = require('../controllers/employee.controller');
const router = require('express').Router();
// normal employee details routes
router.post('/api/employees', employeeController.createEmployee);
router.get('/api/employees', employeeController.getAllEmployees);
router.get('/api/employees/:id', employeeController.getEmployeeById);
router.put('/api/employees/:id', employeeController.updateEmployee);
router.delete('/api/employees/:id', employeeController.deleteEmployee);
// employee performance routes
router.get('/api/reports/averagesalary', employeeController.getAverageSalaryByDepartment);
router.get('/api/reports/performance', employeeController.getEmployeePerformance);
router.get('/api/reports/budgetutilization', employeeController.getDepartmentBudgetUtilization);
router.get('/api/reports/employeetenure', employeeController.getemployeeTenure);
module.exports = router;