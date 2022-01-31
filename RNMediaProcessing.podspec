
Pod::Spec.new do |s|
  s.name         = "RNMediaProcessing"
  s.version      = "1.0.0"
  s.summary      = "RNMediaProcessing"
  s.description  = <<-DESC
                  RNMediaProcessing
                   DESC
  s.homepage     = "https://github.com/sanghanivishal/react-native-media-processing"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "vishsanghani@gmail.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/sanghanivishal/react-native-media-processing", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}",
                    "ios/RNMediaProcessing.m",
                    "ios/RNMediaProcessing.h",
                    "ios/RNExecuteDelegate.h",
                    "ios/RNExecuteDelegate.m"
  s.ios.deployment_target = '11.0'
  s.requires_arc = true

  s.dependency "React"
  s.dependency "mobile-ffmpeg-full-gpl", "~> 4.4"
  #s.dependency "others"

end

