package in.manager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import in.manager.dto.IncomeDto;
import in.manager.entity.Category;
import in.manager.entity.Income;
import in.manager.entity.Profile;
import in.manager.repository.CategoryRepository;
import in.manager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {
	
	private final ProfileService profileService;
	private final CategoryRepository categoryRepository;
	private final IncomeRepository incomeRepository;
	
	private Income toEntity(IncomeDto incomeDto, Profile profile, Category category) {
		return Income.builder()
				.name(incomeDto.getName())
				.icon(incomeDto.getIcon())
				.amount(incomeDto.getAmount())
				.date(incomeDto.getDate())
				.profile(profile)
				.category(category)
				.build();
	}
	
	private IncomeDto toDto(Income income) {
		return IncomeDto.builder()
				.id(income.getId())
				.name(income.getName())
				.icon(income.getIcon())
				.categoryId(income.getCategory() != null ? income.getCategory().getId() : null)
				.categoryName(income.getCategory() != null ? income.getCategory().getName() : "N/A")
				.amount(income.getAmount())
				.date(income.getDate())
				.createdAt(income.getCreatedAt())
				.updatedAt(income.getUpdatedAt())
				.build();
	}
	
	public IncomeDto addIncome(IncomeDto dto) {
		Profile profile = profileService.getCurrentProfile();
		Category category=categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));
		Income newIncome = toEntity(dto, profile, category);
		newIncome=incomeRepository.save(newIncome);
		return toDto(newIncome);
	}
	
	public List<IncomeDto> getCurrentMonthIncomesForCurrentUser(){
		Profile profile=profileService.getCurrentProfile();
		LocalDate now=LocalDate.now();
		LocalDate startDate=now.withDayOfMonth(1);
		LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
		List<Income> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
		return list.stream().map(this::toDto).toList();
	}
	
	public void deleteIncome(Long incomeId) {
		Profile profile=profileService.getCurrentProfile();
		Income income=incomeRepository.findById(incomeId)
		.orElseThrow(() -> new RuntimeException("Income not found"));
		if(!income.getProfile().getId().equals(profile.getId())) {
			throw new RuntimeException("Unauthorized to delete this Income");
		}
		incomeRepository.delete(income);
	}
	
	public List<IncomeDto> getLatest5IncomesForCurrentUser(){
		Profile profile=profileService.getCurrentProfile();
		List<Income> list=incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
		return list.stream().map(this::toDto).toList();
	}
	
	public BigDecimal gettotalIncomesOfCurrentUser() {
		Profile profile=profileService.getCurrentProfile();
		BigDecimal totalIncome=incomeRepository.findTotalIncomeByProfileId(profile.getId());
		return totalIncome != null ? totalIncome : BigDecimal.ZERO;
	}
	
	public List<IncomeDto> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
		Profile profile = profileService.getCurrentProfile();
		List<Income> list=incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
				profile.getId(), startDate, endDate, keyword, sort
				);
		return list.stream().map(this::toDto).toList();
	}
	
}
