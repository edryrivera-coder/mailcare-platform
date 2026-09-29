# 📬 MailCare User Manual (Explained Simply!)

Welcome to **MailCare**!  
Whether you are 10 years old or 100, this guide explains **what MailCare does**, **how to use every button on the screen**, and **how the magic works behind the scenes**—using simple, everyday language.

---

## 🌟 1. What is MailCare? (The Big Picture)

Imagine two common problems:

1. **The Messy Bedroom Problem (Your Personal Inbox):**  
   Every day, stores, apps, and websites send you hundreds of emails. Soon, you have **12,847 emails** piled up! Worse, some emails hide tiny invisible "spy pictures" that tell companies when and where you opened their message.
2. **The Bounced Party Invitation Problem (Business Email Lists):**  
   Imagine a company wants to send 100,000 emails to customers. If 10,000 of those email addresses are fake or misspelled, their emails "bounce back" and email providers might block the company as a spammer!

**MailCare solves both problems in one app:**
- **Consumer Inbox Cleaner:** Organizes your messy inbox, deletes junk in bulk, unsubscribes from annoying newsletters with one click, and blocks spy pixels.
- **Email Verification Detective:** Checks whether an email address is real and safe in **under 1 second**—before you ever send a message!

---

## 🚀 2. How to Open MailCare

1. Open your web browser (Chrome, Edge, Safari, or Firefox) and go to:  
   👉 **`http://localhost:3000`**
2. Look at the **Left Sidebar** (the menu on the left edge):
   - Click any of the 7 menu buttons (`Dashboard`, `Consumer Inbox`, `Email Verification`, `Batch Jobs`, `Analytics`, `Integrations`, `Settings`) to visit that room.
3. **Cool Trick — Mission Control View:**  
   Look at the **Top Bar** and click **`6-Panel Grid (dashboard.png View)`**. That lets you see **all 6 screens at the exact same time** on one giant dashboard! Click **`Single Screen View`** anytime to go back.

---

## 🧭 3. Room-by-Room Guide (How to Use Every Screen)

### 🛡️ Room 1: Email Verification (`The Address Detective`)
**Where to find it:** Click **Email Verification** in the left menu ([EmailVerificationView.tsx](./apps/web/src/components/views/EmailVerificationView.tsx)).

#### What you can do here:
1. **Check a Single Email (`Single Verification` tab):**
   - Type any email address into the **`Enter email address...`** box (or click one of the quick **Test presets** buttons like `Valid Corp`, `Role Account`, `Disposable`, or `Syntax Error`).
   - Click the gold **`Verify`** button.
