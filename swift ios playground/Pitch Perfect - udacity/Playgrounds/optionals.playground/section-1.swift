// Optionals

func findApt (aptNumber : String ) -> String? { // returns optional
    let aptNumbers = ["101","202","303","404"]
    for tempAptNumber in aptNumbers {
        if ( tempAptNumber == aptNumber) {
            return aptNumber
        }
    }
    
    return nil
}

if let culprit = findApt("102") {       // if let keywords, let unwraps optional like using !
    println("Apt Found: \(culprit)")
}

println( findApt("303")! )