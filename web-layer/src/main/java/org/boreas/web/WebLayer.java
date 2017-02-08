/*
    Boreas
    Copyright 2016 Jie Kang, Anirudh Mukundan
    This file is part of Boreas.

    Boreas is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Boreas is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Boreas.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.boreas.web;


import java.util.concurrent.atomic.AtomicBoolean;

import org.boreas.mongodb.MongoStorage;
import org.boreas.web.handler.HttpHandler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;


/**
 * Web Layer for Thermostat that handles http requests from the client to the storage backend (mongodb) through REST API
 */
public class WebLayer {

    private final String host;
    private Server server;
    private ServerConnector httpConnector;

    private AtomicBoolean ready = new AtomicBoolean(false);

    public WebLayer() {
        this("localhost");
    }

    public WebLayer(String host) {
        this.host = host;
    }

    public void start() throws Exception {
        MongoStorage storage = new MongoStorage("thermostat", 27518);
        storage.start();

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        server = new Server(8090);

        httpConnector = new ServerConnector(server);
        httpConnector.setHost(host);
        httpConnector.setIdleTimeout(30000);
        server.addConnector(httpConnector);

        server.setHandler(context);

        ServletHolder jerseyServlet = context.addServlet(
            org.glassfish.jersey.servlet.ServletContainer.class, "/*");
        jerseyServlet.setInitOrder(0);
        jerseyServlet.setInitParameter(
            "jersey.config.server.provider.classnames",
            HttpHandler.class.getCanonicalName());
        try {
            server.start();
            ready.getAndSet(true);
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            storage.finish();
            stop();
        }
    }

    public void stop() {
        try {
            server.stop();
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getPort() {
        return httpConnector.getLocalPort();
    }

    public boolean isReady() {
        return ready.get();
    }
}
