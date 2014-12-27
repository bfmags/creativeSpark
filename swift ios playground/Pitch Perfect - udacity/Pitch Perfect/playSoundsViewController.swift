//
//  playSoundsViewController.swift
//  Pitch Perfect
//
//  Created by Bruno Magalhaes on 24/12/2014.
//  Copyright (c) 2014 Bruno Magalhaes. All rights reserved.
//

import UIKit
import AVFoundation

class playSoundsViewController: UIViewController {
    
    var audioPlayer:AVAudioPlayer!
    var receivedAudio:RecordedAudio!
    
    var audioEngine:AVAudioEngine!
    var audioFile:AVAudioFile!
    
    
    @IBOutlet weak var stopButton: UIButton!
    
    

    override func viewDidLoad() {
        super.viewDidLoad()
        
        stopButton.enabled = false
        
        audioPlayer = AVAudioPlayer()
        audioPlayer = AVAudioPlayer(contentsOfURL: receivedAudio.filePathUrl, error: nil)
        audioPlayer.enableRate = true
        audioPlayer.prepareToPlay()
        
        audioEngine = AVAudioEngine()
        audioFile = AVAudioFile(forReading: receivedAudio.filePathUrl, error: nil)

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func fast(sender: UIButton) {
        stopButton.enabled = true
        playAudio(1.5, fromBeginning: true)
    }
    
    
    @IBAction func slowMo(sender: UIButton) {
        stopButton.enabled = true
        playAudio(0.5,fromBeginning: true)
    }

    @IBAction func stop(sender: UIButton) {
        audioPlayer.stop()
        audioEngine.stop()
        audioEngine.reset()
        audioPlayer.rate = 1
        stopButton.enabled = false
    }
    
    @IBAction func chipmunk(sender: UIButton) {
        stopButton.enabled = true
        playAudioWithVariablePitch(1000)
        
    }
    
    @IBAction func darthVader(sender: UIButton) {
        stopButton.enabled = true
        playAudioWithVariablePitch(-1000)
    }
    
    func playAudio (rate:Float, fromBeginning:Bool?){
        audioPlayer.stop()
        audioPlayer.rate = rate
        
        if let testFromBeginning = fromBeginning {
            if (testFromBeginning) { audioPlayer.currentTime = 0.0 }
        }
        audioPlayer.play()
    }
    
    func playAudioWithVariablePitch(pitch: Float){
        audioPlayer.stop()
        audioEngine.stop()
        audioEngine.reset()
        
        var audioPlayerNode = AVAudioPlayerNode()
        audioEngine.attachNode(audioPlayerNode)
        
        var changePitchEffect = AVAudioUnitTimePitch()
        changePitchEffect.pitch = pitch
        audioEngine.attachNode(changePitchEffect)
        
        audioEngine.connect(audioPlayerNode, to: changePitchEffect, format: nil)
        audioEngine.connect(changePitchEffect, to: audioEngine.outputNode, format: nil)
        
        audioPlayerNode.scheduleFile(audioFile, atTime: nil, completionHandler: nil)
        audioEngine.startAndReturnError(nil)
        
        audioPlayerNode.play()
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
