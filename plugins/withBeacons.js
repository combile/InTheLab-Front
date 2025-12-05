const { withDangerousMod, withInfoPlist } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * MARK:
 * iOS에서 RNiBeacon pod을 Podfile에 추가하고 필요한 권한을 설정
 */
function withBeacons(config) {
  // podspec 파일 복사 및 Podfile 수정
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = config.modRequest.platformProjectRoot;

      // podspec 파일을 node_modules로 복사
      const sourcePodspec = path.join(projectRoot, "plugins", "RNiBeacon.podspec");
      const targetPodspec = path.join(
        projectRoot,
        "node_modules",
        "react-native-beacons-manager",
        "RNiBeacon.podspec"
      );

      if (fs.existsSync(sourcePodspec)) {
        fs.copyFileSync(sourcePodspec, targetPodspec);
        console.log("[withBeacons] Copied RNiBeacon.podspec to node_modules");
      }

      // Podfile 수정
      const podfilePath = path.join(iosRoot, "Podfile");
      let podfileContent = fs.readFileSync(podfilePath, "utf-8");

      // RNiBeacon pod이 이미 있는지 확인
      if (!podfileContent.includes("RNiBeacon")) {
        // use_react_native! 블록 이후에 pod 추가
        const targetPattern = /use_react_native!\([^)]*\)/;
        const match = podfileContent.match(targetPattern);

        if (match) {
          const insertPosition = match.index + match[0].length;
          // node_modules 루트의 podspec 참조
          const podEntry = `\n\n  # react-native-beacons-manager\n  pod 'RNiBeacon', :path => '../node_modules/react-native-beacons-manager'`;

          podfileContent =
            podfileContent.slice(0, insertPosition) +
            podEntry +
            podfileContent.slice(insertPosition);

          fs.writeFileSync(podfilePath, podfileContent);
          console.log("[withBeacons] Added RNiBeacon pod to Podfile");
        } else {
          console.warn(
            "[withBeacons] Could not find use_react_native! in Podfile"
          );
        }
      } else {
        console.log("[withBeacons] RNiBeacon pod already exists in Podfile");
      }

      return config;
    },
  ]);

  // Info.plist에 위치 및 블루투스 권한 추가
  config = withInfoPlist(config, (config) => {
    // 위치 권한 (비콘 스캔에 필요)
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription ||
      "비콘 기반 출퇴근 체크를 위해 위치 권한이 필요합니다.";

    config.modResults.NSLocationWhenInUseUsageDescription =
      config.modResults.NSLocationWhenInUseUsageDescription ||
      "비콘 기반 출퇴근 체크를 위해 위치 권한이 필요합니다.";

    config.modResults.NSLocationAlwaysUsageDescription =
      config.modResults.NSLocationAlwaysUsageDescription ||
      "백그라운드에서도 비콘을 감지하여 자동 출퇴근 체크를 위해 항상 위치 권한이 필요합니다.";

    // 블루투스 권한 (iOS 13+)
    config.modResults.NSBluetoothAlwaysUsageDescription =
      config.modResults.NSBluetoothAlwaysUsageDescription ||
      "비콘 기반 출퇴근 체크를 위해 블루투스 권한이 필요합니다.";

    config.modResults.NSBluetoothPeripheralUsageDescription =
      config.modResults.NSBluetoothPeripheralUsageDescription ||
      "비콘 기반 출퇴근 체크를 위해 블루투스 권한이 필요합니다.";

    // Background Modes 설정
    const existingModes = config.modResults.UIBackgroundModes || [];
    const requiredModes = ["location", "bluetooth-central"];

    requiredModes.forEach((mode) => {
      if (!existingModes.includes(mode)) {
        existingModes.push(mode);
      }
    });

    config.modResults.UIBackgroundModes = existingModes;

    console.log("[withBeacons] Added location and bluetooth permissions");
    return config;
  });

  return config;
}

module.exports = withBeacons;
