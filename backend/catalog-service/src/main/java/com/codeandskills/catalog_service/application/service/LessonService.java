package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.LessonDTO;
import com.codeandskills.catalog_service.application.mapper.LessonMapper;
import com.codeandskills.catalog_service.domain.model.Chapter;
import com.codeandskills.catalog_service.domain.model.Lesson;
import com.codeandskills.catalog_service.domain.repository.ChapterRepository;
import com.codeandskills.catalog_service.domain.repository.LessonRepository;
import com.codeandskills.catalog_service.infrastructure.web.dto.LessonRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;
    @Qualifier("lessonMapper")
    private final LessonMapper mapper;

    /**
     * 🔹 Liste toutes les leçons d’un chapitre
     */
    public List<LessonDTO> getLessonsByChapter(String chapterId) {
        log.info("Fetching lessons for chapter: {}", chapterId);
        return mapper.toDtoList(lessonRepository.findByChapterIdOrderByPositionAsc(chapterId));
    }

    /**
     * 🔹 Crée une nouvelle leçon dans un chapitre
     */
    public LessonDTO createLesson(String chapterId, LessonRequest request) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found " ));

        boolean exists = lessonRepository.existsByChapterIdAndTitleIgnoreCase(chapterId, request.title());
        if (exists) {
            throw new IllegalArgumentException("A lesson with this title already exists in this chapter");
        }

        int nextPosition = lessonRepository.findByChapterIdOrderByPositionAsc(chapterId)
                .stream()
                .map(Lesson::getPosition)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        Lesson lesson = Lesson.builder()
                .title(request.title())
                .description(request.description())
                .thumbnailKey(request.thumbnailKey())
                .videoKey(request.videoKey())
                .duration(request.duration())
                .position(nextPosition)
                .publicAccess(request.publicAccess())
                .chapter(chapter)
                .build();

        Lesson saved = lessonRepository.save(lesson);
        log.info("Lesson created: {}", saved.getTitle());
        return mapper.toDto(saved);
    }

    /**
     * 🔹 Met à jour une leçon
     */
    public LessonDTO updateLesson(String id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found " ));

        if (request.title() != null) lesson.setTitle(request.title());
        if (request.description() != null) lesson.setDescription(request.description());
        if (request.thumbnailKey() != null) lesson.setThumbnailKey(request.thumbnailKey());
        if (request.videoKey() != null) lesson.setVideoKey(request.videoKey());
        if (request.duration() != null) lesson.setDuration(request.duration());
        lesson.setPublicAccess(request.publicAccess() != null ? request.publicAccess() : lesson.isPublicAccess());

        if (request.position() != null && request.position() > 0 && request.position() != lesson.getPosition()) {
            reorderLesson(lesson, request.position());
        }

        Lesson saved = lessonRepository.save(lesson);
        log.info("✅ Updated lesson '{}' (pos={})", saved.getTitle(), saved.getPosition());
        return mapper.toDto(saved);
    }

    /**
     * 🔹 Supprime une leçon et recalcule les positions suivantes
     */
    public void deleteLesson(String id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        String chapterId = lesson.getChapter().getId();
        lessonRepository.delete(lesson);
        log.info("🗑️ Deleted lesson '{}' (pos={})", lesson.getTitle(), lesson.getPosition());

        normalizeLessonPositions(chapterId);
    }

    /**
     * 🔹 Réordonne une leçon à une nouvelle position
     */
    private void reorderLesson(Lesson lesson, int newPosition) {
        String chapterId = lesson.getChapter().getId();
        List<Lesson> lessons = lessonRepository.findByChapterIdOrderByPositionAsc(chapterId);

        lessons.remove(lesson);
        newPosition = Math.max(1, Math.min(newPosition, lessons.size() + 1));
        lessons.add(newPosition - 1, lesson);

        for (int i = 0; i < lessons.size(); i++) {
            lessons.get(i).setPosition(i + 1);
        }

        lessonRepository.saveAll(lessons);
    }

    /**
     * 🔹 Réindexe les positions des leçons après suppression
     */
    private void normalizeLessonPositions(String chapterId) {
        List<Lesson> lessons = lessonRepository.findByChapterIdOrderByPositionAsc(chapterId);
        lessons.sort(Comparator.comparingInt(Lesson::getPosition));

        int index = 1;
        for (Lesson l : lessons) {
            l.setPosition(index++);
        }

        lessonRepository.saveAll(lessons);
        log.info("♻️ Reindexed {} lessons for chapter {}", lessons.size(), chapterId);
    }

    public LessonDTO getLessonById(String id) {
        Optional<Lesson> optionalLesson = lessonRepository.findById(id);

        if(!optionalLesson.isPresent()){
            throw new IllegalArgumentException("Lesson not found");
        }

        return mapper.toDto(optionalLesson.get());
    }
}