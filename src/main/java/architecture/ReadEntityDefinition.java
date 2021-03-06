package architecture;

import java.io.File;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import architecture.utils.DebugWrapper;
import one.DefaultObjects;
import one.ReadXMLFile;

public class ReadEntityDefinition {

    private List<List> NodeDataList = new ArrayList<List>();
    final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private String DB_URL, USER, PASS, DATABASE_NAME, HOST;
    Connection conn;
    private Map<String, Object> tablesMap = new HashMap<String, Object>();
    public final String className = ReadEntityDefinition.class.getName();

    private String nextrr_home = System.getProperty("user.dir") + "/";

    private void setDBUrl() {
        DB_URL = "jdbc:mysql://" + HOST + "/" + DATABASE_NAME;
    }

    private Map<String, Object> loadDriver() {

        Map<String, Object> successMessage = DefaultObjects.getSuccessMap();

        try {
            Class.forName(JDBC_DRIVER);
            DebugWrapper.logInfo("Connecting to " + DATABASE_NAME + " database...", className);
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            DebugWrapper.logInfo("Connected database successfully...", className);
        } catch (Exception e) {
            DebugWrapper.logInfo("Error During Loading Driver" + e, className);
            return DefaultObjects.getErrorMap(e);
        }

        return successMessage;
    }

    private String getJdbcTypeName(int jdbcType) {
        Map map = new HashMap();

        // Get all field in java.sql.Types
        Field[] fields = java.sql.Types.class.getFields();
        for (int i = 0; i < fields.length; i++) {
            try {
                String name = fields[i].getName();
                Integer value = (Integer) fields[i].get(null);
                map.put(value, name);
            } catch (IllegalAccessException e) {
            }
        }
        return (String) map.get(jdbcType);
    }

