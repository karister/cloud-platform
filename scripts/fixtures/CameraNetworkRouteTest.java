package com.example.cloudplatformcomm;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public final class CameraNetworkRouteTest {
    private static Inet4Address ip(String value) throws Exception {
        return (Inet4Address) InetAddress.getByName(value);
    }

    private static void expect(String expected, String actual) {
        if (!Objects.equals(expected, actual)) throw new AssertionError("Expected " + expected + ", got " + actual);
    }

    public static void main(String[] args) throws Exception {
        // Real Redmi K30 Pro topology: wlan0 upstream + wlan1 hotspot.
        List<CameraNetworkRoute<String>> sharedWifi = Arrays.asList(
                new CameraNetworkRoute<>(ip("192.168.0.104"), 24, "wifi"),
                new CameraNetworkRoute<>(ip("192.168.136.50"), 24, null));
        expect(null, CameraNetworkRoute.networkFor(ip("192.168.136.102"), sharedWifi));
        expect("wifi", CameraNetworkRoute.networkFor(ip("192.168.0.102"), sharedWifi));
        // Other phone's hotspot / ESP32 AP: Wi-Fi may not be the default Internet network.
        List<CameraNetworkRoute<String>> offlineWifi = Collections.singletonList(
                new CameraNetworkRoute<>(ip("192.168.4.2"), 24, "offline-wifi"));
        expect("offline-wifi", CameraNetworkRoute.networkFor(ip("192.168.4.1"), offlineWifi));
        expect(null, CameraNetworkRoute.networkFor(ip("192.168.136.102"), Collections.emptyList()));
        expect(null, CameraNetworkRoute.networkFor(ip("192.168.136.102"), offlineWifi));
        // Use actual prefix lengths, including non-octet and overlapping subnets.
        List<CameraNetworkRoute<String>> overlap = Arrays.asList(
                new CameraNetworkRoute<>(ip("10.0.0.1"), 8, "wide-wifi"),
                new CameraNetworkRoute<>(ip("10.42.1.129"), 25, null));
        expect(null, CameraNetworkRoute.networkFor(ip("10.42.1.200"), overlap));
        expect("wide-wifi", CameraNetworkRoute.networkFor(ip("10.42.1.127"), overlap));
        expect(null, CameraNetworkRoute.networkFor(ip("192.168.136.102"), Collections.singletonList(
                new CameraNetworkRoute<>(ip("192.168.0.104"), 0, "default-wifi"))));
        System.out.println("CameraNetworkRoute: all routing regression cases passed");
    }
}
