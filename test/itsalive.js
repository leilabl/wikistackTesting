var chai = require('chai');
chai.should();
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);



describe('testing', function() {
	it ('confirms', function() {
		expect (2+2).to.equal(4);
	})
})

describe('async', function() {
	it ('test setTimeout', function(done) {
		var startDate = Date.now();
		var endDate;
		setTimeout(function() {
			endDate = Date.now() - startDate;
			expect (endDate).to.be.closeTo(1000, 50);
			done();
		}, 1000);
		
	});
});

describe('spy', function() {

	
	it('confirms that double is invoked', function() {
		var arr = [1,2,3,4,5];
		var double = function(val) {
			return val * 2;
		}
		double = chai.spy(double);
		arr.map(double);
		expect(double).to.have.been.called(5);
	})
})

