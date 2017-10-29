package admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gson.Gson;

import one.DatabaseUtils;

public class DashboardHelper {

    public String getVisits() {
        DatabaseUtils dbUtils = new DatabaseUtils();
        Map<String, Object> result = dbUtils.getAllEntityData("visit");

        List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get("result");
        List<Map<String, Object>> finalList = new ArrayList<Map<String, Object>>();
        Map<String, List<Map<String, Object>>> resultMap = new HashMap<String, List<Map<String, Object>>>();

        for (Map<String, Object> map : resultList) {
            if (resultMap.containsKey((String) map.get("userIp"))) {
                List<Map<String, Object>> tempList = resultMap.get((String) map.get("userIp"));
                Map<String, Object> tempMap = new HashMap<String, Object>();
                tempMap.put("ipAddress", map.get("userIp"));
                tempMap.put("country", map.get("userCountry"));
                tempMap.put("city", map.get("userCity"));
                tempMap.put("status", "Allowed");

                tempList.add(tempMap);
                resultMap.put((String) map.get("userIp"), tempList);
            } else {
                List<Map<String, Object>> tempList = new ArrayList<Map<String, Object>>();
                Map<String, Object> tempMap = new HashMap<String, Object>();
                tempMap.put("ipAddress", map.get("userIp"));
                tempMap.put("country", map.get("userCountry"));
                tempMap.put("city", map.get("userCity"));
                tempMap.put("status", "Allowed");

                tempList.add(tempMap);
                resultMap.put((String) map.get("userIp"), tempList);
            }
        }

        resultMap.forEach((k, v) -> {
            List<Map<String, Object>> tempList = resultMap.get(k);
            Set<Map<String, Object>> tempSet = new HashSet<Map<String, Object>>(tempList);
            int totalVisits = resultMap.get(k).size();

            Iterator<Map<String, Object>> it = tempSet.iterator();

            while (it.hasNext()) {
                Map<String, Object> value = it.next();
                value.put("visits", totalVisits);
                finalList.add(value);
            }
        });
        result.put("visitsAnalysis", finalList);

        return new Gson().toJson(result);
    }

    public String getVisitsByCountries() {
        DatabaseUtils dbUtils = new DatabaseUtils();
        Map<String, Object> visits = dbUtils.getAllEntityData("visit");

        List<Map<String, Object>> resultList = (List<Map<String, Object>>) visits.get("result");
        List<String> countryList = new ArrayList<String>();
        Map<String, List<Map<String, Object>>> resultMap = new HashMap<String, List<Map<String, Object>>>();

        for (Map<String, Object> map : resultList) {
            if (!resultMap.containsKey((String) map.get("userCountry"))) {
                if (!map.get("userCountry").equals("null")) {
                    countryList.add(map.get("userCountry").toString());
                }
            }
        }

        Set<String> tempSet = new HashSet<String>(countryList);
        List<String> uniqueCountryList = new ArrayList<String>(tempSet);
        List<Integer> visitsList = new ArrayList<Integer>();

        for (String countryName : uniqueCountryList) {
            Map<String, Object> queryMap = new HashMap<String, Object>();
            queryMap.put("userCountry", countryName);
            Map<String, Object> visitsResult = dbUtils.getEntityDataWithConditions("visit", queryMap);

            List<Map<String, Object>> countryVisitsList = (List<Map<String, Object>>) visitsResult.get("result");
            visitsList.add(countryVisitsList.size());
        }

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("countries", uniqueCountryList);
        result.put("visits", visitsList);

        return new Gson().toJson(result);
    }

    public String getVisitsByDate(String date) {
        DatabaseUtils dbUtils = new DatabaseUtils();
        Map<String, Object> queryParams = new HashMap<String, Object>();

        queryParams.put("requestDate", date);
        Map<String, Object> result = dbUtils.getEntityDataWithConditions("visit", queryParams);

        return new Gson().toJson(result);
    }
}
