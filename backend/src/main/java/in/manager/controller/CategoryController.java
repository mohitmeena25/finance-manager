package in.manager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.manager.dto.CategoryDto;
import in.manager.service.CategoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

	private final CategoryService categoryService;
	
	@PostMapping
	public ResponseEntity<CategoryDto>  saveCategory(@RequestBody CategoryDto categoryDto){
		CategoryDto savedCategory=categoryService.saveCategory(categoryDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
	}
	
	@GetMapping
	public ResponseEntity<List<CategoryDto>> getCategories(){
		List<CategoryDto> categories=categoryService.getCategoriesForCurrentUser();
		return ResponseEntity.ok(categories);
	}
	
	@GetMapping("/{type}")
	public ResponseEntity<List<CategoryDto>> getCategoryByTypeForCurrentUser(@PathVariable String type){
		List<CategoryDto> list = categoryService.getCategoryByTypeForCurrentUser(type);
		return ResponseEntity.ok(list);
	}
	
	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDto categoryDto){
		CategoryDto updatedCategory=categoryService.updateCategory(categoryId, categoryDto);
		return ResponseEntity.ok(updatedCategory);
	}
	
}
