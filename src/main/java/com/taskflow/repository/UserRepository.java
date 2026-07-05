package com.taskflow.repository;

import com.taskflow.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findTop8ByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);
}
