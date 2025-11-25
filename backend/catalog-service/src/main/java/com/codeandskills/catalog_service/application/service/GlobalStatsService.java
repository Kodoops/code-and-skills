package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.domain.model.CourseStatus;
import com.codeandskills.catalog_service.infrastructure.web.dto.GlobalStatsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;


@Service
@Slf4j
public class GlobalStatsService {

    private final CourseService courseService;
    private final CategoryService categoryService;
    private final DomainService domainService;

    public GlobalStatsService(CourseService courseService, CategoryService categoryService, DomainService domainService) {
        this.courseService = courseService;
        this.categoryService = categoryService;
        this.domainService = domainService;
    }

    public GlobalStatsResponse getGlobalStats(String status) {
        List<CourseDTO> courses;

        if (status == null || status.isBlank()) {
            courses = courseService.getAllCourses();
        } else {
            try {
                CourseStatus filter = CourseStatus.valueOf(status.toUpperCase());
                courses = courseService.getAllCourses(filter);
            } catch (IllegalArgumentException e) {
                courses = courseService.getAllCourses();
            }
        }


        return computeStats(courses);
    }

    private GlobalStatsResponse computeStats(List<CourseDTO> courses) {

        long publishedCount = courses.stream()
                .filter(c -> c.getStatus().equals(CourseStatus.PUBLISHED.toString()))
                .count();

        long draftCount = courses.stream()
                .filter(c -> c.getStatus().equals(CourseStatus.DRAFT.toString()))
                .count();

        long archivedCount = courses.stream()
                .filter(c -> c.getStatus().equals(CourseStatus.ARCHIVED.toString()))
                .count();

        int totalChapters = courses.stream()
                .mapToInt(course -> course.getChapters() != null ? course.getChapters().size() : 0)
                .sum();

        int totalLessons = courses.stream()
                .flatMap(course -> course.getChapters() != null ? course.getChapters().stream() : Stream.empty())
                .mapToInt(ch -> ch.getLessons() != null ? ch.getLessons().size() : 0)
                .sum();

        long categoriesCount = categoryService.findAll().stream().count();
        long domainsCount = domainService.findAll().stream().count();

        return GlobalStatsResponse.builder()
                .coursesCount(courses.size())
                .publishedCoursesCount((int) publishedCount)
                .draftCoursesCount((int) draftCount)
                .archivedCoursesCount((int) archivedCount)
                .chaptersCount(totalChapters)
                .lessonsCount(totalLessons)
                .categoriesCount((int) categoriesCount)
                .domainsCount((int) domainsCount)
                .build();
    }
}
