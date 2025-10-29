package in.manager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.manager.dto.ExpenseDto;
import in.manager.service.ExpenseService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

	private final ExpenseService expenseService;
	
	@PostMapping
	public ResponseEntity<ExpenseDto> addExpense(@RequestBody ExpenseDto dto){
		ExpenseDto savedDto=expenseService.addExpense(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
	}
	
	@GetMapping
	public ResponseEntity<List<ExpenseDto>> getExpenses(){
		List<ExpenseDto> expenses=expenseService.getCurrentMonthExpensesForCurrentUser();
		return ResponseEntity.ok(expenses);
	}
	
	@DeleteMapping("/{expenseId}")
	public ResponseEntity<Void> deleteIncome(@PathVariable("expenseId") Long expenseId){
		expenseService.deleteExpense(expenseId);
		return ResponseEntity.noContent().build();
	}
	
	
	
}
