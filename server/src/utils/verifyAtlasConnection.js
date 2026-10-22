/**
 * Safe Atlas Connection Verification Utility
 * Tests MongoDB Atlas connectivity, latency, and read/write permissions
 * without logging or exposing credentials.
 * 
 * Complies with strict testing rules:
 * - Requires a valid MONGODB_URI
 * - Connects to intended database 'resume_checker_ai'
 * - Pings MongoDB
 * - Inserts a uniquely identifiable diagnostic document
 * - Reads the document back
 * - Deletes the document in a finally block
 * - Exits with clear status code (0 for success, 1 for failure)
 * - Never modifies or drops real application collections
 */
require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

async function verifyConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[Verify Atlas Error] MONGODB_URI is not set in server/.env or environment.');
    console.error('[Verify Atlas Action] Set MONGODB_URI in server/.env before running test:db.');
    process.exit(1);
  }

  // Sanitize URI: mask credentials for safe logging
  const safeHost = uri.split('@')[1] ? uri.split('@')[1].split('?')[0] : 'localhost';
  console.log(`[Verify Atlas] Initiating connection test to host: ${safeHost}...`);

  const startTime = Date.now();
  let conn = null;
  let insertedDocId = null;
  let testCollection = null;

  try {
    conn = await mongoose.connect(uri, {
      dbName: 'resume_checker_ai',
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000
    });

    const connectLatency = Date.now() - startTime;
    console.log(`[Verify Atlas] Connected successfully in ${connectLatency}ms.`);
    console.log(`[Verify Atlas] Target Database: ${conn.connection.name}`);
    console.log(`[Verify Atlas] Database State: Connected (readyState: ${conn.connection.readyState})`);

    // 1. Ping MongoDB
    console.log('[Verify Atlas] Testing cluster ping...');
    const pingResult = await conn.connection.db.admin().ping();
    console.log('[Verify Atlas] Cluster Ping response:', pingResult);

    // 2. Uniquely identifiable diagnostic document
    const diagnosticRunId = `diag_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    testCollection = conn.connection.db.collection('__diagnostic_tests__');
    const diagnosticPayload = {
      runId: diagnosticRunId,
      purpose: 'Deployment Readiness Verification',
      createdAt: new Date()
    };

    console.log(`[Verify Atlas] Inserting unique diagnostic document (runId: ${diagnosticRunId})...`);
    const insertResult = await testCollection.insertOne(diagnosticPayload);
    insertedDocId = insertResult.insertedId;
    console.log('[Verify Atlas] Write test: PASSED (Document created with ID: ' + insertedDocId + ')');

    // 3. Read back the document
    console.log('[Verify Atlas] Reading diagnostic document back from database...');
    const retrievedDoc = await testCollection.findOne({ _id: insertedDocId });
    if (!retrievedDoc || retrievedDoc.runId !== diagnosticRunId) {
      throw new Error('Verification failed: Retrieved document does not match inserted diagnostic payload.');
    }
    console.log('[Verify Atlas] Read test: PASSED (Retrieved matching document)');

    console.log('[Verify Atlas] All connectivity, ping, write, and read verification checks PASSED!');
  } catch (err) {
    console.error(`[Verify Atlas Error] Connection or Verification Failed: ${err.name} - ${err.message}`);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('[Verify Atlas Diagnosis] Invalid username or password. Check database user credentials in Atlas.');
    } else if (err.message.includes('queryTxt ETIMEOUT') || err.message.includes('ESERVFAIL')) {
      console.error('[Verify Atlas Diagnosis] DNS lookup failed. Verify your cluster hostname.');
    } else if (err.message.includes('whitelist') || err.message.includes('IP') || err.message.includes('timed out')) {
      console.error('[Verify Atlas Diagnosis] Network timeout / IP not whitelisted. In Atlas Network Access, ensure 0.0.0.0/0 or your IP is allowed.');
    }
    process.exitCode = 1;
  } finally {
    // 4. Guaranteed cleanup of temporary diagnostic document in finally block
    if (testCollection && insertedDocId) {
      try {
        await testCollection.deleteOne({ _id: insertedDocId });
        console.log('[Verify Atlas Cleanup] Diagnostic test document successfully deleted in finally block.');
      } catch (cleanupErr) {
        console.warn(`[Verify Atlas Cleanup Warning] Failed to delete test document: ${cleanupErr.message}`);
      }
    }
    if (conn) {
      try {
        await mongoose.connection.close(false);
        console.log('[Verify Atlas] Connection closed cleanly.');
      } catch (closeErr) {
        // Silently handle close error
      }
    }
    process.exit(process.exitCode || 0);
  }
}

verifyConnection();
