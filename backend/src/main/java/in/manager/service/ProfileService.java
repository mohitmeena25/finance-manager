package in.manager.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import in.manager.dto.AuthDto;
import in.manager.dto.ProfileDto;
import in.manager.entity.Profile;
import in.manager.repository.ProfileRepository;
import in.manager.util.JwtUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final ProfileRepository profileRepository;
	private final EmailService emailService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	
	@Value("${app.activation.url}")
	private String activationUrl;
	
	public ProfileDto registerProfile(ProfileDto profileDto) {
		
		Profile newProfile=toProfile(profileDto);
		newProfile.setActivationToken(UUID.randomUUID().toString());
		profileRepository.save(newProfile);
		
		//send activation link
		
		String activationLink = activationUrl+"/api/v1.0/activate?token=" + newProfile.getActivationToken();
		String subject = "Activate your Money Manager Account";

		String body = "<html>" +
		    "<body>" +
		    "<p>Dear " + newProfile.getFullName() + ",</p>" +
		    "<p>Welcome to Money Manager! To activate your account, please click the button below:</p>" +
		    "<p>" +
		    "<a href='" + activationLink + "' style='display:inline-block;padding:10px 20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px;'>Activate Account</a>" +
		    "</p>" +
		    "<p>If the button doesn't work, you can also copy and paste this link into your browser:</p>" +
		    "<p><a href='" + activationLink + "'>" + activationLink + "</a></p>" +
		    "<p>Best regards,<br>The Money Manager Team</p>" +
		    "</body>" +
		    "</html>";
		
		emailService.sendEmail(newProfile.getEmail(), subject, body);

		
		return toDto(newProfile);
	}
	
	public Profile toProfile(ProfileDto profileDto) {
		return Profile.builder()
				.id(profileDto.getId())
				.fullName(profileDto.getFullName())
				.email(profileDto.getEmail())
				.password(passwordEncoder.encode(profileDto.getPassword()))
				.profileImageUrl(profileDto.getProfileImageUrl())
				.createdAt(profileDto.getCreatedAt())
				.updatedAt(profileDto.getUpdatedAt())
				.build();
	}
	
	public ProfileDto toDto(Profile profile) {
		return ProfileDto.builder()
				.id(profile.getId())
				.fullName(profile.getFullName())
				.email(profile.getEmail())
				.profileImageUrl(profile.getProfileImageUrl())
				.createdAt(profile.getCreatedAt())
				.updatedAt(profile.getUpdatedAt())
				.build();
	}
	
	public boolean activateProfile(String activationToken) {
		return profileRepository.findByActivationToken(activationToken)
				.map(profile -> {
					profile.setIsActive(true);
					profileRepository.save(profile);
					return true;
				})
				.orElse(false);
	}
	
	public boolean isAccountActive(String email) {
		return profileRepository.findByEmail(email)
				.map(Profile::getIsActive)
				.orElse(false);
	}
	
	public Profile getCurrentProfile() {
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		return profileRepository.findByEmail(authentication.getName())
		.orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: "+authentication.getName()));
	}
	
	public ProfileDto getPublicProfile(String email) {
		Profile currentUser=null;
		if(email==null) {
			currentUser=getCurrentProfile();
		}else {
			currentUser=profileRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: "+email));
		}
		return ProfileDto.builder()
				.id(currentUser.getId())
				.fullName(currentUser.getFullName())
				.email(currentUser.getEmail())
				.profileImageUrl(currentUser.getProfileImageUrl())
				.createdAt(currentUser.getCreatedAt())
				.updatedAt(currentUser.getUpdatedAt())
				.build();
	}
	
	public Map<String, Object> authenticateAndGenerateToken(AuthDto authDto){
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDto.getEmail(), authDto.getPassword()));
			
			String token=jwtUtil.generateToken(authDto.getEmail());
			
			return Map.of(
					"token", token ,
					"user", getPublicProfile(authDto.getEmail())
					);
		}catch(Exception ex) {
			throw new RuntimeException("Invalid email or password");
		}
	}
	
}
