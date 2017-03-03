import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

/*
 * a simple static http server
*/
public class Server {

  public static void main(String[] args) throws Exception {
    ExecutorService jmsSendThreadPool = new ThreadPoolExecutor(20, 2000, 400L, TimeUnit.MILLISECONDS, new SynchronousQueue<Runnable>(true));

    HttpServer server = HttpServer.create(new InetSocketAddress(80), 0);
    server.createContext("/", new MyHandler());
    server.setExecutor(jmsSendThreadPool); // creates a default executor
    server.start();
    System.out.println("HTTP SERVER is LISTENING AT PORT 80.");
  }

  static class MyHandler implements HttpHandler {
    public void handle(HttpExchange t) throws IOException {
      String response = "<h1>http test</h1>";
      t.sendResponseHeaders(200, response.length());
      OutputStream os = t.getResponseBody();
      os.write(response.getBytes());
      os.close();
    }
  }
}
