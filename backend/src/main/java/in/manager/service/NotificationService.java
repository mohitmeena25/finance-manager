package in.manager.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import in.manager.dto.ExpenseDto;
import in.manager.entity.Profile;
import in.manager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

	private final ProfileRepository profileRepository;
	private final EmailService emailService;
	private final ExpenseService expenseService;
	
	@Value("${money.manager.frontend.url}")
	private String frontendUrl;
	
	@Scheduled(cron = "0 0 22 * * *",zone = "IST")
	public void sendDailyIncomeExpenseRemainder() {
		log.info("Job started : sendDailyIncomeExpenseRemainder()");
		List<Profile> profiles=profileRepository.findAll();
		for(Profile profile : profiles) {
			String body ="<p>Dear " + profile.getFullName() 
			+ ",</p><p>Just a friendly reminder to log your income and expenses for today in the Money Manager app.</p>"
			+ "<p><a href='" + frontendUrl + "' style='display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;'>Go to Money Manager</a></p>"
					+ "<p>Best regards,<br>The Money Manager Team</p>";

			emailService.sendEmail(profile.getEmail(), "Daily reminder: Add your income and expenses", body);
		}
		log.info("Job completed : sendDailyIncomeExpenseRemainder()");
	}
	
@Scheduled(cron = "0 0 23 * * *",zone = "IST")
	public void sendDailyExpenseSummary() {
		log.info("Job started : sendDailyExpenseSummary()");
		List<Profile> profiles=profileRepository.findAll();
		for(Profile profile : profiles) {
			List<ExpenseDto> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());
			if(!todaysExpenses.isEmpty()) {
				StringBuilder table= new StringBuilder();
				table.append("<table style='border-collapse:collapse;width:100%'>");
				table.append("<tr style='background-color:#f2f2f2;'><th style='border:1px solid #ddd; padding:8px;'>S.No</th><th style='border:1px solid #ddd; padding:8px;'>Name</th><th style='border:1px solid #ddd; padding:8px;'>Amount</th><th style='border:1px solid #ddd; padding:8px;'>Category</th></tr>");
				int i=1;
				for(ExpenseDto expense: todaysExpenses) {
					table.append("<tr>");
					table.append("<td style='border:1px solid #ddd; padding:8px'>").append(i++).append("</td>");
					table.append("<td style='border:1px solid #ddd; padding:8px'>").append(expense.getName()).append("</td>");
					table.append("<td style='border:1px solid #ddd; padding:8px'>").append(expense.getAmount()).append("</td>");
					table.append("<td style='border:1px solid #ddd; padding:8px'>").append(expense.getCategoryId() !=null ? expense.getCategoryName() : "N/A" ).append("</td>");
					table.append("</tr>");
				}
				table.append("</table>");
				String body="Hi "+profile.getFullName()+",<br/><br/> Here is a summary of your expenses today: <br/><br/>"+table+"<br/><br/>Best regards,<br/><br/> The Money Manager Team";
				emailService.sendEmail(profile.getEmail(), "Your daily Expense summary", body);
			}
		}
		log.info("Job Completed : sendDailyExpenseSummary()");
	}
	
}
