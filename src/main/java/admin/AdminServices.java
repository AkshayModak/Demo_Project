package admin;

import java.io.Serializable;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.server.ResourceConfig;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
public class AdminServices extends ResourceConfig implements Serializable {
    /**
     * Admin Services to call Helper Methods for Dashboard and related admin
     * modules. USES: Rest API (Jersey)
     */
    private static final long serialVersionUID = 1L;
    public final String className = AdminServices.class.getName();

    public AdminServices() {
        System.out.println("===running--- Found Class====");
    }

    @POST
    @Path("/getVisits")
    public String getVisits() {
        DashboardHelper dbHelper = new DashboardHelper();
        String result = dbHelper.getVisits();
        return result;
    }
}