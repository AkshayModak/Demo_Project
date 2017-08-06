package one;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.QueryParam;
import com.google.gson.Gson;

import com.nextrr.helper.Formula1Helper;
import com.nextrr.helper.MoviesHelper;
import com.nextrr.helper.MoviesServices;

import architecture.utils.DebugWrapper;

import com.nextrr.helper.CricketHelper;
import com.nextrr.helper.GenericHelper;
import one.DatabaseUtils;

@Path("/UserService")
public class UserService implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public final String className = UserService.class.getName();

	/* Generic User Services*/
	@POST
	@Path("/getCountryAssoc")
	@Produces(MediaType.APPLICATION_JSON)
	public String getCountryAssoc(@QueryParam("sports_type_id") String sports_type_id) {
		GenericHelper genericHelper = new GenericHelper();
		String result = genericHelper.getCountryAssoc(sports_type_id);
		return result;
	}

	/* Formula1 User Services*/
	@POST
	@Path("/getFormula1Schedule")
	@Produces(MediaType.APPLICATION_JSON)
	public String getFormula1Schedule() {
		Formula1Helper f1Helper = new Formula1Helper();
		String result = f1Helper.getFormula1Schedule();
		return result;
	}
	
	@POST
	@Path("/getFormula1ToEdit")
	@Produces(MediaType.APPLICATION_JSON)
	public String getFormula1ToEdit() {
		Formula1Helper f1Helper = new Formula1Helper();
		String result = f1Helper.getFormula1ToEdit();
		return result;
	}
	
	@POST
	@Path("/updateF1Practice")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String setF1Practice(@Context UriInfo uriInfo) {
		Formula1Helper f1Helper = new Formula1Helper();
		String result = f1Helper.updateF1Practice(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/setF1Schedule")
	@Produces(MediaType.APPLICATION_JSON)
	public String setF1Schedule(@Context UriInfo uriInfo) {
		Formula1Helper f1Helper = new Formula1Helper();
		String result = f1Helper.setF1Schedule(uriInfo.getQueryParameters());
		return result;
	}
	
	@POST
	@Path("/removeF1Schedule")
	@Produces(MediaType.APPLICATION_JSON)
	public String removeF1Schedule(@Context UriInfo uriInfo) {
		Formula1Helper f1Helper = new Formula1Helper();
		String result = f1Helper.removeF1Schedule(uriInfo.getQueryParameters());
		return result;
	}
	
	@POST
	@Path("/getMovies")
	@Produces(MediaType.APPLICATION_JSON)
	public String getMovies(@Context UriInfo uriInfo) {
		MoviesServices movieServices = new MoviesServices();
		String result = movieServices.getMovies(uriInfo.getQueryParameters());
		return result;
	}
	
	@POST
	@Path("/getMoviesToEdit")
	@Produces(MediaType.APPLICATION_JSON)
	public String getMoviesToEdit() {
		MoviesServices movieServices = new MoviesServices();
		String result = movieServices.getMoviesToEdit();
		return result;
	}
	
	@POST
	@Path("/setMovie")
	@Produces(MediaType.APPLICATION_JSON)
	public String setMovie(@Context UriInfo uriInfo) {
		MoviesServices movieServices = new MoviesServices();
		String result = movieServices.setMovie(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/removeMovie")
	@Produces(MediaType.APPLICATION_JSON)
	public String removeMovie(@Context UriInfo uriInfo) {
		MoviesServices movieServices = new MoviesServices();
		String result = movieServices.removeMovie(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/updateMovie")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateMovie(@Context UriInfo uriInfo) {
		MoviesServices movieServices = new MoviesServices();
		String result = movieServices.updateMovie(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/setCricket")
	@Produces(MediaType.APPLICATION_JSON)
	public String setCricket(@Context UriInfo uriInfo) {
		CricketHelper cricketHelper = new CricketHelper();
		String result = cricketHelper.setCricket(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/getIntlCricket")
	@Produces(MediaType.APPLICATION_JSON)
	public String getIntlCricket() {
		CricketHelper cricketHelper = new CricketHelper();
		String result = cricketHelper.getIntlCricket();
		return result;
	}

	@POST
	@Path("/getIntlCricketToDisplay")
	@Produces(MediaType.APPLICATION_JSON)
	public String getIntlCricketToDisplay() {
		CricketHelper cricketHelper = new CricketHelper();
		String result = cricketHelper.getIntlCricketToDisplay();
		return result;
	}

	@POST
	@Path("/getCricketCountries")
	@Produces(MediaType.APPLICATION_JSON)
	public String getCricketCountries() {
		GenericHelper genericHelper = new GenericHelper();
		String result = genericHelper.getCountriesBySport("CRICKET");
		return result;
	}

	@POST
	@Path("/getCricketMatchTypes")
	@Produces(MediaType.APPLICATION_JSON)
	public String getCricketMatchTypes() {
		DatabaseUtils dbUtils = new DatabaseUtils();
		Map<String, Object> queryParams = new HashMap<String, Object>();
		queryParams.put("sports_type_id", "CRICKET");
		Map<String, Object> resultMap = dbUtils.getEntityDataWithConditions("sports_child_type", queryParams);
		return new Gson().toJson(resultMap);
	}

	@POST
	@Path("/removeCricket")
	@Produces(MediaType.APPLICATION_JSON)
	public String removeCricket(@Context UriInfo uriInfo) {
		CricketHelper cricketHelper = new CricketHelper();
		String result = cricketHelper.removeCricket(uriInfo.getQueryParameters());
		return result;
	}

	@POST
	@Path("/updateCricket")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateCricket(@Context UriInfo uriInfo) {
		CricketHelper cricketHelper = new CricketHelper();
		String result = cricketHelper.updateCricket(uriInfo.getQueryParameters());
		return result;
	}
}
