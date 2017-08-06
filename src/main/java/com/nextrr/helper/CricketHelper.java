package com.nextrr.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import one.DatabaseUtils;
import one.DefaultObjects;
import one.NextrrUtils;

import javax.ws.rs.core.MultivaluedMap;
import com.google.gson.Gson;

import architecture.utils.DebugWrapper;

public class CricketHelper {
	
	public final String className = CricketHelper.class.getName();
	
	public String setCricket(MultivaluedMap<String, String> params) {
		
		Map<String, Object> queryMap = new HashMap<String, Object>();
		
		String sportsChildTypeId = params.getFirst("matchType");
		String teamOneGeoId = params.getFirst("teamOneId");
		String teamTwoGeoId = params.getFirst("teamTwoId");
		String stadium = params.getFirst("stadium");
		String country = params.getFirst("country");
		String city = params.getFirst("city");
		String time = params.getFirst("time");
		String matchNumber = params.getFirst("matchNumber");
		
		if (params.getFirst("fromDate") != null) {
			String fromDate = params.getFirst("fromDate");
			queryMap.put("match_from_date", fromDate);
		}
		
		if (params.getFirst("toDate") != null) {
			String toDate = params.getFirst("toDate");
			queryMap.put("match_to_date", toDate);
		}
		queryMap.put("match_number", matchNumber);
		queryMap.put("sports_child_type_id", sportsChildTypeId);
		queryMap.put("team_one_geoId", teamOneGeoId);
		queryMap.put("team_two_geoId", teamTwoGeoId);
		queryMap.put("stadium", stadium);
		queryMap.put("city", city);
		queryMap.put("time", time);
		queryMap.put("country_geoId", country);
		
		DatabaseUtils du = new DatabaseUtils();
		
		du.runCreateQuery("cricket", queryMap);
		
		return new Gson().toJson(new ArrayList<String>().add("success"));
	}
	
	public String getIntlCricket() {
		DatabaseUtils dbUtils = new DatabaseUtils();
		Map<String, Object> resultMap = dbUtils.getAllEntityData("cricket");
		
		resultMap.forEach((key,value)-> {
			if("match_to_date".equals(key) || "match_from_date".equals(key)) {
				resultMap.put(key, DefaultObjects.formatDate(value.toString()));
			}
			if("time".equals(key)) {
				resultMap.put(key, DefaultObjects.formatTime(value.toString()));
			}
		});
		
		return new Gson().toJson(resultMap);
	}
	
	public String getIntlCricketToDisplay() {

		String[] cricketMatchList = {"1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"};

		DatabaseUtils dbUtils = new DatabaseUtils();
		Map<String, Object> resultMap = dbUtils.getAllEntityData("cricket");
		
		Map<String, Object> paramMap = new HashMap<String, Object>();
		resultMap.forEach((key,value)-> {
			List<Map<String, Object>> valueList = (List<Map<String, Object>>) value;
			
			for (int i = 0; i < valueList.size(); i++) {
				if (valueList.get(i).get("match_number") != null && Integer.valueOf((String) valueList.get(i).get("match_number")) != 0) {
					valueList.get(i).put("match_number", cricketMatchList[Integer.valueOf((String) valueList.get(i).get("match_number")) - 1]);
				}
				if (valueList.get(i).get("team_one_geoId") != null) {
					paramMap.clear();
					paramMap.put("country_geo_id", valueList.get(i).get("team_one_geoId"));
					Map<String, Object> countryGeoResult = dbUtils.getFirstEntityDataWithConditions("country_geo",paramMap);
					valueList.get(i).put("team_one_geoId", countryGeoResult.get("description"));
				} 
				
				if (valueList.get(i).get("team_two_geoId") != null) {
					paramMap.clear();
					paramMap.put("country_geo_id", valueList.get(i).get("team_two_geoId"));
					Map<String, Object> countryGeoResult = dbUtils.getFirstEntityDataWithConditions("country_geo",paramMap);
					valueList.get(i).put("team_two_geoId", countryGeoResult.get("description"));
				}
				
				if (valueList.get(i).get("sports_child_type_id") != null) {
					paramMap.clear();
					paramMap.put("sports_child_type_id", valueList.get(i).get("sports_child_type_id"));
					paramMap.put("sports_type_id", "CRICKET");
					Map<String, Object> countryGeoResult = dbUtils.getFirstEntityDataWithConditions("sports_child_type",paramMap);
					valueList.get(i).put("sports_child_type_id", countryGeoResult.get("description"));
				}
				
				if (valueList.get(i).get("time") != null) {
					valueList.get(i).put("time", DefaultObjects.formatTimeForFrontEnd((String) valueList.get(i).get("time")));
				}
				
				if (valueList.get(i).get("match_from_date") != null) {
					valueList.get(i).put("match_from_date", DefaultObjects.formatDate((String) valueList.get(i).get("match_from_date"), "CRICKET"));
				}
				
				if (valueList.get(i).get("match_to_date") != null) {
					valueList.get(i).put("match_to_date", DefaultObjects.formatDate((String) valueList.get(i).get("match_to_date"), "CRICKET"));
				}
			}
			resultMap.put(key, valueList);
		});
		return new Gson().toJson(resultMap);
	}
	
	public String removeCricket(MultivaluedMap<String, String> params) {
		
		String cricketId = params.getFirst("cricketId");
		
		if (DefaultObjects.isNotEmpty(cricketId)) {
			DatabaseUtils du = new DatabaseUtils();
			Map<String, Object> queryMap = new HashMap<String, Object>();
			queryMap.put("movie_id", cricketId);
			du.runDeleteQuery("cricket", "cricket_id", cricketId);
		} else {
			return new Gson().toJson(new ArrayList<String>().add("error"));
		}
		
		return new Gson().toJson(new ArrayList<String>().add("success"));
	}
	
	public String updateCricket(MultivaluedMap<String, String> params) {
		
		Map<String, Object> queryMap = new HashMap<String, Object>();
		
		String cricketId = params.getFirst("cricketId");
		String sportsChildTypeId = params.getFirst("matchType");
		String teamOneGeoId = params.getFirst("teamOneId");
		String teamTwoGeoId = params.getFirst("teamTwoId");
		String stadium = params.getFirst("stadium");
		String country = params.getFirst("country");
		String city = params.getFirst("city");
		String time = params.getFirst("time");
		String matchNumber = params.getFirst("matchNumber");
		
		if (params.getFirst("fromDate") != null) {
			String fromDate = params.getFirst("fromDate");
			queryMap.put("match_from_date", fromDate);
		}
		
		if (params.getFirst("toDate") != null) {
			String toDate = params.getFirst("toDate");
			queryMap.put("match_to_date", toDate);
		}
		queryMap.put("match_number", matchNumber);
		queryMap.put("cricket_id", cricketId);
		queryMap.put("sports_child_type_id", sportsChildTypeId);
		queryMap.put("team_one_geoId", teamOneGeoId);
        if (!"N/A".equals(teamTwoGeoId)) {
            queryMap.put("team_two_geoId", teamTwoGeoId);
        }
		queryMap.put("stadium", stadium);
		queryMap.put("city", city);
		queryMap.put("time", time);
		queryMap.put("country_geoId", country);
		
		DatabaseUtils du = new DatabaseUtils();
		
		if (DefaultObjects.isNotEmpty(cricketId)) {
			DatabaseUtils dbUtils = new DatabaseUtils();
			du.runUpdateQuery("cricket", queryMap, "cricket_id");
		} else {
			return new Gson().toJson(new ArrayList<String>().add("error"));
		}
		
		return new Gson().toJson(new ArrayList<String>().add("success"));
	}
}