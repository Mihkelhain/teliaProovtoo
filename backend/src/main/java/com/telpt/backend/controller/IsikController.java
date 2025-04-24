package com.telpt.backend.controller;


import com.telpt.backend.entity.Isik;
import com.telpt.backend.Repository.IsikRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/isikud")
public class IsikController {
    private final IsikRepository isikRepository;

    public IsikController(IsikRepository isikRepository) {
        this.isikRepository = isikRepository;
    }

    //gets all
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Isik> getAllIsikud() {
        return isikRepository.findAll();
    }

    //Gets by ID
    @GetMapping("/{id}")
    public ResponseEntity<Isik> getIsikById(@PathVariable long id) {
        Optional<Isik> isik = isikRepository.findById(id);

        return isik.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Isik createIsik(@RequestBody Isik isik) {
        return isikRepository.save(isik);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIsik(@PathVariable long id) {
        try {
            if (!isikRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            isikRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //Changing
    @PatchMapping("/{id}")
    public ResponseEntity<Isik> updateIsik(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        return isikRepository.findById(id)
                .map(existingIsik -> {
                    // Apply partial updates
                    if (updates.containsKey("eesnimi")) {
                        existingIsik.setEesnimi((String) updates.get("eesnimi"));
                    }
                    if (updates.containsKey("perenimi")) {
                        existingIsik.setPerenimi((String) updates.get("perenimi"));
                    }
                    if (updates.containsKey("email")) {
                        existingIsik.setEmail((String) updates.get("email"));
                    }
                    if (updates.containsKey("sunnipaev")) {
                        existingIsik.setSunnipaev(LocalDate.parse((String) updates.get("sunnipaev")));
                    }
                    if (updates.containsKey("isikukood")) {
                        existingIsik.setIsikukood((String) updates.get("isikukood"));
                    }

                    Isik updatedIsik = isikRepository.save(existingIsik);
                    return ResponseEntity.ok(updatedIsik);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}