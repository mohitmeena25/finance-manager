package in.manager.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.manager.dto.ExpenseDto;
import in.manager.dto.FilterDto;
import in.manager.dto.IncomeDto;
import in.manager.service.ExpenseService;
import in.manager.service.IncomeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

	private final ExpenseService expenseService;
	private final IncomeService incomeService;
	
	@PostMapping
	public ResponseEntity<?> filterTransaction(@RequestBody FilterDto filterDto){
		LocalDate startDate=filterDto.getStartDate() !=null ? filterDto.getStartDate() : LocalDate.MIN;
		LocalDate endDate=filterDto.getEndDate() !=null ? filterDto.getEndDate() : LocalDate.now();
		String keyword=filterDto.getKeyword() !=null ? filterDto.getKeyword() : "";
		String sortField=filterDto.getSortField() !=null ? filterDto.getSortField() : "date" ;
		Sort.Direction direction="desc".equalsIgnoreCase(filterDto.getSortOrder()) ?Sort.Direction.DESC : Sort.Direction.ASC ;
		Sort sort=Sort.by(direction,sortField);
		if("income".equals(filterDto.getType())) {
			List<IncomeDto> incomes=incomeService.filterIncomes(startDate, endDate, keyword, sort);
			return ResponseEntity.ok(incomes);
		} else if("expense".equals(filterDto.getType())) {
			List<ExpenseDto> expenses=expenseService.filterExpenses(startDate, endDate, keyword, sort);
			return ResponseEntity.ok(expenses);
		} else {
			return ResponseEntity.badRequest().body("Invalid type. Must be 'income' or 'expense'");
		}
	}
	
}
