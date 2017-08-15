package one;

import java.util.List;
import java.util.Map;

public class NextrrUtils {
	
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
}