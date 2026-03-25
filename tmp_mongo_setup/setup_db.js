
const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://anthonyruiz20048:1754511275@clusternorthwind.fy4x9vb.mongodb.net/covid_db?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('covid_db');

        console.log("Connected to MongoDB Atlas");

        // 1. Seed regions_info collection (for Lookups)
        const regionsInfo = db.collection('regiones_info');
        await regionsInfo.deleteMany({});
        await regionsInfo.insertMany([
            { region_code: "AMRO", region_name: "Americas", description: "Regional Office for the Americas" },
            { region_code: "EURO", region_name: "Europe", description: "Regional Office for Europe" },
            { region_code: "AFRO", region_name: "Africa", description: "Regional Office for Africa" },
            { region_code: "WPRO", region_name: "Western Pacific", description: "Regional Office for Western Pacific" },
            { region_code: "SEARO", region_name: "South-East Asia", description: "Regional Office for South-East Asia" },
            { region_code: "EMRO", region_name: "Eastern Mediterranean", description: "Regional Office for Eastern Mediterranean" }
        ]);
        console.log("Seeded 'regiones_info' collection.");

        // Helper to recreate views
        async function recreateView(viewName, sourceColl, pipeline) {
            try {
                await db.collection(viewName).drop();
                console.log(`Dropped existing view: ${viewName}`);
            } catch (e) {}
            await db.createCollection(viewName, { viewOn: sourceColl, pipeline: pipeline });
            console.log(`Created view: ${viewName}`);
        }

        // VIEW 1: Ecuador Stats
        await recreateView("vw_ecuador_stats", "stats", [
            { $match: { Name: "Ecuador" } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { TotalCases: "$Cases - cumulative total", TotalDeaths: "$Deaths - cumulative total" } }
        ]);

        // VIEW 2: Top 10 Muertes
        await recreateView("vista_bonita_muertes", "stats", [
            { $project: { _id: 0, Pais: "$Name", "Total Muertes": "$Deaths - cumulative total" } },
            { $sort: { "Total Muertes": -1 } },
            { $limit: 10 }
        ]);

        // VIEW 3: Totales por Región
        await recreateView("vw_totales_por_region", "stats", [
            { $group: { _id: "$WHO Region", TotalCases: { $sum: "$Cases - newly reported in last 24 hours" } } },
            { $project: { Region: "$_id", TotalCases: 1, _id: 0 } }
        ]);

        // VIEW 4: Comparativa Andina
        await recreateView("vw_comparativa_andina", "stats", [
            { $match: { Name: { $in: ["Ecuador", "Peru", "Colombia", "Chile", "Bolivia"] } } },
            { $group: { 
                _id: "$Name", 
                TotalCases: { $max: "$Cases - cumulative total" }, 
                TotalDeaths: { $max: "$Deaths - cumulative total" } 
            }},
            { $project: { Pais: "$_id", TotalCases: 1, TotalDeaths: 1, _id: 0 } }
        ]);

        // VIEW 5: Tasa de Letalidad (Top 10)
        await recreateView("vw_tasa_letalidad", "stats", [
            { $match: { "Cases - cumulative total": { $gt: 1000 } } },
            { $project: { 
                Pais: "$Name", 
                TasaLetalidad: { $multiply: [ { $divide: ["$Deaths - cumulative total", "$Cases - cumulative total"] }, 100 ] }
            }},
            { $sort: { TasaLetalidad: -1 } },
            { $limit: 10 }
        ]);

        // LOOKUP VIEW: Join Stats with Regions Info
        await recreateView("vw_stats_con_region", "stats", [
            {
                $lookup: {
                    from: "regiones_info",
                    localField: "WHO Region",
                    foreignField: "region_code",
                    as: "detalles_region"
                }
            },
            { $unwind: "$detalles_region" },
            {
                $project: {
                    Pais: "$Name",
                    Region: "$detalles_region.region_name",
                    Description: "$detalles_region.description",
                    Casos: "$Cases - cumulative total"
                }
            },
            { $limit: 20 }
        ]);

        console.log("All views and lookups created successfully.");

    } catch (err) {
        console.error("Error setting up DB:", err);
    } finally {
        await client.close();
    }
}

main();
