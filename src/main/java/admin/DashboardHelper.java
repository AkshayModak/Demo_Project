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

            System.out.println("===finalList===" + tempSet);
        });
        result.put("visitsAnalysis", finalList);

        return new Gson().toJson(result);
    }
}
