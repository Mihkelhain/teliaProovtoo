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

        return isik.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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

    @PatchMapping("/{id}")
    public ResponseEntity<Isik> updateIsik(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        //finds the thing to change
        Optional<Isik> isikOptional = isikRepository.findById(id);

        //checks if empty if is then send back
        if (isikOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Isik isik = isikOptional.get();

        // Apply each update from the request body
        updates.forEach((key, value) -> {
            switch (key) {
                case "eesnimi":
                    isik.setEesnimi((String) value);
                    break;
                case "perenimi":
                    isik.setPerenimi((String) value);
                    break;
                case "email":
                    isik.setEmail((String) value);
                    break;
                case "sunnipaev":
                    // Parse the date string to LocalDate
                    isik.setSunnipaev(LocalDate.parse((String) value));
                    break;
                case "isikukood":
                    isik.setIsikukood((String) value);
                    break;
            }
        });

        //Send the updates back :)
        Isik updatedIsik = isikRepository.save(isik);
        return ResponseEntity.ok(updatedIsik);
    }
}