2. **How to read your Verification Result card:**
   MailCare runs 5 quick detective checks in less than a second:
   - **Syntax:** *"Is it spelled like an email?"* (Does it have an `@` symbol and a `.com`?)
   - **Domain (DNS):** *"Does the website exist?"* (Is `company.com` a real place on the internet?)
   - **MX Record:** *"Do they have a mailbox?"* (Does that website have a mail post office set up?)
   - **SMTP:** *"Does this person actually live there?"* (MailCare politely knocks on the mail server's door and asks if the user exists—without actually sending an email!)
   - **Risk Score (`0 to 100`):** Like a golf score, **lower is better!** `Low (5/100)` means super safe.
3. **Check the Big Gold Circle (`Verification Stats`):**
   - Shows that **99.2%** of checked emails are **Valid** (green), plus how many were **Invalid** (red), **Risky** (yellow), or **Unknown** (purple).
4. **Upload a Giant List (`Bulk Verification` tab):**
   - Have a spreadsheet with 250,000 emails? Click the **`Bulk Verification`** tab and click **`Simulate 250k Enterprise CSV Upload`** to watch MailCare break it into smaller pieces for background robots to check!
5. **View Past Checks (`History` tab):**
   - Click **`History`** to see a permanent list of every email you have tested.

---

### 📥 Room 2: Consumer Inbox (`The Smart Email Cleaner`)
**Where to find it:** Click **Consumer Inbox** in the left menu ([ConsumerInboxView.tsx](./apps/web/src/components/views/ConsumerInboxView.tsx)).

#### What you can do here:
1. **Read the 4 Top Scorecards:**
   - **Total Emails (`12,847`):** Everything in your mailbox.
   - **Unread (`342`):** Emails you haven't opened yet.
   - **Archived (`8,921`):** Emails neatly stored away out of sight.
   - **Deleted (`1,203`):** Junk mail you threw in the trash.
2. **Use Smart Filters (Left Box):**
   - Click **`Newsletters`**, **`Promotions`**, **`Social`**, **`Updates`**, or **`Forums`** to only see that kind of email!
3. **Clean Up with 1 Click (Bottom Toolbar):**
   - Check the little boxes next to emails from **Netflix**, **Amazon**, **YouTube**, **Spotify**, **Google**, or **Facebook**.
   - Click **`Archive`** to tidy them away.
   - Click **`Delete`** to throw them in the trash.
   - Click **`Unsubscribe`** to tell that company: *"Stop sending me newsletters!"* automatically.
4. **Secret Feature — Spy-Pixel Shield:**
   - Notice the little gold badge like **`🛡️ 3px`** next to an email subject?
   - **Click on any email row** (like Netflix or Spotify) to open the **Privacy Proxy Inspector** at the bottom. It shows how many invisible `1x1` spy pictures MailCare blocked so senders can't track your location or IP address!

---

### ⚙️ Room 3: Batch Jobs (`The Heavy-Lifting Robots`)
**Where to find it:** Click **Batch Jobs** in the left menu ([BatchJobsView.tsx](./apps/web/src/components/views/BatchJobsView.tsx)).

#### Why this room exists:
If you ask MailCare to clean **25,000 emails** or verify **1,000,000 addresses**, you don't want your computer screen to freeze while it waits! Instead, MailCare gives big jobs to background helper robots called **Workers**.

#### What you can do here:
1. **Filter by Job Type:** Click the tabs at the top (`All Jobs`, `Verification`, `Inbox Processing`, `CRM Sync`, `Hygiene`).
2. **Watch the Green Progress Bars:**
   - `● Running (68%)` means the robots are still working.
   - `✔ Completed (100%)` means the job is all done!
   - `● Failed (0%)` means something went wrong (for example, another mail server timed out).
3. **Video Game Save Points (`View` Button):**
   - Click **`View`** on any job row to see its **Checkpoint Cursor** (like `000001 - 170000`).
   - Just like a checkpoint in a video game, if a worker robot crashes at #170,000, the next robot starts right at #170,001 so it never wastes time starting over!
   - On a **Failed** job (`BJ-2025-00119`), click **`View`** and then click the gold **`Replay DLQ`** button to wake the robot up and finish the job!

---

### 📊 Room 4: Analytics (`The Scoreboard`)
**Where to find it:** Click **Analytics** in the left menu ([AnalyticsView.tsx](./apps/web/src/components/views/AnalyticsView.tsx)).

#### What you can see here:
- **Time Travel Buttons:** Switch between `Last 7 days`, `Last 30 days`, and `Last 90 days`.
- **4 Big Trophies:**
  - **2,847,392** Total Emails Processed
  - **99.2%** Verification Accuracy
  - **8,421** Active Users
  - **99.99%** System Uptime (That means MailCare is awake and working 99.99% of the time!)
- **Email Processing Trend (Left Chart):** A glowing gold wave showing how many hundreds of thousands of emails were cleaned each day from `Apr 21` to `Apr 27`.
- **Email Categories (Right Donut Chart):** A colorful ring showing what makes up your inbox (`42% Inbox`, `22% Newsletters`, `18% Promotions`, `10% Social`, `8% Updates`).

---

### 🔗 Room 5: Integrations (`Plugging in Your Favorite Apps`)
**Where to find it:** Click **Integrations** in the left menu ([IntegrationsView.tsx](./apps/web/src/components/views/IntegrationsView.tsx)).

#### What you can do here:
1. **Connect Email Providers:** Click on **Gmail**, **Microsoft 365**, **Outlook**, or **Yahoo** to connect or disconnect them.
2. **Connect Business Tools (`CRM & ESP`):** Click on **Salesforce**, **HubSpot**, **Mailchimp**, or **SendGrid** so cleaned email lists sync automatically.
3. **Check DNS & Security (`DNS & Security` tab):** Shows if your domain's digital ID badges (`SPF`, `DKIM`, `DMARC`) are healthy and confirms you are on **0 out of 48 spam blacklists**.
4. **Check Webhooks (`Webhooks` tab):** Webhooks are like automatic text messages MailCare sends to another computer the moment a big batch job finishes!

---

### 🛠️ Room 6: Settings & API Playground (`The Control Room`)
**Where to find it:** Click **Settings** in the left menu ([SettingsView.tsx](./apps/web/src/components/views/SettingsView.tsx)).

#### What you can do here:
1. **Profile & Organization:** View administrator details (**Edry de Guzman** — `edry@yourdomain.com`) and your **Enterprise Plan**.
2. **Security Settings:** Toggle **Two-Factor Authentication (2FA)**, check **Login Activity**, or manage **Sessions**.
3. **Preferences:** Pick your **Language** (`English (US)`) and **Time Zone** (`(GMT+08:00) Manila`).
4. **Bonus — Try the Live Computer Brain (`API` Tab):**
   - Click the **`API`** tab at the top of Settings!
   - You'll see 5 test buttons (`GET /v1/monitoring`, `GET /v1/audit`, `GET /v1/accounts`, `POST /v1/unsubscribe`, and `Test NFA-15 Password Guard`).
   - Click any button to watch the live **API Gateway** respond with real data, and scroll through the **17 PostgreSQL Database Tables** on the right side!

---

## 🔒 4. MailCare's 4 Golden Safety Rules

Even though MailCare is super powerful, it follows 4 strict safety rules to keep you safe:

| Golden Rule | What It Means in Simple Words |
| :--- | :--- |
| **1. No Passwords Allowed!** (`NFA-15`) | MailCare **never** asks for or saves your email password. It uses official **OAuth permission slips** from Google and Microsoft instead. (Try clicking `Test NFA-15 Password Guard` in `Settings → API` to see MailCare block a password attempt!) |
| **2. We Don't Read Your Private Letters!** (`NFA-14`) | When MailCare cleans your inbox, it only looks at the **outside of the envelope** (who sent it, when, and how big it is). It never saves the private message inside! |
| **3. Every Customer Gets Their Own Locked Vault!** (`NFA-22`) | Our PostgreSQL database uses **Row-Level Security (RLS)**. That's like giving every company their own locked safe so Company A can never peek at Company B's emails. |
| **4. Unbreakable Security Diary!** (`NFA-52` & `NFA-53`) | Every important action is written in a permanent **Audit Log** using unchangeable ink. Even an administrator cannot erase or fake past history! |
