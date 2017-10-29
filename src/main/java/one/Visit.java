package one;

import java.io.File;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import com.maxmind.geoip.Location;
import com.maxmind.geoip.LookupService;
import com.maxmind.geoip.regionName;

//reference -- https://www.mkyong.com/java/java-find-location-using-ip-address/
//api -- https://github.com/maxmind/geoip-api-java
public class Visit {

    public void setVisit(HttpServletRequest request) {
        String nextrr_home = System.getProperty("user.dir");
        String geoDataPath = nextrr_home + "/ext-data/geoData/GeoLiteCity.dat";

        File file = new File(geoDataPath);
        /* String ipAddressRequestCameFrom = request.getRemoteAddr(); */

        String ipAddressRequestCameFrom = request.getHeader("x-forwarded-for");
        System.out.println("====ipAddressRequestCameFrom====" + ipAddressRequestCameFrom);

        Map<String, String> result = new HashMap<>();

        Enumeration headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            result.put(key, value);
        }

        System.out.println("====result====" + result);

        if (ipAddressRequestCameFrom == null) {
            ipAddressRequestCameFrom = request.getRemoteAddr();
        }
        String ipAddressesRequestCameFrom[] = ipAddressRequestCameFrom.split(",");
        ipAddressRequestCameFrom = ipAddressesRequestCameFrom[0];

        System.out.println("====ipAddressRequestCameFrom====" + ipAddressRequestCameFrom);

        ServerLocation location = null;
        Calendar cal = Calendar.getInstance();
        DateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        String requestDate = sdf.format(cal.getTime());
        String requestTime = sdf.format(cal.getTime());

        String requestUri = request.getRequestURI();
        try {
            location = getLocation(ipAddressRequestCameFrom, file);
        } catch (NullPointerException npe) {
            System.out.println("====Visit Location is Null=====" + npe);
            return;
        }
        if (location != null) {
            DatabaseUtils dbUtils = new DatabaseUtils();

            Map<String, Object> queryParams = new HashMap<String, Object>();
            queryParams.put("requestDate", requestDate);
            queryParams.put("userIp", ipAddressRequestCameFrom);
            queryParams.put("requestUri", requestUri);

            Map<String, Object> resultMap = dbUtils.getEntityDataWithConditions("visit", queryParams);
            List<Map<String, Object>> resultList = (List<Map<String, Object>>) resultMap.get("result");

            if (resultList.isEmpty()) {
                Map<String, Object> queryMap = new HashMap<String, Object>();

                queryMap.put("requestUri", requestUri);
                queryMap.put("userIp", ipAddressRequestCameFrom);
                queryMap.put("userCity", location.getCity());
                queryMap.put("userCountry", location.getCountryName());
                queryMap.put("requestDate", requestDate);
                queryMap.put("requestTime", requestTime);

                dbUtils.runCreateQuery("visit", queryMap);

            } else {
                System.out.println("===Visit Already Exists===");
            }
        }
    }

    public ServerLocation getLocation(String ipAddress, File file) {

        ServerLocation serverLocation = null;

        try {

            serverLocation = new ServerLocation();

            LookupService lookup = new LookupService(file, LookupService.GEOIP_MEMORY_CACHE);
            Location locationServices = lookup.getLocation(ipAddress);

            serverLocation.setCountryCode(locationServices.countryCode);
            serverLocation.setCountryName(locationServices.countryName);
            serverLocation.setRegion(locationServices.region);
            serverLocation
                    .setRegionName(regionName.regionNameByCode(locationServices.countryCode, locationServices.region));
            serverLocation.setCity(locationServices.city);
            serverLocation.setPostalCode(locationServices.postalCode);
            serverLocation.setLatitude(String.valueOf(locationServices.latitude));
            serverLocation.setLongitude(String.valueOf(locationServices.longitude));

        } catch (IOException e) {
            System.err.println(e.getMessage());
        }

        return serverLocation;

    }

}
