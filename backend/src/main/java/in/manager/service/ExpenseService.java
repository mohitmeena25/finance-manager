package in.manager.service;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import in.manager.dto.ExpenseDto;
import in.manager.entity.Category;
import in.manager.entity.Expense;
import in.manager.entity.Profile;
import in.manager.repository.CategoryRepository;
import in.manager.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ProfileService profileService;
	private final CategoryRepository categoryRepository;
	private final ExpenseRepository expenseRepository;
	
	private Expense toEntity(ExpenseDto expenseDto, Profile profile, Category category) {
		return Expense.builder()
				.name(expenseDto.getName())
				.icon(expenseDto.getIcon())
				.amount(expenseDto.getAmount())
				.date(expenseDto.getDate())
				.profile(profile)
				.category(category)
				.build();
	}
	
	private ExpenseDto toDto(Expense expense) {
		return ExpenseDto.builder()
				.id(expense.getId())
				.name(expense.getName())
				.icon(expense.getIcon())
				.categoryId(expense.getCategory() != null ? expense.getCategory().getId() : null)
				.categoryName(expense.getCategory() != null ? expense.getCategory().getName() : "N/A")
				.amount(expense.getAmount())
				.date(expense.getDate())
				.createdAt(expense.getCreatedAt())
				.updatedAt(expense.getUpdatedAt())
				.build();
	}
	
	public ExpenseDto addExpense(ExpenseDto dto) {
		Profile profile = profileService.getCurrentProfile();
		Category category=categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));
		Expense newExpense = toEntity(dto, profile, category);
		newExpense=expenseRepository.save(newExpense);
		return toDto(newExpense);
	}
	
	public List<ExpenseDto> getCurrentMonthExpensesForCurrentUser(){
		Profile profile=profileService.getCurrentProfile();
		LocalDate now=LocalDate.now();
		LocalDate startDate=now.withDayOfMonth(1);
		LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
		List<Expense> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
		return list.stream().map(this::toDto).toList();
	}
	
	public void deleteExpense(Long expenseId) {
		Profile profile=profileService.getCurrentProfile();
		Expense expense=expenseRepository.findById(expenseId)
		.orElseThrow(() -> new RuntimeException("Expense not found"));
		if(!expense.getProfile().getId().equals(profile.getId())) {
			throw new RuntimeException("Unauthorized to delete this expense");
		}
		expenseRepository.delete(expense);
	}
	
	public List<ExpenseDto> getLatest5ExpensesForCurrentUser(){
		Profile profile=profileService.getCurrentProfile();
		List<Expense> list=expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
		return list.stream().map(this::toDto).toList();
	}
	
	public BigDecimal gettotalExpensesOfCurrentUser() {
		Profile profile=profileService.getCurrentProfile();
		BigDecimal totalExpense=expenseRepository.findTotalExpenseByProfileId(profile.getId());
		return totalExpense != null ? totalExpense : BigDecimal.ZERO;
	}
	
	public List<ExpenseDto> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
		Profile profile = profileService.getCurrentProfile();
		List<Expense> list=expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
				profile.getId(), startDate, endDate, keyword, sort
				);
		return list.stream().map(this::toDto).toList();
	}
	
	//Notifications
	public List<ExpenseDto> getExpensesForUserOnDate(Long profileId, LocalDate date){
		List<Expense> list=expenseRepository.findByProfileIdAndDate(profileId, date);
		return list.stream().map(this::toDto).toList();
	}
	
}
