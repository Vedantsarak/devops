import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalSupabaseStorage, simulatedClient } from './supabase';

test('Supabase multi-user auth, workspace creation, task persistence, and RLS isolation', async () => {
  // Reset clean state
  LocalSupabaseStorage.reset();

  // 1. Sign up User Alpha
  const alphaEmail = 'alpha.tester@devos.io';
  const alphaPass = 'AlphaSecurePass123!';
  const { data: alphaSignup, error: alphaSignupErr } = await simulatedClient.auth.signUp({
    email: alphaEmail,
    password: alphaPass,
    options: {
      data: {
        full_name: 'Alpha Operative',
        username: 'alpha_op',
      },
    },
  });

  assert.equal(alphaSignupErr, null, 'Alpha sign-up must succeed');
  assert.ok(alphaSignup.user?.id, 'Alpha must have a valid user ID');
  const alphaUserId = alphaSignup.user!.id;

  // 2. Verify automatic profile & default workspace trigger
  const { data: alphaProfile } = await simulatedClient.from('profiles').select().eq('id', alphaUserId).single();
  assert.ok(alphaProfile, 'Profile should be automatically created');
  assert.equal(alphaProfile.username, 'alpha_op');

  const { data: alphaWorkspaces } = await simulatedClient.from('workspaces').select();
  assert.equal(alphaWorkspaces!.length, 1, 'Default workspace must be created');
  assert.equal(alphaWorkspaces![0].owner_id, alphaUserId);
  const alphaWsId = alphaWorkspaces![0].id;

  // 3. Create Custom Workspace for Alpha
  const { data: alphaCustomWs } = await simulatedClient.from('workspaces').insert({
    name: 'Stealth Neural Lab',
    slug: 'stealth-neural-lab',
    description: 'Classified AI research lab',
    icon: 'Cpu',
  }).select().single();
  assert.ok(alphaCustomWs, 'Custom workspace creation must succeed');
  assert.equal(alphaCustomWs.owner_id, alphaUserId);

  // 4. Create Alpha Tasks in Workspace
  const { data: taskAlpha1 } = await simulatedClient.from('tasks').insert({
    workspace_id: alphaCustomWs.id,
    title: 'Initialize Quantum Neural Matrix',
    category: 'Coding Studio',
    priority: 'high',
    completed: false,
  }).select().single();

  const { data: taskAlpha2 } = await simulatedClient.from('tasks').insert({
    workspace_id: alphaWsId,
    title: 'Alpha Secret Task 2',
    category: 'DSA Arena',
    priority: 'medium',
    completed: false,
  }).select().single();

  assert.ok(taskAlpha1?.id);
  assert.ok(taskAlpha2?.id);

  // Verify Alpha can list their tasks
  const { data: alphaTasksBeforeLogout } = await simulatedClient.from('tasks').select();
  assert.equal(alphaTasksBeforeLogout!.length, 2, 'Alpha should see their 2 created tasks');

  // 5. Alpha Signs Out
  await simulatedClient.auth.signOut();
  const { data: signedOutSession } = await simulatedClient.auth.getSession();
  assert.equal(signedOutSession.session, null, 'Session must be null after sign out');

  // Verify that an unauthenticated query returns NO tasks (RLS protected)
  const { data: anonTasks } = await simulatedClient.from('tasks').select();
  assert.equal(anonTasks!.length, 0, 'Unauthenticated user cannot see any tasks');

  // 6. Sign up User Beta
  const betaEmail = 'beta.engineer@devos.io';
  const betaPass = 'BetaSecurePass123!';
  const { data: betaSignup } = await simulatedClient.auth.signUp({
    email: betaEmail,
    password: betaPass,
    options: {
      data: {
        full_name: 'Beta Engineer',
        username: 'beta_eng',
      },
    },
  });
  const betaUserId = betaSignup.user!.id;

  // 7. Verify Row Level Security (RLS) Isolation: Beta CANNOT see Alpha's tasks or workspaces!
  const { data: betaVisibleTasks } = await simulatedClient.from('tasks').select();
  assert.equal(betaVisibleTasks!.length, 0, 'RLS ISOLATION: Beta must NOT see Alpha tasks');

  const { data: betaVisibleWorkspaces } = await simulatedClient.from('workspaces').select();
  assert.equal(betaVisibleWorkspaces!.length, 1, 'Beta should only see their own default workspace');
  assert.equal(betaVisibleWorkspaces![0].owner_id, betaUserId, 'Beta workspace must belong to Beta');

  // 8. Beta creates a Beta task
  const { data: betaTask } = await simulatedClient.from('tasks').insert({
    title: 'Beta Exclusive Task',
    category: 'Security',
    priority: 'low',
    completed: false,
  }).select().single();

  assert.ok(betaTask?.id);
  assert.equal(betaTask.user_id, betaUserId);

  // 9. Beta attempts to update or delete Alpha's task (Should be rejected by RLS)
  const updateRes = await simulatedClient.from('tasks').update({ title: 'Hacked title' }).eq('id', taskAlpha1.id).select().single();
  assert.ok(updateRes.error, 'RLS ISOLATION: Beta must NOT be able to update Alpha task');

  // 10. Beta Signs Out
  await simulatedClient.auth.signOut();

  // 11. Alpha Signs Back In (Persistence Verification!)
  const { data: alphaLogin, error: alphaLoginErr } = await simulatedClient.auth.signInWithPassword({
    email: alphaEmail,
    password: alphaPass,
  });
  assert.equal(alphaLoginErr, null, 'Alpha sign-in must succeed');
  assert.equal(alphaLogin.user?.id, alphaUserId);

  // 12. Verify Alpha's tasks remain available after refreshing and signing in again!
  const { data: alphaTasksAfterLogin } = await simulatedClient.from('tasks').select();
  assert.equal(alphaTasksAfterLogin!.length, 2, 'Alpha tasks must remain intact after signing back in');
  assert.ok(alphaTasksAfterLogin!.some((t: any) => t.title === 'Initialize Quantum Neural Matrix'));
  assert.ok(alphaTasksAfterLogin!.some((t: any) => t.title === 'Alpha Secret Task 2'));
  // Ensure Beta's task is NOT visible to Alpha
  assert.ok(!alphaTasksAfterLogin!.some((t: any) => t.title === 'Beta Exclusive Task'), 'Alpha must NOT see Beta task');

  // 13. Test Task Update & Toggle
  const { data: updatedTask } = await simulatedClient.from('tasks').update({ completed: true }).eq('id', taskAlpha1.id).select().single();
  assert.equal((updatedTask as any)?.completed, true, 'Task update should persist');

  // 14. Test Task Delete
  await simulatedClient.from('tasks').delete().eq('id', taskAlpha2.id);
  const { data: finalTasks } = await simulatedClient.from('tasks').select();
  assert.equal(finalTasks!.length, 1, 'Deleted task should be removed');
  assert.equal(finalTasks![0].id, taskAlpha1.id);
});
