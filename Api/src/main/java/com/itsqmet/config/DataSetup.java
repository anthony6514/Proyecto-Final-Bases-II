package com.itsqmet.config;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSetup implements CommandLineRunner {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        MongoDatabase db = mongoTemplate.getDb();
        System.out.println("Starting MongoDB Data Setup...");

        // 1. Seed regions_info collection (for Lookups)
        if (!db.listCollectionNames().into(new java.util.ArrayList<>()).contains("regiones_info")) {
            db.createCollection("regiones_info");
        }
        db.getCollection("regiones_info").deleteMany(new Document());
        db.getCollection("regiones_info").insertMany(Arrays.asList(
                new Document("region_code", "AMRO").append("region_name", "Americas").append("description", "Regional Office for the Americas"),
                new Document("region_code", "EURO").append("region_name", "Europe").append("description", "Regional Office for Europe"),
                new Document("region_code", "AFRO").append("region_name", "Africa").append("description", "Regional Office for Africa"),
                new Document("region_code", "WPRO").append("region_name", "Western Pacific").append("description", "Regional Office for Western Pacific"),
                new Document("region_code", "SEARO").append("region_name", "South-East Asia").append("description", "Regional Office for South-East Asia"),
                new Document("region_code", "EMRO").append("region_name", "Eastern Mediterranean").append("description", "Regional Office for Eastern Mediterranean")
        ));
        System.out.println("Seeded 'regiones_info' collection.");

        // 2. Helper to recreate views
        recreateView(db, "vw_ecuador_stats", "stats", Arrays.asList(
                new Document("$match", new Document("Name", "Ecuador")),
                new Document("$project", new Document("TotalCases", new Document("$ifNull", Arrays.asList("$Cases - cumulative total", "$TotalCases")))
                        .append("TotalDeaths", new Document("$ifNull", Arrays.asList("$Deaths - cumulative total", "$TotalDeaths")))),
                new Document("$limit", 1)
        ));

        recreateView(db, "vista_bonita_muertes", "stats", Arrays.asList(
                new Document("$project", new Document("_id", 0)
                        .append("Pais", new Document("$ifNull", Arrays.asList("$Name", "$Country")))
                        .append("Total Muertes", new Document("$ifNull", Arrays.asList("$Deaths - cumulative total", "$TotalMuertes")))),
                new Document("$sort", new Document("Total Muertes", -1)),
                new Document("$limit", 10)
        ));

        recreateView(db, "vw_totales_por_region", "stats", Arrays.asList(
                new Document("$group", new Document("_id", new Document("$ifNull", Arrays.asList("$WHO Region", "$Region")))
                        .append("TotalCases", new Document("$sum", new Document("$ifNull", Arrays.asList("$Cases - newly reported in last 24 hours", 0))))),
                new Document("$project", new Document("Region", "$_id").append("TotalCases", 1).append("_id", 0))
        ));

        recreateView(db, "vw_comparativa_andina", "stats", Arrays.asList(
                new Document("$match", new Document("$or", Arrays.asList(
                        new Document("Name", new Document("$in", Arrays.asList("Ecuador", "Peru", "Colombia", "Chile", "Bolivia"))),
                        new Document("Country", new Document("$in", Arrays.asList("Ecuador", "Peru", "Colombia", "Chile", "Bolivia")))
                ))),
                new Document("$group", new Document("_id", new Document("$ifNull", Arrays.asList("$Name", "$Country")))
                        .append("TotalCases", new Document("$max", new Document("$ifNull", Arrays.asList("$Cases - cumulative total", 0))))
                        .append("TotalDeaths", new Document("$max", new Document("$ifNull", Arrays.asList("$Deaths - cumulative total", 0))))),
                new Document("$project", new Document("Pais", "$_id").append("TotalCases", 1).append("TotalDeaths", 1).append("_id", 0))
        ));

        recreateView(db, "vw_tasa_letalidad", "stats", Arrays.asList(
                new Document("$project", new Document("Pais", new Document("$ifNull", Arrays.asList("$Name", "$Country")))
                        .append("Casos", new Document("$ifNull", Arrays.asList("$Cases - cumulative total", 1)))
                        .append("Muertes", new Document("$ifNull", Arrays.asList("$Deaths - cumulative total", 0)))),
                new Document("$match", new Document("Casos", new Document("$gt", 1000))),
                new Document("$project", new Document("Pais", 1)
                        .append("TasaLetalidad", new Document("$multiply", Arrays.asList(
                                new Document("$divide", Arrays.asList("$Muertes", "$Casos")),
                                100)))),
                new Document("$sort", new Document("TasaLetalidad", -1)),
                new Document("$limit", 10)
        ));

        recreateView(db, "vw_stats_con_region", "stats", Arrays.asList(
                new Document("$lookup", new Document("from", "regiones_info")
                        .append("localField", "WHO Region")
                        .append("foreignField", "region_code")
                        .append("as", "detalles_region")),
                new Document("$unwind", new Document("path", "$detalles_region").append("preserveNullAndEmptyArrays", true)),
                new Document("$project", new Document("Pais", new Document("$ifNull", Arrays.asList("$Name", "$Country")))
                        .append("Region", new Document("$ifNull", Arrays.asList("$detalles_region.region_name", "$WHO Region")))
                        .append("Description", new Document("$ifNull", Arrays.asList("$detalles_region.description", "Región Global")))
                        .append("Casos", new Document("$ifNull", Arrays.asList("$Cases - cumulative total", 0)))),
                new Document("$limit", 20)
        ));

        System.out.println("All views and lookups created successfully via Java.");
    }

    private void recreateView(MongoDatabase db, String viewName, String sourceColl, List<Document> pipeline) {
        try {
            db.getCollection(viewName).drop();
            System.out.println("Dropped existing view: " + viewName);
        } catch (Exception e) {}
        db.createView(viewName, sourceColl, pipeline);
        System.out.println("Created view: " + viewName);
    }
}
