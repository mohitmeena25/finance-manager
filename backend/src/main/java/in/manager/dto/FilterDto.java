package in.manager.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterDto {

	private String type;
	private LocalDate startDate;
	private LocalDate endDate;
	private String keyword;
	private String sortField; //date, amount, name
	private String sortOrder; //asc, desc
	
}
