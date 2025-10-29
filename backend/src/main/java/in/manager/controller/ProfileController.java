package in.manager.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.manager.dto.AuthDto;
import in.manager.dto.ProfileDto;
import in.manager.service.ProfileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
	
	private final ProfileService profileService;
	
	@PostMapping("/register")
	public ResponseEntity<ProfileDto> registerProfile(@RequestBody ProfileDto profileDto){
		ProfileDto registedProfile = profileService.registerProfile(profileDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(registedProfile);
	}
	
	@GetMapping("/activate")
	public ResponseEntity<String> activateProfile(@RequestParam String token){
		boolean isActivated = profileService.activateProfile(token);
		if(isActivated) {
			return ResponseEntity.ok("Profile Activated Successfully");
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used");
		}
	}
		
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDto authDto){
		try {
			if(!profileService.isAccountActive(authDto.getEmail())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
						"message", "Account is not active. Please activate your account first."
						));
			}
			Map<String, Object> response=profileService.authenticateAndGenerateToken(authDto);
			return ResponseEntity.ok(response);
		}catch(Exception ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
					"message", ex.getMessage() 
					));
		}
	}
	
	@GetMapping("/profile")
	public ResponseEntity<ProfileDto>getPublicProfile(){
		ProfileDto profileDto=profileService.getPublicProfile(null);
		return ResponseEntity.ok(profileDto);
	}

}
