package in.manager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import in.manager.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {

List<Income> findByProfileIdOrderByDateDesc(Long profileId);
	
	List<Income> findTop5ByProfileIdOrderByDateDesc(Long profileId);
	
	@Query("Select SUM(i.amount) from Income i where i.profile.id = :profileId")
	BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);
	
	List<Income> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase
	(Long profileId, LocalDate startDate, LocalDate endDate, String name, Sort sort);
	
	List<Income> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate,LocalDate endDate);
	
}
