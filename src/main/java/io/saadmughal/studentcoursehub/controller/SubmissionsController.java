package io.saadmughal.studentcoursehub.controller;

import io.saadmughal.studentcoursehub.dto.SubmissionsDTO;
import io.saadmughal.studentcoursehub.service.SubmissionsService;
import io.saadmughal.studentcoursehub.vo.SubmissionsQueryVO;
import io.saadmughal.studentcoursehub.vo.SubmissionsUpdateVO;
import io.saadmughal.studentcoursehub.vo.SubmissionsVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/submissions")
public class SubmissionsController {

    @Autowired
    private SubmissionsService submissionsService;

    @PostMapping
    public String save(@Valid @RequestBody SubmissionsVO vO) {
        return submissionsService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Long id) {
        submissionsService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Long id,
                       @Valid @RequestBody SubmissionsUpdateVO vO) {
        submissionsService.update(id, vO);
    }

    @GetMapping("/{id}")
    public SubmissionsDTO getById(@Valid @NotNull @PathVariable("id") Long id) {
        return submissionsService.getById(id);
    }

    @GetMapping
    public Page<SubmissionsDTO> query(@Valid SubmissionsQueryVO vO) {
        return submissionsService.query(vO);
    }
}
