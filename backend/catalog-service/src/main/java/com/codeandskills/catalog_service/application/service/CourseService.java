package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.application.dto.CourseLessonCounts;
import com.codeandskills.catalog_service.application.dto.UserProfileDTO;
import com.codeandskills.catalog_service.application.mapper.CourseMapper;
import com.codeandskills.catalog_service.domain.model.Course;
import com.codeandskills.catalog_service.domain.model.CourseStatus;
import com.codeandskills.catalog_service.domain.model.Level;
import com.codeandskills.catalog_service.domain.model.Tag;
import com.codeandskills.catalog_service.domain.repository.CourseRepository;
import com.codeandskills.catalog_service.domain.repository.TagRepository;
import com.codeandskills.catalog_service.infrastructure.client.GetPublicUserProfile;
import com.codeandskills.catalog_service.infrastructure.client.UserProfileClient;
import com.codeandskills.common.events.catalog.CourseCreatedEvent;
import com.codeandskills.catalog_service.infrastructure.kafka.CourseEventProducer;
import com.codeandskills.common.events.catalog.CoursePublishedEvent;
import com.codeandskills.common.response.PagedResponse;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEventProducer eventProducer;
    private final TagRepository tagRepository;
    @Qualifier("courseMapper")
    private final CourseMapper mapper;

    private final UserProfileClient userProfileClient;

    /**
     * 🔹 Récupère une page de cours publiés (public)
     */
    public PagedResponse<CourseDTO> getPublicCourses(int page, int size) {
        Page<Course> result = courseRepository.findByStatus(CourseStatus.PUBLISHED, PageRequest.of(page, size));
        return mapper.toDtoPage(result);
    }

    /**
     * 🔹 Récupère les derniers cours publiés avec une limite (public)
     */
    public List<CourseDTO> getRecentCourses(int limit, boolean onlyPublished) {
        List<Course> courses;

        if (onlyPublished) {
            courses = courseRepository.findByStatusOrderByCreatedAtDesc(CourseStatus.PUBLISHED, PageRequest.of(0, limit));
        } else {
            courses = courseRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit));
        }

        return mapper.toDtoList(courses);
    }

    /**
     * 🔹 Récupère une page de tous les cours (admin)
     */
    public List<CourseDTO> getAllCourses() {
        List<Course> result = courseRepository.findAll();

        return mapper.toDtoList(result);
    }


    /**
     * 🔹 Récupère une page de tous les cours (admin)
     */
    public PagedResponse<CourseDTO> getAllCourses(int page, int size) {
        Page<Course> result = courseRepository.findAll(PageRequest.of(page, size));

        return mapper.toDtoPage(result);
    }


    /**
     * 🔹 Récupère une page de tous les cours (admin)
     */
    public List<CourseDTO> getAllCourses(CourseStatus status) {
        List<Course> result = courseRepository.findByStatus(status);

        return mapper.toDtoList(result);
    }

    /**
     * 🔹 Récupère une page de tous les cours (admin)
     */
    public PagedResponse<CourseDTO> getAllCoursesByStatus(CourseStatus status, int page, int size) {
        Page<Course> result = courseRepository.findByStatus(status, PageRequest.of(page, size));
        return mapper.toDtoPage(result);
    }

    /**
     * 🔹 Récupère un cours par ID
     */
    public CourseDTO getById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cours introuvable : " + id));
        return mapper.toDto(course);
    }


    /**
     * 🔹 Récupère un cours par SLUG
     */
    public CourseDTO getBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Cours introuvable : " + slug));
        CourseDTO dto =  mapper.toDto(course);

        // 🔹 Récupère les infos de l'utilisateur (microservice user)
        try {
            UserProfileDTO userProfileById = userProfileClient.getUserProfileById(new GetPublicUserProfile(course.getUserId()));
            dto.setUser(userProfileById);
        } catch (Exception e) {
            log.info(e.getMessage(), e);
            dto.setUser(null);
        }

        return dto;
    }


    /**
     * 🔹 Récupère un cours par User ID
     */
    public PagedResponse<CourseDTO> getByUserId(String userId , int page, int size ) {
        Page<Course> courses = courseRepository.findByUserId(userId, PageRequest.of(page, size));

        return mapper.toDtoPage(courses);
    }


    /**
     * 🔧 Crée un nouveau cours
     */
    @Transactional
    public CourseDTO createCourse(Course course, String courseId) {

        if (courseRepository.existsBySlug(course.getSlug())) {
            throw new IllegalArgumentException("Slug already exists");
        }

        if (courseRepository.existsByTitle(course.getTitle())) {
            throw new IllegalArgumentException("Title already exists");
        }

        if (courseId != null) {
            course.setId(courseId);
        }
        course.setStatus(CourseStatus.DRAFT);
        Course saved = courseRepository.save(course);

        eventProducer.sendCourseCreatedEvent(
                CourseCreatedEvent.builder()
                        .id(saved.getId())
                        .title(saved.getTitle())
                        .slug(saved.getSlug())
                        .userId(saved.getUserId())
                        .status(saved.getStatus().name())
                        .build()
        );
        return mapper.toDto(saved);
    }

    // 🔹 Publier un cours
    @Transactional
    public CourseDTO publishCourse(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus(CourseStatus.PUBLISHED);
        Course saved = courseRepository.save(course);

        eventProducer.sendCoursePublishedEvent(
                CoursePublishedEvent.builder()
                        .id(saved.getId())
                        .title(saved.getTitle())
                        .slug(saved.getSlug())
                        .userId(saved.getUserId())
                        .build()
        );

        return mapper.toDto(saved);
    }

    /**
     * ✏️ Met à jour un cours existant
     */
    public CourseDTO updateCourse(String id, Course updates) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cours introuvable : " + id));

        // 🔹 Mise à jour des champs simples
        existing.setTitle(updates.getTitle());
        existing.setSlug(updates.getSlug());
        existing.setSmallDescription(updates.getSmallDescription());
        existing.setDescription(updates.getDescription());
        existing.setDuration(updates.getDuration());
        existing.setLevel(updates.getLevel());
        existing.setCurrency(updates.getCurrency());
        existing.setPrice(updates.getPrice());
        existing.setFileKey(updates.getFileKey());
        existing.setStatus(updates.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setUserId(updates.getUserId());
        existing.setCategory(updates.getCategory());

        // 🔹 Mise à jour des tags si fournis
        if (updates.getTags() != null && !updates.getTags().isEmpty()) {
            existing.setTags(updates.getTags());
        }

        // 🔹 Mise à jour des ressources (futur microservice)
        if (updates.getResourceIds() != null) {
            existing.setResourceIds(updates.getResourceIds());
        }

        Course saved = courseRepository.save(existing);
        log.info("✏️ Cours mis à jour : {}", saved.getTitle());
        return mapper.toDto(saved);
    }


    // 🔹 Supprimer un cours
    @Transactional
    public void deleteCourse(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        courseRepository.delete(course);
    }

    @Transactional
    public void deleteUserCourse(String id, String userId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getUserId().equals(userId)) {
            throw new SecurityException("Vous n'êtes pas autorisé à supprimer ce cours.");
        }

        courseRepository.delete(course);
    }

    public CourseDTO updateObjectives(String id, List<String> objectives) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.setObjectives(objectives);
        course.setUpdatedAt(LocalDateTime.now());
        Course updated = courseRepository.save(course);
        return mapper.toDto(updated);
    }

    public CourseDTO updatePrerequisites(String id, List<String> prerequisites) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.setPrerequisites(prerequisites);
        course.setUpdatedAt(LocalDateTime.now());
        Course updated = courseRepository.save(course);

        return mapper.toDto(updated);
    }

    /**
     * 🔄 Met à jour les tags d’un cours existant
     */
    @Transactional
    public Course updateCourseTags(String courseId, List<String> tagIds) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        Set<Tag> newTags = new HashSet<>(tagRepository.findAllById(tagIds));
        course.setTags(newTags);

        return courseRepository.save(course);
    }

    public PagedResponse<CourseDTO> getFilteredCourses(String categorySlug, String level, Boolean isFree, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Level levelEnum = null;
        if (level != null && !level.isBlank()) {
            try {
                levelEnum = Level.valueOf(level.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid level value: " + level);
            }
        }

        Page<Course> resultPage = courseRepository.findByFilters(categorySlug, levelEnum, isFree, pageable);

        List<CourseDTO> content = resultPage.getContent()
                .stream()
                .map(mapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );
    }

    public List<CourseDTO> getCoursesByIds(List<String> ids) {
        return courseRepository.findAllById(ids)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public long countCourses(CourseStatus status) {
        return courseRepository.countByOptionalStatus(status);
    }

    public CourseLessonCounts getCountsByStatus(@Nullable CourseStatus status) {
        return courseRepository.countCoursesAndLessonsByStatus(status);
    }
}