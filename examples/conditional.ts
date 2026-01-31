/**
 * Conditional example - Skip steps based on conditions with Work.tree()
 * Demonstrates shouldRun, onSkipped hooks, and isSkipped() pre-flight check
 */
import { Work } from '../src';

async function main() {
  // Example 1: Tree-level shouldRun with isSkipped() pre-flight check
  console.log('=== Pre-flight check with isSkipped() ===\n');

  const maintenanceTree = Work.tree('maintenanceMode', {
    shouldRun: (ctx) => !ctx.data.maintenanceMode,
    onSkipped: () => console.log('⚠️ System is in maintenance mode, skipping all operations'),
  }).addSerial({
    name: 'processRequest',
    execute: async () => {
      console.log('Processing request...');
      return { processed: true };
    },
  });

  // Check if tree would be skipped BEFORE running
  const wouldSkip = await maintenanceTree.isSkipped({ maintenanceMode: true });
  console.log(`isSkipped({ maintenanceMode: true }): ${wouldSkip}`); // true

  const wouldRun = await maintenanceTree.isSkipped({ maintenanceMode: false });
  console.log(`isSkipped({ maintenanceMode: false }): ${wouldRun}`); // false

  // Actually run with maintenance mode enabled
  const maintenanceResult = await maintenanceTree.run({ maintenanceMode: true });
  console.log(`Tree run status: ${maintenanceResult.status}`); // completed (no error occurred)

  // The tree's entry in workResults shows it was skipped
  // Note: Tree names are tracked at runtime, so we use a type assertion
  const treeWorkResult = (maintenanceResult.workResults as Map<string, { status: string }>).get(
    'maintenanceMode'
  );
  console.log(`Tree work result status: ${treeWorkResult?.status}`); // skipped

  // Example 2: Work-level conditional execution
  console.log('\n=== Work-level conditional execution ===\n');

  const tree = Work.tree('notifications')
    .addSerial({
      name: 'fetchUserPreferences',
      execute: async (ctx) => {
        console.log(`Fetching preferences for user: ${ctx.data.userId}`);
        return {
          email: 'user@example.com',
          phone: '+1234567890',
          deviceToken: 'abc123',
        };
      },
    })
    .addSerial({
      name: 'sendEmailNotification',
      shouldRun: (ctx) => Boolean(ctx.data.sendEmail),
      execute: async (ctx) => {
        const prefs = ctx.workResults.get('fetchUserPreferences').result;
        console.log(`📧 Sending email to: ${prefs?.email}`);
        await new Promise((r) => setTimeout(r, 100));
        return { type: 'email', sent: true };
      },
      onSkipped: (ctx) => {
        console.log(`⏭️ Email notification skipped for user: ${ctx.data.userId}`);
      },
    })
    .addSerial({
      name: 'sendSmsNotification',
      shouldRun: (ctx) => Boolean(ctx.data.sendSms),
      execute: async (ctx) => {
        const prefs = ctx.workResults.get('fetchUserPreferences').result;
        console.log(`📱 Sending SMS to: ${prefs?.phone}`);
        await new Promise((r) => setTimeout(r, 100));
        return { type: 'sms', sent: true };
      },
      onSkipped: (ctx) => {
        console.log(`⏭️ SMS notification skipped for user: ${ctx.data.userId}`);
      },
    })
    .addSerial({
      name: 'sendPushNotification',
      shouldRun: (ctx) => Boolean(ctx.data.sendPush),
      execute: async (ctx) => {
        const prefs = ctx.workResults.get('fetchUserPreferences').result;
        console.log(`🔔 Sending push to device: ${prefs?.deviceToken}`);
        await new Promise((r) => setTimeout(r, 100));
        return { type: 'push', sent: true };
      },
      onSkipped: (ctx) => {
        console.log(`⏭️ Push notification skipped for user: ${ctx.data.userId}`);
      },
    })
    .addSerial({
      name: 'logNotifications',
      execute: async (ctx) => {
        const sent: string[] = [];
        if (ctx.workResults.get('sendEmailNotification').result) sent.push('email');
        if (ctx.workResults.get('sendSmsNotification').result) sent.push('sms');
        if (ctx.workResults.get('sendPushNotification').result) sent.push('push');
        return { notificationsSent: sent };
      },
    });

  console.log('=== Scenario 1: Email only ===\n');
  let result = await tree.run({
    userId: 'user-1',
    sendEmail: true,
    sendSms: false,
    sendPush: false,
  });
  console.log('Result:', result.context.workResults.get('logNotifications').result);

  console.log('\n=== Scenario 2: All notifications ===\n');
  result = await tree.run({
    userId: 'user-2',
    sendEmail: true,
    sendSms: true,
    sendPush: true,
  });
  console.log('Result:', result.context.workResults.get('logNotifications').result);

  console.log('\n=== Scenario 3: No notifications ===\n');
  result = await tree.run({
    userId: 'user-3',
    sendEmail: false,
    sendSms: false,
    sendPush: false,
  });
  console.log('Result:', result.context.workResults.get('logNotifications').result);
}

main().catch(console.error);
