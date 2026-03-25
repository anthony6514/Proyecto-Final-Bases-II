package com.itsqmet.model;

import java.util.Map;
import java.util.HashMap;
import org.springframework.data.annotation.Id;

public class CovidStats {
    @Id
    private String id;
    
    private Map<String, Object> data = new HashMap<>();

    public CovidStats() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public Object get(String key) {
        return data.get(key);
    }
}
