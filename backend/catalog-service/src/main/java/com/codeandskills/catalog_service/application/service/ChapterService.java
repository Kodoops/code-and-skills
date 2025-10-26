package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.ChapterDTO;
import com.codeandskills.catalog_service.application.mapper.ChapterMapper;
import com.codeandskills.catalog_service.domain.model.Chapter;
import com.codeandskills.catalog_service.domain.model.Course;
import com.codeandskills.catalog_service.domain.repository.ChapterRepository;
import com.codeandskills.catalog_service.domain.repository.CourseRepository;
import com.codeandskills.catalog_service.infrastructure.web.dto.ChapterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    @Qualifier("chapterMapper")
    private final ChapterMapper mapper;

    public List<ChapterDTO> getChaptersByCourse(String courseId) {
        return mapper.toDtoList(chapterRepository.findByCourseIdOrderByPositionAsc(courseId));
    }

    public ChapterDTO createChapter(String courseId, ChapterRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        boolean exists = chapterRepository.existsByCourseIdAndTitleIgnoreCase(courseId, request.title());
        if (exists) {
            throw new IllegalArgumentException("A chapter with this title already exists for this course");
        }

        int position = chapterRepository.findByCourseIdOrderByPositionAsc(courseId)
                .stream()
                .map(Chapter::getPosition)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        Chapter chapter = new Chapter(
                request.title(),
                position + 1,
                course,
                null
        );

        Chapter saved = chapterRepository.save(chapter);
        return mapper.toDto(saved);
    }

    public ChapterDTO updateChapter(String id, ChapterRequest request) {
        Optional<Chapter> existing = chapterRepository.findById(id);
        if (existing.isEmpty()) throw new IllegalArgumentException("Chapter not found");

        Chapter chapter = existing.get();
        if (request.title() != null) {
            chapter.setTitle(request.title());
        }
        // Si une position est fournie et différente
        if (request.position() > 0 && request.position() != chapter.getPosition()) {
            reorderChapter(chapter, request.position());
        }
        Chapter saved = chapterRepository.save(chapter);

        return mapper.toDto(saved);
    }

    /**
     * 🔹 Supprime un chapitre et recalcule les positions suivantes
     */
    public void deleteChapter(String id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        String courseId = chapter.getCourse().getId();
        chapterRepository.delete(chapter);
        log.info("🗑️ Deleted chapter '{}' (position {})", chapter.getTitle(), chapter.getPosition());

        // Recalcule les positions après suppression
        normalizeChapterPositions(courseId);
    }

    /**
     * 🔹 Réordonne un chapitre à une nouvelle position
     */
    private void reorderChapter(Chapter chapter, int newPosition) {
        String courseId = chapter.getCourse().getId();
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderByPositionAsc(courseId);

        chapters.remove(chapter);

        // Réinsère à la nouvelle position
        newPosition = Math.max(1, Math.min(newPosition, chapters.size() + 1));
        chapters.add(newPosition - 1, chapter);

        // Réindexe toutes les positions
        for (int i = 0; i < chapters.size(); i++) {
            chapters.get(i).setPosition(i + 1);
        }

        chapterRepository.saveAll(chapters);
    }

    /**
     * 🔹 Réindexe toutes les positions (utile après suppression)
     */
    private void normalizeChapterPositions(String courseId) {
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderByPositionAsc(courseId);

        // Trie pour s’assurer de l’ordre
        chapters.sort(Comparator.comparingInt(Chapter::getPosition));

        int index = 1;
        for (Chapter c : chapters) {
            c.setPosition(index++);
        }

        chapterRepository.saveAll(chapters);
        log.info("♻️ Reindexed {} chapters for course {}", chapters.size(), courseId);
    }
}