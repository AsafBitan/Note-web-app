import { test, expect } from '@playwright/test';

// Test that creates a new user and logs in
test('Register a new user', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('button:has-text("Login")')).toBeVisible();
  await expect(page.locator('button:has-text("Create User")')).toBeVisible();

  await page.fill('input[name="create_user_form_name"]', 'testuser');
  await page.fill('input[name="create_user_form_email"]', 'testuser@example.com');
  await page.fill('input[name="create_user_form_username"]', 'testuserUserName');
  await page.fill('input[name="create_user_form_password"]', 'password');
 
  await page.click('button:has-text("Create User")');

  await page.fill('input[name="login_form_username"]', 'testuserUserName');
  await page.fill('input[name="login_form_password"]', 'password');

  await page.click('button:has-text("Login")');

  await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  await expect(page.locator('button:has-text("Login")')).not.toBeVisible();
  await expect(page.locator('button:has-text("Create User")')).not.toBeVisible();
});


// Test that creates a new note
test('Create a new note', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.fill('input[name="login_form_username"]', 'testuserUserName');
  await page.fill('input[name="login_form_password"]', 'password');
  await page.click('button:has-text("Login")');

  await page.click('button:has-text("Add new note")');
  await page.fill('input[name="text_input_new_note"]', 'This is a test note.');
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(3000);
  await page.click('button:has-text("Last")');
  await page.waitForTimeout(3000);

  await expect(page.locator('text=This is a test note.')).toBeVisible();
  
});


// Test to edit a note
test('Edit a note', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.fill('input[name="login_form_username"]', 'testuserUserName');
  await page.fill('input[name="login_form_password"]', 'password');
  await page.click('button:has-text("Login")');

  await page.click('button:has-text("Last")');
  await page.waitForTimeout(3000);
  await page.click('button:has-text("Edit")');
  await page.fill('input[value="This is a test note."]', 'This is an edited test note.');
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(3000);

  await expect(page.locator('text=This is an edited test note.')).toBeVisible();
});


// Test to verify that a logged-in user can only edit or delete a note that he created
test('Logged-in user can only edit or delete their own notes', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.fill('input[name="create_user_form_name"]', 'testuser2');
    await page.fill('input[name="create_user_form_email"]', 'testuser2@example.com');
    await page.fill('input[name="create_user_form_username"]', 'testuserUserName2');
    await page.fill('input[name="create_user_form_password"]', 'password');

    await page.click('button:has-text("Create User")');
    
    await page.fill('input[name="login_form_username"]', 'testuserUserName2');
    await page.fill('input[name="login_form_password"]', 'password');
    await page.click('button:has-text("Login")');

    await expect(page.locator('button:has-text("Edit")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Delete")')).not.toBeVisible();

    await page.waitForTimeout(3000);
    await page.click('button:has-text("Add new note")');
    await page.fill('input[name="text_input_new_note"]', 'This is a test note for user 2.');
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Last")');
    await page.waitForTimeout(3000);
    
    await expect(page.locator('button:has-text("Edit")')).toBeVisible();
    await expect(page.locator('button:has-text("Delete")')).toBeVisible();
  });
  
  
  // Test to delete a note
  test('Delete a note', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.fill('input[name="login_form_username"]', 'testuserUserName2');
    await page.fill('input[name="login_form_password"]', 'password');
    await page.click('button:has-text("Login")');

    await page.waitForTimeout(3000);
    await page.click('button:has-text("Last")');
    await page.waitForTimeout(3000);
  
    await expect(page.locator('text=This is a test note for user 2.')).toBeVisible();

    await page.click('button:has-text("Delete")');
  
    await expect(page.locator('text=This is a test note for user 2.')).not.toBeVisible();
  });





