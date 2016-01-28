process.env.TEST_ENV = 'test';

var chai = require('chai');
chai.should();
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var chaiAsPromised = require('chai-as-promised');
var mongoose = require("mongoose");
var Page = require("../models/").Page;


describe('Page model', function() {

    var page;
    beforeEach(function() {
        page = new Page();
        //need to manually save this page later
    });

    var page2;
    beforeEach(function(done) {
        Page.create({
            title: "Testing our file",
            content: "We are creating test specs for our file",
            tags: ['nice', 'cool']
        })
        .then(function(page){
            //page here is the result of the Page.create() invokation
            page2 = page;
            done();
        })
        .then(null, done);
    });

    afterEach(function(done) {
                Page.remove({})
                .then(function() {
                    done()
                })
                .then(null, done)
            })

    describe('Validations', function() {
        it('errors without title', function(done) {
            page.validate(function(err) {
                expect(err.errors).to.have.property('title');
                done();
            }) 
        });
        it('errors without content', function(done) {
            page.validate(function(err) {
                expect(err.errors).to.have.property('content');
                done();
            }) 
        });
    });

    describe('Statics', function() {
        describe('findByTag', function() {
            it('gets pages with the search tag', function(done) {
                Page.findByTag('cool').then(function(pages) {
                    expect(pages).length(1);
                    done();
                }).then(null, done);

            });
            it('does not get pages without the search tag', function(done) {
                Page.findByTag('dumb').then(function(pages) {
                    expect(pages).length(0);
                    done();
                }).then(null, done);
            });
        });
    });

    describe('Methods', function() {
        describe('findSimilar', function() {
            var page3;
            beforeEach(function(done) {
                Page.create({
                    title: "Methods Test File 1",
                    content: "Creating a file to test methods",
                    tags: ['cool', 'weird']
                })
                .then(function(page){
                    page3 = page;
                    done();
                })
                .then(null, done);
            });

            var page4;
            beforeEach(function(done) {
                Page.create({
                    title: "Methods Test File 2",
                    content: "Creating a file to test methods",
                    tags: ['hi', 'bye']
                })
                .then(function(page){
                    page4 = page;
                    done();
                })
                .then(null, done);
            });

            afterEach(function(done) {
                Page.remove({})
                .then(function() {
                    done();
                })
                .then(null, done);
            });

            it('never gets itself', function(done) {
                page2.findSimilar()
                .then(function(pages) {
                    expect(pages._id).to.not.equal(page2._id);
                    done();
                })
                .then(null,done);
            });

            it('gets other pages with any common tags', function(done) {
                page2.findSimilar()
                .then (function(pages) {
                    console.log("THIS IS PAGES: ", pages);
                    expect(pages).length(1);
                    done();
                })
                .then(null, done);
            });

            it('does not get other pages without any common tags', function(done) {
                page4.findSimilar()
                .then (function(pages) {
                    expect(pages).length(0);
                    done();
                })
                .then(null, done);
            });
        });
    });

    describe('Virtuals', function() {
        describe('route', function() {
            it('returns the url_name prepended by "/wiki/"', function(done) {
                expect(page2.urlTitle).to.equal("Testing_our_file");
                done();
            })
            .then(null, done);
        });
    });

    describe('Hooks', function() {
        it('it sets urlTitle based on title before validating', function() {
                expect(page2.urlTitle).to.equal("Testing_our_file");

        });
    });


});