    private Map<String, Object> getXMLData() {

        Map<String, Object> nodeResult = new HashMap<String, Object>();
        try {
            String fileName = nextrr_home + "Entity.xml";
            File file = new File(fileName);
            DocumentBuilder dBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = dBuilder.parse(file);

            Element tableElements = doc.getDocumentElement();
            NodeList tableNodeList = tableElements.getElementsByTagName("table");

            if (doc.hasChildNodes()) {
                for (int i = 0; i < tableNodeList.getLength(); i++) {
                    Node columnNodes = tableNodeList.item(i);
                    if (columnNodes.hasAttributes()) {
                        NamedNodeMap nodeMap = columnNodes.getAttributes();
                        Node node = nodeMap.item(0);
                        String tableName = node.getNodeValue();
                        printNote(columnNodes.getChildNodes(), tableName);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return tablesMap;
    }

    private void printNote(NodeList nodeList, String tableName) {

        List<Map<String, Object>> tableList = new ArrayList<Map<String, Object>>();
        String nodeName = null;
        String nodeValue = null;

        for (int count = 0; count < nodeList.getLength(); count++) {
            Node tempNode = nodeList.item(count);
            if (tempNode.hasAttributes()) {
                NamedNodeMap nodeMap = tempNode.getAttributes();
                Map<String, Object> nodeData = new HashMap<String, Object>();
                nodeData.put("tableName", tableName);
                for (int i = 0; i < nodeMap.getLength(); i++) {
                    Node node = nodeMap.item(i);
                    nodeName = node.getNodeName();
                    nodeValue = node.getNodeValue();
                    nodeData.put(nodeName, nodeValue);
                }
                tableList.add(nodeData);
            }
        }
        tablesMap.put(tableName.toLowerCase(), tableList);
    }

    private Map<String, Object> setCreateQuery() {

        DatabaseMetaData metadata = null;
        try {
            metadata = conn.getMetaData();
        } catch (SQLException e) {
            System.out.println(e);
        }

        ResultSet resultSet;
        Map<String, Object> queriesMap = new HashMap<String, Object>();

        try {
            Map<String, Object> map = tablesMap;
            for (Map.Entry<String, Object> table : map.entrySet()) {
                String tableName = table.getKey();
                ResultSet tableRs = metadata.getTables(null, null, tableName, null);
                HashSet<String> createQueries = new HashSet<String>();
                if (!tableRs.next()) {
                    for (Map<String, Object> column : (List<Map<String, Object>>) table.getValue()) {
                        String createQuery = "";
                        String dataType = (String) column.get("data-type");

                        if ("int".equals(dataType)) {
                            createQuery += " " + column.get("name") + " " + dataType;
                        } else {
                            createQuery += " " + column.get("name") + " " + dataType + "(" + column.get("column-size")
                                    + ")";
                        }

                        if ("true".equals(column.get("primary-key"))) {
                            String primaryKey = " primary key";
                            createQuery += primaryKey;
                        } else if ("true".equals(column.get("distinct"))) {
                            String distinct = " distinct";
                            createQuery += distinct;
                        }

                        if ("false".equals(column.get("null")) && "true".equals(column.get("primary-key"))) {
                            createQuery += " NOT NULL";
                        }

                        if ("true".equals(column.get("auto-increment"))) {
                            createQuery += " AUTO_INCREMENT";
                        }

                        if (DefaultObjects.isNotEmpty(createQuery)) {
                            createQueries.add(createQuery);
                        }
                    }
                }
                if (!createQueries.isEmpty()) {
                    queriesMap.put("create-" + tableName, createQueries);
                }
            }

            resultSet = metadata.getTables(null, null, "%", null);
            while (resultSet.next()) {
                String tableName = resultSet.getString(3);
                List<Map<String, Object>> table = (List<Map<String, Object>>) tablesMap.get(tableName);

                if (table != null) {
                    HashSet<String> alterQueries = new HashSet<String>();
                    HashSet<String> modifyQueries = new HashSet<String>();
                    for (Map<String, Object> column : table) {
                        String columnName = (String) column.get("name");

                        ResultSet rs = null;
                        rs = metadata.getColumns(null, null, tableName, null);
                        boolean found = false;
                        while (rs.next()) {
                            if ("raceTypeId".equals(rs.getString("COLUMN_NAME"))) {
                                System.out.println("=====columnName======" + columnName);
                            } else {
                                /*
                                 * System.out.println("==exists==="+columnName);
                                 */
                            }
                        }

                        ResultSet tableRs = metadata.getColumns(null, null, tableName, columnName);

                        if (!tableRs.next()) {
                            String alterQuery = "";
                            String dataType = (String) column.get("data-type");
                            alterQuery += " " + columnName + " " + dataType + "(" + column.get("column-size") + ")";

                            if ("true".equals(column.get("primary-key"))) {
                                String primaryKey = " primary key";
                                alterQuery += primaryKey;
                            } else if ("true".equals(column.get("distinct"))) {
                                String distinct = " distinct";
                                alterQuery += distinct;
                            }

                            if ("false".equals(column.get("null"))) {
                                alterQuery += " NOT NULL";
                            }

                            if ("true".equals(column.get("auto-increment"))) {
                                alterQuery += " AUTO_INCREMENT";
                            }

                            if (DefaultObjects.isNotEmpty(alterQuery)) {
                                alterQueries.add(alterQuery);
                            }
                            if (!alterQueries.isEmpty()) {
                                queriesMap.put("alter-" + tableName, alterQueries);
                            }
                        } else {

                            /*
                             * Reference --
                             * https://docs.oracle.com/javase/7/docs/api/java/
                             * sql/DatabaseMeta
                             * Data.html#getColumns(java.lang.String,%20java.
                             * lang.String,%20java.
                             * lang.String,%20java.lang.String)
                             */
                            String modifyQuery = "";
                            columnName = (String) column.get("name");
                            ResultSet columnRs = metadata.getColumns(null, null, tableName, columnName);
                            while (columnRs.next()) {
                                String rsTableName = columnRs.getString("TABLE_NAME");
                                String rsColumnName = columnRs.getString("COLUMN_NAME");

                                if (rsTableName.equalsIgnoreCase(tableName)
                                        && rsColumnName.equalsIgnoreCase(columnName)) {
                                    Boolean columnText = true;
                                    Boolean dataTypeText = true;
                                    String rsDataType = getJdbcTypeName(columnRs.getShort("DATA_TYPE"));
                                    int rsColumnSize = columnRs.getInt("COLUMN_SIZE");
                                    /*
                                     * if (rsColumnSize == 10) { rsColumnSize =
                                     * Integer.parseInt((String)
                                     * column.get("column-size")); }
                                     */
                                    String rsNullable = columnRs.getString("NULLABLE");
                                    String nullable = null;
                                    if (rsNullable.equalsIgnoreCase(String.valueOf(0))) {
                                        nullable = "true";
                                    } else if (rsNullable.equalsIgnoreCase(String.valueOf(1))) {
                                        nullable = "false";
                                    }
                                    String rsIsAutoIncrement = columnRs.getString("IS_AUTOINCREMENT");
                                    String autoIncrement = null;
                                    if (rsIsAutoIncrement.equalsIgnoreCase("NO")) {
                                        autoIncrement = "false";
                                    } else if (rsIsAutoIncrement.equalsIgnoreCase("YES")) {
                                        autoIncrement = "true";
                                    }

                                    if (column.get("data-type").equals("int")) {
                                        column.put("data-type", "INTEGER");
                                    }

                                    if (!rsDataType.equalsIgnoreCase((String) column.get("data-type"))) {
                                        String dataType = (String) column.get("data-type");
                                        dataTypeText = !dataTypeText;
                                        String columnSize = (String) column.get("column-size");
                                        if (columnText) {
                                            columnText = !columnText;
                                            if (column.get("data-type").equals("INTEGER")) {
                                                modifyQuery += " " + columnName + " " + dataType;
                                            } else {
                                                modifyQuery += " " + columnName + " " + dataType + "(" + columnSize
                                                        + ")";
                                            }
                                        } else {
                                            if (column.get("data-type").equals("INTEGER")) {
                                                modifyQuery += " " + dataType;
                                            } else {
                                                modifyQuery += " " + dataType + "(" + columnSize + ")";
                                            }
                                        }
                                    }
                                    int tableColumnSize = 0;
                                    if (column.get("column-size") != null) {
                                        tableColumnSize = Integer.parseInt((String) column.get("column-size"));
                                    }
                                    if (column.get("column-size") != null && rsColumnSize != tableColumnSize) {
                                        String columnSize = (String) column.get("column-size");
                                        if (column.get("data-type").equals("INTEGER")) {
                                            throw new SQLException("Fatal Error: Column Size of Integer defined.");
                                        }
                                        if (columnText) {
                                            columnText = !columnText;
                                            modifyQuery += " " + columnName + " " + (String) column.get("data-type")
                                                    + "(" + columnSize + ")";
                                        } else if (dataTypeText) {
                                            modifyQuery += " " + (String) column.get("data-type") + "(" + columnSize
                                                    + ")";
                                        } else {
                                            modifyQuery += "(" + columnSize + ")";
                                        }
                                    }

                                    if (DefaultObjects.isNotEmpty(column.get("null"))
                                            && "false".equals(column.get("null"))
                                            && (nullable.equalsIgnoreCase((String) column.get("null")))) {
                                        if (columnText) {
                                            columnText = !columnText;
                                            String columnSize = (String) column.get("column-size");
                                            if (column.get("data-type").equals("INTEGER")) {
                                                modifyQuery += " " + columnName + " " + (String) column.get("data-type")
                                                        + " NOT NULL";
                                            } else {
                                                modifyQuery += " " + columnName + " " + (String) column.get("data-type")
                                                        + "(" + columnSize + ")" + " NOT NULL";
                                            }
                                        } else {
                                            modifyQuery += " NOT NULL";
                                        }
                                    }

                                    if ((DefaultObjects.isNotEmpty(column.get("auto-increment"))
                                            && "true".equalsIgnoreCase((String) column.get("auto-increment")))
                                            && (DefaultObjects.isNotEmpty(column.get("auto-increment"))
                                                    && !autoIncrement
                                                            .equalsIgnoreCase((String) column.get("auto-increment")))) {
                                        if (columnText) {
                                            columnText = !columnText;
                                            String columnSize = (String) column.get("column-size");
                                            if (column.get("data-type").equals("INTEGER")) {
                                                modifyQuery += " " + columnName + " " + column.get("data-type")
                                                        + " AUTO_INCREMENT";
                                            } else {
                                                modifyQuery += " " + columnName + " " + column.get("data-type") + "("
                                                        + columnSize + ")" + " AUTO_INCREMENT";
                                            }
                                        } else {
                                            modifyQuery += " AUTO_INCREMENT";
                                        }
                                    }
                                    columnRs.close();
                                    columnRs = metadata.getPrimaryKeys(null, null, tableName);

                                    while (columnRs.next()) {
                                        String pkColName = columnRs.getString("COLUMN_NAME");
                                        if (DefaultObjects.isNotEmpty(column.get("primary-key"))
                                                && "true".equals(column.get("primary-key"))
                                                && !pkColName.equalsIgnoreCase(columnName)) {
                                            if (columnText) {
                                                columnText = !columnText;
                                                String columnSize = (String) column.get("column-size");
                                                if (column.get("data-type").equals("INTEGER")) {
                                                    modifyQuery += " " + columnName + " "
                                                            + (String) column.get("data-type") + " primary key";
                                                } else {
                                                    modifyQuery += " " + columnName + " "
                                                            + (String) column.get("data-type") + "(" + columnSize + ")"
                                                            + " primary key";
                                                }
                                            } else {
                                                modifyQuery += " primary key";
                                            }
                                        }
                                    }

                                    if (DefaultObjects.isNotEmpty(modifyQuery)) {
                                        modifyQueries.add(modifyQuery);
                                    }

                                    /*
                                     * String fkTable = null; String fKey =
                                     * null; if (column.get("fk-table") != null
                                     * && column.get("f-key") != null) { fkTable
                                     * = (String) column.get("fk-table"); fKey =
                                     * (String) column.get("f-key"); } columnRs
                                     * = metadata.getImportedKeys(null, null,
                                     * tableName); while(columnRs.next()) {
                                     * String fktable =
                                     * columnRs.getString("FKTABLE_NAME");
                                     * String fkColumn =
                                     * columnRs.getString("FKCOLUMN_NAME");
                                     * String fkName =
                                     * columnRs.getString("FK_NAME"); if
                                     * ((column.get("fk-table") != null &&
                                     * column.get("f-key") != null) &&
                                     * (column.get("fk-table") != fktable ||
                                     * column.get("f-key") != fkColumn)) {
                                     * System.out.println(
                                     * "========tableName========="+tableName);
                                     * System.out.println(
                                     * "========fktable========"+fktable);
                                     * System.out.println(
                                     * "=========fkColumn=========="+fkColumn);
                                     * System.out.println(
                                     * "=========fkName========="+fkName); } }
                                     */

                                    /*
                                     * if (column.get("fk-table") != null &&
                                     * column.get("f-key") != null) {
                                     * modifyQuery = ""; modifyQuery +=
                                     * "FOREIGN KEY (" + columnName +
                                     * ") REFERENCES " + column.get("fk-table")
                                     * +"(" + column.get("f-key") + ")"; if
                                     * (DefaultObjects.isNotEmpty(modifyQuery))
                                     * { modifyQueries.add(modifyQuery); } }
                                     */
                                }
                            }
                            if (!modifyQuery.isEmpty()) {
                                queriesMap.put("modify-" + tableName, modifyQueries);
                            }
                        }
                    }
                } else if (table == null) {
                    /*
                     * System.out.println("====table doesn't exist==="+tableName
                     * );
                     */
                    queriesMap.put("drop-" + tableName, tableName);

                }
            }
        } catch (SQLException e) {
            System.out.println("========e==========" + e);
        }
        return queriesMap;
    }

    private List<String> getCreateQueries() {

        List<String> createQueryList = new ArrayList<String>();
        Map<String, Object> tableList = getXMLData();

        Map<String, Object> sqlQuery = setCreateQuery();

        Map<String, Object> map = sqlQuery;
        for (Map.Entry<String, Object> queries : map.entrySet()) {
            String key = queries.getKey();

            if (key.startsWith("create-")) {
                String tableName = key.replace("create-", "");
                String query = "Create table if not exists " + tableName + "(";
                Iterator iterator = ((HashSet<Object>) queries.getValue()).iterator();
                while (iterator.hasNext()) {
                    query += (String) iterator.next();
                    if (iterator.hasNext()) {
                        query += ", ";
                    } else {
                        query += ");";
                    }
                }
                createQueryList.add(query);
            } else if (key.startsWith("modify-")) {
                String tableName = key.replace("modify-", "");
                String query = "alter table " + tableName;
                Iterator iterator = ((HashSet<Object>) queries.getValue()).iterator();
                while (iterator.hasNext()) {
                    String queryStr = (String) iterator.next();
                    if (queryStr.startsWith("FOREIGN KEY")) {
                        query += " add " + queryStr;
                    } else {
                        query += " modify Column " + queryStr;
                    }
                    if (iterator.hasNext()) {
                        query += ", ";
                    } else {
                        query += ";";
                    }
                }
                createQueryList.add(query);
            } else if (key.startsWith("alter-")) {
                String tableName = key.replace("alter-", "");
                String query = "alter table " + tableName + " add ";
                Iterator iterator = ((HashSet<Object>) queries.getValue()).iterator();
                while (iterator.hasNext()) {
                    query += (String) iterator.next();
                    if (iterator.hasNext()) {
                        query += ", ";
                    } else {
                        query += ";";
                    }
                }
                createQueryList.add(query);
            } else if (key.startsWith("drop-")) {
                String tableName = (String) queries.getValue();
                String query = "Drop table " + tableName;
                createQueryList.add(query);
            }
        }
        return createQueryList;
    }

    public String createTable() {
        String fileName = nextrr_home + "setup.xml";
        Map<String, Object> setupConfig = ReadXMLFile.getXMLData(fileName);
        USER = (String) setupConfig.get("username");
        PASS = (String) setupConfig.get("password");
        DATABASE_NAME = (String) setupConfig.get("database-name");
        HOST = (String) setupConfig.get("host");

        setDBUrl();
        loadDriver();
        Statement stmt = null;
        List<String> createQueries = getCreateQueries();

        for (String createQuery : createQueries) {
            System.out.println("========createQuery=======" + createQuery);
            try {
                stmt = conn.createStatement();
                stmt.executeUpdate(createQuery);
            } catch (SQLException e) {
                System.out.println(e);
            }

        }
        return "Table created Successfully";
    }

}