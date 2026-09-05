package com.example.cloudplatformcomm;

import java.net.Inet4Address;
import java.util.List;

/** A connected IPv4 subnet. A null network means a local hotspot interface. */
final class CameraNetworkRoute<T> {
    final Inet4Address address;
    final int prefixLength;
    final T network;

    CameraNetworkRoute(Inet4Address address, int prefixLength, T network) {
        this.address = address;
        this.prefixLength = prefixLength;
        this.network = network;
    }

    boolean contains(Inet4Address target) {
        // Never use a default route to bind camera traffic to an upstream network.
        if (prefixLength <= 0 || prefixLength > 32) return false;
        byte[] local = address.getAddress();
        byte[] remote = target.getAddress();
        for (int bit = 0; bit < prefixLength; bit++) {
            int mask = 1 << (7 - bit % 8);
            if ((local[bit / 8] & mask) != (remote[bit / 8] & mask)) return false;
        }
        return true;
    }

    static <T> T networkFor(Inet4Address target, List<CameraNetworkRoute<T>> routes) {
        CameraNetworkRoute<T> best = null;
        for (CameraNetworkRoute<T> route : routes) {
            if (route.contains(target) && (best == null || route.prefixLength > best.prefixLength)) best = route;
        }
        return best == null ? null : best.network;
    }
}
