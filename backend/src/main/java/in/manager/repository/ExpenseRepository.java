package in.manager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import in.manager.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByProfileIdOrderByDateDesc(Long profileId);
	
	List<Expense> findTop5ByProfileIdOrderByDateDesc(Long profileId);
	
	@Query("Select SUM(e.amount) from Expense e where e.profile.id = :profileId")
	BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);
	
	List<Expense> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase
	(Long profileId, LocalDate startDate, LocalDate endDate, String name, Sort sort);
	
	List<Expense> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate,LocalDate endDate);
	
	List<Expense> findByProfileIdAndDate(Long profileId, LocalDate date);
	
}
