'use strict';

describe('Developers Collection', function () {

    var developers = PairGenerator.developersList;
    beforeEach(function() {
        developers.reset();
    });

    it('should add Developer instances as objects', function() {
        expect(developers).to.have.length(0);
        developers.add({ name: 'John Wicks' });
        expect(developers).to.have.length(1);
        developers.add([
            { name: 'Jack', paired: true },
            { name: 'Phil', paired: true }
        ]);
        expect(developers).to.have.length(3);
    });

    it('should have a comparator function that will sort by name', function() {
        developers.add([
            { name: 'Jack'},
            { name: 'Phil'},
            { name: 'Ben'}
        ]);
        expect(developers.at(0).get('name')).to.equal('Ben');
        expect(developers.at(1).get('name')).to.equal('Jack');
        expect(developers.at(2).get('name')).to.equal('Phil');
    });

    it('should calculate paired and unpaired developers', function() {
        developers.add([
            { name: 'Jack', paired: true },
            { name: 'John', paired: false },
            { name: 'Ben', paired: true }
        ]);

        var completedItems = developers.paired();
        var remainingItems = developers.remaining();

        expect(completedItems).to.have.length(2);
        expect(remainingItems).to.have.length(1);
        
        expect(remainingItems[0].get('paired')).to.equal(false);
        expect(remainingItems[0].get('name')).to.equal('John');
    });

    it('should return matrix with all developers', function() {
        developers.add([
            { name: 'Jack', paired: true },
            { name: 'John', paired: false },
            { name: 'Ben', paired: true }
        ]);

        var completedItems = developers.paired();
        var remainingItems = developers.remaining();

        expect(completedItems).to.have.length(2);
        expect(remainingItems).to.have.length(1);
        
        expect(remainingItems[0].get('paired')).to.equal(false);
        expect(remainingItems[0].get('name')).to.equal('John');
    });

    it('should return updated matrix when developer model is deleted', function() {
        developers.add([
            { name: 'Jack', paired: true },
            { name: 'John', paired: false },
            { name: 'Ben', paired: true }
        ]);

        var completedItems = developers.paired();
        var remainingItems = developers.remaining();

        expect(completedItems).to.have.length(2);
        expect(remainingItems).to.have.length(1);
        
        expect(remainingItems[0].get('paired')).to.equal(false);
        expect(remainingItems[0].get('name')).to.equal('John');
    });
});