# EmailJS Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (it's FREE!)
3. Sign up with your email

### Step 2: Add Email Service
1. Go to https://dashboard.emailjs.com/admin
2. Click "Add New Service"
3. Choose "Gmail" (recommended for deeplearn.ra@gmail.com)
4. Connect your Gmail account (deeplearn.ra@gmail.com)
5. Copy the **Service ID** (looks like: `service_abc1234`)

### Step 3: Create Email Template
1. Go to https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Use this template:

```
Subject: New Contact Form Submission from {{user_name}}

From: {{user_name}}
Email: {{user_email}}

Message:
{{message}}

---
Sent from Red Moon Website Contact Form
```

4. Save the template
5. Copy the **Template ID** (looks like: `template_xyz5678`)

### Step 4: Get Public Key
1. Go to https://dashboard.emailjs.com/admin/account
2. Copy your **Public Key** (looks like: `abc123xyz456`)

### Step 5: Update Your Code

Open `contact-script.js` and replace these lines:

```javascript
// Line 10
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key

// Lines 48-51
const response = await emailjs.send(
    'YOUR_SERVICE_ID',      // Replace with your service ID
    'YOUR_TEMPLATE_ID',     // Replace with your template ID
    templateParams
);
```

### Example:
```javascript
emailjs.init("abc123xyz456");

const response = await emailjs.send(
    'service_abc1234',
    'template_xyz5678',
    templateParams
);
```

## That's It!

Now when users click "Connect" and submit the form, emails will be sent directly to **deeplearn.ra@gmail.com**!

## Features Included:

✅ Email validation with regex
✅ Beautiful animated modal popup
✅ Loading spinner during submission
✅ Success/error messages
✅ Auto-close after successful submission
✅ Mobile responsive
✅ Closes on ESC key or overlay click
✅ No page redirect - stays on the same page

## Testing:

1. Open `index.html`
2. Click the "Connect" button
3. Fill in the form
4. Submit
5. Check deeplearn.ra@gmail.com inbox!

## Troubleshooting:

**Emails not sending?**
- Check your EmailJS dashboard for quota (free tier: 200 emails/month)
- Make sure all IDs are correct
- Check browser console for errors
- Verify Gmail account is connected in EmailJS dashboard

**Need help?**
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
