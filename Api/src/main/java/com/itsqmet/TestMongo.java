package com.itsqmet;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import org.bson.Document;

public class TestMongo {
    public static void main(String[] args) {
        String uri = "mongodb+srv://anthonyruiz20048:1754511275@clusternorthwind.fy4x9vb.mongodb.net/covid_db?retryWrites=true&w=majority";
        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("covid_db");
            
            System.out.println("Documento de muestra de 'stats':");
            Document statsDoc = database.getCollection("stats").find().first();
            if (statsDoc != null) System.out.println(statsDoc.toJson());
            else System.out.println("Colección 'stats' está vacía.");

            System.out.println("\nDocumento de Ecuador:");
            Document ecuador = database.getCollection("stats").find(new Document("Name", "Ecuador")).first();
            if (ecuador != null) System.out.println(ecuador.toJson());
            else System.out.println("Ecuador no encontrado en 'stats' con Name: 'Ecuador'.");

            System.out.println("\nContenido de 'regiones_info':");
            for (Document region : database.getCollection("regiones_info").find()) {
                System.out.println(region.toJson());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
