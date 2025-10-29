package in.manager.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import in.manager.dto.CategoryDto;
import in.manager.entity.Category;
import in.manager.entity.Profile;
import in.manager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
	
	private final ProfileService profileService;
	private final CategoryRepository categoryRepository;
	
	private Category toEntity(CategoryDto categoryDto, Profile profile) {
		return Category.builder()
				.name(categoryDto.getName())
				.icon(categoryDto.getIcon())
				.profile(profile)
				.type(categoryDto.getType())
				.build();
	}
	
	private CategoryDto toDto(Category category) {
		return CategoryDto.builder()
				.id(category.getId())
				.profileId(category.getProfile()!=null ? category.getProfile().getId() : null)
				.name(category.getName())
				.icon(category.getIcon())
				.createdAt(category.getCreatedAt())
				.updatedAt(category.getUpdatedAt())
				.type(category.getType())
				.build();
	}
	
	public CategoryDto saveCategory(CategoryDto categoryDto) {
		Profile profile=profileService.getCurrentProfile();
		if(categoryRepository.existsByNameAndProfileId(categoryDto.getName(), profile.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,"Category with this name already exists");
		}
		Category newCategory=toEntity(categoryDto, profile);
		newCategory=categoryRepository.save(newCategory);
		return toDto(newCategory);
	}
	
	public List<CategoryDto> getCategoriesForCurrentUser(){
		Profile profile=profileService.getCurrentProfile();
		List<Category> categories=categoryRepository.findByProfileId(profile.getId());
		return categories.stream().map(this::toDto).toList();
	}
	
	public List<CategoryDto> getCategoryByTypeForCurrentUser(String type) {
		Profile profile=profileService.getCurrentProfile();
		List<Category> category=categoryRepository.findByTypeAndProfileId(type, profile.getId());
		return category.stream().map(this::toDto).toList();
	}
	
	public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto) {
		Profile profile=profileService.getCurrentProfile();
		Category existingCategory = categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
				.orElseThrow(() -> new RuntimeException("Category not found or not accesible"));
		existingCategory.setName(categoryDto.getName());
		existingCategory.setIcon(categoryDto.getIcon());
		existingCategory = categoryRepository.save(existingCategory);
		return toDto(existingCategory);
	}

}
