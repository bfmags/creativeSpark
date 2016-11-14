'use strict';

describe('Developer Model', function() {

    it('should exist', function() {
        var developer = new PairGenerator.Models.Developer();
        expect(developer).to.be.ok;
    });

    it('should be created with default values for its attributes', function() {
        var developer = new PairGenerator.Models.Developer();
        expect(developer.get('name')).to.equal('');
        expect(developer.get('paired')).to.equal(false);
    });

    it('should be created with values passed in constructor', function() {
        var developer = new PairGenerator.Models.Developer({
            name: "Joe",
            paired: true
        });
        expect(developer.get('name')).to.equal('Joe');
        expect(developer.get('paired')).to.equal(true);
    });

    it('should fire a custom event when state change', function() {
        var spy = sinon.spy();        
        var developer = new PairGenerator.Models.Developer();
        developer.on('change', spy);
        developer.set({paired: true});
        developer.set('name', 'John');
        sinon.assert.calledTwice(spy);
    });

});