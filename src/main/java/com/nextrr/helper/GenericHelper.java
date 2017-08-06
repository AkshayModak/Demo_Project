package com.nextrr.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import java.util.stream.Collectors;
import com.google.gson.Gson;

import one.DatabaseUtils;
import architecture.utils.DebugWrapper;

public class GenericHelper {
	
	public final String className = GenericHelper.class.getName();
	
	public String getCountriesBySport(String sport) {
		DebugWrapper.logInfo("Initiating getCountriesBySports of GenericHelper", className);
		ArrayList<Map> formula1List = new ArrayList<Map>();
		DatabaseUtils dbUtils = new DatabaseUtils();
		
		Map<String, Object> conditionParams = new HashMap<String, Object>();
		conditionParams.put("sports_type_id", sport);
		Map<String, Object> countryAssoc = dbUtils.getEntityDataWithConditions("country_assoc", conditionParams);
		List<Object> countryAssocList = (List) countryAssoc.get("result");
		
		List<Map<String, Object>> countryGeoList = new ArrayList<Map<String, Object>>();
		
		for(Object countryGeoId : countryAssocList) {
			conditionParams.clear();
			Map<String, Object> geoId = (Map<String, Object>) countryGeoId;
			conditionParams.put("country_geo_id", geoId.get("country_id"));
			Map<String, Object> country_geo = dbUtils.getFirstEntityDataWithConditions("country_geo", conditionParams);
			countryGeoList.add(country_geo);
		}
		DebugWrapper.logInfo("getCountriesBySports finished running", className);
		return new Gson().toJson(countryGeoList);
	}
}