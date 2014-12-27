//
//  Current.swift
//  WeatherApp
//
//  Created by Bruno Magalhaes on 25/12/2014.
//  Copyright (c) 2014 Bruno Magalhaes. All rights reserved.
//

import Foundation
import UIKit

struct Current {
    
    var currentTime: String?
    var icon: UIImage?
    var temperature: Int
    var humidity: Double
    var precipProbability: Double
    var summary: String

    
    init(weatherDictionary: NSDictionary) {
        
        let currentWeather = weatherDictionary["currently"] as NSDictionary
        
        temperature = currentWeather["temperature"] as Int
        humidity = currentWeather["humidity"] as Double
        precipProbability = currentWeather["precipProbability"] as Double
        summary = currentWeather["summary"] as String
        
        let iconString = currentWeather["icon"] as String
        icon = weatherIconFromString(iconString)
        
        currentTime = dateStringFromUnixTime( currentWeather["time"] as Int )
                
    }
    
    func dateStringFromUnixTime(unixTime: Int) -> String {
        let timeInSeconds = NSTimeInterval(unixTime)
        let weatherDate = NSDate( timeIntervalSince1970: timeInSeconds)
        
        let dateFormatter = NSDateFormatter();
        dateFormatter.timeStyle = .ShortStyle
        
        return dateFormatter.stringFromDate(weatherDate)
    }
    
    func weatherIconFromString(stringIcon: String) -> UIImage {
        
        var imageName : String
        
        switch stringIcon {
        case "clear-day":
            imageName = "clear-day"
        case "clear-night":
            imageName = "clear-night"
        case "rain":
            imageName = "rain"
        case "snow":
            imageName = "snow"
        case "sleet":
            imageName = "sleet"
        case "wind":
            imageName = "wind"
        case "fog":
            imageName = "fog"
        case "cloudy":
            imageName = "cloudy"
        case "partly-cloudy-day":
            imageName = "partly-cloudy"
        case "partly-cloudy-night":
            imageName = "cloudy-night"
        default:
            imageName = "default"
        }
        
        var iconName = UIImage(named: imageName)
        return iconName!
        
    }
    
}