package io.khadijah.smartcoursehub.config;

import io.khadijah.smartcoursehub.entity.Courses;
import io.khadijah.smartcoursehub.entity.Sections;
import io.khadijah.smartcoursehub.entity.Users;
import io.khadijah.smartcoursehub.repository.CoursesRepository;
import io.khadijah.smartcoursehub.repository.SectionsRepository;
import io.khadijah.smartcoursehub.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private SectionsRepository sectionsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        createAdminUser();
        loadCoursesFromCSV();
    }

    private void createAdminUser() {
        if (usersRepository.findByEmail("admin@smartcoursehub.com").isEmpty()) {
            Users admin = Users.builder()
                    .name("System Administrator")
                    .email("admin@smartcoursehub.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .enabled(true)
                    .build();
            usersRepository.save(admin);
            System.out.println("Default admin user created: admin@smartcoursehub.com / admin123");
        }
    }

    private void loadCoursesFromCSV() {
        if (coursesRepository.count() > 0) {
            System.out.println("Courses already populated, skipping CSV load.");
            return;
        }

        System.out.println("Loading courses from CSV...");
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                new ClassPathResource("Courses_Processed.csv").getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true;
            int courseCounter = 100;

            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // Split by comma, ignoring commas inside quotes
                String[] values = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (values.length < 5) continue;

                String courseName = values[0].replace("\"", "").trim();
                String creditHoursStr = values[1].replace("\"", "").trim();
                String semester = values[2].replace("\"", "").trim();
                String sectionName = values[3].replace("\"", "").trim();
                String instructorName = values[4].replace("\"", "").trim();
                // String type = values.length > 5 ? values[5].replace("\"", "").trim() : "";

                // 1. Create or Get Instructor
                Users instructor = createOrGetInstructor(instructorName);

                // 2. Create or Get Course
                Courses course = createOrGetCourse(courseName, creditHoursStr, ++courseCounter);

                // 3. Create Section
                createSection(course, instructor, semester, sectionName);
            }
            System.out.println("CSV Data loaded successfully.");

        } catch (Exception e) {
            System.err.println("Error loading CSV: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Users createOrGetInstructor(String name) {
        String email = generateEmail(name);
        Optional<Users> existing = usersRepository.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }

        Users instructor = Users.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode("password123")) // Default password
                .role("INSTRUCTOR")
                .enabled(true)
                .build();
        return usersRepository.save(instructor);
    }

    private Courses createOrGetCourse(String title, String creditHoursStr, int counter) {
        // Simple check by title to avoid duplicates in this run if CSV implies same course for diff sections
        // Note: Repository might not find it if not flushed, but we are in one transaction?
        // Better: check database.
        
        // Since we don't have a unique code in CSV, we assume Title is unique for the Course entity definition
        // However, "Application of Information..." appears multiple times for different sections.
        // We need to find if it exists.
        
        // We need a method to find by title. Let's assume we can fetch all or add a findByTitle method.
        // For now, let's iterate or use a repository method if exists.
        // I'll add `findByTitle` to repository or use `findAll` and stream filter for simplicity in this script 
        // (performance is fine for small CSV).
        
        // Actually, let's check if we can query by title. I'll rely on the repository.
        // Since `CoursesRepository` has `findByCode`, I should probably add `findByTitle` or check manually.
        // Let's implement a quick check.
        
        return coursesRepository.findAll().stream()
                .filter(c -> c.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseGet(() -> {
                    int creditHours = 3;
                    try {
                        creditHours = Integer.parseInt(creditHoursStr);
                    } catch (NumberFormatException e) {
                        // ignore
                    }

                    Courses newCourse = Courses.builder()
                            .code("CSE-" + counter) // Generating a pseudo-code
                            .title(title)
                            .description(title)
                            .creditHours(creditHours)
                            .build();
                    return coursesRepository.save(newCourse);
                });
    }

    private void createSection(Courses course, Users instructor, String semester, String sectionName) {
        // Avoid duplicate sections if run multiple times (though we check course count at start)
        // Here we just create it.
        
        Sections section = Sections.builder()
                .courseId(course.getId())
                .instructorId(instructor.getId())
                .semester(semester) // Use program name as semester for now
                .capacity(30)
                .room("TBD")
                .schedule("Section " + sectionName) // Store section name in schedule or room temporarily or just append
                .build();
        
        // Let's format the schedule to include Section Name clearly if we don't have a field for it.
        // The `Sections` entity doesn't have a `sectionName` field. 
        // SRS says "Section" (A, B).
        // I will append "Section A" to the schedule string so it's visible.
        section.setSchedule("Section " + sectionName + " - TBD");
        
        sectionsRepository.save(section);
    }

    private String generateEmail(String name) {
        // simplistic: replace spaces with dots, remove special chars
        String cleanName = name.replaceAll("[^a-zA-Z0-9\\s]", "").trim();
        String[] parts = cleanName.split("\\s+");
        String localPart = parts[0].toLowerCase();
        if (parts.length > 1) {
            localPart += "." + parts[parts.length - 1].toLowerCase();
        }
        return localPart + "@smartcoursehub.com";
    }
}