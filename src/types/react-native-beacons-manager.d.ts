declare module "react-native-beacons-manager" {
  export interface BeaconRegion {
    identifier: string;
    uuid: string;
    major?: number;
    minor?: number;
  }

  export interface Beacon {
    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    proximity: string;
    accuracy: number;
    distance?: number; // Android
  }

  export function requestAlwaysAuthorization(): void;
  export function requestWhenInUseAuthorization(): void;
  
  export function detectIBeacons(): void;
  
  export function startRangingBeaconsInRegion(region: BeaconRegion): Promise<void>;
  export function stopRangingBeaconsInRegion(region: BeaconRegion): Promise<void>;
  
  export function startMonitoringForRegion(region: BeaconRegion): Promise<void>;
  export function stopMonitoringForRegion(region: BeaconRegion): Promise<void>;
  
  // Android specific
  export function setHardwareEqualityEnforced(flag: boolean): void;
}

