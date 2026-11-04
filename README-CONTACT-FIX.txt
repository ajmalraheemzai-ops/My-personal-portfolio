AJMAL PORTFOLIO CONTACT FORM FIX

The contact form now submits directly to FormSubmit's AJAX endpoint for:
  ajmal.abdulrahimzai123@gmail.com

This works with static GitHub Pages hosting and does not require PHP or MySQL.

INSTALL
1. Replace your published HTML page with ajmal_updated.html (rename it to index.html if that is the filename your GitHub Pages site uses).
2. Keep your existing assets/, vendors/, CSS, images, and other website folders unchanged.
3. Commit and push the updated page to your GitHub Pages repository.
4. Submit one test message from the live website.
5. Check ajmal.abdulrahimzai123@gmail.com inbox and Spam for FormSubmit's activation email, then click its activation link. FormSubmit requires this one-time confirmation before it delivers contact messages.
6. Submit another test message. Confirm that the success message appears on the page and that the email arrives.

IMPORTANT
- The old contact.php/MySQL handler is no longer used by this static GitHub Pages version. GitHub Pages cannot execute PHP, which caused the previous response to be an HTML 404 page instead of JSON.
- Do not upload database credentials. No PHP or database setup is needed for this form integration.
- If you do not receive the activation email, check Spam/Junk and verify the recipient address in the HTML form action.
