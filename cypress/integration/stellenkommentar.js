import { letterFixture, letterXsltResult } from '../fixtures/letter.fixture';

const baseURI = "http://localhost:8081";
const apiURI = "http://localhost:8000";
const letterPath = "/letters/G000016";

describe("Gregorovius Stellenkommentar", () => {

    beforeEach(() => {
        cy.viewport(1920, 1080);
        
        cy.server();

        cy.wait(200);
        
        cy.route("GET", apiURI + "/letters/G000016", letterFixture).as("letter");
        cy.route("POST", apiURI + "/letters/G000016?xslt=true", letterXsltResult).as("letterXsltResult");
    });
    it("Selects a comment", () => {
        cy.visit(baseURI + letterPath);

        cy.wait(2000);

        cy.get('.g-comment-orig[commentid="nwrd_lwn_llb"] .comment-icon')
            .scrollIntoView({ 
                duration: 2000,
                offset: {
                    top: -150
                }
            })
            .wait(2000)
            .click()
            .wait(2000);

        cy.get('.g-comment-orig[commentid="ntj5_5wn_llb"] .comment-icon')
            .scrollIntoView({ 
                duration: 1000,
                offset: {
                    top: -150
                }
            })
            .wait(2000)
            .click()
            .wait(2000);

        cy.get("#close-comment-large").click();

        cy.wait(2000);

        cy.get('.g-comment-orig[commentid="nn2k_mvn_llb"] .comment-icon')
            .scrollIntoView({ 
                duration: 1000,
                offset: {
                    top: -150
                }
            })
            .wait(2000)
            .click()
            .wait(2000);
    });


});