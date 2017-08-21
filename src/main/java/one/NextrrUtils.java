package one;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nextrr.helper.GenericHelper;

import architecture.utils.DebugWrapper;

public class NextrrUtils {
	
	public static final String CLASS_NAME = NextrrUtils.class.getName();

	public static String listToCommaSeperatedString(List<String> list) {
		return String.join(",", list);
	}

	public static String escapeMetaCharacters(String inputString){
	    final String[] metaCharacters = {"'"};
	    String outputString="";
	    for (int i = 0 ; i < metaCharacters.length ; i++){
	        if(inputString.contains(metaCharacters[i])){
	            outputString = inputString.replace(metaCharacters[i],"\\"+metaCharacters[i]);
	            inputString = outputString;
	            return outputString;
	        }
	    }
	    return inputString;
	}

	public static Object getFirstFromList(Map<String, Object> map) {
		List resultList = (List) map.get("result");
		if (!map.isEmpty()) {
			Map<String, Object> resultMap = (Map<String, Object>) resultList.get(0);
			return resultMap;
		}
		return DefaultObjects.getErrorMap();
	}

	public static Map<String, Object> getEmptyMap() {
		return new HashMap<String, Object>();
	}

	public static String valueToStringOrEmpty(Map<String, ?> map, String key) {
	    Object value = map.get(key);
	    return value == null ? "" : value.toString();
	}

	public static Boolean isPresentValue(Map<String, ?> map, String key) {
	    String value = (String) map.get(key);
	    return value == null || value.length() == 0 ? false : true;
	}

	public static String getYearFromDate(String date) {
		try {
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
			Date parsedDate = df.parse(date);
			Calendar cal = Calendar.getInstance();
		    cal.setTime(parsedDate);
			String year = String.valueOf(cal.get(Calendar.YEAR));
			return year;
		} catch(ParseException pe) {
			DebugWrapper.logError(pe, CLASS_NAME);
			return "ERROR";
		}
	}
}