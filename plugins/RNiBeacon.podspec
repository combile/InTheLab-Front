require "json"

Pod::Spec.new do |s|
  s.name         = "RNiBeacon"
  s.version      = "1.0.7"
  s.summary      = "React Native iBeacon support for iOS"
  s.description  = "React Native iBeacon support for iOS using react-native-beacons-manager"
  s.homepage     = "https://github.com/MacKentoch/react-native-beacons-manager"
  s.license      = "MIT"
  s.author       = { "MacKentoch" => "erwan.music@gmail.com" }
  s.platform     = :ios, "12.0"
  s.source       = { :git => "https://github.com/MacKentoch/react-native-beacons-manager.git", :tag => "v#{s.version}" }
  s.source_files = "ios/RNiBeacon/RNiBeacon/**/*.{h,m}"
  s.frameworks   = "CoreLocation"
  s.dependency   "React-Core"
end
