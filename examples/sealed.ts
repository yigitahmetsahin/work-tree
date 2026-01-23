/**
 * Sealed workflow example - Prevent modifications after construction
 */
import { Workflow, WorkflowStatus } from '../src';

interface UserData {
  userId: string;
}

/**
 * Factory function that returns a sealed workflow with custom execute.
 * The execute function wraps the workflow execution with logging.
 */
function buildUserWorkflow() {
  const workflow = new Workflow<UserData>()
    .serial({
      name: 'validate',
      execute: async (ctx) => {
        console.log(`Validating user ID: ${ctx.data.userId}`);
        return ctx.data.userId.length > 0;
      },
    })
    .serial({
      name: 'fetchUser',
      execute: async (ctx) => {
        const isValid = ctx.workResults.get('validate').result;
        if (!isValid) {
          throw new Error('Invalid user ID');
        }
        console.log(`Fetching user: ${ctx.data.userId}`);
        await new Promise((r) => setTimeout(r, 100));
        return { id: ctx.data.userId, name: 'John Doe', email: 'john@example.com' };
      },
    });

  // Seal with custom execute that wraps the workflow with logging
  return workflow.seal({
    execute: async (ctx) => {
      console.log('>>> Before workflow execution');
      const result = await workflow.run(ctx.data);
      console.log('<<< After workflow execution');
      return result;
    },
  });
}

async function main() {
  console.log('=== Sealed Workflow Example ===\n');

  // Create a sealed workflow from the factory
  const userWorkflow = buildUserWorkflow();

  // Check properties of sealed workflow with execute
  console.log(`Name: ${userWorkflow.name}`); // 'seal'
  console.log(`Is sealed: ${userWorkflow.isSealed()}`); // true

  // TypeScript prevents modifications:
  // userWorkflow.serial(...) // ❌ Error: Property 'serial' does not exist
  // userWorkflow.parallel(...) // ❌ Error: Property 'parallel' does not exist

  // Use execute() with context - shows custom logging
  console.log('\nUsing execute() with custom logging...\n');
  const result = await userWorkflow.execute({
    data: { userId: 'user-123' },
    workResults: {} as never, // Context is passed to execute
  });

  if (result.status === WorkflowStatus.COMPLETED) {
    console.log('\n✅ Workflow completed!');
    console.log(`Total duration: ${result.totalDuration}ms`);
    console.log('User:', result.context.workResults.get('fetchUser').result);
  }

  // Can also use run() directly (bypasses custom execute)
  console.log('\n--- Using run() directly (no custom logging) ---\n');
  const result2 = await userWorkflow.run({ userId: 'user-456' });

  if (result2.status === WorkflowStatus.COMPLETED) {
    console.log('\n✅ Second run completed!');
    console.log('User:', result2.context.workResults.get('fetchUser').result);
  }
}

main().catch(console.error);
