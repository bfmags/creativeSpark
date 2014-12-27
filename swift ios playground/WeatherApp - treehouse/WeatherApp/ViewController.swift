//
//  ViewController.swift
//  WeatherApp
//
//  Created by Bruno Magalhaes on 25/12/2014.
//  Copyright (c) 2014 Bruno Magalhaes. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    private let apiKey = "32faf1cc0b72c92edbfc9febab4a9df8"
    
    
    @IBOutlet weak var iconView: UIImageView!
    @IBOutlet weak var currentTimeLabel: UILabel!
    @IBOutlet weak var temperatureLabel: UILabel!
    @IBOutlet weak var humidityLabel: UILabel!
    @IBOutlet weak var precipitationLabel: UILabel!
    @IBOutlet weak var summaryLabel: UILabel!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    
    @IBOutlet weak var refreshButton: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        activityIndicator.hidden = true
        updateWeatherData()
        
    }
    
    
    @IBAction func refreshButton(sender: UIButton) {
        updateWeatherData()
    }
    
    func updateWeatherData() -> Void {
        
        let baseURL = NSURL(string: "https://api.forecast.io/forecast/\(apiKey)/")
        let forecastURL = NSURL(string: "37.8267,-122.423", relativeToURL: baseURL)
        
        downloadActivity(true)
        
        let sharedSession = NSURLSession.sharedSession()
        let downloadTask: NSURLSessionDownloadTask = sharedSession.downloadTaskWithURL(forecastURL!, completionHandler: { (location: NSURL!, response: NSURLResponse!, error: NSError!) -> Void in
            
            if (error == nil){
                let dataObject = NSData(contentsOfURL: location)
                let weatherDictionary : NSDictionary = NSJSONSerialization.JSONObjectWithData(dataObject!, options: nil, error: nil) as NSDictionary
                
                let currentWeather = Current(weatherDictionary: weatherDictionary)
                
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    
                    self.temperatureLabel.text = "\(currentWeather.temperature)"
                    self.humidityLabel.text = "\(currentWeather.humidity)"
                    self.currentTimeLabel.text = "\(currentWeather.currentTime!)"
                    self.precipitationLabel.text = "\(currentWeather.precipProbability)"
                    self.summaryLabel.text = "\(currentWeather.summary)"
                    
                    self.iconView.image = currentWeather.icon!
                    
                    self.downloadActivity(false)
                    
                } )
                
            } else {
                self.downloadActivity(false)
                
                let networkIssueController = UIAlertController(title: "Error", message: "Unable to load data. Connectivity error.", preferredStyle: .Alert)
                
                let okButton = UIAlertAction(title: "OK", style: .Default, handler: nil)
                networkIssueController.addAction(okButton)
                
                self.presentViewController(networkIssueController, animated: true, completion: nil)
                
            }
            
        })
        downloadTask.resume()
    
    }
    
    func downloadActivity (animate: Bool) -> Void {
        if (animate == true){
            activityIndicator.hidden = false
            refreshButton.hidden = true
            activityIndicator.startAnimating()
        } else {
            activityIndicator.hidden = true
            refreshButton.hidden = false
            activityIndicator.stopAnimating()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

