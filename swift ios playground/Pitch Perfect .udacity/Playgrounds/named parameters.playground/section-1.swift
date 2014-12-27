// Playground - noun: a place where people can play

struct Person {
    let name:String
    var age:Int
    var profession:String
    
    init( name name: String, #age: Int, profession: String? ){
        
        self.name = name
        self.age = age
        
        if let hasProfession = profession {
            self.profession = hasProfession
        } else {
            self.profession = "unkown"
        }
    }
    
    func description() -> String {
        return "Name: " + self.name + "\nAge: " + String(self.age) + "\nProfession: " + self.profession
    }
}

let joe = Person(name: "Joe", age: 19, profession: nil)

println(joe.description())
