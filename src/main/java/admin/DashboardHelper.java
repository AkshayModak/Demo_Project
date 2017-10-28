package admin;

import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import one.DatabaseUtils;

public class DashboardHelper {

    public String getVisits() {
        DatabaseUtils dbUtils = new DatabaseUtils();
        Map<String, Object> result = dbUtils.getAllEntityData("visit");
        return new Gson().toJson(result);
    }
}
