package one;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.nextrr.helper.Formula1Helper;
import architecture.utils.DebugWrapper;

public class DefaultObjects {
	
	private static Map<String, Object> paramMap;
	public static final String className = Formula1Helper.class.getName();
	
	public static Map<String, Object> getSuccessMap(String message) {
		
		Map<String, Object> successMessage = new HashMap<String, Object>();
		if (message != null) {
			successMessage.put("successMessage", message);
		} else {
			successMessage.put("successMessage", "Action Performed Successfully");
		}
		
		return successMessage;
	}
	
	public static Map<String, Object> getSuccessMap() {
		
		Map<String, Object> successMessage = new HashMap<String, Object>();
		successMessage.put("successMessage", "Action Performed Successfully");
		
		return successMessage;
	}
	
	public static Map<String, Object> getErrorMap(Exception e) {
	
		Map<String, Object> errorMessage = new HashMap<String, Object>();
		errorMessage.put("errorMessage", "Error During Operation "+e);
		
		return errorMessage;
	}
	
	public static void setParamMap(HttpServletRequest request) {
		HttpSession session = request.getSession();
		paramMap = new HashMap<String, Object>();
		session.setAttribute("paramMap", paramMap);
	}
	
	public static Map<String, Object> getParamMap() {
		return paramMap;
	}
	
	public static String formatDate(String date) {
		
		String formattedDate = null;
		
		DebugWrapper.logInfo("=======date========"+date, className);
		try {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		Date parsedDate = df.parse(date);
		DateFormat formatter = new SimpleDateFormat("d MMMM YYYY");
		formattedDate = formatter.format(parsedDate);
		} catch(ParseException pe) {
			System.out.println(pe);
		}
		
		return formattedDate;
	}

	public static String formatTime(String time) {

		String formattedTime = null;
		
		try {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		Date parsedTime = df.parse(time);
		DateFormat formatter = new SimpleDateFormat("HH:mm:ss");
		formattedTime = formatter.format(parsedTime);
		} catch(ParseException pe) {
			System.out.println(pe);
		}
		
		return formattedTime;
	}

	public static String formatTimeForFrontEnd(String time) {
		
		String formattedTime = null;
		
		try {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		Date parsedTime = df.parse(time);
		DateFormat formatter = new SimpleDateFormat("hh:mm a");
		formattedTime = formatter.format(parsedTime);
		} catch(ParseException pe) {
			System.out.println(pe);
		}
		
		return formattedTime;
	}

	
	public static String formatTimeToDisplay(String time) {
		
		String formattedTime = null;
		
		try {
		DateFormat df = new SimpleDateFormat("HH:mm:ss");
		Date parsedTime = df.parse(time);
		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		formattedTime = formatter.format(parsedTime);
		} catch(ParseException pe) {
			System.out.println(pe);
		}
		
		return formattedTime;
	}
	
	public static String formatDateToDisplay(String date) {
		
		String formattedDate = null;
		
		try {
		DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
		Date parsedDate = df.parse(date);
		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		formattedDate = formatter.format(parsedDate);
		} catch(ParseException pe) {
			System.out.println(pe);
		}
		
		return formattedDate;
	}
	
	public static Boolean isNotEmpty(Object objValue) {
		String value = String.valueOf(objValue);
		value = value.replaceAll("\\s+","");
		if ((value != null) && (value.length() > 0) && !(value.isEmpty()) && !(value.equals("null"))) {
			return true;
		}
		return false;
	}
}

