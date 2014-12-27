//
//  RecordSoundsViewController.swift
//  Pitch Perfect
//
//  Created by Bruno Magalhaes on 23/12/2014.
//  Copyright (c) 2014 Bruno Magalhaes. All rights reserved.
//

import UIKit
import AVFoundation

class RecordSoundsViewController: UIViewController, AVAudioRecorderDelegate {
    
    @IBOutlet weak var recordingLabel: UILabel!
    @IBOutlet weak var stopButton: UIButton!
    @IBOutlet weak var recordingButton: UIButton!
    
    //Declared Globally
    var audioRecorder:AVAudioRecorder!
    var recordedAudio:RecordedAudio!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool) {
        recordingButton.enabled = true
        stopButton.hidden = true
    }
    
    
    @IBAction func stopRecording(sender: UIButton) {
        
        audioRecorder.stop()
        var audioSession = AVAudioSession.sharedInstance()
        audioSession.setActive(false, error: nil)
        
        recordingLabel.hidden = true
        recordingButton.enabled = true
        stopButton.enabled = false
    }
    
    @IBAction func recordAudio(sender: UIButton) {
        recordingButton.enabled = false
        recordingLabel.hidden = false
        stopButton.hidden = false
        stopButton.enabled = true
        
        //Inside func recordAudio(sender: UIButton)
        let dirPath = NSSearchPathForDirectoriesInDomains(.DocumentDirectory, .UserDomainMask, true)[0] as String
        
        let currentDateTime = NSDate()
        let formatter = NSDateFormatter()
        formatter.dateFormat = "ddMMyyyy-HHmmss"
        let recordingName = formatter.stringFromDate(currentDateTime)+".wav"
        let pathArray = [dirPath, recordingName]
        let filePath = NSURL.fileURLWithPathComponents(pathArray)
        println(filePath)
        
        var session = AVAudioSession.sharedInstance()
        session.setCategory(AVAudioSessionCategoryPlayAndRecord, error: nil)
        
        audioRecorder = AVAudioRecorder(URL: filePath, settings: nil, error: nil)
        audioRecorder.meteringEnabled = true
        
        audioRecorder.delegate = self
        audioRecorder.record()
        
    }
    
    func audioRecorderDidFinishRecording(recorder: AVAudioRecorder!, successfully flag: Bool) {
        
        if (flag){
            
            recordedAudio = RecordedAudio()
            recordedAudio.filePathUrl = recorder.url
            recordedAudio.title = recorder.url.lastPathComponent
            self.performSegueWithIdentifier("stopRecording", sender: recordedAudio)
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        if (segue.identifier == "stopRecording"){
            
            let playSoundsVC:playSoundsViewController = segue.destinationViewController as playSoundsViewController
            let data = sender as RecordedAudio
            playSoundsVC.receivedAudio = data
        }
        
    }
    
}

