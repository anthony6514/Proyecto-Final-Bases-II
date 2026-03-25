package com.itsqmet.controller;

import com.itsqmet.repository.CovidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Permitir Angular
public class CovidController {

    @Autowired
    private CovidRepository covidRepository;

    @GetMapping("/ecuador")
    public List<Map> getEcuadorStats() {
        return covidRepository.findAllFromView("vw_ecuador_stats");
    }

    @GetMapping("/top-muertes")
    public List<Map> getTopMuertes() {
        return covidRepository.findAllFromView("vista_bonita_muertes");
    }

    @GetMapping("/regiones")
    public List<Map> getRegionesStats() {
        return covidRepository.findAllFromView("vw_totales_por_region");
    }

    @GetMapping("/comparativa-andina")
    public List<Map> getComparativaAndina() {
        return covidRepository.findAllFromView("vw_comparativa_andina");
    }

    @GetMapping("/letalidad")
    public List<Map> getLetalidadStats() {
        return covidRepository.findAllFromView("vw_tasa_letalidad");
    }

    @GetMapping("/stats-region")
    public List<Map> getStatsRegion() {
        return covidRepository.findAllFromView("vw_stats_con_region");
    }
}
