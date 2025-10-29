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

import in.manager.dto.IncomeDto;
import in.manager.service.IncomeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {
	
	private final IncomeService incomeService;

	@PostMapping
	public ResponseEntity<IncomeDto> addExpense(@RequestBody IncomeDto dto){
		IncomeDto savedDto=incomeService.addIncome(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
	}
	
	@GetMapping
	public ResponseEntity<List<IncomeDto>> getExpenses(){
		List<IncomeDto> incomes=incomeService.getCurrentMonthIncomesForCurrentUser();
		return ResponseEntity.ok(incomes);
	}
	
	@DeleteMapping("/{incomeId}")
	public ResponseEntity<Void> deleteIncome(@PathVariable("incomeId") Long incomeId){
		incomeService.deleteIncome(incomeId);
		return ResponseEntity.noContent().build();
	}
	
}
