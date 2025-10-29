package in.manager.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import in.manager.dto.ExpenseDto;
import in.manager.dto.IncomeDto;
import in.manager.dto.RecentTransactionDto;
import in.manager.entity.Profile;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;
    
    public Map<String, Object> getDashBoardData() {
        Profile profile = profileService.getCurrentProfile();
        
        List<IncomeDto> latestIncomes=incomeService.getLatest5IncomesForCurrentUser();
        List<ExpenseDto> latestExpenses=expenseService.getLatest5ExpensesForCurrentUser();

        List<RecentTransactionDto> incomeTransactions = latestIncomes.stream()
        	    .map(income -> RecentTransactionDto.builder()
        	        .id(income.getId())
        	        .profileId(profile.getId())
        	        .icon(income.getIcon())
        	        .name(income.getName())
        	        .amount(income.getAmount())
        	        .date(income.getDate())
        	        .createdAt(income.getCreatedAt())
        	        .updatedAt(income.getUpdatedAt())
        	        .type("income")
        	        .build())
        	    .collect(Collectors.toList());

        	List<RecentTransactionDto> expenseTransactions = latestExpenses.stream()
        	    .map(expense -> RecentTransactionDto.builder()
        	        .id(expense.getId())
        	        .profileId(profile.getId())
        	        .icon(expense.getIcon())
        	        .name(expense.getName())
        	        .amount(expense.getAmount())
        	        .date(expense.getDate())
        	        .createdAt(expense.getCreatedAt())
        	        .updatedAt(expense.getUpdatedAt())
        	        .type("expense")
        	        .build())
        	    .collect(Collectors.toList());


        List<RecentTransactionDto> recentTransactions = Stream.concat(
                incomeTransactions.stream(),
                expenseTransactions.stream())
            .sorted((a, b) -> {
                int cmp = b.getDate().compareTo(a.getDate());
                if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                }
                return cmp;
            })
            .collect(Collectors.toList());

        Map<String, Object> returnValue = new LinkedHashMap<>();
        returnValue.put("totalBalance", incomeService.gettotalIncomesOfCurrentUser()
        		.subtract(expenseService.gettotalExpensesOfCurrentUser())
        		);
        returnValue.put("totalIncome", incomeService.gettotalIncomesOfCurrentUser());
        returnValue.put("totalExpense", expenseService.gettotalExpensesOfCurrentUser());
        returnValue.put("recent5Expenses", latestExpenses);
        returnValue.put("recent5Incomes", latestIncomes);
        returnValue.put("recentTransactions", recentTransactions);
        return returnValue;
    }

}
