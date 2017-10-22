package one;

import java.io.File;
import java.util.Calendar;
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
		String geoDataPath = nextrr_home + "/runtime/geoData/GeoLiteCity.dat";
		System.out.println("====geoDataPath===="+geoDataPath);
		
		File file = new File(geoDataPath);
		String ipAddressRequestCameFrom = request.getRemoteAddr();
		ServerLocation location = null;
		Calendar cal = Calendar.getInstance();
	    DateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        System.out.println("===cal Date==="+sdf.format(cal.getTime()));
        String requestDate = sdf.format(cal.getTime());
        sdf = new SimpleDateFormat("HH:mm:ss");
        String requestTime = sdf.format(cal.getTime());
        
        System.out.println("===requestUri==="+request.getRequestURI());
        String requestUri = request.getRequestURI();
        
        System.out.println("===cal time==="+sdf.format(cal.getTime()));
		System.out.println("==ipAddressRequestCameFrom=="+ipAddressRequestCameFrom);
		try {
			location = getLocation("139.59.72.136", file);
		} catch (NullPointerException npe) {
			System.out.println("===it's null====");
		}
		System.out.println("===location==="+location);
		if (location != null) {
			DatabaseUtils dbUtils = new DatabaseUtils();
			
			Map<String, Object> queryParams = new HashMap<String, Object>();
			queryParams.put("requestDate", requestDate);
			queryParams.put("userIp", "139.59.72.136");
			queryParams.put("requestUri", requestUri);
			
			System.out.println("===queryParams==="+queryParams);
			Map<String, Object> resultMap = dbUtils.getEntityDataWithConditions("visit", queryParams);
			System.out.println("===resultMap======"+resultMap);
			List<Map<String, Object>> resultList = (List<Map<String, Object>>) resultMap.get("result");
			
			if (resultList.isEmpty()) {
				Map<String, Object> queryMap = new HashMap<String, Object>();
				
				queryMap.put("requestUri", requestUri);
				queryMap.put("userIp", "139.59.72.136");
				queryMap.put("userCity", location.getCity());
				queryMap.put("userCountry", location.getCountryName());
				queryMap.put("requestDate", requestDate);
				queryMap.put("requestTime", requestTime);
				
				System.out.println("===queryMap==="+queryMap);
				
				dbUtils.runCreateQuery("visit", queryMap);
				
				System.out.println("===Visit created successfully===");
			} else {
				System.out.println("===Visit Already Exists===");
			}
		}
	}
	
/*	public ServerLocation getLocation(String ipAddress, HttpServletRequest request) {
		System.out.println("===Recording visit===="+ipAddressRequestCameFrom);
		String rootPath = request.getContextPath();
		
		System.out.println("===rootPath==="+rootPath);

		String geoDataPath = "\\" + rootPath + "\\" + "runtime\\geoData\\GeoLiteCity.dat";
		System.out.println("====geoDataPath===="+geoDataPath);
		
		File file = new File(geoDataPath);
		
		
		Locale locale = request.getLocale();
		String language = locale.getLanguage();
		String country = locale.getCountry();

		System.out.println(language + ":" + country);
	}*/
	
	public ServerLocation getLocation(String ipAddress, File file) {

		ServerLocation serverLocation = null;

		try {

		serverLocation = new ServerLocation();

		LookupService lookup = new LookupService(file,LookupService.GEOIP_MEMORY_CACHE);
		Location locationServices = lookup.getLocation(ipAddress);

		serverLocation.setCountryCode(locationServices.countryCode);
		serverLocation.setCountryName(locationServices.countryName);
		serverLocation.setRegion(locationServices.region);
		serverLocation.setRegionName(regionName.regionNameByCode(
	             locationServices.countryCode, locationServices.region));
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
