/**
 * @author Artus Vranken
 */


// Initialize connection
const driver = require('bigchaindb-driver');
const bip39  = require('bip39');
const API_PATH = 'http://localhost:59984/api/v1/';
const conn = new driver.Connection(API_PATH);

// Create identities
const alice = new driver.Ed25519Keypair(bip39.mnemonicToSeed("alice"));
const bob = new driver.Ed25519Keypair(bip39.mnemonicToSeed("bob"));

const assert = require('assert');

describe('artusvranken/alpine-bigchaindb docker image', function() {

    describe('Create transactions (adding assets)', function() {

        it('should add assets when done correctly', function() {

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
            const signedTransaction = driver.Transaction.signTransaction(unsignedCreateTransaction, alive.privateKey);

            // Post transaction.
            conn.postTransaction(signedTransaction).then( response => {

                // Poll for status.
                return conn.pollStatusAndFetchTransaction(response.id);
            }).then( whatever => {
                
                // Check if the asset was posted.
                conn.listOutputs(alice.publicKey, 'CREATE').then(response => {
                    assert.ok(response.lenth == 1);
                });
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