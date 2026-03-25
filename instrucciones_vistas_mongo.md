  # Instrucciones Finales para las Vistas en MongoDB Atlas

  He visto que tu colección se llama **`stats`** y los campos tienen nombres como `"Cases - cumulative total"`. He ajustado los códigos para que funcionen exactamente con tus datos:

  ### 1. vw_ecuador_stats
  **Objetivo**: Datos actuales de Ecuador.
  ```javascript
  [
    { $match: { Name: "Ecuador" } },
    { $sort: { _id: -1 } },
    { $limit: 1 },
    { $project: { TotalCases: "$Cases - cumulative total", TotalDeaths: "$Deaths - cumulative total" } }
  ]
  ```

  ### 2. vista_bonita_muertes (Top 10 Muertes)
  **Importante**: Borra la que creaste antes y usa esta (la fuente debe ser `"stats"`, no `"covid"`):
  ```javascript
  db.createView("vista_bonita_muertes", "stats", [
    {
      $project: {
        _id: 0,
        Pais: "$Name",
        "Total Muertes": "$Deaths - cumulative total"
      }
    },
    { $sort: { "Total Muertes": -1 } },
    { $limit: 10 
  ])
  ```

  ### 3. vw_totales_por_region
  ```javascript
  [
    { $group: { _id: "$WHO Region", TotalCases: { $sum: "$Cases - newly reported in last 24 hours" } } },
    { $project: { Region: "$_id", TotalCases: 1, _id: 0 } }
  ]
  ```

  ---
  **¿Qué debes hacer ahora?**
  1. **Borra** las vistas si tienen errores.
  2. **Crea la vista `vista_bonita_muertes`** usando el comando de arriba (asegúrate de que el segundo parámetro sea `"stats"`).
  3. **Crea las otras** usando la pestaña "Aggregation" en Atlas sobre la colección `stats`.

  ¡Una vez que la vista `vista_bonita_muertes` tenga datos de la colección `stats`, la tabla de tu web se llenará al instante!
