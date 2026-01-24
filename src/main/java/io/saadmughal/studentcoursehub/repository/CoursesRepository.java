package io.saadmughal.studentcoursehub.repository;

import io.saadmughal.studentcoursehub.entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CoursesRepository extends JpaRepository<Courses, Long>, JpaSpecificationExecutor<Courses> {

    Optional<Courses> findByCode(String code);

    boolean existsByCode(String code);
}
