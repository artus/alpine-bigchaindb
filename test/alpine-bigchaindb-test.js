/**
 * @author Artus Vranken
 */


// Initialize connection
const driver = require('bigchaindb-driver');
const bip39  = require('bip39');
const API_PATH = 'http://localhost:59984/api/v1/';
const conn = new driver.Connection(API_PATH);

// Create identities
const alice = new driver.Ed25519Keypair(bip39.mnemonicToSeed("alice").slice(0, 32));
const bob = new driver.Ed25519Keypair(bip39.mnemonicToSeed("bob").slice(0, 32));

const assert = require('assert');

describe('artusvranken/alpine-bigchaindb docker image', function() {

    describe('Create transactions (adding assets)', function() {

        it('should add assets when done correctly', function(done) {

            // Create a new asset.
            const assetData = {
                'testAsset' : 'This is a test-asset.'
            };

            // Create metadata.
            const metaData = {
                'date' : new Date()
            }

            // Create transaction.
            const unsignedCreateTransaction = driver.Transaction.makeCreateTransaction(
                assetData,
                metaData,
                [ driver.Transaction.makeOutput( driver.Transaction.makeEd25519Condition(alice.publicKey))],
                alice.publicKey
            );

            // Sign transaction.
            const signedTransaction = driver.Transaction.signTransaction(unsignedCreateTransaction, alice.privateKey);

            // Post transaction.
            conn.postTransaction(signedTransaction).then( response => {

                // Poll for status.
                return conn.pollStatusAndFetchTransaction(response.id);
            }).then( whatever => {
                
                // Check if the asset was posted.
                return conn.listOutputs(alice.publicKey);
            }).then(response => {

                    // We do so by checking if there is exactly one transaction.
                    if (response.length == 1) done();
                    else (done(new Error("Length was not 1.")));
            }).catch(error => {
                done( new Error(error));
            })
        });

        it('should fail when not done correctly', function () {
            // TODO
        });
    });

    describe('Transfer transactions', () => {

        it('should transfer assets when done correctly', () => {
            // TODO
        });

        it('should fail when done incorrectly', () => {
            // TODO
        });
    })
})