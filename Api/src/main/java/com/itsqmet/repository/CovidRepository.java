package com.itsqmet.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class CovidRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Map> findAllFromView(String viewName) {
        // Consultamos la vista de MongoDB como si fuera una colección normal
        return mongoTemplate.findAll(Map.class, viewName);
    }
}
