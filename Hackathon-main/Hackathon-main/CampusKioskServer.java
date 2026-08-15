import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CampusKioskServer {
    private static final Path ROOT = Path.of(System.getProperty("user.dir"));
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/rooms", exchange -> {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String json = Files.readString(ROOT.resolve("rooms.json"), StandardCharsets.UTF_8);
            sendJson(exchange, 200, json);
        });

        server.createContext("/api/reserve", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String roomId = extractJsonString(requestBody, "roomId");
            String duration = extractJsonString(requestBody, "duration");
            String studentId = extractJsonString(requestBody, "studentId");

            String response = String.format(
                "{\"status\":\"success\",\"roomId\":\"%s\",\"duration\":\"%s\",\"studentId\":\"%s\",\"message\":\"Seat reservation received by Java backend\"}",
                roomId == null ? "unknown" : roomId,
                duration == null ? "unknown" : duration,
                studentId == null ? "" : studentId
            );

            sendJson(exchange, 200, response);
        });

        server.createContext("/", new StaticFileHandler());
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();

        System.out.println("Campus kiosk Java backend is running on http://localhost:" + PORT);
    }

    private static void sendJson(HttpExchange exchange, int statusCode, String jsonBody) throws IOException {
        byte[] response = jsonBody.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, response.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response);
        }
    }

    private static String extractJsonString(String payload, String key) {
        Pattern pattern = Pattern.compile("\\\"" + Pattern.quote(key) + "\\\"\\s*:\\s*\\\"([^\\\"]*)\\\"");
        Matcher matcher = pattern.matcher(payload);
        return matcher.find() ? matcher.group(1) : null;
    }

    private static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            String fileName = requestPath.equals("/") ? "index.html" : requestPath.substring(1);

            if (fileName.isBlank()) {
                fileName = "index.html";
            }

            Path target = ROOT.resolve(fileName).normalize();
            if (!target.startsWith(ROOT) || !Files.exists(target)) {
                sendJson(exchange, 404, "{\"error\":\"File not found\"}");
                return;
            }

            byte[] content = Files.readAllBytes(target);
            exchange.getResponseHeaders().set("Content-Type", getContentType(fileName));
            exchange.sendResponseHeaders(200, content.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(content);
            }
        }

        private String getContentType(String fileName) {
            if (fileName.endsWith(".html")) return "text/html; charset=UTF-8";
            if (fileName.endsWith(".css")) return "text/css; charset=UTF-8";
            if (fileName.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (fileName.endsWith(".json")) return "application/json; charset=UTF-8";
            return "application/octet-stream";
        }
    }
}
