'use strict';

describe('App View', function () {
    var developerView;
    beforeEach(function() {
        // Set up model, using localStorage to persist
        var developer = new PairGenerator.Models.Developer();
        developer.localStorage = new Store('DeveloperView-Tests');
        // Create View
        $('body').append('<ul id="container"></ul>');
        developerView = new PairGenerator.Views.DeveloperView({ model: developer });
    });

    afterEach(function() {
        developerView.remove();
        $('#container').remove();
    });

    it('should be rendered to the correct DOM element', function() {
        expect(developerView.tagName).to.be.equal('li');
        expect(developerView.el.tagName.toLowerCase()).to.be.equal('li');
    });

    it('is backed by the data provided in the model instance', function() {
        expect(developerView.model).to.exist;
        expect(developerView.model.get('paired')).to.be.false;
    });

    it('when rendered, the view is complete', function() {
        developerView.render();
        expect(developerView.$el).not.to.be.empty;
        expect(developerView.$el.find('label')).to.exist;
    });

    describe('Developer View Interactions', function() {
        beforeEach(function() {
            developerView.model.set({ name: 'Jack White' }, { silent: true });
            $('#container').append(developerView.render().el);
        });

        it('should enter editing mode', function() {
            $('#container').find('label').trigger('click');

            expect(developerView.$el.find('.edit').is(':visible')).to.be.true;
            expect(developerView.$el.find('.edit').val()).to.be.equal('Jack White');
        });

        it('should update on enter in editing mode', function() {
            $('#container').find('label').trigger('dblclick');

            var e = jQuery.Event('keypress');
            e.which = 13;
            developerView.$el.find('.edit').val('Jack White').trigger(e);

            expect(developerView.$el.find('label').text()).to.be.equal('Jack White');
            expect(developerView.model.get('name')).to.be.equal('Jack White');
        });

        it('should remove item when enter empty in editing mode', function() {
            var spy = sinon.spy(developerView.model, 'destroy');

            $('#container').find('label').trigger('dblclick');

            var e = jQuery.Event('keypress');
            e.which = 13;
            developerView.$el.find('.edit').val('').trigger(e);

            expect($('#container').children()).to.have.length(0);

            sinon.assert.calledOnce(spy);
            developerView.model.destroy.restore();
        });

        it('should remove item when remove is clicked', function() {
            var spy = sinon.spy(developerView.model, 'destroy');

            $('#container').find('button').trigger('click');
            expect($('#container').children()).to.have.length(0);

            sinon.assert.calledOnce(spy);
            developerView.model.destroy.restore();
        });
    });
});